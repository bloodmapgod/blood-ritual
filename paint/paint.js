let Paint = (function () {
    'use strict';

    let InteractionMode = {
        NONE: 0,
        PAINTING: 1
    };

    let ColorModel = {
        RYB: 0,
        RGB: 1
    };


    let QUALITIES = [
        {
            name: 'Low',
            resolutionScale: 1.0
        },
        {
            name: 'Medium',
            resolutionScale: 1.5
        },
        {
            name: 'High',
            resolutionScale: 2.0
        }
    ];

    let INITIAL_QUALITY = 2;


    let INITIAL_PADDING = 0;
    let MIN_PAINTING_WIDTH = 300;
    let MAX_PAINTING_WIDTH = 4096; //this is further constrained by the maximum texture size

    //brush parameters
    let MAX_BRISTLE_COUNT = 100;
    let MIN_BRISTLE_COUNT = 10;
    let MIN_BRUSH_SCALE = 5;
    let MAX_BRUSH_SCALE = 75;
    let BRUSH_HEIGHT = 2.0; //how high the brush is over the canvas - this is scaled with the brushScale
    let Z_THRESHOLD = 0.13333; //this is scaled with the brushScale


    //splatting parameters
    let SPLAT_VELOCITY_SCALE = 0.14;
    let SPLAT_RADIUS = 0.05;

    //for thin brush (fewest bristles)
    let THIN_MIN_ALPHA = 0.002;
    let THIN_MAX_ALPHA = 0.08;

    //for thick brush (most bristles)
    let THICK_MIN_ALPHA = 0.002;
    let THICK_MAX_ALPHA = 0.025;


    //panel is aligned with the top left
    let PANEL_WIDTH = 300;
    let PANEL_HEIGHT = 580;
    let PANEL_BLUR_SAMPLES = 13;
    let PANEL_BLUR_STRIDE = 8;

    let RESIZING_FEATHER_SIZE = 8; //in pixels

    //rendering parameters
    let BACKGROUND_GRAY = 0.7;
    let NORMAL_SCALE = 7.0;
    let ROUGHNESS = 0.075;
    let F0 = 0.05;
    let SPECULAR_SCALE = 0.5;
    let DIFFUSE_SCALE = 0.15;
    let LIGHT_DIRECTION = [0, 1, 1];
    let RED_BLOOD_HSVA = [...Utilities.rgbToHsv(138, 3, 3), 0.3];
    let GREEN_BLOOD_HSVA = [...Utilities.rgbToHsv(0, 167, 28), 0.3];

    function pascalRow (n) {
        let line = [1];
        for (let k = 0; k < n; ++k) {
            line.push(line[k] * (n - k) / (k + 1));
        }
        return line;
    }

    //width should be an odd number
    function makeBlurShader (width) {
        let coefficients = pascalRow(width - 1 + 2);

        //take the 1s off the ends
        coefficients.shift();
        coefficients.pop();

        let normalizationFactor = 0;
        for (let i = 0; i < coefficients.length; ++i) {
            normalizationFactor += coefficients[i];
        }

        let shader = [
            'precision highp float;',

            'uniform sampler2D u_input;',

            'uniform vec2 u_step;',
            'uniform vec2 u_resolution;',

            'void main () {',
                'vec4 total = vec4(0.0);',

                'vec2 coordinates = gl_FragCoord.xy / u_resolution;',
                'vec2 delta = u_step / u_resolution;',
        ].join('\n');

        shader += '\n';

        for (let i = 0; i < width; ++i) {
            let offset = i - (width - 1) / 2;

            shader += 'total += texture2D(u_input, coordinates + delta * ' + offset.toFixed(1) + ') * ' + coefficients[i].toFixed(1) + '; \n';
        }

        shader += 'gl_FragColor = total / ' + normalizationFactor.toFixed(1) + ';\n }';

        return shader;
    }


    function hsvToRyb (h, s, v) {
        h = h % 1;

        let c = v * s,
            hDash = h * 6;

        let x = c * (1 - Math.abs(hDash % 2 - 1));

        let mod = Math.floor(hDash);

        let r = [c, x, 0, 0, x, c][mod],
            g = [x, c, c, x, 0, 0][mod],
            b = [0, 0, x, c, c, x][mod];

        let m = v - c;

        r += m;
        g += m;
        b += m;

        return [r, g, b];
    }

    function makeOrthographicMatrix (matrix, left, right, bottom, top, near, far) {
        matrix[0] = 2 / (right - left);
        matrix[1] = 0;
        matrix[2] = 0;
        matrix[3] = 0;
        matrix[4] = 0;
        matrix[5] = 2 / (top - bottom);
        matrix[6] = 0;
        matrix[7] = 0;
        matrix[8] = 0;
        matrix[9] = 0;
        matrix[10] = -2 / (far - near);
        matrix[11] = 0;
        matrix[12] = -(right + left) / (right - left);
        matrix[13] = -(top + bottom) / (top - bottom);
        matrix[14] = -(far + near) / (far - near);
        matrix[15] = 1;

        return matrix;
    }

    function mix (a, b, t) {
        return (1.0 - t) * a + t * b;
    }

    function Paint (canvas, wgl) {
        this.canvas = canvas;
        this.wgl = wgl;

        wgl.getExtension('OES_texture_float');
        wgl.getExtension('OES_texture_float_linear');

        WrappedGL.loadTextFiles([
            'paint/shaders/splat.vert', 'paint/shaders/splat.frag',
            'paint/shaders/fullscreen.vert',
            'paint/shaders/advect.frag',
            'paint/shaders/divergence.frag',
            'paint/shaders/jacobi.frag',
            'paint/shaders/subtract.frag',
            'paint/shaders/resize.frag',

            'paint/shaders/project.frag',
            'paint/shaders/distanceconstraint.frag',
            'paint/shaders/planeconstraint.frag',
            'paint/shaders/bendingconstraint.frag',
            'paint/shaders/setbristles.frag',
            'paint/shaders/updatevelocity.frag',

            'paint/shaders/brush.vert', 'paint/shaders/brush.frag',
            'paint/shaders/painting.vert', 'paint/shaders/painting.frag',
            'paint/shaders/picker.vert', 'paint/shaders/picker.frag',
            'paint/shaders/panel.frag',
            'paint/shaders/output.frag',
            'paint/shaders/shadow.frag',
        ], start.bind(this));

        function start(shaderSources) {
            let maxTextureSize = wgl.getParameter(wgl.MAX_TEXTURE_SIZE);
            this.maxPaintingWidth = Math.min(MAX_PAINTING_WIDTH, maxTextureSize / QUALITIES[QUALITIES.length - 1].resolutionScale);

            this.framebuffer = wgl.createFramebuffer();

            this.paintingProgram = wgl.createProgram(
                shaderSources['paint/shaders/painting.vert'], shaderSources['paint/shaders/painting.frag']);

            this.paintingProgramRGB = wgl.createProgram(
                shaderSources['paint/shaders/painting.vert'], '#define RGB \n ' + shaderSources['paint/shaders/painting.frag']);

            this.brushProgram = wgl.createProgram(
                shaderSources['paint/shaders/brush.vert'], shaderSources['paint/shaders/brush.frag'], { 'a_position': 0 });

            this.blurProgram = wgl.createProgram(
                shaderSources['paint/shaders/fullscreen.vert'], makeBlurShader(PANEL_BLUR_SAMPLES), { 'a_position': 0 });

            this.outputProgram = wgl.createProgram(
                shaderSources['paint/shaders/fullscreen.vert'], shaderSources['paint/shaders/output.frag'], { 'a_position': 0 });

            this.quadVertexBuffer = wgl.createBuffer();
            wgl.bufferData(this.quadVertexBuffer, wgl.ARRAY_BUFFER, new Float32Array([-1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0]), wgl.STATIC_DRAW);


            //position of painting on screen, and its dimensions
            //units are pixels
            this.paintingRectangle = new Rectangle(
                INITIAL_PADDING, INITIAL_PADDING,
                Utilities.clamp(canvas.width - INITIAL_PADDING * 2, MIN_PAINTING_WIDTH, this.maxPaintingWidth),
                Utilities.clamp(canvas.height - INITIAL_PADDING * 2, MIN_PAINTING_WIDTH, this.maxPaintingWidth));

            //simulation resolution = painting resolution * resolution scale
            this.resolutionScale = QUALITIES[INITIAL_QUALITY].resolutionScale;


            this.simulator = new Simulator(wgl, shaderSources, this.getPaintingResolutionWidth(), this.getPaintingResolutionHeight());

            this.brushInitialized = false; //whether the user has moved their mouse at least once and we thus have a valid brush position
            this.brushX = 0;
            this.brushY = 0;

            this.brushScale = 9;
            this.brushColorHSVA = RED_BLOOD_HSVA;
            this.colorModel = ColorModel.RGB;

            this.needsRedraw = true; //whether we need to redraw the painting
            this.brush = new Brush(wgl, shaderSources, MAX_BRISTLE_COUNT);

            // this.fluiditySlider = new Slider(document.getElementById('fluidity-slider'), this.simulator.fluidity, 0.6, 0.9, (function (fluidity) {
            //   this.simulator.fluidity = fluidity;
            // }).bind(this));

            this.brush.setBristleCount(30);
            // this.bristleCountSlider = new Slider(document.getElementById('bristles-slider'), 0.3, 0, 1, (function (t) {
            //     let BRISTLE_SLIDER_POWER = 2.0;
            //     t = Math.pow(t, BRISTLE_SLIDER_POWER);
            //     let bristleCount = Math.floor(MIN_BRISTLE_COUNT + t * (MAX_BRISTLE_COUNT - MIN_BRISTLE_COUNT));
            //     this.brush.setBristleCount(bristleCount);
            // }).bind(this));

            // this.brushSizeSlider = new Slider(document.getElementById('size-slider'), this.brushScale, MIN_BRUSH_SCALE, MAX_BRUSH_SCALE, (function(size) {
            //     this.brushScale = size;
            // }).bind(this));

            // this.qualityButtons = new Buttons(document.getElementById('qualities'),
            //     QUALITIES.map(function (q) { return q.name })
            // , INITIAL_QUALITY, (function (index) {
            //
            //     this.resolutionScale = QUALITIES[index].resolutionScale;
            //     this.simulator.changeResolution(this.getPaintingResolutionWidth(), this.getPaintingResolutionHeight());
            //
            //     this.needsRedraw = true;
            // }).bind(this));
            //
            // this.modelButtons = new Buttons(document.getElementById('models'),
            //   ['Natural', 'Digital'], 1, (function (index) {
            //       if (index === 0) {
            //           this.colorModel = ColorModel.RYB;
            //       } else if (index === 1) {
            //           this.colorModel = ColorModel.RGB;
            //       }
            //
            //       this.needsRedraw = true;
            //   }).bind(this));

            // this.clearButton = document.getElementById('clear-button');
            // this.clearButton.addEventListener('click', this.clear.bind(this));
            // this.clearButton.addEventListener('touchstart', (function (event) {
            //     event.preventDefault();
            //
            //     this.clear();
            // }).bind(this));

            this.mainProjectionMatrix = makeOrthographicMatrix(new Float32Array(16), 0.0, this.canvas.width, 0, this.canvas.height, -5000.0, 5000.0);

            this.onResize = function () {

                this.paintingRectangle.left = Utilities.clamp(this.paintingRectangle.left, -this.paintingRectangle.width, this.canvas.width);
                this.paintingRectangle.bottom = Utilities.clamp(this.paintingRectangle.bottom, -this.paintingRectangle.height, this.canvas.height);

                this.mainProjectionMatrix = makeOrthographicMatrix(new Float32Array(16), 0.0, this.canvas.width, 0, this.canvas.height, -5000.0, 5000.0);

                this.canvasTexture = wgl.buildTexture(wgl.RGBA, wgl.UNSIGNED_BYTE, this.canvas.width, this.canvas.height, null, wgl.CLAMP_TO_EDGE, wgl.CLAMP_TO_EDGE, wgl.LINEAR, wgl.LINEAR);
                this.tempCanvasTexture = wgl.buildTexture(wgl.RGBA, wgl.UNSIGNED_BYTE, this.canvas.width, this.canvas.height, null, wgl.CLAMP_TO_EDGE, wgl.CLAMP_TO_EDGE, wgl.LINEAR, wgl.LINEAR);

                this.needsRedraw = true;
            };
            this.onResize();

            window.addEventListener('resize', this.onResize.bind(this));

            this.mouseX = 0;
            this.mouseY = 0;

            canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
            canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
            document.addEventListener('mouseup', this.onMouseUp.bind(this));
            canvas.addEventListener('mouseover', this.onMouseOver.bind(this));


            canvas.addEventListener('touchstart', this.onTouchStart.bind(this));
            canvas.addEventListener('touchmove', this.onTouchMove.bind(this));
            canvas.addEventListener('touchend', this.onTouchEnd.bind(this));
            canvas.addEventListener('touchcancel', this.onTouchCancel.bind(this));

            this.interactionState = InteractionMode.NONE;

            let update = (function () {
                this.update();
                requestAnimationFrame(update);
            }).bind(this);
            update();
        }
    }

    Paint.prototype.setRedBlood = function () {
        return this.brushColorHSVA = RED_BLOOD_HSVA;
    };

    Paint.prototype.setGreenBlood = function () {
        return this.brushColorHSVA = GREEN_BLOOD_HSVA;
    };

    Paint.prototype.getPaintingResolutionWidth = function () {
        return Math.ceil(this.paintingRectangle.width * this.resolutionScale);
    };


    Paint.prototype.getPaintingResolutionHeight = function () {
        return Math.ceil(this.paintingRectangle.height * this.resolutionScale);
    };


    Paint.prototype.update = function () {
        let wgl = this.wgl;

        //update brush
        if (this.brushInitialized) {
            this.brush.update(this.brushX, this.brushY, BRUSH_HEIGHT * this.brushScale, this.brushScale);
        }

        //splat into paint and velocity textures
        if (this.interactionState === InteractionMode.PAINTING) {
            let splatRadius = SPLAT_RADIUS * this.brushScale;

            let splatColor = hsvToRyb(this.brushColorHSVA[0], this.brushColorHSVA[1], this.brushColorHSVA[2]);

            let alphaT = this.brushColorHSVA[3];

            //we scale alpha based on the number of bristles
            let bristleT = (this.brush.bristleCount - MIN_BRISTLE_COUNT) / (MAX_BRISTLE_COUNT - MIN_BRISTLE_COUNT);

            let minAlpha = mix(THIN_MIN_ALPHA, THICK_MIN_ALPHA, bristleT);
            let maxAlpha = mix(THIN_MAX_ALPHA, THICK_MAX_ALPHA, bristleT);

            splatColor[3] =  mix(minAlpha, maxAlpha, alphaT);

            let splatVelocityScale = SPLAT_VELOCITY_SCALE * splatColor[3] * this.resolutionScale;

            //splat paint
            this.simulator.splat(this.brush, Z_THRESHOLD * this.brushScale, this.paintingRectangle, splatColor, splatRadius, splatVelocityScale);

        }

        let simulationUpdated = this.simulator.simulate();

        if (simulationUpdated) this.needsRedraw = true;


        //the rectangle we end up drawing the painting into
        let clippedPaintingRectangle = (this.paintingRectangle).clone()
                                           .intersectRectangle(new Rectangle(0, 0, this.canvas.width, this.canvas.height));

        if (this.needsRedraw) {
            //draw whole painting into texture

            wgl.framebufferTexture2D(this.framebuffer, wgl.FRAMEBUFFER, wgl.COLOR_ATTACHMENT0, wgl.TEXTURE_2D, this.canvasTexture, 0);
            let clearState = wgl.createClearState()
              .bindFramebuffer(this.framebuffer)
              .depthMask(false)
              .clearColor(0, 0, 0, 0);

            wgl.clear(clearState, wgl.COLOR_BUFFER_BIT | wgl.DEPTH_BUFFER_BIT);


            let paintingProgram;

            if (this.colorModel === ColorModel.RYB) {
                paintingProgram = this.paintingProgram;
            } else if (this.colorModel === ColorModel.RGB) {
                paintingProgram = this.paintingProgramRGB;
            }

            // @TODO
            let paintingDrawState = wgl.createDrawState()
                .bindFramebuffer(this.framebuffer)
                .vertexAttribPointer(this.quadVertexBuffer, paintingProgram.getAttribLocation('a_position'), 2, wgl.FLOAT, false, 0, 0)
                .useProgram(paintingProgram)
                .uniform1f('u_featherSize', RESIZING_FEATHER_SIZE)

                .uniform1f('u_normalScale', NORMAL_SCALE / this.resolutionScale)
                .uniform1f('u_roughness', ROUGHNESS)
                .uniform1f('u_diffuseScale', DIFFUSE_SCALE)
                .uniform1f('u_specularScale', SPECULAR_SCALE)

                .uniform1f('u_F0', F0)
                .uniform3f('u_lightDirection', LIGHT_DIRECTION[0], LIGHT_DIRECTION[1], LIGHT_DIRECTION[2])

                .uniform2f('u_paintingPosition', this.paintingRectangle.left, this.paintingRectangle.bottom)
                .uniform2f('u_paintingResolution', this.simulator.resolutionWidth, this.simulator.resolutionHeight)
                .uniform2f('u_paintingSize', this.paintingRectangle.width, this.paintingRectangle.height)
                .uniform2f('u_screenResolution', this.canvas.width, this.canvas.height)
                .uniformTexture('u_paintTexture', 0, wgl.TEXTURE_2D, this.simulator.paintTexture)

                .viewport(clippedPaintingRectangle.left, clippedPaintingRectangle.bottom, clippedPaintingRectangle.width, clippedPaintingRectangle.height);

            // ???
            wgl.drawArrays(paintingDrawState, wgl.TRIANGLE_STRIP, 0, 4);

        }

        //output painting to screen
        let outputDrawState = wgl.createDrawState()
          .viewport(0, 0, this.canvas.width, this.canvas.height)
          .useProgram(this.outputProgram)
          .uniformTexture('u_input', 0, wgl.TEXTURE_2D, this.canvasTexture)
          .vertexAttribPointer(this.quadVertexBuffer, 0, 2, wgl.FLOAT, wgl.FALSE, 0, 0);

        wgl.drawArrays(outputDrawState, wgl.TRIANGLE_STRIP, 0, 4);


        //draw brush to screen
        if (this.interactionState === InteractionMode.PAINTING || this.interactionState === InteractionMode.NONE && this.desiredInteractionMode() === InteractionMode.PAINTING) { //we draw the brush if we're painting or you would start painting on click
            // let brushDrawState = wgl.createDrawState()
            //     .bindFramebuffer(null)
            //     .viewport(0, 0, this.canvas.width, this.canvas.height)
            //     .vertexAttribPointer(this.brush.brushTextureCoordinatesBuffer, 0, 2, wgl.FLOAT, wgl.FALSE, 0, 0)
            //
            //     .useProgram(this.brushProgram)
            //     .bindIndexBuffer(this.brush.brushIndexBuffer)
            //
            //     .uniform4f('u_color', 0.6, 0.6, 0.6, 1.0)
            //     .uniformMatrix4fv('u_projectionViewMatrix', false, this.mainProjectionMatrix)
            //     .enable(wgl.DEPTH_TEST)
            //
            //     .enable(wgl.BLEND)
            //     .blendFunc(wgl.DST_COLOR, wgl.ZERO)
            //
            //     .uniformTexture('u_positionsTexture', 0, wgl.TEXTURE_2D, this.brush.positionsTexture);

            // disabled bristles over paint
            // wgl.drawElements(brushDrawState, wgl.LINES, this.brush.indexCount * this.brush.bristleCount / this.brush.maxBristleCount, wgl.UNSIGNED_SHORT, 0);
        }


        //work out what cursor we want
        let desiredCursor = '';

        // if (this.interactionState === InteractionMode.NONE) { //if there is no current interaction, we display a cursor based on what interaction would occur on click
        //     let desiredMode = this.desiredInteractionMode();
        //
        //     if (desiredMode === InteractionMode.PAINTING) {
        //         desiredCursor = 'none';
        //     } else {
        //         desiredCursor = 'default';
        //     }
        // } else { //if there is an interaction going on, display appropriate cursor
        //     if (this.interactionState === InteractionMode.PAINTING) {
        //         desiredCursor = 'none';
        //     }
        // }
        //
        // if (this.canvas.style.cursor !== desiredCursor) { //don't thrash the style
        //     this.canvas.style.cursor = desiredCursor;
        // }


        let panelBottom = this.canvas.height - PANEL_HEIGHT;

        if (0 && this.needsRedraw) {
            console.log('redraw ??');
            //blur the canvas for the panel

            let BLUR_FEATHER = ((PANEL_BLUR_SAMPLES - 1) / 2) * PANEL_BLUR_STRIDE;

            let blurDrawState = wgl.createDrawState()
                .useProgram(this.blurProgram)
                .viewport(
                    0,
                    Utilities.clamp(panelBottom - BLUR_FEATHER, 0, this.canvas.height),
                    PANEL_WIDTH + BLUR_FEATHER,
                    PANEL_HEIGHT + BLUR_FEATHER)
                .bindFramebuffer(this.framebuffer)
                .uniform2f('u_resolution', this.canvas.width, this.canvas.height)
                .vertexAttribPointer(this.quadVertexBuffer, 0, 2, wgl.FLOAT, wgl.FALSE, 0, 0);


            wgl.framebufferTexture2D(this.framebuffer, wgl.FRAMEBUFFER, wgl.COLOR_ATTACHMENT0, wgl.TEXTURE_2D, this.tempCanvasTexture, 0);
            blurDrawState.uniformTexture('u_input', 0, wgl.TEXTURE_2D, this.canvasTexture)
                .uniform2f('u_step', PANEL_BLUR_STRIDE, 0);

            wgl.drawArrays(blurDrawState, wgl.TRIANGLE_STRIP, 0, 4);

            wgl.drawArrays(blurDrawState, wgl.TRIANGLE_STRIP, 0, 4);
        }

        this.needsRedraw = false;
    };

    Paint.prototype.clear = function () {
        this.simulator.clear();
        this.needsRedraw = true;
    };

    Paint.prototype.onMouseMove = function (event) {
        if (event.preventDefault) event.preventDefault();

        let position = Utilities.getMousePosition(event, this.canvas);

        let mouseX = position.x;
        let mouseY = this.canvas.height - position.y;

        this.brushX = mouseX;
        this.brushY = mouseY;


        if (!this.brushInitialized) {
            this.brush.initialize(this.brushX, this.brushY, BRUSH_HEIGHT * this.brushScale, this.brushScale);

            this.brushInitialized = true;
        }


        this.mouseX = mouseX;
        this.mouseY = mouseY;
    };


    //what interaction mode would be triggered if we clicked with given mouse position
    Paint.prototype.desiredInteractionMode = function () {

        if (this.mouseX < this.paintingRectangle.left || this.mouseX > this.paintingRectangle.left + this.paintingRectangle.width || this.mouseY < this.paintingRectangle.bottom || this.mouseY > this.paintingRectangle.bottom + this.paintingRectangle.height) {
            return InteractionMode.NONE;
        } else {
            return InteractionMode.PAINTING;
        }
    };

    Paint.prototype.onMouseDown = function (event) {
        if (event.preventDefault) event.preventDefault();
        if ('button' in event && event.button !== 0) return; //only handle left clicks

        let position = Utilities.getMousePosition(event, this.canvas);

        let mouseX = position.x;
        let mouseY = this.canvas.height - position.y;

        this.mouseX = mouseX;
        this.mouseY = mouseY;

        this.brushX = mouseX;
        this.brushY = mouseY;
        this.interactionState = this.desiredInteractionMode(mouseX, mouseY);
    };

    Paint.prototype.onMouseUp = function (event) {
        if (event.preventDefault) event.preventDefault();

        this.interactionState = InteractionMode.NONE;
    };

    Paint.prototype.onMouseOver = function (event) {
        event.preventDefault();

        let position = Utilities.getMousePosition(event, this.canvas);

        let mouseX = position.x;
        let mouseY = this.canvas.height - position.y;

        this.brushX = mouseX;
        this.brushY = mouseY;


        this.brush.initialize(this.brushX, this.brushY, BRUSH_HEIGHT * this.brushScale, this.brushScale);
        this.brushInitialized = true;
    };

    Paint.prototype.onTouchStart = function (event) {
        event.preventDefault();

        if (event.touches.length === 1) { //if this is the first touch

            this.onMouseDown(event.targetTouches[0]);

            //if we've just started painting then we need to initialize the brush at the touch location
            if (this.interactionState === InteractionMode.PAINTING) {
                this.brush.initialize(this.brushX, this.brushY, BRUSH_HEIGHT * this.brushScale, this.brushScale);
                this.brushInitialized = true;
            }
        }
    };

    Paint.prototype.onTouchMove = function (event) {
        event.preventDefault();

        this.onMouseMove(event.targetTouches[0]);
    };

    Paint.prototype.onTouchEnd = function (event) {
        event.preventDefault();

        if (event.touches.length > 0) return; //don't fire if there are still touches remaining

        this.onMouseUp({});
    };

    Paint.prototype.onTouchCancel = function (event) {
        event.preventDefault();

        if (event.touches.length > 0) return; //don't fire if there are still touches remaining

        this.onMouseUp({});
    };

    return Paint;
}());

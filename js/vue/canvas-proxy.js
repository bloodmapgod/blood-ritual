/* global Vue */

let canvas = document.getElementById('canvas');
let wgl = WrappedGL.create(canvas, { premultipliedalpha: false });

if (wgl !== null && wgl.hasFloatTextureSupport()) { //required features are supported
  var painter = new Paint(canvas, wgl);
} else { //required features unsupported
  if (wgl === null) {
    alert('Unfortunately, your browser does not support WebGL.');
  } else {
    alert('Unfortunately, your browser does not support WebGL floating point textures.');
  }
}

Vue.component('canvas-proxy', {
  data: function() {
    return {
      mouseDown: false,
      canvas: canvas,
      strokeX: [],
      strokeY: [],
      trace: [],
    };
  },
  mounted: function() {
    canvas.addEventListener('mousedown', this.onCanvasMouseDown);
    canvas.addEventListener('mousemove', this.onCanvasMouseMove);
    canvas.addEventListener('mouseup', this.onCanvasMouseUp);
  },
  beforeDestroy: function() {
    this.reset();
    canvas.removeEventListener('mousedown', this.onCanvasMouseDown);
    canvas.removeEventListener('mousemove', this.onCanvasMouseMove);
    canvas.removeEventListener('mouseup', this.onCanvasMouseUp);
  },
  template: `
    <div id="canvas-proxy"></div>
  `,
  methods: {
    reset: function () {
      this.mouseDown = false;
      this.strokeX = [];
      this.strokeY = [];
      this.trace = [];
      painter.clear();
    },
    setColor: function (color) {
      if ('red' === color) {
        painter.setRedBlood();
      } else {
        painter.setGreenBlood();
      }
    },
    onCanvasMouseDown: function(e) {
      this.mouseDown = true;
      let rect = this.canvas.getBoundingClientRect();
      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;

      this.strokeX = [x];
      this.strokeY = [y];
    },
    onCanvasMouseMove: function(e) {
      if (this.mouseDown) {
        let rect = this.canvas.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        this.strokeX.push(x);
        this.strokeY.push(y);
      }
    },
    onCanvasMouseUp: function() {
      let stroke = [
        this.strokeX,
        this.strokeY,
        [] // touch strength ?
      ];
      this.trace.push(stroke);
      this.mouseDown = false;

      this.$emit('draw', this.trace);
    },
  }
});

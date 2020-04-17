var Utilities = (function () {
  'use strict';

  return {
    swap: function (object, a, b) {
      var temp = object[a];
      object[a] = object[b];
      object[b] = temp;
    },

    clamp: function (x, min, max) {
      return Math.max(min, Math.min(max, x));
    },

    getMousePosition: function (event, element) {
      var boundingRect = element.getBoundingClientRect();
      return {
        x: event.clientX - boundingRect.left,
        y: event.clientY - boundingRect.top
      };
    },

    rgbToHsv: function (r, g, b) {
      r /= 255, g /= 255, b /= 255;

      let max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h, s, v = max;

      let d = max - min;
      s = max == 0 ? 0 : d / max;

      if (max == min) {
        h = 0; // achromatic
      } else {
        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / d + 2;
            break;
          case b:
            h = (r - g) / d + 4;
            break;
        }

        h /= 6;
      }

      return [h, s, v];
    }
  };
}());

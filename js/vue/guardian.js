/* global Vue */

Vue.component('guardian', {
  props: ['direction'],
  data: function() {
    return {
      interval: null,
      eyesLit: false
    };
  },
  mounted: function() {
    this.interval = setInterval(() => {
      if (this.eyesLit) {
        this.eyesLit = false;
      } else if (Math.random() > 0.6) {
        this.eyesLit = true;
      }
    }, 5000);
  },
  beforeDestroy: function() {
    clearInterval(this.interval);
  },
  template: `
    <div class="guardian" v-bind:class="[direction]">
      <div class="eye" v-bind:class="{ lit: eyesLit }" ></div>
      <div class="eye" v-bind:class="{ lit: eyesLit }" ></div>
    </div>
  `
});

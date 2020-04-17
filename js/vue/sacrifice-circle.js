/* global Vue */

Vue.component('sacrifice-circle', {
  data: function() {
    return {
      name: null,
    };
  },
  mounted: function () {
    audioHelper.play('audio/thunder_intro.mp3');
  },
  beforeDestroy: function () {
    audioHelper.stop('audio/thunder_intro.mp3');
  },
  methods: {
    setRandomName: function () {
      getRandomViewer(randomViewer => {
        this.name = randomViewer;
      });
    }
  },
  template: `
    <div id="sacrifice-circle">
      <div id="btn-sacrifice-random" v-on:click="setRandomName" class="btn-round btn-small" title="Random Sacrifice" v-cloak></div>
      <div id="btn-sacrifice-close" v-on:click="$emit('close')" class="btn-round btn-small" title="End Sacrifice" v-cloak></div>
      <span>{{ name }}</span>
    </div>
  `
});

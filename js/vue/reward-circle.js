/* global Vue */

Vue.component('reward-circle', {
  data: function () {
    return {
      opening: false,
      reward: null,
    };
  },
  computed: {
    masterVolume: function () {
      return audioHelper.masterVolume;
    }
  },
  created: function () {
    audioHelper.addListener('masterVolumeChange', this.setVolume);
  },
  beforeDestroy: function () {
    audioHelper.speakStop();
    audioHelper.removeListener('masterVolumeChange', this.setVolume);
    audioHelper.stop('audio/lootbox_open.mp3');
  },
  methods: {
    setVolume: function (masterVolume) {
      let el = document.getElementById('reward-audio');
      if (el) {
        el.volume = masterVolume;
      }
      // @TODO Speech
    },
    openLootbox: function () {
      if (this.opening) {
        return;
      }
      this.opening = true;
      audioHelper.play('audio/lootbox_open.mp3'); // length = 3900
      setTimeout(() => {
        this.opening = false;
        this.reward = randomReward();
      }, 2850); // sooner than audio ends
    },
    playSpeech: function () {
      audioHelper.speak(this.reward.speech);
    },
    playAudio: function () {
      audioHelper.stop(this.reward.audio);
      audioHelper.play(this.reward.audio);
    }
  },
  template: `
    <div id="reward-circle">

      <div class="flex-center h100 w100" v-if="!reward">
        <div class="rel">
          <div class="lootbox" v-bind:class="{ opening: opening }" v-on:click="openLootbox" title="ACB Drop">
            <div class="lootbox-upper"></div>
            <div class="lootbox-lower"></div>
            <div class="lootbox-latch"></div>
          </div>
           <img v-if="opening"  src="img/blue_loader.gif" alt="" class="w100 h100 abs">
        </div>
      </div>

      <div v-if="reward && reward.youtube" class="reward-row">
        <youtube v-bind:url="reward.youtube" height="300" width="570"></youtube>
      </div>

      <div v-if="reward && reward.image" class="reward-row">
        <img v-bind:src="reward.image" alt="" style="max-width: 400px; max-height: 200px;">
      </div>

      <div v-if="reward && reward.text" class="reward-row">
        <h1>{{ reward.text }}</h1>
      </div>

      <div v-if="reward && reward.audio" class="reward-row">
        <div class="select-button" v-on:click="playAudio()" title="Do Not Push"></div>
      </div>

      <div v-if="reward && reward.speech" class="reward-row">
        <div class="select-button" v-on:click="playSpeech()" title="Do Not Push"></div>
      </div>

    </div>
  `
});
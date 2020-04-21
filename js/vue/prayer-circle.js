/* global Vue */
/* global annyang */

Vue.component('prayer-circle', {
  data: function () {
    return {
      speaking: false,
      listening: false,
      expectedLines: null,
      lastUnmatchedText: null,
      completedAudio: null,
      completedImage: null,
      backgroundAudio: null,
    };
  },
  computed: {
    matchedCount: function() {
      return this.expectedLines.reduce((sum, line) => sum + line.matched, 0);
    },
    isFullyMatched: function () {
      return this.matchedCount >= this.expectedLines.length;
    },
  },
  created: function () {
    annyang.addCallback('result', this.onResult);
    annyang.addCallback('error ', console.log);
    annyang.addCallback('soundstart', this.setSpeakingTrue);
    annyang.addCallback('end', this.setSpeakingFalse);

    this.setPrayer(randomPrayer());
  },
  mounted: function () {
    audioHelper.play('audio/bell_intro.mp3');
  },
  beforeDestroy: function () {
    audioHelper.stop('audio/bell_intro.mp3');
    audioHelper.stop(this.completedAudio);
    audioHelper.stop(this.backgroundAudio);

    annyang.abort();
    annyang.removeCallback('result', this.onResult);
    annyang.removeCallback('error ', console.log);
    annyang.removeCallback('soundstart', this.setSpeakingTrue);
    annyang.removeCallback('end', this.setSpeakingFalse);
  },
  methods: {
    setSpeakingTrue: function () {
      this.speaking = true;
    },
    setSpeakingFalse: function () {
      this.speaking = false;
    },
    setPrayer: function (prayer) {
      this.completedAudio = _.get(prayer, 'completed.audio', null);
      this.completedImage = _.get(prayer, 'completed.image', null);
      this.backgroundAudio = _.get(prayer, 'background.audio', null);

      annyang.setLanguage(prayer.lang);
      this.expectedLines = prayer.lines.map(line => ({ text: line, matched: false }));
    },
    toggleListening: function () {
      this.listening = !this.listening;
      if (this.listening) {
        annyang.start({ continuous: false });
        audioHelper.play(this.backgroundAudio);
      } else {
        audioHelper.stop(this.backgroundAudio);
        annyang.abort();
        this.lastUnmatchedText = null;
      }
    },
    normalize: function(line) {
      return line
        .toLowerCase()
        .replace(/\s\s+/g, ' ')
        .replace(/[?.,'’¿¡!]/g, '')
        .replace(/á/g, 'a')
        .replace(/é/g, 'e')
        .replace(/í/g, 'i')
        .replace(/ó/g, 'o')
        .replace(/ú/g, 'u')
        .replace(/ü/g, 'u')
        .replace(/ñ/g, 'n');
    },
    onResult: function (spokenTexts) {
      console.log(spokenTexts);

      let matchedSomething = false;
      this.expectedLines.forEach((expectedLine, idx) => {
        spokenTexts.forEach(spokenText => {
          if (!expectedLine.matched && this.normalize(spokenText).includes(this.normalize(expectedLine.text))) {
            this.$set(this.expectedLines[idx], 'matched', true);
            matchedSomething = true;
          }
        });
      });

      this.lastUnmatchedText = matchedSomething ? null : spokenTexts[0].trim();
      if (this.isFullyMatched) {
        this.listening = false;
        annyang.abort();
        audioHelper.stop(this.backgroundAudio);
        audioHelper.play(this.completedAudio, () => {
          this.completedImage = null;
        });
      }
    }
  },
  template: `
    <div id="prayer-circle">
      
      <table id="prayer-expected-lines">
        <tr v-for="expectedLine in expectedLines">
          <td class="prayer-line" v-bind:class="{ matched: expectedLine.matched }">{{ expectedLine.text }}</td>
        </tr>
      </table>

      <div id="microphone" v-if="!isFullyMatched" v-bind:class="{ active: listening, speaking: speaking }" v-on:click="toggleListening"></div>

      <div id="prayer-unmatched-line" v-if="!isFullyMatched && lastUnmatchedText">
        You said: "<span>{{ lastUnmatchedText }}</span>"
        <img class="inline-image" src="img/weirdchamp_small.png" alt="">
      </div>

      <button class="btn-continue" v-if="isFullyMatched" v-on:click="$emit('completed')">Continue</button>
      
      <div id="prayer-image-container" v-if="isFullyMatched && completedImage">
        <img v-bind:src="completedImage" alt="">
      </div>

    </div>
  `
});

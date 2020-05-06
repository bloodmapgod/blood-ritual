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
      completedYoutube: null,
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
      this.completedYoutube = _.get(prayer, 'completed.youtube', null);

      annyang.setLanguage(prayer.lang);
      this.expectedLines = prayer.lines.map(line => ({
        displayText: line.split('|')[0].trim(),
        matchVariations: line.split('|'),
        matched: false
      }));
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
        .trim()
        .replace(/\s\s+/g, ' ')
        .replace(/[?.,'’¿¡!)(]/g, '') // @TODO keep a-z0-9 only
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
      _.each(this.expectedLines, (expectedLine, idx) => {
        if (expectedLine.matched) {
          return; // continue expectedLines
        }

        let lineMatched = false;
        _.each(spokenTexts, spokenText => {
          let normSpokenText = this.normalize(spokenText);
          _.each(expectedLine.matchVariations, matchVariation => {
            if (normSpokenText.includes(this.normalize(matchVariation))) {
              this.$set(this.expectedLines[idx], 'matched', true);
              lineMatched = true;
              return false; // break matchVariations
            }
          });
          if (lineMatched) {
            return false; // break spokenTexts
          }
        });

        matchedSomething = matchedSomething || lineMatched;

        // must be spoken line by line
        if (!lineMatched) {
          return false; // break expectedLines
        }
      });

      this.lastUnmatchedText = matchedSomething ? null : spokenTexts[0].trim();
      if (this.isFullyMatched) {
        incrCompletedPrayerCount();
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
      
      <table id="prayer-expected-lines" class="txt-select">
        <tr v-for="expectedLine in expectedLines">
          <td class="prayer-line" v-bind:class="{ matched: expectedLine.matched }">{{ expectedLine.displayText }}</td>
        </tr>
      </table>

      <div id="microphone" v-if="!isFullyMatched" v-bind:class="{ active: listening, speaking: speaking }" v-on:click="toggleListening"></div>

      <div id="prayer-unmatched-line" v-if="!isFullyMatched && lastUnmatchedText">
        You said: "<span>{{ lastUnmatchedText }}</span>"
        <img class="inline-image" src="img/weirdchamp_small.png" alt="">
      </div>

      <button class="btn-continue" v-if="isFullyMatched" v-on:click="$emit('completed')">Continue</button>
      
      <youtube v-if="isFullyMatched && completedYoutube" v-bind:url="completedYoutube" height="225" width="400"></youtube>

      <div id="prayer-image-container" v-if="isFullyMatched && completedImage">
        <img v-bind:src="completedImage" alt="">
      </div>
    </div>
  `
});

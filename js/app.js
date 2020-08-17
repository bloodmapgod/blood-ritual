/* global Vue */
/* global audioHelper */

let app = new Vue({
  el: '#vue',
  data: {
    mode: 'start', // start, draw, sacrifice, prayer, trivia, journey, stock, reward

    tribute: null, // null, 'sacrifice', 'trivia', 'journey', 'prayer'
    triviaAnsweredRatio: 0,

    // draw
    color: null, // red, green
    trace: [],

    // stock
    candleLit: false,
    ticker: null,
    pendingTrace: false,

    // misc
    acbChantActive: false,
    randomChantActive: false,
    lastRandomChant: null,

  },
  computed: {
    isStartMode: function() {
      return 'start' === this.mode;
    },
    isDrawMode: function() {
      return 'draw' === this.mode;
    },
    isSacrificeMode: function() {
      return 'sacrifice' === this.mode;
    },
    isPrayerMode: function() {
      return 'prayer' === this.mode;
    },
    isTriviaMode: function() {
      return 'trivia' === this.mode;
    },
    isStockMode: function() {
      return 'stock' === this.mode;
    },
    isRewardMode: function() {
      return 'reward' === this.mode;
    },
    isJourneyMode: function() {
      return 'journey' === this.mode;
    },
    inProgress: function() {
      return -1 !== ['draw', 'sacrifice', 'prayer', 'journey', 'trivia'].indexOf(this.mode);
    },
    hasTrace: function () {
      return this.trace.length > 0;
    },
    bloodLevel: function () {
      let tributePoints = 0;
      if ('trivia' === this.tribute) {
        tributePoints = Math.round(this.triviaAnsweredRatio * 40);
      } else if (this.tribute) {
        tributePoints = 25; // sacrifice, journey, prayer
      }

      return (this.color ? 15 : 0) // 15
           + (this.trace.length ? 20 : 0) // 35
           + (this.acbChantActive > 0 ? 5 : 0) // 40
           + (this.randomChantActive > 0 ? 5 : 0) // 45
           + tributePoints; // 70 - 85
    },
    bloodOrbTitle: function () {
      return 'Sanguis ' + romanize(this.bloodLevel)
    },
    hasUnknownTicker: function () {
      return null !== this.ticker && !this.tickerSupported(this.ticker);
    }
  },
  mounted: function () {
    // nothing yet
  },
  methods: {
    isTribute: function (tribute) {
      return tribute === this.tribute;
    },
    isMode: function (mode) {
      return mode === this.mode;
    },
    clickAlmond: function () {
      audioHelper.stop('audio/wipe_off_blood.mp3');
      audioHelper.play('audio/wipe_off_blood.mp3');
      this.resetRitual();
    },
    resetRitual: function() {
      resetRain();

      this.$refs.proxy.reset();

      this.mode = 'start';
      this.tribute = null;
      this.triviaAnsweredRatio = 0;

      this.color = null;
      this.trace = [];
      this.pendingTrace = false;

      this.acbChantActive = false;
      this.randomChantActive = false;
      this.candleLit = false;
      this.ticker = null;

      audioHelper.tracks.triviaBg.stop();
      audioHelper.tracks.ritualBg.stop();
    },
    setTrace: function(trace) {
      this.trace = trace;
      this.ticker = null;
    },
    chantAcb: function() {
      if (this.isDrawMode) {
        this.acbChantActive = true;
      }
      audioHelper.tracks.acb.replay();
    },
    chantRandom: function() {
      if (this.isDrawMode) {
        this.randomChantActive = true;
      }

      audioHelper.stop(this.lastRandomChant);
      this.lastRandomChant = _.sample(audioHelper.randomChants);
      audioHelper.play(this.lastRandomChant);
    },
    setColor: function(color) {
      if (color !== this.color) {
        this.resetRitual();
        audioHelper.tracks.ritualBg.replay();
        this.$refs.proxy.setColor(color);
        this.color = color;
        this.mode = 'draw';
      }
    },
    enterTribute: function(tribute) {
      if (!this.inProgress) {
        return;
      }
      this.ticker = null;
      audioHelper.tracks.ritualBg.pause();
      this.mode = tribute;
      this.tribute = tribute;
      if ('trivia' !== tribute) {
        this.triviaAnsweredRatio = 0;
      }
    },
    enterDraw: function() {
      audioHelper.tracks.ritualBg.resume();
      this.mode = 'draw';
    },
    closeTrivia: function (triviaAnsweredRatio) {
      this.triviaAnsweredRatio = triviaAnsweredRatio;
      this.enterDraw();
    },
    submitRitual: function () {
      if (this.pendingTrace || 'draw' !== this.mode || this.ticker || !this.hasTrace) {
        return;
      }

      // @TODO prevent race conditions
      this.pendingTrace = true;
      sendTrace(this.trace, resolvedTickers => {
        console.log(resolvedTickers);

        let ticker = resolvedTickers.filter(this.tickerSupported)[0] || resolvedTickers[0];

        this.ticker = ticker;
        this.pendingTrace = false;

        if (this.tickerSupported(ticker)) {
          this.candleLit = true;
          this.mode = 'stock';
        }
      });
    },
    tickerSupported: function (ticker) {
      return _.has(supportedTickers, ticker);
    },
    closeStockMode: function (success) {
      audioHelper.tracks.ritualBg.stop();
      if (success) {
        this.mode = 'reward';
        if (getWinCount() > 1 && Math.random() < 0.06) {
          setTendiesRain();
        }
      } else {
        this.resetRitual();
      }
    }
  }
});

/* global Vue */

Vue.component('stock-circle', {
  props: [
    'ticker', // 'ACB'
    'color', // 'red', 'green'
    'chance', // 0 - 100
  ],
  data: function () {
    return {
      stopped: false,
      name: supportedTickers[this.ticker],
      currentPrice: null,
      futurePrice: null,
      interval: null,
      reaction: null
    };
  },
  computed: {
    isImageReaction: function () {
      return this.reaction && this.reaction.endsWith(".gif");
    },
    isVideoReaction: function () {
      return this.reaction && this.reaction.endsWith(".mp4");
    },
    success: function () {
      return 'green' === this.color && this.delta.positive
          || 'red' === this.color && !this.delta.positive;
    },
    fetching: function () {
      return null === this.currentPrice;
    },
    delta: function () {
      return {
        neutral: this.futurePrice === this.currentPrice,
        positive: this.futurePrice > this.currentPrice,
        absolute: Math.abs(this.futurePrice - this.currentPrice).toFixed(2),
        percentage: (100 * (this.futurePrice - this.currentPrice) / this.currentPrice).toFixed(2)
      };
    }
  },
  created: function () {
    this.fetchCurrentPrice(this.ticker, this.setCurrentPrice);
  },
  beforeDestroy: function () {
    clearInterval(this.interval);
  },
  template: `
    <div id="vision-circle">
      <div v-if="fetching " class="flex-center w100 h100">
        <img src="img/red_loader.gif" alt="">
      </div>
      <div v-else id="stock-vision">
        <div class="stock-name">{{ name }}</div>
        <div class="stock-ticker">
          <span title="Blood God Stock Exchange">BGSE:</span> {{ ticker }}
        </div>
        <span style="white-space: nowrap">
          <span class="stock-price">
            {{ currentPrice }} &rarr; {{ futurePrice }}
          </span>
          <span class="stock-currency">USD</span>
          <span v-bind:class="[delta.positive ? 'stock-change-positive' : 'stock-change-negative']" class="stock-change">
            <span v-if="delta.positive">+</span><span v-else>-</span>{{ delta.absolute }}
            ({{ delta.percentage }}%)
            <span v-if="delta.positive">&uparrow;</span>
            <span v-else>&downarrow;</span>
          </span>
        </span>
        <div style="min-height: 40px;">
          <button class="continue" v-if="stopped" v-on:click="$emit('continue', success)">Continue</button>
        </div>
        <div id="stock-reaction" v-if="reaction">
           <img v-if="isImageReaction" v-bind:src="reaction" alt="">
           <video v-if="isVideoReaction" v-bind:src="reaction" autoplay loop muted></video>
        </div>
      </div>
    </div>
  `,
  methods: {
    setCurrentPrice: function (currentPrice) {
      this.currentPrice = currentPrice.toFixed(2);
      this.interval = setInterval(this.setRandomPrice, 50);
      setTimeout(() => {
        clearInterval(this.interval);
        let success = this.setRandomPrice(true);
        this.stopped = true;
        this.reaction = getStockReaction(this.color === 'red', success);
        if (!success) {
          audioHelper.play('audio/i_lost_again.mp3');
        }
      }, 3000);
    },
    setRandomPrice: function(finalCall = false) {
      // https://en.wikipedia.org/wiki/Exponential_distribution#Generating_exponential_variates
      let randomChangeRatio =  -Math.log(1 - Math.random()) / 15;
      let desiredSign = 'red' === this.color ? -1 : 1;
      let success = Math.random() < (this.chance / 100);
      let sign = success ? desiredSign : (-1 * desiredSign);

      if (finalCall) {
        if ('ACB' === this.ticker) {
          sign = 1;
          randomChangeRatio += Math.random() + 0.03;
        }
      }

      let randomPrice = this.currentPrice * (1 + (sign * randomChangeRatio));
      this.futurePrice = randomPrice.toFixed(2);

      return desiredSign === sign;
    },
    fetchCurrentPrice: function (ticker, callback) {
      fetch('https://finnhub.io/api/v1/quote?symbol=' + ticker + '&token=bqd08fnrh5rdevg57a30')
        .then(response => response.json())
        .then(data => callback(data['c']))
        .catch(error => console.log(error));
    }
  }
});

/* global Vue */

let ytIframeApiLoaded = false;
function initIframeApi(callback) {
  if (ytIframeApiLoaded) {
    callback();
  }
  ytIframeApiLoaded = true;

  // https://developers.google.com/youtube/iframe_api_reference
  window.onYouTubeIframeAPIReady = callback || function () {};

  let tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";

  let firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

Vue.component('youtube', {
  props: [
    'url',
    'height',
    'width'
  ],
  data: function () {
    return {
      id: null,
      autoplay: null,
      start: null,
      player: null,
    };
  },
  created: function () {
    let url = new URL(this.url);
    this.autoplay = url.searchParams.get('autoplay') === '1';
    this.start = url.searchParams.get('t') || 0;
    this.id = url.searchParams.get('v');
  },
  mounted: function () {
    initIframeApi(() => {
      this.player = new YT.Player('ytplayer', {
        height: this.height || 400,
        width: this.width || 640,
        videoId: this.id,
        playerVars: {
          // https://developers.google.com/youtube/player_parameters.html?playerVersion=HTML5#Parameters
          autoplay: this.autoplay ? 1 : 0,
          start: this.start
        },
        events: {
          'onReady': () => {
            this.setVolume(audioHelper.masterVolume);
          }
        }
      });
    });
    audioHelper.addListener('masterVolumeChange', this.setVolume);
  },
  beforeDestroy: function () {
    audioHelper.removeListener('masterVolumeChange', this.setVolume);
    this.player && this.player.destroy();
  },
  methods: {
    setVolume: function (volume0to1) {
      let masterVolume = Math.ceil(100 * volume0to1);
      this.player && this.player.setVolume(masterVolume);
    }
  },
  template: `
    <div id="ytplayer"></div>
  `
});

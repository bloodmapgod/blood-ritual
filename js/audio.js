class CustomAudio extends Audio
{
  stop() {
    this.pause();
    this.currentTime = 0;
  }
  replay(callback) {
    this.stop();
    this.play();
    this.onended = callback;
  }
  resume() {
    this.play();
  }
}

let audioHelper = {
  listeners: {},
  randomChants: [
    'audio/dos_horas.mp3',
    'audio/its_at_666.mp3',
    'audio/we_family.mp3',
    'audio/all_in_weeklies.mp3',
    'audio/all_in_boeing.mp3',
    'audio/my_401k.mp3',
    'audio/dont_let_us_die.mp3',
    'audio/all_in_walmart.mp3',
    'audio/one_call_one_put.mp3',
    'audio/all_in_lk.mp3',
    'audio/dos_horas.mp3',
  ],
  masterVolume: parseFloat(Cookies.get('master_volume')) || 1.0,
  tracks: {
    triviaBg: (new CustomAudio('audio/trivia_bg.mp3')),
    triviaIntro: (new CustomAudio('audio/trivia_intro.mp3')),
    triviaCorrect: (new CustomAudio('audio/trivia_correct.mp3')),
    triviaIncorrect: (new CustomAudio('audio/trivia_incorrect.mp3')),
    ritualBg: (new CustomAudio('audio/lucifer_hymn.mp3')),
    acb: (new CustomAudio('audio/all_in_acb.mp3')),
  },
  setMasterVolume: function (value0to1) {
    this.masterVolume = value0to1;
    _.forEach(this.tracks, track => {
      track.volume = value0to1;
    });
  },
  updateMasterVolume: function () {
    this.setMasterVolume(this.masterVolume);
  },
  play: function (trackSrc, callback) {
    if (!trackSrc) {
      return;
    }
    this.tracks[trackSrc] = (new CustomAudio(trackSrc));
    this.tracks[trackSrc].volume = this.masterVolume;
    this.tracks[trackSrc].play();
    this.tracks[trackSrc].onended = callback || null;

    return this.tracks[trackSrc];
  },
  stop: function (trackSrc) {
    this.tracks[trackSrc] && this.tracks[trackSrc].stop();
  },
  addListener: function (eventName, callback) {
    this.listeners[eventName] = this.listeners[eventName] || [];
    this.listeners[eventName].push(callback);
  },
  removeListener: function (eventName, callback) {
    this.listeners[eventName] = this.listeners[eventName] || [];
    _.pull(this.listeners[eventName], [callback]);
  },
  speak: function (text) {
    window.speechSynthesis.cancel();

    let msg = new SpeechSynthesisUtterance();
    let voices = window.speechSynthesis.getVoices();
    msg.voice = voices[3]; // Google US English
    msg.voiceURI = 'native';
    msg.volume = 1; // 0 to 1
    msg.rate = 1; // 0.1 to 10
    msg.pitch = 1.1; //0 to 2
    msg.text = text;
    msg.lang = 'en-US';
    msg.volume = this.masterVolume; // 0 to 1

    window.speechSynthesis.speak(msg);
  },
  speakStop: function () {
    window.speechSynthesis.cancel();
  }
};
_.bindAll(audioHelper, _.keys(audioHelper).filter(key => _.isFunction(audioHelper[key])));

let slider = document.getElementById('master-volume');
slider.addEventListener('input', function () {
  let value = parseInt(slider.value) / 100;
  audioHelper.setMasterVolume(value);
  Cookies.set('master_volume', value);
  _.each(audioHelper.listeners['masterVolumeChange'] || [], callback => callback(value));
});
slider.value = 100 * audioHelper.masterVolume;
audioHelper.updateMasterVolume();

// preload
audioHelper.randomChants.forEach(track => new Audio(track));

// @see https://stackoverflow.com/questions/22812303/why-is-my-speech-synthesis-api-voice-changing-when-function-run-more-than-1-time
window.speechSynthesis.getVoices();

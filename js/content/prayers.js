// https://github.com/TalAter/annyang/blob/master/docs/FAQ.md#what-languages-are-supported
//
// prayer properties:
//  - weight: how likely it is to get this prayer
//  - lang: language for speech recognition
//  - lines: prayer lines that have to be read out
//  - completed.image: image to show on success
//  - completed.audio: audio to play on success
//  - background.audio: audio to play each time recording is started (this has not been tested)
//
let prayers = [
  {
    lang: 'en-US',
    lines: [
      'This is a cult',
      'It has been a cult since day one',
      'I am the leader',
      'Join us'
    ],
    completed: {
      image: 'img/bless_rng.png',
    }
  },
  {
    lang: 'en-US',
    lines: [
      'I never told you this but',
      'all marble games are rigged',
    ],
    completed: {
      image: 'img/kappa.png',
    }
  },
  {
    lang: 'es-MX',
    lines: [
      'Dale a tu cuerpo alegria Macarena',
      'Que tu cuerpo es pa\' darle alegria y cosa buena',
      'Dale a tu cuerpo alegria, Macarena',
      'Hey Macarena'
    ],
    completed: {
      image: 'img/pepe_jam.gif',
      audio: 'audio/content/macarena.mp3'
    }
  },
  {
    lang: 'en-US',
    valid: function () {
      return 5 === (new Date()).getDay();
    },
    lines: [
      'It\'s Friday, Friday',
      'Gotta get down on Friday',
      'Everybody\'s lookin\' forward to the weekend, weekend',
      'Friday, Friday',
      'Gettin\' down on Friday'
    ],
    completed: {
      image: 'img/rebecca_black.png',
      audio: 'audio/content/its_friday.mp3'
    }
  },
  {
    weight: 2,
    lang: 'en-US',
    lines: [
      'It\'s going down, I\'m yelling timber',
      'You better move, you better dance',
      'Let\'s make a night you won\'t remember',
      'I\'ll be the one you won\'t forget',
    ],
    completed: {
      image: 'img/pepe_d.gif',
      audio: 'audio/content/timber.mp3'
    }
  },
  {
    weight: 1,
    lang: 'en-US',
    lines: [
      'Girl, you looks good, won\'t you back that ass up',
      'You\'s a fine mother trucker, won\'t you back that ass up',
      'Call me Big Daddy when you back that ass up',
      'Girl, who is you playing with? Back that ass up',
    ],
    completed: {
      image: 'img/pepe_d.gif',
      audio: 'audio/content/back_that_ass.mp3'
    }
  },
  {
    weight: 1,
    lang: 'en-US',
    lines: [
      'Never gonna give you up',
      'Never gonna let you down',
      'Never gonna run around and desert you',
      'Never gonna make you cry',
      'Never gonna say goodbye',
      'Never gonna tell a lie and hurt you',
    ],
    completed: {
      image: 'img/pepe_d.gif',
      audio: 'audio/content/rick_roll_outro.mp3'
    }
  },
  {
    weight: 1,
    lang: 'en-US',
    lines: [
      'My wife is a 7 out of 10',
    ],
    completed: {
      image: 'img/kekw_anim.gif',
    }
  },
  {
    weight: 1,
    lang: 'en-US',
    lines: [
      'The bigger they are, the harder they fall',
      'This biggity boy\'s a diggity dog',
      'I have them like Miley Cyrus, clothes off',
      'Twerking in their bras and thongs, timber',
    ],
    completed: {
      image: 'img/pepe_d.gif',
      audio: 'audio/content/timber.mp3'
    }
  },
  {
    weight: 1,
    lang: 'en-US',
    lines: [
      'Face down, booty up, timber',
      'That\'s the way we like the what, timber',
      'I\'m slicker than an oil spill',
      'She say she won\'t, but I bet she will, timber'
    ],
    completed: {
      image: 'img/pepe_d.gif',
      audio: 'audio/content/timber.mp3'
    }
  },
  {
    weight: 1,
    lang: 'en-US',
    lines: [
      'Swing your partner round and round',
      'End of the night, it\'s going down',
      'One more shot, another round',
      'End of the night, it\'s going down',
    ],
    completed: {
      image: 'img/pepe_d.gif',
      audio: 'audio/content/timber.mp3'
    }
  }
];

let prayerNum = null;

// @TODO Cookie
function randomPrayer() {
  let indices = [];
  _.forEach(prayers, (prayer, idx) => {
    if (!_.isFunction(prayer.valid) || prayer.valid()) {
      let weight = prayer.weight || 1;
      indices = indices.concat(Array(weight).fill(idx))
    }
  });

  return prayers[null === prayerNum ? _.sample(indices) : prayerNum];
}

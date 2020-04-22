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
// Use pipe symbol "|" to provider alternative texts for recognition. E.g. see day man prayer.
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
      'Hoy Macarena',  // Hey is english
    ],
    completed: {
      image: 'img/pepe_jam.gif',
      audio: 'audio/macarena.mp3'
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
      audio: 'audio/its_friday.mp3'
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
      audio: 'audio/timber.mp3'
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
      audio: 'audio/back_that_ass.mp3'
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
      audio: 'audio/rick_roll_outro.mp3'
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
      audio: 'audio/timber.mp3'
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
      audio: 'audio/timber.mp3'
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
      audio: 'audio/timber.mp3'
    }
  },
  {
    weight: 1,
    lang: 'en-US',
    lines: [
      'It\'s a piece of cake to bake a pretty cake',
      'If the way is hazy',
      'You gotta do the cooking by the book',
      'You know you can\'t be lazy!',
      'Never use a messy recipe',
      'The cake will end up crazy',
      'If you do the cooking by the book, then you\'ll have a cake',
    ],
    completed: {
      image: 'img/pepe_d.gif',
      audio: 'audio/lazytown.mp3'
    }
  },
  {
    weight: 1,
    lang: 'en-US',
    lines: [
      'Ask not what ACB can do for you',
      'Ask what you can do for ACB',
    ],
    completed: {
      image: 'img/bless_rng.png',
    }
  },
  {
    weight: 1,
    lang: 'en-US',
    lines: [
      'This is just my opinion',
      'But I think ACB is a great stock',
      'I have been buying in since March',
      'Weed is the future guys'
    ],
    completed: {
      image: 'img/kekw_anim.gif',
      audio: 'audio/all_in_acb.mp3'
    }
  },
  {
    weight: 1,
    lang: 'ru-RU',
    lines: [
      'Наркотик не класс',
      'Я еду на Хард бас',
      'Если ты не знал',
      'Наркотик кал',
    ],
    completed: {
      image: 'img/pepe_gopnik.png',
      audio: 'audio/acb_hardbass.mp3'
    }
  },
  {
    lang: 'es-MX',
    lines: [
      'Despacito',
      'Quiero respirar tu cuello despacito',
      'Deja que te diga cosas al oído',
      'Para que te acuerdes si no estás conmigo',
    ],
    completed: {
      image: 'img/pepe_jam.gif',
      audio: 'audio/despacito.mp3'
    }
  },
  {
    weight: 1,
    lang: 'en-US',
    lines: [
      'Dayman (ah-ah-ah) | day man | damon',
      'Fighter of the Nightman (ah-ah-ah) | fighter of the night man | fighter of the nightman',
      'Champion of the Sun (ah-ah-ah) | champion of the sun',
      'You\'re a Master of Karate',
      'And Friendship',
      'For Everyone!',
    ],
    completed: {
      youtube: 'https://www.youtube.com/watch?v=TzaVd6zl2bA&t=57&autoplay=1',
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

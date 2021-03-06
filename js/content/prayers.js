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
      'Hey Macarena | Ey Macarena',
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
    },
    valid: function () {
      return getCompletedPrayerCount() >= 2;
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
  },
  {
    weight: 1,
    lang: 'en-US',
    lines: [
      'Ocean man, take me by the hand, lead me to the land that you understand',
      'Ocean man, the voyage to the corner of the globe is a real trip',
      'Ocean man, the crust of a tan man imbibed by the sand | Ocean man, the crust of a 10-man imbibed by the sand',
      'Soaking up the thirst of the land',
    ],
    completed: {
      youtube: 'https://www.youtube.com/watch?v=tkzY_VwNIek&autoplay=1',
    }
  },
  {
    // gangnam style
    weight: 1,
    lang: 'ko',
    lines: [
      '오빤 강남스타일',
    ],
    completed: {
      youtube: 'https://www.youtube.com/watch?v=9bZkp7q19f0&autoplay=1&t=71',
    },
    valid: function () {
      return getCompletedPrayerCount() >= 2;
    }
  },
  {
    weight: 1,
    lang: 'en-US',
    lines: [
      'Soulja Boy off in this oh | Soulja Boy off in this old | Soulja Boy off in this hoe',
      'Watch me crank it, watch me roll',
      'Watch me crank dat, Soulja Boy | Watch me crank that, Soulja Boy',
      'Then Superman dat oh | Then Superman that oh',
      'Now watch me you',
      '(Crank dat, Soulja Boy) | (Crank that, Soulja Boy)',
      'Now watch me you',
      '(Crank dat, Soulja Boy) | (Crank that, Soulja Boy)',
    ],
    completed: {
      youtube: 'https://www.youtube.com/watch?v=8UFIYGkROII&autoplay=1&t=194',
    }
  },
  {
    weight: 1,
    lang: 'en-US',
    lines: [
      'Everybody get ready to TWIRL....',
      'Twirling twirling all around',
      'Twirling twirling twirling',
      'Twirling any way you please...',
      'But STOP...',
      'When I say FREEZE!',
    ],
    completed: {
      youtube: 'https://www.youtube.com/watch?v=2UcZWXvgMZE&autoplay=1&t=14',
    }
  },
  {
    weight: 1,
    lang: 'en-US',
    lines: [
      'I\'m blue da ba dee da ba daa | I\'m blue daba dee daba die | I\'m blue daba dee daba dah | I\'m blue daba dee daba da',
      'Da ba dee da ba daa, da ba dee da ba daa, da ba dee da ba daa | double dee daba dee daba dee daba dee daba dee daba die | the ba dee daba dee daba dee daba dee daba dee daba die | double dee daba dee daba dee daba dee daba dee daba da | double dee daba dee daba dee daba dee daba dee daba die. | the ba dee daba dee daba dee daba dee daba dee daba da | double dee daba die daba dee daba dee daba dee daba die | double dee daba dee daba dee daba die daba dee daba die | double dee daba dee daba dee daba die daba dee daba da | Daba Di Daba dee daba dee daba dee daba dee daba die | double di daba di daba di daba di daba di daba die | double dee daba daba daba dee daba die daba dee daba die',
      'I\'m blue',
      'Da ba dee da ba daa, da ba dee da ba daa, da ba dee da ba daa | double dee daba dee daba dee daba dee daba dee daba die | the ba dee daba dee daba dee daba dee daba dee daba die | double dee daba dee daba dee daba dee daba dee daba da | double dee daba dee daba dee daba dee daba dee daba die. | the ba dee daba dee daba dee daba dee daba dee daba da | double dee daba die daba dee daba dee daba dee daba die | double dee daba dee daba dee daba die daba dee daba die | double dee daba dee daba dee daba die daba dee daba da | Daba Di Daba dee daba dee daba dee daba dee daba die | double di daba di daba di daba di daba di daba die | double dee daba daba daba dee daba die daba dee daba die',
    ],
    completed: {
      youtube: 'https://www.youtube.com/watch?v=68ugkg9RePc&autoplay=1&t=111',
      image: 'img/pepe_d.gif',
    },
    valid: function () {
      return getCompletedPrayerCount() >= 1;
    }
  },
  {
    weight: 1,
    lang: 'en-US',
    lines: [
      'I\'m a Barbie girl, in a Barbie world',
      'Life in plastic, it\'s fantastic',
      'You can brush my hair, undress me everywhere | You can brush my hair, and dress me everywhere',
      'Imagination, life is your creation',
      'Come on, Barbie, let\'s go party',
    ],
    completed: {
      youtube: 'https://www.youtube.com/watch?v=ZyhrYis509A&autoplay=1&t=70',
      image: 'img/kekw_anim.gif',
    }
  },
  {
    weight: 1,
    lang: 'en-US',
    lines: [
      'I like it when the beat goes',
      'Baby make your booty go',
      'Baby I know you want to show',
      'That thong thong thong thong thong',
      'I like it when the beat goes',
      'Baby make your booty go',
      'Baby I know you want to show',
      'That thong thong thong thong thong',
    ],
    completed: {
      youtube: 'https://www.youtube.com/watch?v=Oai1V7kaFBk&autoplay=1&t=78'
    }
  },
  {
    weight: 1,
    lang: 'en-US',
    lines: [
      'I know when that hotline bling',
      'That can only mean one thing',
      'I know when that hotline bling',
      'That can only mean one thing',
    ],
    completed: {
      youtube: 'https://www.youtube.com/watch?v=uxpDa-c-4Mc&autoplay=1&t=47'
    }
  },
  {
    weight: 1,
    lang: 'en-US',
    lines: [
      'And I was like baby, baby, baby oh',
      'Like baby, baby, baby no',
      'Like baby, baby, baby oh',
      'I thought you\'d always be mine | I thought you would always be mine',
      'Baby, baby, baby oh',
      'Like baby, baby, baby no',
      'Like baby, baby, baby oh',
      'I thought you\'d always be mine | I thought you would always be mine',
    ],
    completed: {
      youtube: 'https://www.youtube.com/watch?v=kffacxfA7G4&autoplay=1&t=44'
    }
  },
  {
    weight: 1,
    lang: 'de-DE',
    lines: [
      'Du',
      'Du hast',
      'Du hast mich',
      'Du hast mich gefragt',
      'Du hast mich gefragt und ich hab nichts gesagt',
    ],
    completed: {
      youtube: 'https://www.youtube.com/watch?v=W3q8Od5qJio&autoplay=1&t=91',
      image: 'img/pepe_d.gif',
    }
  },
  {
    weight: 1,
    lang: 'en-US',
    lines: [
      'Deep in the night',
      'I\'m looking for some fun',
      'deep in the night',
      'I\'m looking for some love',
      'Oh, you touch my tralala',
      'Mmm, my ding ding dong | my ding ding dong',
      'Oh you touch my tralala',
      'Mmm, my ding ding dong | my ding ding dong',
      'la la la, la la la, la la la | lalala lalala lalala',
    ],
    completed: {
      youtube: 'https://www.youtube.com/watch?v=vzkp10zbgMA&autoplay=1&t=86'
    }
  },
  {
    weight: 1,
    lang: 'en-US',
    lines: [
      'The snow glows white on the mountain tonight',
      'Not a footprint to be seen',
      'A kingdom of isolation',
      'And it looks like I\'m the queen',
    ],
    completed: {
      youtube: 'https://www.youtube.com/watch?v=LOM0h-6eaVY&autoplay=1&t=21'
    }
  },
  {
    weight: 1,
    lang: 'en-US',
    lines: [
      'Like you cause you got that something',
      'That I need in my life',
      'That I need',
      'So give it to me',
      'Cause you got that'
    ],
    completed: {
      youtube: 'https://www.youtube.com/watch?v=JmLHjOzwVbw&autoplay=1&t=0'
    }
  },
  {
    weight: 1,
    lang: 'en-US',
    lines: [
      'I want to be the very best',
      'Like no one ever was',
      'To catch them is my real test',
      'To train them is my cause',
      'I will travel across the land',
      'Searching far and wide',
      'Each Pokemon to understand',
      'The power that\'s inside',
    ],
    completed: {
      youtube: 'https://www.youtube.com/watch?v=rg6CiPI6h2g&autoplay=1&t=32'
    }
  },
  {
    weight: 1,
    lang: 'en-US',
    lines: [
      'Who lives in a pineapple under the sea?',
      'SpongeBob SquarePants',
      'Absorbent and yellow and porous is he',
      'SpongeBob SquarePants',
      'If nautical nonsense be something you wish',
      'SpongeBob SquarePants',
      'Then drop on the deck and flop like a fish',
      'SpongeBob SquarePants',
    ],
    completed: {
      youtube: 'https://www.youtube.com/watch?v=r9L4AseD-aA&autoplay=1&t=8',
      image: 'img/hypers_250.png', // overflown but visible
    }
  },
  {
    weight: 1,
    lang: 'en-US',
    lines: [
      'Here\'s a llama There\'s a llama',
      'And another little llama',
      'Fuzzy Llama Funny Llama',
      'Llama Llama duck',
      'Llama llama Cheesecake llama',
      'Tablet, brick, potato, llama',
      'Llama llama mushroom llama',
      'Llama llama duck',
    ],
    completed: {
      youtube: 'https://www.youtube.com/watch?v=KMYN4djSq7o&autoplay=1&t=0',
      image: 'img/boomer_125.png',
    }
  },
  {
    weight: 1,
    lang: 'en-US',
    lines: [
      'Have you ever had a dream that, that, that you had, that you had to, you could, you do, you would, you want, you could do so, you do you could, you want, you wanted him to do you so much you could do anything?'
    ],
    valid: function () {
      return getCompletedPrayerCount() > 2;
    },
    completed: {
      youtube: 'https://www.youtube.com/watch?v=G7RgN9ijwE4&autoplay=1&t=1',
      image: 'img/kekw_anim.gif',
    }
  },
  {
    weight: 1,
    lang: 'en-US',
    lines: [
      'Uhh, feel me! | feel me',
      'Come with me, Hail Mary',
      'Run quick see, what do we have here now',
      'Do you want to ride or die',
      'La dadada, la la | Ladadada lala',
    ],
    valid: function () {
      return getCompletedPrayerCount() > 1;
    },
    completed: {
      youtube: 'https://www.youtube.com/watch?v=nkJA6SYwa94&autoplay=1&t=9',
      image: 'img/bless_rng.png',
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

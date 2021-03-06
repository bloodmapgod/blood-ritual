//
// reward properties:
//  - weight: how likely it is to get this reward
//  - youtube: youtube video link, add &autoplay=1 and/or &t=60 to control start
//  - image: image to show
//  - text: text to show
//  - speech: spoken text on button press
//  - audio: played audio on button press
//
// If a property is an array, a random one will be chosen
//
// total weight = 7
let rewards = [
  {
    // marbles
    weight: 2,
    image: [
      'img/hypers_250.png',
      'img/marbles_sir.png',
    ],
    text: '!play',
  },
  {
    // speech insult
    weight: 1,
    image: 'img/monkahmm_250.png',
    speech: [
      'Stocky, you look like Charlie Day if he had a heroin addiction',
      'Stocky, You look like Michael Bublé if he got hit by a bus',
    ],
  },
  {
    // you suck
    weight: 2,
    image: 'img/monkahmm_250.png',
    audio: [
      'audio/you_suck_stocky.mp3',
    ],
  },
  {
    // uu rr marbles
    weight: 1,
    image: 'img/monkahmm_250.png',
    audio: [
      'audio/uurr_marbles.mp3',
    ],
  },
  {
    // audio insult
    weight: 1,
    image: 'img/monkahmm_250.png',
    audio: [
      'audio/give_me_a_yolo.mp3',
      'audio/if_you_took_plays.mp3',
      'audio/show_milkers.mp3',
      'audio/weak_hands.mp3',
    ],
  },
  {
    // fart
    weight: 1,
    image: 'img/monkahmm_250.png',
    audio: 'audio/fart.mp3',
  },
  {
    // chat goes ham
    weight: 1,
    image: 'img/kekw_anim.gif',
    text: 'Chat spam random numbers',
  },
  {
    // request a sacrifice
    weight: 1,
    image: 'img/monkas_250.png',
    text: 'A random viewer must be sacrificed',
  },
  {
    // god: under sacrifice quota
    weight: 1,
    image: 'img/monkas_250.png',
    audio: 'audio/god_quota.wav'
  },
  {
    weight: 1,
    text: 'Stocky must do a dab',
    image: 'img/dab.png',
  },
  {
    weight: 1,
    text: 'COCK',
    image: 'img/yep.jpg',
  },
  {
    // annoying songs
    weight: 1,
    image: 'img/pepe_d.gif',
    youtube: [
      'https://www.youtube.com/watch?v=hHUbLv4ThOo&autoplay=1&t=8',  // timber
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ&autoplay=1',      // rick roll
      'https://www.youtube.com/watch?v=1lB42RjZs0A&autoplay=1',      // you enjoyed your stay
      'https://www.youtube.com/watch?v=ULZWquS46y0&autoplay=1',      // trololo
      'https://www.youtube.com/watch?v=6E5m_XtCX3c&autoplay=1',      // ocean man
      'https://www.youtube.com/watch?v=LDU_Txk06tM&autoplay=1&t=74', // crab rave
      'https://www.youtube.com/watch?v=2UcZWXvgMZE&autoplay=1&t=14', // freeze dance
    ],
  },
  {
    // stonk poki butt
    weight: 1,
    image: 'img/stock_poki.png',
    youtube: [
      'https://www.youtube.com/watch?v=X53ZSxkQ3Ho&autoplay=1&t=30',  // sir bounce a lot
    ],
  },
  {
    // stock got that
    weight: 1,
    youtube: 'https://www.youtube.com/watch?v=JmLHjOzwVbw&autoplay=1'
  },
  {
    // dos horas
    weight: 1,
    youtube: 'https://www.youtube.com/watch?v=fRs99-1a8sI&autoplay=1&t=2812'
  },
  {
    // hydra_riddle
    weight: 1,
    image: 'img/hydra_riddle.png',
    text: 'Chat do you see it?',
  },
  {
    // song request
    weight: 1,
    image: 'img/pepe_jam.gif',
    text: "Add song request",
    youtube: [
      'https://www.youtube.com/watch?v=4fndeDfaWCg', // i want it that way
      'https://www.youtube.com/watch?v=lKMqwRv3plI', // epic sax guy EDM
      'https://www.youtube.com/watch?v=ymNFyxvIdaM', // freestyler, boomer classic
      'https://www.youtube.com/watch?v=uWu4aynBK7E', // tracktor sexy
      'https://www.youtube.com/watch?v=hQBgFttbtKM', // great depression song
      'https://www.youtube.com/watch?v=Fegs-XVKgnM', // dmx carly remix
      'https://www.youtube.com/watch?v=oT3mCybbhf0', // rick roll avicii pog
      'https://www.youtube.com/watch?v=xtolv9kM1qk', // i saw the light
      'https://www.youtube.com/watch?v=z_Y3mnj-8lA', // earl scruggs
      'https://www.youtube.com/watch?v=RQmEERvqq70', // everybody's circulation
      'https://www.youtube.com/watch?v=12wtsBDQTJQ', // mongols khusugtun
      'https://www.youtube.com/watch?v=p_5yt5IX38I', // mongols khusugtun
      'https://www.youtube.com/watch?v=Jqa1Ugmv9yY', // rick roll eurobeat
      'https://www.youtube.com/watch?v=Y2OSh6TqQ1o', // rick roll edm
      'https://www.youtube.com/watch?v=dX3k_QDnzHE', // m83 midnight city
      'https://www.youtube.com/watch?v=uOIHHMnI_Ig', // leo rojas
      'https://www.youtube.com/watch?v=PTTmNYzj1pc', // mesa que mas aplauda
      'https://www.youtube.com/watch?v=MlW7T0SUH0E', // chacaron
      'https://www.youtube.com/watch?v=Hy8kmNEo1i8', // scatman
      'https://www.youtube.com/watch?v=_r0n9Dv6XnY', // tarzan boy 80s
      'https://www.youtube.com/watch?v=k_U6mWu1XQA', // what is love
      'https://www.youtube.com/watch?v=TvZskcqdYcE', // running in the might new retro
      'https://www.youtube.com/watch?v=35YpV77tGm0', // never stop new retro
      'https://www.youtube.com/watch?v=zezO7GBrD_c', // return of the mack
      'https://www.youtube.com/watch?v=8GW6sLrK40k', // resonance new retro
      'https://www.youtube.com/watch?v=-cy78b9uvBs', // return of the mack edm
    ],
  },
];

let rewardNum = null;

function randomReward() {
  let indices = [];
  _.each(rewards,  (reward, idx) => {
    let weight = reward.weight || 1;
    indices = indices.concat(Array(weight).fill(idx))
  });

  let reward = rewards[rewardNum === null ? _.sample(indices) : rewardNum];

  let processedReward = {};
  _.each(reward, (val, key) => {
    if (_.isArray(val)) {
      processedReward[key] = _.sample(val);
    } else {
      processedReward[key] = val;
    }
  });

  return processedReward; // image, text, speech, audio, youtube
}

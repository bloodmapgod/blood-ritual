function getRandomQuestions(count, callback) {
  fetch('https://opentdb.com/api.php?amount=' + count + '&type=multiple')
    .then(response => response.json())
    .then(data => callback(data['results']))
    .catch(error => console.log(error));
}

function nowTimestamp() {
  return Math.floor(Date.now() / 1000);
}

let cachedViewerData = null;
let cachedViewerTime = null;

function getViewers(callback) {
  if (nowTimestamp() <= cachedViewerTime + 2 * 120) {
    callback(cachedViewerData);
    return;
  }
  fetchJsonp('https://tmi.twitch.tv/group/user/thestockguy/chatters')
    .then(response => response.json())
    .then(data => {
      cachedViewerData = data['data'];
      cachedViewerTime = nowTimestamp();
      callback(data['data']);
    })
    .catch(error => console.log(error));
}

function getRandomViewer(callback) {
  getViewers(data => {
    let all = [].concat(
      data['chatters']['vips'],
      data['chatters']['moderators'],
      data['chatters']['staff'],
      data['chatters']['admins'],
      data['chatters']['global_mods'],
      data['chatters']['viewers'],
    );
    let name;
    if (all.indexOf('bliffy_') && Math.random() > 0.8) {
      name = 'bliffy_';
    } else {
      name = _.sample(all) || 'thestockguy'
    }
    callback(name);
  });
}

function sendTrace(trace, callback) {
  let data = JSON.stringify({
    "options": "enable_pre_space",
    "requests": [{
      "writing_guide": {
        "writing_area_width": 800,
        "writing_area_height": 800
      },
      "ink": trace,
      "language": "en"
    }]
  });

  fetch(
    'https://www.google.com.tw/inputtools/request?ime=handwriting&app=mobilesearch&cs=1&oe=UTF-8',
    {
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      },
      body: data,
      method: "POST"
    }
  )
    .then(response => response.json())
    .then(data => {
      callback(data[1][0][1])
    })
    .catch(error => console.log(error));
}


function romanize(num) {
  let lookup = {M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1},
    roman = '', i;
  for (i in lookup) {
    while (num >= lookup[i]) {
      roman += i;
      num -= lookup[i];
    }
  }
  return roman;
}

let rad = function (x) {
  return x * Math.PI / 180;
};

let getDistance = function (p1, p2) {
  let R = 6378137; // Earth’s mean radius in meter
  let dLat = rad(p2.lat() - p1.lat());
  let dLong = rad(p2.lng() - p1.lng());
  let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let d = R * c;
  return d; // returns the distance in meter
};

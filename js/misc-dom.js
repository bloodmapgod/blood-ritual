/* global Cookies */
(function () {

  let tos = document.getElementById('tos-compatible');
  function showTOS() {
    tos.classList.remove('collapsed');
    Cookies.remove('hide_tos');
  }
  function hideTOS() {
    tos.classList.add('collapsed');
    Cookies.set('hide_tos', '1')
  }
  function toggleTOS() {
    tos.classList.contains('collapsed') ? showTOS() : hideTOS();
  }
  tos.addEventListener('click', toggleTOS);
  !Cookies.get('hide_tos') && showTOS();

  for (let i=0; i<150; i++) {
    let drop = document.createElement('i');
    drop.classList.add('rain');
    document.getElementById('rain-container').appendChild(drop);
  }

  let auroraBg = document.getElementById('bg-aurora');
  setInterval(function () {
    if (0.07 < Math.random()) {
      auroraBg.style.display = 'block';
      setTimeout(function () {
        auroraBg.style.display = 'none';
      }, 500); // 500ms, flash
    }
  }, 180 * 1000); // 2m
})();

function setTendiesRain() {
  document.getElementById('rain-container').classList.add('tendies');
  document.querySelectorAll('.rain').forEach(el => {
    let deg = Math.ceil(Math.random() * 360);
    el.style.transform = 'rotate(' + deg +'deg)';
  });
}

function resetRain() {
  document.getElementById('rain-container').classList.remove('tendies');
  document.querySelectorAll('.rain').forEach(el => {
    el.style.transform = null;
  });
}

const $debugButton = document.getElementById('debug-btn');
const $debugTable  = document.getElementById('debug-table');
const $debugPrayer = document.getElementById('debug-prayer');

$debugButton.addEventListener('click', () => {
  $debugTable.style.display = $debugTable.style.display === 'none' ? 'block' : 'none';
});

let $opts = '<option value="">-</option>';
prayers.forEach((prayer, idx) => {
  let title = prayer.lines[0].split('|')[0].trim().substring(0, 40);
  $opts += '<option value="' + idx + '">' + title + '</option>'
});
$debugPrayer.innerHTML = $opts;
$debugPrayer.addEventListener('input', e => {
  let val = e.target.value;
  prayerNum = '' === val ? null : parseInt(val);
});

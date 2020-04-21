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
    if (0.1 < Math.random()) {
      auroraBg.style.display = 'block';
      setTimeout(function () {
        auroraBg.style.display = 'none';
      }, 500); // 500ms, flash
    }
  }, 120 * 1000); // 2m
})();

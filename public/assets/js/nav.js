(function () {
  var header = document.querySelector('.nav');
  if (!header) return;

  var nav = header.querySelector('nav[aria-label="Primary"]');
  if (!nav) return;

  if (!nav.id) nav.id = 'primary-navigation';

  var button = document.createElement('button');
  button.className = 'nav-toggle';
  button.type = 'button';
  button.setAttribute('aria-controls', nav.id);
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-label', 'Open navigation menu');
  button.innerHTML = '<span class="nav-toggle-lines" aria-hidden="true"></span>';
  nav.parentNode.insertBefore(button, nav);
  header.classList.add('nav-ready');

  function closeMenu(returnFocus) {
    nav.classList.remove('is-open');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', 'Open navigation menu');
    if (returnFocus) button.focus();
  }

  function openMenu() {
    nav.classList.add('is-open');
    button.setAttribute('aria-expanded', 'true');
    button.setAttribute('aria-label', 'Close navigation menu');
  }

  button.addEventListener('click', function () {
    if (button.getAttribute('aria-expanded') === 'true') closeMenu(false);
    else openMenu();
  });

  nav.addEventListener('click', function (event) {
    if (event.target.closest('a')) closeMenu(false);
  });

  document.addEventListener('click', function (event) {
    if (!header.contains(event.target)) closeMenu(false);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
      closeMenu(true);
    }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 1080) closeMenu(false);
  });
})();

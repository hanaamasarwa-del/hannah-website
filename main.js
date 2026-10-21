const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-navigation');
const header = document.querySelector('.site-header');

// One class controls the animation and switches the menu/close icons.
function setMenuOpen(isOpen) {
  header.classList.toggle('menu-open', isOpen);
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'סגירת תפריט' : 'פתיחת תפריט');
}

if (menuButton && navigation && header) {
  menuButton.addEventListener('click', () => {
    setMenuOpen(menuButton.getAttribute('aria-expanded') !== 'true');
  });
  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenuOpen(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      setMenuOpen(false);
      menuButton.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (!header.contains(event.target)) setMenuOpen(false);
  });
  header.addEventListener('focusout', (event) => {
    if (!header.contains(event.relatedTarget)) setMenuOpen(false);
  });
  // Reset the menu when switching between mobile and desktop layouts.
  window.matchMedia('(max-width: 700px)').addEventListener('change', () => setMenuOpen(false));
}

const greetingForm = document.querySelector('#greeting-form');
const nameInput = document.querySelector('#visitor-name');

if (greetingForm && nameInput) {
  greetingForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = nameInput.value.trim();
    if (!name) {
      nameInput.setCustomValidity('אנא הזינו שם.');
      nameInput.reportValidity();
      return;
    }
    alert(`שלום, ${name}`);
  });
  nameInput.addEventListener('input', () => nameInput.setCustomValidity(''));
}

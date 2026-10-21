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
const greetingStatus = document.querySelector('#greeting-status');

if (greetingForm && nameInput && greetingStatus) {
  const submitButton = greetingForm.querySelector('button[type="submit"]');

  greetingForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (submitButton.disabled) return;

    const name = nameInput.value.trim();
    if (!name) {
      nameInput.setCustomValidity('אנא הזינו שם.');
      nameInput.reportValidity();
      return;
    }

    // Keep the assignment's greeting, then send the name to the email service.
    window.alert(`שלום, ${name}`);
    submitButton.disabled = true;
    submitButton.textContent = 'שולח…';
    greetingForm.setAttribute('aria-busy', 'true');
    greetingStatus.textContent = 'השם שלכם נשלח…';
    greetingStatus.classList.remove('is-error');

    try {
      const endpoint = greetingForm.action.replace('https://formsubmit.co/', 'https://formsubmit.co/ajax/');
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, _subject: 'מישהו אמר שלום באתר של הנא' }),
        signal: AbortSignal.timeout(15000),
      });
      const result = await response.json();

      if (!response.ok || (result.success !== true && result.success !== 'true')) {
        throw new Error('The email service did not accept the submission.');
      }

      greetingStatus.textContent = 'הבקשה התקבלה. תודה שאמרתם שלום!';
      greetingForm.reset();
    } catch {
      greetingStatus.textContent = 'לא הצלחנו לאשר את השליחה. אפשר לנסות שוב בעוד רגע.';
      greetingStatus.classList.add('is-error');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'שלום';
      greetingForm.setAttribute('aria-busy', 'false');
    }
  });
  nameInput.addEventListener('input', () => nameInput.setCustomValidity(''));
}

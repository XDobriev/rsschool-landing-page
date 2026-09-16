const STORAGE_KEY = 'theme';
const root = document.documentElement;
const buttons = document.querySelectorAll('.theme-toggle__btn');

function applyTheme(theme) {
  if (theme === 'dark') {
    root.setAttribute('data-theme', 'dark');
  } else {
    root.removeAttribute('data-theme');
  }

  buttons.forEach((button) => {
    const isActive = button.dataset.themeValue === theme;
    button.classList.toggle('theme-toggle__btn--active', isActive);
    button.setAttribute('aria-pressed', isActive);
  });
}

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const theme = button.dataset.themeValue;
    localStorage.setItem(STORAGE_KEY, theme);
    applyTheme(theme);
  });
});

applyTheme(localStorage.getItem(STORAGE_KEY) === 'dark' ? 'dark' : 'light');

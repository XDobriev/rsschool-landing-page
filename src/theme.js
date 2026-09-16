const STORAGE_KEY = 'theme';
const root = document.documentElement;
const toggle = document.querySelector('.theme-toggle');

toggle.addEventListener('click', () => {
  const isDark = root.getAttribute('data-theme') === 'dark';

  if (isDark) {
    root.removeAttribute('data-theme');
    localStorage.setItem(STORAGE_KEY, 'light');
  } else {
    root.setAttribute('data-theme', 'dark');
    localStorage.setItem(STORAGE_KEY, 'dark');
  }
});

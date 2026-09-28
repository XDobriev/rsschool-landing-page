export function lockScroll() {
  const scrollbar = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.paddingRight = `${scrollbar}px`;
  document.body.classList.add('is-locked');
}

export function unlockScroll() {
  document.body.style.paddingRight = '';
  document.body.classList.remove('is-locked');
}

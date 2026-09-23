import { lockScroll, unlockScroll } from './scroll-lock.js';

const TABLET_WIDTH = 768;

const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav');

function isOpen() {
  return nav.classList.contains('nav--open');
}

function openMenu() {
  nav.classList.add('nav--open');
  burger.classList.add('burger--open');
  burger.setAttribute('aria-expanded', 'true');
  burger.setAttribute('aria-label', 'Close menu');
  lockScroll();
}

function closeMenu() {
  if (!isOpen()) {
    return;
  }

  nav.classList.remove('nav--open');
  burger.classList.remove('burger--open');
  burger.setAttribute('aria-expanded', 'false');
  burger.setAttribute('aria-label', 'Open menu');
  unlockScroll();
}

burger.addEventListener('click', () => {
  if (isOpen()) {
    closeMenu();
  } else {
    openMenu();
  }
});

nav.addEventListener('click', (event) => {
  if (event.target.closest('.nav__link')) {
    closeMenu();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeMenu();
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > TABLET_WIDTH) {
    closeMenu();
  }
});

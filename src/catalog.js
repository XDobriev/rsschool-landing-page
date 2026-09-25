import './styles/main.scss';
import './theme.js';
import './burger.js';
import products from './products.json';
import { productImage } from './images.js';
import { openModal } from './modal.js';

const MOBILE_LIMIT = 4;

const grid = document.querySelector('.catalog__grid');
const tabs = document.querySelectorAll('.tab');
const moreButton = document.querySelector('.catalog__more');
const mobile = window.matchMedia('(max-width: 768px)');

let category = tabs[0].dataset.category;
let expanded = false;
let visible = [];

function cardMarkup(product, index) {
  return `
            <li class="card" data-index="${index}" tabindex="0">
              <img src="${productImage(product.image)}" alt="${product.name}" class="card__image">
              <div class="card__body">
                <div class="card__info">
                  <h2 class="card__title">${product.name}</h2>
                  <p class="card__description">${product.description}</p>
                </div>
                <p class="card__price">$${product.price}</p>
              </div>
            </li>`;
}

function render() {
  const items = products.filter((product) => product.category === category);
  visible = mobile.matches && !expanded ? items.slice(0, MOBILE_LIMIT) : items;

  grid.innerHTML = visible.map(cardMarkup).join('');
  moreButton.hidden = visible.length === items.length;
}

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    if (tab.dataset.category === category) {
      return;
    }

    tabs.forEach((item) => {
      const isActive = item === tab;
      item.classList.toggle('tab--active', isActive);
      item.setAttribute('aria-pressed', isActive);
    });

    category = tab.dataset.category;
    expanded = false;
    render();
  });
});

moreButton.addEventListener('click', () => {
  expanded = true;
  render();
});

mobile.addEventListener('change', () => {
  expanded = false;
  render();
});

grid.addEventListener('click', (event) => {
  const card = event.target.closest('.card');

  if (card) {
    openModal(visible[card.dataset.index]);
  }
});

grid.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter' && event.key !== ' ') {
    return;
  }

  const card = event.target.closest('.card');

  if (card) {
    event.preventDefault();
    openModal(visible[card.dataset.index]);
  }
});

render();

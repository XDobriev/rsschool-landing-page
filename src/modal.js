import { lockScroll, unlockScroll } from './scroll-lock.js';
import { productImage } from './images.js';

const NOTE = `The cost is not final. Download our mobile app to see the final price
  and place your order. Earn loyalty points and enjoy your favorite coffee
  with up to 20% discount.`;

const INFO_ICON = `<svg class="modal__alert-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M8 7.66667V11" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M8 5.00667L8.00667 4.99926" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M8 14.6667C11.6819 14.6667 14.6667 11.6819 14.6667 8C14.6667 4.3181 11.6819 1.33333 8 1.33333C4.3181 1.33333 1.33333 4.3181 1.33333 8C1.33333 11.6819 4.3181 14.6667 8 14.6667Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;

const modal = document.querySelector('.modal');
const modalWindow = modal.querySelector('.modal__window');

let product = null;
let size = 's';
let additives = [];
let lastFocused = null;

function getTotal() {
  const extras = additives.reduce(
    (sum, index) => sum + Number(product.additives[index]['add-price']),
    0,
  );

  return Number(product.price) + Number(product.sizes[size]['add-price']) + extras;
}

function updateTotal() {
  modalWindow.querySelector('.modal__price').textContent = `$${getTotal().toFixed(2)}`;
}

function optionMarkup(mark, label, attribute, value, isActive) {
  return `
            <button type="button" class="tab${isActive ? ' tab--active' : ''}" data-${attribute}="${value}">
              <span class="tab__icon">${mark}</span>
              ${label}
            </button>`;
}

function render() {
  const sizeOptions = Object.entries(product.sizes)
    .map(([key, value]) => optionMarkup(key.toUpperCase(), value.size, 'size', key, key === size))
    .join('');

  const additiveOptions = product.additives
    .map((additive, index) => optionMarkup(index + 1, additive.name, 'additive', index, false))
    .join('');

  modalWindow.innerHTML = `
      <img src="${productImage(product.image)}" alt="${product.name}" class="modal__image">

      <div class="modal__content">
        <div class="modal__heading">
          <h2 class="modal__title">${product.name}</h2>
          <p class="modal__description">${product.description}</p>
        </div>

        <div class="modal__group">
          <p class="modal__group-title">Size</p>
          <div class="modal__options">${sizeOptions}</div>
        </div>

        <div class="modal__group">
          <p class="modal__group-title">Additives</p>
          <div class="modal__options">${additiveOptions}</div>
        </div>

        <p class="modal__total">
          <span class="modal__total-label">Total:</span>
          <span class="modal__price"></span>
        </p>

        <div class="modal__alert">
          ${INFO_ICON}
          <p class="modal__note">${NOTE}</p>
        </div>

        <button type="button" class="modal__close">Close</button>
      </div>`;

  updateTotal();
}

function closeModal() {
  if (!modal.classList.contains('modal--open')) {
    return;
  }

  modal.classList.remove('modal--open');
  unlockScroll();

  if (lastFocused) {
    lastFocused.focus();
  }
}

export function openModal(selected) {
  product = selected;
  size = 's';
  additives = [];
  lastFocused = document.activeElement;

  render();
  modalWindow.setAttribute('aria-label', product.name);
  modal.classList.add('modal--open');
  lockScroll();
  modalWindow.querySelector('.modal__close').focus();
}

modal.addEventListener('click', (event) => {
  if (!event.target.closest('.modal__window') || event.target.closest('.modal__close')) {
    closeModal();
    return;
  }

  const sizeButton = event.target.closest('[data-size]');

  if (sizeButton) {
    size = sizeButton.dataset.size;
    modalWindow.querySelectorAll('[data-size]').forEach((button) => {
      button.classList.toggle('tab--active', button === sizeButton);
    });
    updateTotal();
    return;
  }

  const additiveButton = event.target.closest('[data-additive]');

  if (additiveButton) {
    const index = Number(additiveButton.dataset.additive);

    additives = additives.includes(index)
      ? additives.filter((item) => item !== index)
      : [...additives, index];

    additiveButton.classList.toggle('tab--active');
    updateTotal();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeModal();
  }
});

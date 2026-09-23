import { lockScroll, unlockScroll } from './scroll-lock.js';
import { productImage } from './images.js';

const NOTE = `The cost is not final. Download our mobile app to see the final price
  and place your order. Earn loyalty points and enjoy your favourite coffee
  with up to 20% discount.`;

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

function render() {
  const sizeOptions = Object.entries(product.sizes)
    .map(([key, value]) => `
            <button type="button" class="option${key === size ? ' option--active' : ''}" data-size="${key}">
              <span class="option__mark">${key.toUpperCase()}</span>
              ${value.size}
            </button>`)
    .join('');

  const additiveOptions = product.additives
    .map((additive, index) => `
            <button type="button" class="option" data-additive="${index}">
              <span class="option__mark">${index + 1}</span>
              ${additive.name}
            </button>`)
    .join('');

  modalWindow.innerHTML = `
      <img src="${productImage(product.image)}" alt="${product.name}" class="modal__image">

      <div class="modal__content">
        <h2 class="modal__title">${product.name}</h2>
        <p class="modal__description">${product.description}</p>

        <div class="modal__group">
          <p class="modal__group-title">Size</p>
          <div class="modal__options">${sizeOptions}</div>
        </div>

        <div class="modal__group">
          <p class="modal__group-title">Additives</p>
          <div class="modal__options">${additiveOptions}</div>
        </div>

        <p class="modal__total">Total: <span class="modal__price"></span></p>
        <p class="modal__note">${NOTE}</p>

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
      button.classList.toggle('option--active', button === sizeButton);
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

    additiveButton.classList.toggle('option--active');
    updateTotal();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeModal();
  }
});

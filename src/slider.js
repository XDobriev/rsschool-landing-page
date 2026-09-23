const slider = document.querySelector('.slider');
const track = slider.querySelector('.slider__track');
const slides = slider.querySelectorAll('.slider__slide');
const prevButton = slider.querySelector('.slider__control--prev');
const nextButton = slider.querySelector('.slider__control--next');
const dots = document.querySelectorAll('.slider__dot');

let current = 0;

function showSlide(index) {
  current = (index + slides.length) % slides.length;
  track.style.transform = `translateX(-${current * 100}%)`;

  slides.forEach((slide, i) => {
    slide.setAttribute('aria-hidden', i !== current);
  });

  dots.forEach((dot, i) => {
    dot.classList.toggle('slider__dot--active', i === current);
  });
}

prevButton.addEventListener('click', () => showSlide(current - 1));
nextButton.addEventListener('click', () => showSlide(current + 1));

dots.forEach((dot, index) => {
  dot.addEventListener('click', () => showSlide(index));
});

showSlide(0);

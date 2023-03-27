'use strict';

///////////////////////////////////////
// ELEMENTS

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('section');
const dotContainer = document.querySelector('.dots');
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');

////////////////////////////////////////////////////////////////////////////////////////////
//FUNCTIONS

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const sibilings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    sibilings.forEach(el => {
      if (el !== link) {
        el.style.opacity = this;
      }
    });
    logo.style.opacity = this;
  }
};

const createDots = () => {
  slides.forEach((_, i) => {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide='${i}'></button>`
    );
  });
};

const activateDot = function (slide) {
  document.querySelectorAll('.dots__dot').forEach(dot => {
    dot.classList.remove('dots__dot--active');
  });

  document
    .querySelector(`.dots__dot[data-slide = "${slide}"]`)
    .classList.add('dots__dot--active');
};

const goToSlide = function (slide = 0) {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${(i - slide) * 100}%)`;
  });
};

const nextSlide = function () {
  {
    currentSlide = currentSlide === maxSlide ? 0 : ++currentSlide;

    goToSlide(currentSlide);
    activateDot(currentSlide);
    // 0%, 100%, 200% and so on
  }
};
const prevSlide = function () {
  currentSlide = currentSlide === 0 ? maxSlide : --currentSlide;
  goToSlide(currentSlide);
  activateDot(currentSlide);
};
const init = function () {
  //Setting slide to zero
  createDots();
  goToSlide();
  activateDot(0);
};
init();

//Modals
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
///////////////////////////////////////////////////////////////////////////////////////////////////
//SCROLLING SMOOTHLY
btnScrollTo.addEventListener('click', function (e) {
  //MODERN WAY
  section1.scrollIntoView({ behavior: 'smooth' });
});
//////////////////////////////////////////////////////////////////////////////////////////////////
//NAV

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  //Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////
//TABBED COMPONENET
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  //Guard clause
  if (!clicked) return;

  //Remove active class from tabs
  tabs.forEach(child => child.classList.remove('operations__tab--active'));

  //Add active to clicked
  clicked.classList.add('operations__tab--active');

  //Removing active class from btn description
  tabsContent.forEach(element =>
    element.classList.remove('operations__content--active')
  );

  //Adding active class to content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));
/////////////////////////////////////////////////////////////////////////////////////////////////
//STICKY NAVIGATION WITH INTERSECTION OBSERVER API

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${nav.getBoundingClientRect().height}px`,
});
headerObserver.observe(header);

//Reveal sections
// allSections.forEach(section => section.classList.add('section--hidden'));
// console.log(allSections);

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  sectionObserver.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});
///////////////////////////////////////////////////////////////////////////////////////////////////
//LAZY LOADIG IMAGES (FOR PERFORMANCE)
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  //Guard clouse
  if (!entry.isIntersecting) return;

  //Replace src with data-src, emmits load event when loaded
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', e => {
    e.target.classList.remove('lazy-img');
  });
  imgObserver.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));
////////////////////////////////////////////////////////////////////////////////////////////
/////SLIDER
let currentSlide = 0;
const maxSlide = slides.length - 1;

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);
//Arrow keys to go next and prev slide
document.addEventListener('keydown', function (e) {
  e.key === 'ArrowLeft' && prevSlide();
  e.key === 'ArrowRight' && nextSlide();
});

dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const { slide } = e.target.dataset;
    goToSlide(slide);
    activateDot(slide);
  }
});

'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollDown = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
//tab-component
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
//slider-component
const btnRight = document.querySelector('.slider__btn--right');
const btnLeft = document.querySelector('.slider__btn--left');
const slides = document.querySelectorAll('.slide');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
btnsOpenModal.forEach(btn => btn.addEventListener('clicl', openModal()));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
//_______________________________________________________________________________
//***************Opacity-navbar********************//
const navOpacity = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const navElement = e.target;
    // console.log(navElement);
    const navElements = navElement
      .closest('.nav')
      .querySelectorAll('.nav__link');
    const navLogo = navElement.closest('.nav').querySelector('.nav__logo');
    navElements.forEach(el => {
      if (el !== navElement) el.style.opacity = this;
    });
    navLogo.style.opacity = this;
  }
};
nav.addEventListener('mouseover', navOpacity.bind(0.5));
nav.addEventListener('mouseout', navOpacity.bind(1));
//_______________________________________________________________________________
//***************sticky-navbar********************//
const navHeight = nav.getBoundingClientRect().height;
// console.log(navHeight);
const headerObsCallBack = function (entries) {
  const [entry] = entries;
  //   console.log(entry);
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const headerObsOption = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};
const headerObserver = new IntersectionObserver(
  headerObsCallBack,
  headerObsOption
);
headerObserver.observe(header);
//_______________________________________________________________________________
//***************Scroll-Smooth********************//
btnScrollDown.addEventListener('click', function (e) {
  e.preventDefault();
  section1.scrollIntoView({ behavior: 'smooth' });
});
//_______________________________________________________________________________
//***************Page-Navigation*******************//
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});
//_______________________________________________________________________________
//***************Revealing Sections on Scroll*******************//
const sections = document.querySelectorAll('.section');

const obsSectionCallBack = function (entries, observer) {
  const [entry] = entries;
  //   console.log(entry);
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const obsSectionOption = {
  root: null,
  threshold: 0.15,
};
const obsSection = new IntersectionObserver(
  obsSectionCallBack,
  obsSectionOption
);
sections.forEach(function (section) {
  obsSection.observe(section);
  section.classList.add('section--hidden');
});

//_______________________________________________________________________________
//******************Operations-Tabbed Component****************//
// Add Event with Event delegation
tabsContainer.addEventListener('click', function (e) {
  const tab = e.target.closest('.operations__tab');
  //Guard clause
  if (!tab) return;
  // remove active tabs and contents
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  // add active class
  tab.classList.add('operations__tab--active');
  // add active content
  document
    .querySelector(`.operations__content--${tab.dataset.tab}`)
    .classList.add('operations__content--active');
});
//_______________________________________________________________________________
//******************Lazy Load Images****************//
const imgLazy = document.querySelectorAll('img[data-src]');
const obsImgOption = {
  root: null,
  threshold: 0,
};
const obsImgCallback = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const obsImg = new IntersectionObserver(obsImgCallback, obsImgOption);
imgLazy.forEach(image => obsImg.observe(image));
//_______________________________________________________________________________
//******************Slider-section****************//
const sliderSection = function () {
  let currSlide = 0;
  const gotoSlide = function (currSlide) {
    slides.forEach(
      (slide, i) =>
        (slide.style.transform = `translateX(${100 * (i - currSlide)}%)`)
    );
  };
  gotoSlide(0);

  const nextSlide = function () {
    if (currSlide === slides.length - 1) {
      currSlide = 0;
    } else {
      currSlide++;
    }
    gotoSlide(currSlide);
    activatDotsColor(currSlide);
  };
  const prevSlide = function () {
    if (currSlide === 0) {
      currSlide = slides.length - 1;
    } else {
      currSlide--;
    }
    gotoSlide(currSlide);
    activatDotsColor(currSlide);
  };

  btnLeft.addEventListener('click', prevSlide);
  btnRight.addEventListener('click', nextSlide);
  // key-board-arrows
  document.addEventListener('keydown', function (e) {
    console.log(e);
    if (e.key === 'ArrowRight') nextSlide();
    e.key === 'ArrowLeft' && prevSlide();
  });

  //add dots
  const dotsContainer = document.querySelector('.dots');
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotsContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };
  createDots();

  // activate-dots-when clicked
  dotsContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const specificSlide = e.target.dataset.slide;
      gotoSlide(specificSlide);
      activatDotsColor(specificSlide);
    }
  });

  // activat-dots-color
  const dots = document.querySelectorAll('.dots__dot');
  const activatDotsColor = function (slideNumber) {
    dots.forEach(dot => {
      dot.classList.remove('dots__dot--active');
    });
    document
      .querySelector(`.dots__dot[data-slide="${slideNumber}"]`)
      .classList.add('dots__dot--active');
  };
  activatDotsColor(0);
};
sliderSection();
//_______________________________________________________________________________
//******************Finished****************//

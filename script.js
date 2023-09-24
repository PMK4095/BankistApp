'use strict';

///////////////////////////////////////
// Declarations

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');

///////////////////////////////////////////////////////* Modal window */
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
/////////////////////////////////////////////////////////Scrolling Button

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  // console.log(s1coords);

  // console.log(e.target.getBoundingClientRect());

  // console.log(`current scroll (X\Y)`, window.pageXOffset, window.pageYOffset);

  //scrolling

  //getting the absolute coordinates
  /* windows.scrollTo(
    s1coords.left + window.pageXOffset,
    s1coords.top + window.pageYOffset
  ); */

  //implementing smooth behaviour//OLD WAY
  /* window.scrollTo({
    left: s1coords.left + window.pageXOffset,
    top: s1coords.top + window.pageYOffset,
    behavior: 'smooth',
  }); */

  //NEW WAY
  section1.scrollIntoView({ behavior: 'smooth' });
});

/* Page Navigation */ ////////////////////////////

//using old method__Where each element will be assigned separate event listener which will make the program slow
/* document.querySelectorAll('.nav__link').forEach(function (event) {
  event.addEventListener('click', function (e) {
    e.preventDefault();

    const id = this.getAttribute('href');
    console.log(id);

    document.querySelector(id).scrollIntoView({
      behavior: 'smooth',
    });
  });
}); */

//using new method__Event Delegation
//1.ADD event listener to common parent element
document
  .querySelector('.nav__links')
  .addEventListener('click', function (event) {
    event.preventDefault();

    //2.Determine what element originated the event
    //Matching strategy
    if (event.target.classList.contains('nav__link')) {
      const id = event.target.getAttribute('href');
      console.log(id);
      document.querySelector(id).scrollIntoView({
        behavior: 'smooth',
      });
    }
  });

///TABBED COMPONENTS

tabsContainer.addEventListener('click', function (event) {
  const clicked = event.target.closest('.operations__tab');
  // console.log(clicked);

  //guard clause
  if (!clicked) return;

  //remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  //Active tab
  clicked.classList.add('operations__tab--active');
  //Activate Content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//MENU FADE ANIMATION
const handlehover = function (event, opacity) {
  if (event.target.classList.contains('nav__link')) {
    const linked = event.target;
    const siblings = linked.closest('.nav').querySelectorAll('.nav__link');
    const logo = linked.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== linked) el.style.opacity = opacity;
    });
    logo.style.opacity = opacity;
  }
};
nav.addEventListener('mouseover', function (event) {
  handlehover(event, 0.5);
});
nav.addEventListener('mouseout', function (event) {
  handlehover(event, 1);
});

//STICKY NAVIGATION

//using Scroll method(old method not efficient)
/* const initialCoords = section1.getBoundingClientRect();

window.addEventListener('scroll', function (event) {
  // console.log(window.scrollY);
  if (this.window.scrollY > initialCoords.top) {
    nav.classList.add('sticky');
  } else nav.classList.remove('sticky');
}); */
//Sticky navigation: Intersection Observer API
/* const obsCallback = function (entries, observer) {
  entries.forEach(entry => {
    console.log(entry);
  });
};

const obsOptions = {
  root: null,
  threshold: [0, 0.2],
};

const observer = new IntersectionObserver(obsCallback, obsOptions);
observer.observe(section1); */
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

//Reveal SEctions
const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.3,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

//Lazy loading Images

const imgTargets = document.querySelectorAll('img[data-src]');
/* callBackFunction */
const loadImg = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return;

  //replace src with data-src
  entry.target.src = entry.target.dataset.src;
  //this is done to ensure that the images are loaded before removing the blurry filter
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  //this is done to stop observing after loading the whole site
  observer.unobserve(entry.target);
};
/* observer */
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  //this is done to load imgs a bit early
  rootMargin: '+200px',
});
/* observe */
imgTargets.forEach(img => imgObserver.observe(img));

//Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');
  let currSlide = 0;
  const maxSlide = slides.length;

  // const createDots = function () {
  //   slides.forEach(function (_, i) {
  //     dotContainer.insertAdjacentElement(
  //       'beforeend',
  //       `<button class = "dots__dot" data-slide = "${i}"></button>`
  //     );
  //   });
  // };

  const createDots = function () {
    slides.forEach(function (_, i) {
      const dotElement = document.createElement('button');
      dotElement.className = 'dots__dot';
      dotElement.setAttribute('data-slide', i);
      dotContainer.insertAdjacentElement('beforeend', dotElement);
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add(`dots__dot--active`);
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  /* next slide la jaychya velis */
  const nextSlide = function () {
    if (currSlide === maxSlide - 1) {
      currSlide = 0;
    } else {
      currSlide++;
    }
    goToSlide(currSlide);
    activateDot(currSlide);
  };
  const prevSlide = function () {
    if (currSlide === 0) {
      currSlide = maxSlide - 1;
    } else {
      currSlide--;
    }
    goToSlide(currSlide);
    activateDot(currSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  init();

  //Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  //ADDING KEYBOARD EVENTS TO THE SLIDER COMPONENT
  document.addEventListener('keydown', function (event) {
    console.log(event);
    if (event.key === 'ArrowLeft') prevSlide();
    event.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// to code practice...//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const message = document.createElement('div');
message.classList.add('cookie-message');
message.innerHTML =
  "We use Cookies to improve user Experience.<button class = 'btn btn--close-cookie'>Got it!</button>";
// header.prepend(message);
header.prepend(message);
// header.append(message.cloneNode(true));

//Delete elements
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.parentElement.removeChild(message);
  });

// message.insertAdjacentElement( );

//Styles
message.style.backgroundColor = '#37383d';
message.style.width = '120%'; //only set the inline css

/* console.log(getComputedStyle(message).color); */ //this will give us the .css file props

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 20 + 'px';

// document.documentElement.style.setProperty('--color-primary', 'orangered');

//Attributes/////////////////////////////////////////
/* 
const logo = document.querySelector('.nav__logo');
console.log(logo);
console.log(logo.alt);
console.log(logo.src); */

//classes/////////////////////////////////////////////

/* logo.classList.add('c', 'J');
logo.classList.remove('c', 'J');
logo.classList.toggle('c');
logo.classList.contains('c');
console.log(logo); */

//various Event handlers////////////////////////////////
/* 
const h1 = document.querySelector('h1');
h1.addEventListener('mouseenter', function (e) {
  alert('addEventListener: Great! You are reading the heading :D');
});

h1.ondblclick = function () {
  console.log('pressed two times');
}; */

//EVent bubbling and capturing and propogation
/*  */ ///////////////////////////////////////
const randomint = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const randomColor = () =>
  `rgb(${randomint(0, 255)}, ${randomint(0, 255)}, ${randomint(0, 255)})`;

// console.log(randomColor(0, 255));

//Bubbling and capturing///////////////////////////

/* document.querySelector('.nav__link').addEventListener('click', function (e) {
  console.log('LINK', e.target);
});
document.querySelector('.nav__links').addEventListener('click', function (e) {
  console.log('container', e.target);
});
document.querySelector('.nav').addEventListener('click', function (e) {
  console.log('nav', e.target);
});
 */

///////////////////////////////////////////////////////DOM TRAVERSING

const h1 = document.querySelector('h1');

/* //going downwards: child
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes); //all nodes
console.log(h1.children); //all live nodes
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'orangered';

//going upwards: parents
console.log(h1.parentNode);
console.log(h1.parentElement);
h1.closest('.header').style.background = 'var(--gradient-secondary)';

//going sideways: sibling
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling); */

document.addEventListener('DOMContentLoaded', function (event) {
  console.log('Html parsed and DOM Tree built!', event);
});

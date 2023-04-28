

const dataFilter = '[data-filter]';
const filterClass = '.filter-link';
const active = 'active';

/* card list */ 

const filterLinks = document.querySelectorAll(dataFilter);

const setActive = (elm, selector) => {
   if (document.querySelector(`${selector}.${active}`) !== null) {
      document.querySelector(`${selector}.${active}`).classList.remove(active);
   }
   elm.classList.add(active);
};

for (const link of filterLinks) {
   link.addEventListener('click', function() {
      setActive(link, filterClass);
   });   
}

/* carousel */ 

const slides = document.querySelectorAll('.info-card');
const slideButtons = document.querySelectorAll('.slide-ctrl-container button');
let currentSlide = Math.floor(Math.random() * slides.length);
let prevSlide = (currentSlide > 0) ? currentSlide - 1 : slides.length - 1;
let nextSlide = (currentSlide < slides.length - 1) ? currentSlide + 1 : 0;

const goToPrev = () => (currentSlide > 0) ? goToNum(currentSlide - 1) : goToNum(slides.length - 1);
const goToNext = () => (currentSlide < slides.length - 1) ? goToNum(currentSlide + 1) : goToNum(0);

const goToNum = (val) => {
   currentSlide = val;
   prevSlide = (currentSlide > 0) ? currentSlide - 1 : slides.length - 1;
   nextSlide = (currentSlide < slides.length - 1) ? currentSlide + 1 : 0;
   console.log('prev: ' + prevSlide, 'current:' + currentSlide, 'next:' + nextSlide);
   updateCarousel();
};

const updateCarousel = () => {
   for (const slide of slides) {
      slide.classList.remove('next', 'active', 'previous');
   }

   slides[prevSlide].classList.add('previous');
   slides[currentSlide].classList.add('active');
   slides[nextSlide].classList.add('next');
};

for (let i = 0; i < slideButtons.length; i++) {
   slideButtons[i].addEventListener('click', () => (i === 0) ? goToPrev() : goToNext());
}

updateCarousel();
const sortDir = '[data-sortdir]';
const siteHeader = document.querySelector('.site-header h4');
const filterLinks = document.querySelectorAll(sortDir);
const mainCollection = document.getElementById('collections');
const favCollection = document.getElementById('favorites');

/* populate cards */ 

const pokeNames = [
   'ditto',
   'pikachu',
   'charizard',
   'muk',
   'mewtwo',
   'abra',
   'alakazam',
   'gardevoir',
   'gyarados',
   'articuno',
   'magmar',
   'blastoise',
   'dugtrio',
   'snorlax',
   'shellder',
   'klefki',
   'bulbasaur',
   'magnemite',
   'arcanine',
   'kabuto',
   'lugia'
];

pokeNames.sort();

const fetchList = [];
for (let i = 0; i < pokeNames.length; i++) {
   const pokemon = fetch(`https://pokeapi.co/api/v2/pokemon/${pokeNames[i]}`);
   fetchList.push(pokemon);
}

siteHeader.innerText = `Select your favorites below\n from among ${pokeNames.length} pokemon!`;

const pokeList = [];

const createCard = (array, index) => {
   const pokemon = array[index];
   const html =
      `<div id="${pokemon.name}" class="info-card">
         <div class="card-body">
            <div class="card-title">
               ${pokemon.name.toUpperCase()}
            </div>
            <div class="img-container">
               <img src=${pokemon.sprites.front_default} alt="${pokemon.name} image">
            </div>

            <div class="stats-container">
               <div class="type">
                  Type: ${pokemon.types[0].type.name}
               </div>

               <div class="base-stats-container">
                  <div class="hp">
                     HP: <div>${pokemon.stats[0].base_stat}</div>
                  </div>
                  <div class="atk">
                     Attack: <span>${pokemon.stats[1].base_stat}</span>
                  </div>
                  <div class="defense">
                     Defense: <span>${pokemon.stats[2].base_stat}</span>
                  </div>
                  <div class="special-attack">
                     Special-Attack: <span>${pokemon.stats[3].base_stat}</span>
                  </div>
                  <div class="special-defense">
                     Special-Defense: <span>${pokemon.stats[4].base_stat}</span>
                  </div>
                  <div class="speed">
                     Speed: <span>${pokemon.stats[5].base_stat}</span>
                  </div>
               </div>
            </div>
            <div class="card-tool-tip">
               Click to add to favorites
            </div>
         </div>
      </div>`;
   
   return html;
};

/* carousel */ 

let slides, currentSlide, prevSlide, nextSlide;

const appendCards = () => {
   for (let i = 0; i < pokeList.length; i++) {
      const card = createCard(pokeList, i);
      mainCollection.innerHTML += card;
   }
};

const updatePrevSlide = () => { prevSlide = (currentSlide > 0) ? currentSlide - 1 : slides.length - 1; };
const updateNextSlide = () => { nextSlide = (currentSlide < slides.length - 1) ? currentSlide + 1 : 0; };


const carouselToggle = '[data-toggle]';
const infoCard = '.info-card';
const slideButton = '.slide-ctrl-container button';
const cardContainer = '.info-card-grid';
const carouselMode = 'carousel-mode';

const slideButtons = document.querySelectorAll(slideButton);
const toggleCarousel = document.querySelector(carouselToggle);
const changeMode = document.querySelector(cardContainer);

toggleCarousel.addEventListener('click', function() {
   const array = Array.from(changeMode.classList);
   if (array.includes(carouselMode)) {
      this.innerText = 'Change to Carousel Mode';  
      changeMode.classList.remove(carouselMode);
   } else {
      this.innerText = 'Change to 2d Mode';
      changeMode.classList.add(carouselMode);
   }
});

const goToPrev = () => (currentSlide > 0) ? goToNum(currentSlide - 1) : goToNum(slides.length - 1);
const goToNext = () => (currentSlide < slides.length - 1) ? goToNum(currentSlide + 1) : goToNum(0);

const goToNum = (val) => {
   currentSlide = val;
   updatePrevSlide();
   updateNextSlide();
   console.log('prev: ' + prevSlide, 'current:' + currentSlide, 'next:' + nextSlide);
   updateCarousel();
};

const clearSlides = () => {
   for (const slide of slides) {
      slide.classList.remove('next', 'active', 'previous');
   }
}

const updateCarousel = () => {
   clearSlides();
   slides[prevSlide].classList.add('previous');
   slides[currentSlide].classList.add('active');
   slides[nextSlide].classList.add('next');
};

for (let i = 0; i < slideButtons.length; i++) {
   slideButtons[i].addEventListener('click', () => (i === 0) ? goToPrev() : goToNext());
}

const updateCollections = (id, direction) => {
   const parent = (direction === 'toMain') ? mainCollection : favCollection;
   const element = document.getElementById(id);
   parent.append(element);
   goToNext();
   goToNext();
};

Promise.all(fetchList)
.then((response) => {
      return Promise.all(response.map((res) => res.json()))
   })
   .then((data) => {
      const newData = Array.from(data);
      for (let i = 0; i < newData.length; i++) {
         pokeList.push(newData[i]);
      }
      return pokeList;
   })
   .then(() => { 
      appendCards();
      slides = document.querySelectorAll(infoCard);
      currentSlide = Math.floor(Math.random() * slides.length);
      updatePrevSlide();
      updateNextSlide();
      updateCarousel();
      slides.forEach((item) => {
         item.addEventListener('click', function(){
          const parentId = this.parentElement.id;
          const dir = (parentId === 'collections') ? 'toFavs' : 'toMain';
          const id = this.id;
          updateCollections(id, dir);
         });
      });
   });
   
   const sortData = (dir, container) => {
      const newArr = Array.from(slides);
      newArr.sort((a,b) => {
         if (dir === 'desc') {
            if (a.id < b.id) return 1
            else if (a.id > b.id) return -1
            else return 0;
         }
      });
      newArr.forEach((card) => container.append(card));
   };
   
   filterLinks.forEach((link) => {
      const sortDir = link.dataset.sortdir;
      link.addEventListener('click', function(){
         sortData(sortDir, mainCollection);
      });
   });

   slides = document.querySelectorAll('.info-card');

   
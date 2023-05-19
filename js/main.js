const modalOpen = '[data-open]';
const modalClose = '[data-close]';
const isVisible = 'is-visible';
const open = 'open';
const typeTab = '.types'
const typeList = 'type-list';
const neonButton = '.neon-button';
const filterLink = '[data-filter]';
const active = 'active';
const toolTip = '.card-tool-tip';

const root = document.documentElement;

const apiNames = [
   'ditto',
   'pikachu',
   'mewtwo',
   'bulbasaur',
   'charizard',
   'charmander',
   'gastly',
   'haunter',
   'abra',
   'kadabra',
   'alakazam',
   'staryu',
   'starmie',
   'mew',
   'gardevoir',
   'klefki',
   'articuno',
   'venusaur',
   'gyarados',
   'kabuto',
   'snorlax',
   'muk',
   'grimer',
   'arbok',
   'ninjask'
];

const jsonList = [];
const sumOfTypes = {};
const typeHeight = 42.3;
const listHeight = '--list-height';
const mainId = 'main-collection';
const favId = 'favorites-collection';
const mainCollection = document.getElementById(mainId);
const favCollection = document.getElementById(favId);
const mainCards = [];
const favCards = [];

/*modals*/

const openModals = document.querySelectorAll(modalOpen);
const closeModals = document.querySelectorAll(modalClose);

for (const elm of openModals) {
   elm.addEventListener('click', function(){
      const modalId = this.dataset.open;
      document.getElementById(modalId).classList.add(isVisible);
   });
}

for (const elm of closeModals) {
   elm.addEventListener('click', function(){
      const modalId = this.dataset.close;
      document.getElementById(modalId).classList.remove(isVisible);
   });
}

/*elemental types list*/
const toggleTypes = document.querySelector(typeTab).addEventListener('click', function(){
   if (!this.className.includes(open)) {
      this.classList.add(open);
   } else {
      this.classList.remove(open);
   }
});

const setActive = (elm, selector) => {
   if (document.querySelector(`${selector}.${active}`) !== null) {
      document.querySelector(`${selector}.${active}`).classList.remove(active);
   }
   elm.classList.add(active);
};

const searchBox = document.getElementById('search');

searchBox.addEventListener('keyup', (e) => {
   const searchInput = e.target.value.toLowerCase().trim();
   document.querySelectorAll('.card').forEach((card) => {
      if (card.dataset.sort.includes(searchInput)) {
         card.style.display = 'block';
      } else {
         card.style.display = 'none';
      }
   });
});

const updateCollections = (id, collection) => {
   const parent = (collection === mainCollection) ? favCollection : mainCollection;
   const element = document.getElementById(id);
   parent.append(element);
};

const sortData = (dir, collection) => {
   const newArr = Array.from(collection.children);
   newArr.sort((a,b) => {
      if (a.id < b.id) return dir === 'desc' ? 1 : -1
      else if (a.id > b.id) return dir === 'desc' ? -1 : 1
      else return 0;
   });

   newArr.forEach((card) => collection.append(card));
};

const filterLinks = document.querySelectorAll(filterLink);

for (const link of filterLinks) {
   link.addEventListener('click', function(){
      const sortDir = this.dataset.sortdir;
      const collection = (this.dataset.filter === 'main') ? mainCollection : favCollection;
      setActive(link, neonButton);
      sortData(sortDir, collection);
   });   
}

/* API */

apiNames.sort();

const fetchData = (array) => {
   return array.map((item) => fetch(`https://pokeapi.co/api/v2/pokemon/${item}`));
};

const createCard = (obj) => {
   const html = 
   `<div id = "${obj.name}" data-sort="${obj.name}" class="card">
      <div class="card-body">
         <div class="card-name">${obj.name.toUpperCase()}</div>
         <div class="img-wrapper">
            <img src="${obj.sprites.front_default}" alt="${obj.name} image">
         </div>
         <div class="stats-container">
            <div class="elemental-type">
               Type <span>${obj.types[0].type.name}</span>
            </div>
            <div class="hp">
               HP: <span>${obj.stats[0].base_stat}</span>
            </div>
            <div class="attack">
               Attack: <span>${obj.stats[1].base_stat}</span>
            </div>
            <div class="defense">
               Defense: <span>${obj.stats[2].base_stat}</span>
            </div>
            <div class="special-attack">
               Special-Attack: <span>${obj.stats[3].base_stat}</span>
            </div>
            <div class="special-defense">
               Special-Defense: <span>${obj.stats[4].base_stat}</span>
            </div>
            <div class="speed">
               Speed: <span>${obj.stats[5].base_stat}</span>
            </div>
         </div>
      </div>
      <div class="card-tool-tip">Click to add to favorites.</div>
   </div>`;

   return html;
};

const initializeCards = (arr) => {
   for (let i = 0; i < arr.length; i++) {
      const card = createCard(arr[i], i);
      mainCollection.innerHTML += card;
   }
};

const addElementalTypes = (obj) => {
   const listContainer = document.querySelector('.list-of-types');
   for (const [key, value] of Object.entries(obj)) {
      const listItem = `<li id="${key}">${key} : ${value}</li>`;
      listContainer.innerHTML += listItem;
   }
   root.style.setProperty(listHeight, `${listContainer.children.length * typeHeight}px`);
};

function moveCard(e) {
   const card = e.target;
   const parent = card.parentElement;
   const id = card.id;
   document.querySelector(`#${id} ${toolTip}`).innerText = 
      (parent === mainCollection)
      ? 'Click to remove from Favorites'
      : 'Click to add to Favorites';
   updateCollections(id, parent);
}

Promise
   .all(fetchData(apiNames))
   .then((response) => {
      return Promise.all(response.map((res) => res.json()));
   })
   .then((data) => {
      const newArr = Array.from(data);
      newArr.forEach((obj) => {
         jsonList.push(obj);
         sumOfTypes[obj.types[0].type.name] = sumOfTypes[obj.types[0].type.name] + 1 || 1;
      });
      return jsonList;
   })
   .then((arr) => {
      initializeCards(arr);
      addElementalTypes(sumOfTypes);
      const collections = document.querySelectorAll('.collection-grid');
      collections.forEach((collection) => collection.addEventListener('click', moveCard));
   });
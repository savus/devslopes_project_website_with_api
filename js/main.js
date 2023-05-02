const sortDir = '[data-filter]';
const filterLinks = document.querySelectorAll(sortDir);

const siteHeader = document.querySelector('.site-header h4');

const mainCollection = document.getElementById('collections');
const favCollection = document.getElementById('favorites');

const toolTip = '.card-tool-tip';

const mainCards = [];
const favCards = [];
const typeSum = {};
const typeList = document.getElementById('list-of-types');
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
const pokeList = [];

let cards;
const infoCard = '.info-card';
const cardContainer = '.info-card-grid';

const fetchData = (array) => {
   for (let i = 0; i < pokeNames.length; i++) {
      const pokemon = fetch(`https://pokeapi.co/api/v2/pokemon/${pokeNames[i]}`);
      fetchList.push(pokemon);
   }
};

fetchData(fetchList);

siteHeader.innerText = `Select your favorites below\n from among ${pokeNames.length} pokemon!`;

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

const appendCards = (dataList, collection) => {
   for (let i = 0; i < dataList.length; i++) {
      const card = createCard(dataList, i);
      collection.innerHTML += card;
   }
};

const updateCollections = (id, collection) => {
   const parent = (collection === mainCollection) ? favCollection : mainCollection;
   const element = document.getElementById(id);
   parent.append(element);
};

const sortData = (dir, collection = mainCollection) => {
   const newArr = Array.from(collection.children);
   newArr.sort((a,b) => {
      if (dir === 'desc') {
         if (a.id < b.id) return 1
         else if (a.id > b.id) return -1
         else return 0;
      } else {
         if (a.id > b.id) return 1 
         else if (a.id < b.id) return -1 
         else return 0;
      }
   });
   newArr.forEach((card) => collection.append(card));
};

const calculateTypes = (obj) => {
   for (const [key,value] of Object.entries(obj)) {
      let element = `<li id="${key}">${key} : ${value}</li>`;
      typeList.innerHTML += element;
   }
};

function moveCard(e) {
   const card = e.target;
   const parent = card.parentElement;
   const id = card.id;
   document.querySelector(`#${id} ${toolTip}`).innerText = 
      (parent === favCollection)
      ? 'Click to remove from Favorites'
      : 'Click to add to Favorites';
   updateCollections(id, parent);
};

Promise.all(fetchList)
.then((response) => {
      return Promise.all(response.map((res) => res.json()))
   })
   .then((data) => {
      const newData = Array.from(data);
      for (let i = 0; i < newData.length; i++) {
         pokeList.push(newData[i]);
         typeSum[newData[i].types[0].type.name] = typeSum[newData[i].types[0].type.name] + 1 || 1;
      }
      return pokeList;
   })
   .then(() => { 
      calculateTypes(typeSum);
      appendCards(pokeList, mainCollection);
      cards = document.querySelectorAll(cardContainer);
      cards.forEach((container) => container.addEventListener('click', moveCard));
   });
   
   filterLinks.forEach((link) => {
      link.addEventListener('click', function() {
         const dir = link.dataset.sortdir;
         const filterGroup = document.getElementById(link.dataset.filter);
         sortData(dir, filterGroup);
      });
   });


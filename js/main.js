const sortDir = '[data-filter]';
const siteHeader = document.querySelector('.site-header h4');
const filterLinks = document.querySelectorAll(sortDir);
const mainCollection = document.getElementById('collections');
const favCollection = document.getElementById('favorites');
const toolTip = '.card-tool-tip';
const mainCards = [];
const favCards = [];

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
      `<div id="${pokemon.name}" class="info-card" data-item="main">
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

let cards;

const infoCard = '.info-card';
const cardContainer = '.info-card-grid';

const appendCards = () => {
   for (let i = 0; i < pokeList.length; i++) {
      const card = createCard(pokeList, i);
      mainCollection.innerHTML += card;
   }
};

const updateCollections = (id, direction) => {
   const parent = (direction === 'toMain') ? mainCollection : favCollection;
   const element = document.getElementById(id);
   parent.append(element);
};

const sortData = (dir, collection) => {
   const container = (collection === 'main') ? mainCollection : favCollection;
   const newArr = Array.from(container.children);
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
   newArr.forEach((card) => container.append(card));
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
      cards = document.querySelectorAll(infoCard);
      cards.forEach((item) => {
         item.addEventListener('click', function(){
          const parentId = this.parentElement.id;
          const dir = (parentId === 'collections') ? 'toFavs' : 'toMain';
          const id = this.id;
          document.querySelector(`#${id} ${toolTip}`).innerText = 
            (dir === 'toFavs') 
            ? 'Click to remove from Favorites'
            : 'Click to add to Favorites';
          updateCollections(id, dir);
         });
      });
   });
   
   filterLinks.forEach((link) => {
      link.addEventListener('click', function() {
         const dir = link.dataset.sortdir;
         const filterGroup = link.dataset.filter;
         sortData(dir, filterGroup);
      });
   })

   cards = document.querySelectorAll(infoCard);

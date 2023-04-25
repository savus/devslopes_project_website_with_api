

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
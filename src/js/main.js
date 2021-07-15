import { selectors, renderLoader, clearLoader, constants } from './base.js';
import { displayImages, displayPop } from './view.js';
import { sortIds, splitUrlId, } from './utilities.js';

////////// Global variables
 
const state = {
  pokemon: [],
}

////////// Search Filters

const pokeTypes = ['normal', 'fire', 'water', 'grass', 'electric', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dark', 'dragon', 'steel', 'fairy'];

////////// Event Listeners

// Add event listener on document that targets any event with an id, the <li> tags
document.addEventListener("click", (e) => {

  if (e.target.id) {
    // clear out pokemon array and set offset to 0 before every new data call
    state.pokemon = [];
    constants.offset = 0;

    // fetch call here for pokemon data based on generation id
    getData(e.target.id);
  }
});

document.addEventListener("click", e => {

  console.log(e.target.parentElement.id);
  if (e.target.parentElement.className !== "img-container") return;

  displayPop();
});

// Button Handlers

selectors.leftButton.addEventListener('click', leftButtonClick);
selectors.rightButton.addEventListener('click', rightButtonClick);

function leftButtonClick() {
  if (constants.offset !== 0) {
    constants.offset -= constants.limit;
    displayImages(state.pokemon);
  }
  return;
}

function rightButtonClick() {
  
  if ((constants.offset + constants.limit) > state.pokemon.length) {
    return;
  } else {
    constants.offset += constants.limit;
    displayImages(state.pokemon);
  }
}

// Input Handler
function filterPokemon(val) {
  constants.offset = 0;
  const search = val;

  // if (search == pokeTypes.filter(name => name.includes(search))) {
  //   console.log('fired');
  //   const types = pokemon.map(e => {
  //     return e.types; 
  //   });
  //   console.log(types)
  //   const filteredTypes = types.filter(e => {
  //     return e.forEach(e => {
  //       return e.type.name.includes(search);
  //     })
  //   })
    
  //   console.log(filteredTypes);
  // }
  const filteredNames = state.pokemon.filter(e => {
    return e.name.includes(search);
  });
  displayImages(filteredNames);
}

////////// Fetch Calls

// Main data function
async function getData(id) {
  renderLoader(selectors.body);
  
  // Get array of pokemon based on generation
  const generation = await getGeneration(id);

  // Parse id from pokemon urls and sort them low to high
  const filteredIds = getFilteredIds(generation);

  // Returns array of pokemon data, low to high
  state.pokemon = await getPoke(filteredIds);

  console.log(state.pokemon);

  displayImages(state.pokemon);
  clearLoader();
}

// fetch generation data
async function getGeneration(id) {
  const response = await fetch(`https://pokeapi.co/api/v2/generation/${id}/`);
  const data = response.json();
  return data;
}

// fetch pokemon data with id
async function getPoke(ids) {
  const promises = await Promise.all(
    ids.map(async (id) => {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
      const data = await response.json();
      return data;
    })
  )
  return promises;
}

function getFilteredIds(data) {
  // map through array of urls and return the id at the end of each url
  const unfilteredIds = data.pokemon_species.map(item => {
    return splitUrlId(item.url);
  });

  // sort ids low to high, starting with 1
  sortIds(unfilteredIds);
  return unfilteredIds;
}
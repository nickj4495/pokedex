////////// Document selectors

const gallery = document.querySelector(".gallery");
const body = document.getElementsByTagName("BODY")[0];
const filter = document.querySelector(".filter");
const buttonContainer = document.querySelector(".button-container");
const leftButton = document.querySelector(".left");
const rightButton = document.querySelector(".right");

////////// Global variables

let pokemon = [];
let limit = 30;
let offset = 0;

////////// Search Filters

const pokeTypes = ['normal', 'fire', 'water', 'grass', 'electric', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dark', 'dragon', 'steel', 'fairy'];

////////// Event Listeners

// Add event listener on document that targets any event with an id, the <li> tags
document.addEventListener("click", (e) => {

  // if click event target isn't an li tag, return out of function
  if (e.target.tagName !== "LI") return;
  // clear out pokemon array and set offset to 0 before every new data call
  pokemon = [];
  offset = 0;

  // fetch call here
  getData(e.target.id);
});


////////// Event Handlers

// Button Handlers
function leftButtonClick() {
  if (offset !== 0) {
    offset -= limit;
    displayImages(pokemon);
  }
  return;
}

function rightButtonClick() {
  
  if ((offset + limit) > pokemon.length) {
    return;
  } else {
    offset += limit;
    displayImages(pokemon);
  }
}

// Input Handler
function filterPokemon(val) {
  offset = 0;
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
  const filteredNames = pokemon.filter(e => {
    return e.name.includes(search);
  });
  displayImages(filteredNames);
}

////////// Loader functions 

function renderLoader(el) {
  el.insertAdjacentHTML(
    "afterbegin",
    `
    <div class="loader">
    <img src="./loader.svg" alt="loading" />
  </div>
    `
  );
}

function clearLoader() {
  const loader = document.querySelector(".loader");
  loader.remove();
}

////////// Helper Functions

function clearGallery() {
  gallery.innerHTML = "";
}

function sortIds(arr) {
  arr.sort((a, b) => {
    return a - b;
  })
}

function splitUrlId(url) {
  return url.split('/')[6];
}

function slicePokemon(arr, limit, offset) {
  return arr.slice(offset, (offset + limit));
}

////////// Fetch Calls

// Main data function
async function getData(id) {
  renderLoader(body);
  
  // Get array of pokemon based on generation
  const generation = await getGeneration(id);

  // Parse id from pokemon urls and sort them low to high
  const filteredIds = getFilteredIds(generation);

  // Returns array of pokemon data, low to high
  pokemon = await getPoke(filteredIds);

  console.log(pokemon);

  displayImages(pokemon);
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

////////// Display Function

function displayImages(arr) {
  clearGallery();
  renderLoader(gallery);
  
  slicePokemon(arr, limit, offset).forEach(({name, id, types,}) => {
    gallery.insertAdjacentHTML(
    "beforeend",
    `
          <div class="img-container">
          <div class='types-container'>
            ${types.map(obj => {
              return `<div class="${obj.type.name} type">${obj.type.name}</div>`
            }).join("")}
            <div class="poke-id">${id}</div>
          </div>
            <div class="title">${name}</div>
            <img class="img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png" alt='image of ${name}'/>
          </div>
    `
    );
  });
  
  // Make search input visible
  filter.hidden = false;

  // Button only visible if more pokemon in pokemon array than the limi
  (arr.length >= limit) ? buttonContainer.hidden = false : buttonContainer.hidden = true;

  filter.scrollIntoView({behavior: "smooth", block: "start"});
  clearLoader();
}


//////// ANIMATION FROM https://tobiasahlin.com/moving-letters/

// Wrap every letter in a span
var textWrapper = document.querySelector('.ml11 .letters');
textWrapper.innerHTML = textWrapper.textContent.replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>");

anime.timeline({loop: true})
  .add({
    targets: '.ml11 .letter',
    opacity: [0,1],
    easing: "easeInOutExpo",
    duration: 1400,
    offset: '-=775',
    delay: (el, i) => 34 * (i+1)
  }).add({
    targets: '.ml11',
    opacity: 0,
    duration: 700,
    easing: "easeInOutExpo",
    delay: 100
  });
////////// Document selectors

const gallery = document.querySelector(".gallery");
const body = document.getElementsByTagName("BODY")[0];
const generation = document.querySelector(".generation");
const topButton = document.getElementById("top");
const bottomButton = document.getElementById("bottom");
const leftButton = document.querySelector(".left");
const rightButton = document.querySelector(".right");

////////// Global variables

let pokemon = [];
let limit = 30;
let offset = 0

////////// Event Listeners

// Add event listener on document that targets any event with an id, the <li> tags
document.addEventListener("click", (e) => {
  console.log(e.target.tagName);
  if (e.target.tagName !== "LI") return;
  // clear our pokemon array and set offset to 0 before every new data call
  pokemon = [];
  offset = 0;
  // fetch call here
  getData(e.target.id);
});


////////// Button onclick handlers


function leftButtonClick() {
  console.log("button clicked");
  if (offset !== 0) {
    offset -= limit;
    console.log(offset);
    renderLoader();
    displayImages(pokemon);
  }
  return;
}

function rightButtonClick() {
  console.log("button clicked");
  
  if ((offset + limit) > pokemon.length) {
    return;
  } else {
    offset += limit;
    console.log(offset);
    renderLoader();
    displayImages(pokemon);
  }
}

////////// Loader functions 

function renderLoader() {
  body.insertAdjacentHTML(
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
  renderLoader();
  
  // Get array of pokemon based on generation
  const generation = await getGeneration(id);

  // Parse id from pokemon urls and sort them low to high
  const filteredIds = getFilteredIds(generation);

  // Returns array of pokemon data, low to high
  pokemon = await getPoke(filteredIds);

  console.log(pokemon);

  displayImages(pokemon);
  // clearLoader();
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

function displayImages(pokemon) {
  clearGallery();
  
  slicePokemon(pokemon, limit, offset).forEach(({name, id, types}) => {
    gallery.insertAdjacentHTML(
    "beforeend",
    `
          <div class="img-container">
          <div class='types-container'>
            ${types.map(obj => {
              return `<div class="${obj.type.name} type">${obj.type.name}</div>`
            })}
          </div>
              <div class="title">${name}</div>
              <img class="img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png" alt='image of ${name}'/>
          </div>
    `
    );
  });
  topButton.hidden = false;
  bottomButton.hidden = false;
  clearLoader();
}

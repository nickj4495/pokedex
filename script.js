const gallery = document.querySelector(".gallery");
const body = document.getElementsByTagName("BODY")[0];

let pokemon = [];

// Add event listener on document that targets any event with an id, the <a></a> tags

document.addEventListener("click", (e) => {
  if (!e.target.id) return;
  // clear our pokemon array before every fetch call
  pokemon = [];
  // fetch call here
  getData(e.target.id);
});

// Loader functions 

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
  loader.style.display = "none";
}

// Helper Functions

function clearGallery() {
  gallery.innerHTML = "";
}

function sortIds(arr) {
  arr.sort((a, b) => {
    return a - b;
  })
}

function getUrlId(url) {
  return url.split('/')[6];
}

// Fetch Calls

async function getData(id) {
  renderLoader();
  const generation = await getGeneration(id);

  const filteredIds = getFilteredIds(generation);

  pokemon = await getPoke(filteredIds);

  console.log(pokemon);

  displayImages(pokemon);
  clearLoader();
}

async function getGeneration(id) {
  const response = await fetch(`https://pokeapi.co/api/v2/generation/${id}/`);
  const data = response.json();
  return data;
}

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
  let unfilteredIds = data.pokemon_species.map(item => {
    return getUrlId(item.url);
  });

  sortIds(unfilteredIds);
  unfilteredIds.splice(30);
  return unfilteredIds;
}

function displayImages(pokemon) {
  clearGallery();
  pokemon.forEach(async ({name, id, types}) => {
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
}

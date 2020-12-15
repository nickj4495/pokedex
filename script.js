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

function sortNumbers(obj) {
  obj.sort((a, b) => {
    return a.id - b.id;
  })
}

// Fetch Calls

async function getData(id) {
  renderLoader();
  const generation = await getGeneration(id);
  // console.log(generation);

  const pokemonData =  await getId(generation);
  sortNumbers(pokemonData);
  pokemon = pokemonData;

  // console.log(pokemon);

  displayImages(pokemon);
  clearLoader();
}

async function getGeneration(id) {
  const response = await fetch(`https://pokeapi.co/api/v2/generation/${id}/`);
  const data = response.json();
  return data;
}

async function getId(gen) {
  const promises = await Promise.all(
    gen.pokemon_species.map(async (item) => {
      const response = await fetch(item.url);
      const data = await response.json();
      return { id: data.id, name: data.name };
    })
  )
  return promises;
}

async function getTypes(name) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}/`);
  const data = await response.json();
  // console.log(data.types);
  return data.types;
}

function displayImages(arr) {
  clearGallery();
  arr.forEach(async ({name, id}) => {
    const types = await getTypes(name);
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
    getTypes(name);
  });
}

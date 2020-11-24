const gallery = document.querySelector(".gallery");
const body = document.getElementsByTagName("BODY")[0];

// Add event listener on document that targets any event with an id, the <a></a> tags

document.addEventListener("click", (e) => {
  if (!e.target.id) return;
  // clear our pokemon array before every fetch call
  pokemon = [];
  // fetch call here
  // renderLoader();
  getData(e.target.id);
});

let pokemon = [];

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

// Fetch Calls

async function getData(id) {
  renderLoader();
  // retrieve list of pokemon names based on generation id
  const generation = await fetch(
    `https://pokeapi.co/api/v2/generation/${id}/`
  ).then((response) => response.json());
  // create an array of objects for each pokemon in the generation
  generation.pokemon_species.map(async (item) => {
    const pokeId = await getId(item.url);
    pokemon.push({ name: item.name, id: pokeId });
    displayImages();
    clearLoader();
  });
}

// async function getTypes() {
//   pokemon.map(async ({ name }) => {
//     const response = await fetch(`https://pokeapi.co/api/v2/type/${name}/`);
//     const data = await response.json();
//     console.log(data);
//   });
// }

async function getId(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data.id;
}

function displayImages() {
  clearGallery();
  pokemon.forEach(({ name, id }) => {
    // console.log(name, imgUrl);
    gallery.insertAdjacentHTML(
      "beforeend",
      `
            <div class="img-container">
                <div class="title">${name}</div>
                <img class="img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png" alt='image of ${name}'/>
            </div>
            `
    );
  });
}

function clearGallery() {
  gallery.innerHTML = "";
}

function clearLoader() {
  const loader = document.querySelector(".loader");
  loader.style.display = "none";
}

// TESTING

// async function getPokemon() {
//   const response = await fetch("https://pokeapi.co/api/v2/pokemon/");
//   const data = await response.json();
//   console.log(data.results[0].url);
//   data.results.forEach(async (item) => {
//     const response1 = await fetch(item.url);
//     const data1 = await response1.json();
//     console.log(data1);
//   });
// }

// async function yay() {
//   const response = await fetch("https://pokeapi.co/api/v2/pokemon-species/1/");
//   const data = await response.json();
//   console.log(data);
// }

// yay();

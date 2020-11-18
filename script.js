const gallery = document.querySelector(".gallery");

let pokemonImages = [];

async function getData() {
  try {
    const response = await fetch(
      "https://pokeapi.co/api/v2/pokemon/turtonator/"
    );
    const data = await response.json();
    pokemonImages.push(data.sprites.front_default);
  } catch {
    console.log(error);
  }
}

// Show Images

async function displayImages() {
  await getData();
  pokemonImages.forEach((item) => {
    gallery.insertAdjacentHTML(
      "afterbegin",
      `
        <img class='image' src=${item}>
    `
    );
  });
}

displayImages();

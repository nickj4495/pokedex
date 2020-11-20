const gallery = document.querySelector(".gallery");

// Add event listener on document that targets any event with an id, the <a></a> tags

document.addEventListener("click", (e) => {
  if (!event.target.id) return;
  // clear our name array before every fetch call
  generationPokemonNames = [];
  // fetch call here
  getGenerations(e.target.id);
});

let pokemonImages = [];
let generationPokemonNames = [];

// Fetch Calls

async function getGenerations(id) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/generation/${id}/`);
    const data = await response.json();
    // create new array of the pokemon names
    data.pokemon_species.map((item) => {
      // we only want the name property of each object in the array
      if (Object.getOwnPropertyNames(item).includes("name")) {
        generationPokemonNames.push(`${item.name}`);
      }
    });
  } catch {
    console.log(error);
  }
  console.log(generationPokemonNames);
}

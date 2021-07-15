import { selectors, renderLoader, clearLoader, constants } from "./base.js";
import { slicePokemon } from './utilities.js';

////////// Display Functions

export function displayImages(arr) {

    clearGallery();

    renderLoader(selectors.gallery);
    
    slicePokemon(arr, constants.limit, constants.offset).forEach(({name, id, types,}) => {
      selectors.gallery.insertAdjacentHTML(
      "beforeend",
      `
            <div class="img-container" id="${id}" onclick="displayPop">
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
    selectors.filter.hidden = false;
  
    // Button only visible if more pokemon in pokemon array than the limi
    (arr.length >= constants.limit) ? selectors.buttonContainer.hidden = false : selectors.buttonContainer.hidden = true;
  
    selectors.filter.scrollIntoView({behavior: "smooth", block: "start"});
    clearLoader();
  }
  
  // POPUP DISPLAY
  
export function displayPop() {
    selectors.body.insertAdjacentHTML('afterbegin',
      `
        <div class="popup">
          <div class="popup-content">
          </div>
        </div>
      `
    );
}

function clearGallery() {
    selectors.gallery.innerHTML = "";
}
////////// Document selectors

export const selectors = {
    gallery: document.querySelector(".gallery"),
    body: document.getElementsByTagName("BODY")[0],
    filter: document.querySelector(".filter"),
    buttonContainer: document.querySelector(".button-container"),
    leftButton: document.querySelector(".left"),
    rightButton: document.querySelector(".right")
} 

export const constants = {
    limit: 30,
    offset: 0
}

////////// Loader functions 

export function renderLoader(el) {
    el.insertAdjacentHTML(
      "afterbegin",
      `
      <div class="loader">
      <img src="/assets/loader.svg" alt="loading" />
    </div>
      `
    );
}
  
export function clearLoader() {
    const loader = document.querySelector(".loader");
    loader.remove();
}
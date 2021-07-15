////////// Helper Functions

export function sortIds(arr) {
    arr.sort((a, b) => {
      return a - b;
    });
}
  
export function splitUrlId(url) {
    return url.split('/')[6];
}
  
export function slicePokemon(arr, limit, offset) {
    return arr.slice(offset, (offset + limit));
}
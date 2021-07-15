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
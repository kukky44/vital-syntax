let canvasEl = document.getElementById('myCanvas');
let galleryEl = document.getElementById('gallery');
let openCanvasBtn = document.getElementById('openCanvasBtn');

function hideCanvas() {
  canvasEl.classList.add('hide');
  galleryEl.classList.remove('hide');
}

function showCanvas() {
  canvasEl.classList.remove('hide');
  galleryEl.classList.add('hide');
}

openCanvasBtn.addEventListener('click', showCanvas);

// hideCanvas();

//loading animation
const leftLoader = document.getElementById('leftLoader');
const rightLoader = document.getElementById('rightLoader');

function showLoader(side) {
  if(side == 'left') leftLoader.style.display = "block";
  else rightLoader.style.display = "block";
}

function hideLoader(side) {
  if(side == 'left') leftLoader.style.display = "none";
  else rightLoader.style.display = "none";
}

//Splide
let splide;
document.addEventListener('DOMContentLoaded', function () {
  splide = new Splide('.splide', {
    autoplay: true,
    interval: 5000,
    type: 'loop',
    pauseOnHover: false,
    pauseOnFocus: false,
    // width : '100vw',
		// height: '100vh',
  }).mount();
});

function addPatternSlide(timestamp) {
  const slide = document.createElement( 'li' );
  slide.classList.add( 'splide__slide' );
  add( slide );
}
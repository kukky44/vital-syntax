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

//Splide
document.addEventListener('DOMContentLoaded', function () {
  new Splide('.splide', {
    autoplay: true,
    interval: 5000,
    type: 'loop',
    pauseOnHover: false,
    pauseOnFocus: false,
    // width : '100vw',
		// height: '100vh',
  }).mount();
});

// hideCanvas();
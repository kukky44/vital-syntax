let canvasEl = document.getElementById('myCanvas');
let galleryEl = document.getElementById('gallery');

function hideCanvas() {
  canvasEl.classList.add('hide');
  galleryEl.classList.remove('hide');
}

function showCanvas() {
  canvasEl.classList.remove('hide');
  galleryEl.classList.add('hide');
}

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
    interval: 6000,
    speed: 1200,
    type: 'loop',
    pauseOnHover: false,
    pauseOnFocus: false,
    width : '100vw',
		height: '100vh',
  }).mount();

  // fetch all images and display them
  fetch("/list-patterns")
    .then(res => res.json())
    .then(result => {
      if (result.success) {
        for (let file of result.files) {
          const path = `/pattern_images/${file}`;
          addPatternSlide(path);
        }
        splide.refresh();
        splide.Components.Autoplay.play();
      }
    })
    .catch(err => console.error("Error loading images:", err));
});

function addPatternSlide(imgPath) {
  // Extract filename without extension (assuming it's a timestamp)
  const filename = imgPath.split("/").pop().split(".")[0];
  const timestamp = Number(filename);
  const dateObj = new Date(timestamp);

  // Format date and time
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
  const year = dateObj.getFullYear();

  let hours = dateObj.getHours();
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // convert to 12-hour format

  const formattedDate = `${day}/${month}/${year}`;
  const formattedTime = `${hours}:${minutes} ${ampm}`;

  // Create the slide structure
  const slide = document.createElement("li");
  slide.classList.add("splide__slide");

  const container = document.createElement("div");
  container.classList.add("pattern_container");

  const timestampDiv = document.createElement("div");
  timestampDiv.classList.add("pattern_timestamp");

  const dateDiv = document.createElement("div");
  dateDiv.classList.add("pattern_date");
  dateDiv.textContent = formattedDate;

  const timeDiv = document.createElement("div");
  timeDiv.classList.add("pattern_time");
  timeDiv.textContent = formattedTime;

  timestampDiv.append(dateDiv, timeDiv);

  const img = document.createElement("img");
  img.src = imgPath;
  img.alt = `Pattern from ${formattedDate} ${formattedTime}`;

  container.append(timestampDiv, img);
  slide.append(container);

  splide.add(slide);
}

function goToLastSlide() {
  // Get the index of the last slide
  const lastSlideIndex = splide.Components.Controller.getEnd();
  // Go to the last slide
  splide.go(lastSlideIndex);
}

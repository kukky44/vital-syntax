const galleryEl = document.getElementById('gallery');
const infoWrapper = document.getElementById('infoWrapper');
const infoTextEl = document.getElementById('info-text')
const infoOpenBtn = document.getElementById('info-open');
const infoCloseBtn = document.getElementById('info-close');

infoOpenBtn.addEventListener('click', () => {
  infoWrapper.classList.add('show');
});

infoCloseBtn.addEventListener('click', () => {
  infoWrapper.classList.remove('show');
});

infoWrapper.addEventListener('click', (e) => {
  e.stopPropagation();
  infoWrapper.classList.remove('show');
});

infoTextEl.addEventListener('click', (e) => {
  e.stopPropagation();
});

function addPatternSlide(imgPath) {
  // Extract filename without extension
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

  const timestampWrapperDiv = document.createElement("div");
  timestampWrapperDiv.classList.add("pattern_timestamp-wrapper");

  const timestampTextDiv = document.createElement("div");
  timestampTextDiv.classList.add("pattern_timestamp-text");
  timestampTextDiv.textContent = "Generated at";

  const timestampDiv = document.createElement("div");
  timestampDiv.classList.add("pattern_timestamp");

  const dateDiv = document.createElement("div");
  dateDiv.classList.add("pattern_date");
  dateDiv.textContent = formattedDate;

  const timeDiv = document.createElement("div");
  timeDiv.classList.add("pattern_time");
  timeDiv.textContent = formattedTime;

  timestampDiv.append(dateDiv, timeDiv);
  timestampWrapperDiv.append(timestampTextDiv, timestampDiv);

  const img = document.createElement("img");
  img.src = imgPath;
  img.alt = `Pattern from ${formattedDate} ${formattedTime}`;

  container.append(timestampWrapperDiv, img);
  slide.append(container);

  splide.add(slide);
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
  for (let file of patterns) {
    const path = `/pattern_images/${file}`;
    addPatternSlide(path);
  }
  splide.refresh();
  splide.Components.Autoplay.play();
});
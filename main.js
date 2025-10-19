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

hideCanvas();

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

//prompt screen
const promptLeft = document.getElementById('promptLeft');
const promptRight = document.getElementById('promptRight');

function showPrompt(side) {
  if(side == 'left') promptLeft.classList.remove('hide');
  else promptRight.classList.remove('hide');
}

function hidePrompt(side) {
  if(side == 'left') promptLeft.classList.add('hide');
  else promptRight.classList.add('hide');
}

//finished animation
const finishedLeft = document.getElementById('finishedLeft');
const finishedRight = document.getElementById('finishedRight');
function showFinishedAnimation(side) {
  if(side == 'left') {
    setTimeout(() => {
      finishedLeft.style.display = 'none';
      finishedLeft.style.display = 'block';
    }, 500);
  } else {
    setTimeout(() => {
      finishedRight.style.display = 'none';
      finishedRight.style.display = 'block';
    }, 500);
  }
}

function hideFinishedAnimation() {
  finishedLeft.style.display = 'none';
  finishedRight.style.display = 'none';
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

//Toast
function showMessage(position, message, type = 'normal', extraClass = "") {
  const el = document.getElementById(`msg-${position}`);
  if (!el) return;

  el.classList.remove('hideLoad');

  let classes = [];

  if(type === 'awaiting') {
    if(!el.classList.contains('awaiting')) classes.push('awaiting');
  } else {
    el.classList.remove('awaiting');
  }

  if(type === 'awaiting_extra') {
    if(!el.classList.contains('awaiting')) classes.push('awaiting');
    if(!el.classList.contains('extra')) classes.push('extra');
  } else {
    el.classList.remove('awaiting', 'extra');
  }

  if(type === 'delay') {
    classes.push('delay');
  }

  if(type === 'long') {
    classes.push('long');
  }

  if(extraClass) classes.push(extraClass);

  classes.push('show');
  el.textContent = message;
  if(!el.classList.contains('show')) el.classList.add(...classes);
}

function toggleToastLoading(position, hide = true) {
  const el = document.getElementById(`msg-${position}`);
  if (!el) return;

  if(hide) {
    if(!el.classList.contains('hideLoad')) el.classList.add('hideLoad');
  }else {
    el.classList.remove('hideLoad');
  }
}

function hideAllMessages() {
  const left = document.getElementById('msg-left');
  const center = document.getElementById('msg-center');
  const right = document.getElementById('msg-right');
  left.className = 'toast left';
  center.className = 'toast center';
  right.className = 'toast right';
}

function hideMessage(position) {
  const el = document.getElementById(`msg-${position}`);
  if (!el) return;
  el.className = `toast ${position}`;
}

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

function goToLastSlide() {
  // Get the index of the last slide
  const lastSlideIndex = splide.Components.Controller.getEnd();
  // Go to the last slide
  splide.go(lastSlideIndex);
}

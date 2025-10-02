let myCanvas;

let minIr = 40000;
let defalutRate = 40;
let maxRate = 140;
let rRate = defalutRate;
let lRate = defalutRate;
let prevRate = defalutRate;

//for arduino sensors
let leftSensors;
let rightSensors;

//gradual change for the temperature
let leftCTemp = 20;
let rightCTemp = 20;
let leftCValue = 140;
let rightCValue = 140;

//pulse animation
let indicatorState = {
  left: {lastBeat: 0, pulse: 0},
  right: {lastBeat: 0, pulse: 0}
}
let indiLOffsetX;
let indiROffsetX;
let interval = 60;    // milliseconds per beat

//progress bar
let progressBarWidth = 16;
let progMargin = 80;

//sarturation, brightness
let sat = 100;
let brt = 100;

//center rect
let rectSize;
let rectX, rectY;
let pg;

//grid
let gridItemRow = 6;
let maxPatternItem = gridItemRow ** 2;
let gridSize;

//track current grid position to draw pattern
let patternStartX;
let patternStartY;
let LcurGridX;
let LcurGridY;
let RcurGridX;
let RcurGridY;

//patterns
let L_pattern = [];
let R_pattern = [];
let leftAnimStartX;
let rightAnimStartX;
let animStartY;
const ANIM_SPEED = 0.01;
let isLeftFinished = false;
let isRightFinished = false;
let finishedFrame = 0;
let isFinishing = false;

function setup() {
  myCanvas = createCanvas(windowWidth, windowHeight);
  myCanvas.parent('myCanvas');
  noFill();

  rectSize = height / 2;
  rectX = width / 2 - rectSize / 2;
  rectY = height / 2 - rectSize / 2;
  gridSize = rectSize / gridItemRow;

  //set indicator positions
  indiLOffsetX = height / 7;
  indiROffsetX = width - height / 7;

  patternStartX = gridSize / 2;
  patternStartY = gridSize / 2;

  //start positions of the pattern item
  leftAnimStartX = 0 - rectX - rectSize;
  rightAnimStartX = width - rectX;
  animStartY = height / 2;

  //initialize the grid cordinates
  LcurGridX = patternStartX;
  LcurGridY = patternStartY;
  RcurGridX = patternStartX;
  RcurGridY = patternStartY;

  leftSensors = new SerialManager('/dev/tty.usbmodemFX2348N1');
  rightSensors = new SerialManager('/dev/tty.usbmodem14301');

  colorMode(HSB);

  //for saving pattern
  pg = createGraphics(rectSize + 3, rectSize + 3);
  pg.colorMode(HSB);

  // showSample();
}

function draw() {
  background(3);

  if(isLeftFinished && isRightFinished) {
    finishedFrame = frameCount;
    isFinishing = true;
    isLeftFinished = false;
    isRightFinished = false;
  }

  if(isFinishing && frameCount - finishedFrame > 400) {
    savePattern();
    resetGrid();
    hideCanvas();
  }

  push();
  translate(rectX, rectY);
  for(let pat of L_pattern) {
    pat.draw();
    if(!pat.reached) pat.update();
  }

  for(let pat of R_pattern) {
    pat.draw();
    if(!pat.reached) pat.update();
  }
  pop();

  logg('lBPM: ' + leftSensors.bpmValue + ', lTemp: ' + leftSensors.tempValue);
  logg('rBPM: ' + rightSensors.bpmValue + ', rTemp: ' + rightSensors.tempValue);
  // logg('BPM: ' + bpmValue + ', Temp: ' + tempValue);

  //left color
  leftCTemp = lerp(leftCTemp, leftSensors.tempValue, 0.1);
  leftCValue = Math.round(map(leftCTemp, 25, 39, 140, 360));
  if(leftCValue < 0) leftCValue = 360 + leftCValue;

  //right color
  rightCTemp = lerp(rightCTemp, rightSensors.tempValue, 0.1);
  rightCValue = Math.round(map(rightCTemp, 25, 41, 140, 360));
  if(rightCValue < 0) rightCValue = 360 + rightCValue;

  //detect the hand and add pattern
  //left
  if(leftSensors.irValue > minIr){
    showCanvas();
    if(leftSensors.bpmValue > defalutRate) {
      lRate = leftSensors.bpmValue;
      leftSensors.isActive = true;
      hideLoader('left');

      if(frameCount % 15 === 0) {
        if(L_pattern.length < maxPatternItem) {
          addPatternItem('left');
        }
      }
    } else {
      showPressingMessage();
      showLoader('left');
    }
  } else {
    lRate = defalutRate;
    leftSensors.isActive = false;
    hideLoader('left');
  }
  //right
  if(rightSensors.irValue > minIr){
    showCanvas();
    if(rightSensors.bpmValue > defalutRate) {
      rRate = rightSensors.bpmValue;
      rightSensors.isActive = true;
      hideLoader('right');

      if(frameCount % 15 === 0) {
        if(R_pattern.length < maxPatternItem) {
          addPatternItem('right');
        }
      }
    } else {
      showPressingMessage();
      showLoader('right');
    }
  } else {
    rRate = defalutRate;
    rightSensors.isActive = false;
    hideLoader('right');
  }

  //left indicator
  drawIndicator(leftSensors, leftCValue, indiLOffsetX, rectY + 30, indicatorState.left, lRate);
  //right indicator
  drawIndicator(rightSensors, rightCValue, indiROffsetX, rectY + 30, indicatorState.right, rRate);

  drawCenterGrid(rectX, rectY);

  //draw progress bar
  if(leftSensors.isActive) drawProgress(indiLOffsetX + progMargin, L_pattern);
  if(rightSensors.isActive) drawProgress(indiROffsetX - progMargin, R_pattern);

  // if(frameCount > 100) noLoop();
}

let lProgHeight = 0;
let rPogHeight = 0;

function drawProgress(x, patternArray) {
  // Calculate progress (0 to 1)
  let progress = constrain(patternArray.length / maxPatternItem, 0, 1);
  let rad = 8;

  // Draw background bar
  noStroke();
  fill(255, 0.8); // semi-transparent background
  rect(x, rectY, progressBarWidth, rectSize, rad);

  // Draw progress fill
  fill(220, 100, 100); // bright color for progress
  let filledHeight = rectSize * progress;
  rect(x, rectY, progressBarWidth, filledHeight, rad);
}

function showPressingMessage() {
  textAlign(CENTER);
  fill(255, 0, 100);
  noStroke();
  textSize(20);
  text("Please press your finger firmly and keep it there for at least 10 seconds!", width / 2, height / 10);
}

//adds an item for the pattern based on the current rate and temp
function addPatternItem(side) {

  if(side === 'left') {
    let num = getRightmostDigit(lRate);
    if(lRate < 70) {
      L_pattern.push(new Dots(leftAnimStartX, animStartY, LcurGridX, LcurGridY, num, leftCValue, lRate));
    } else if(lRate < 80) {
      L_pattern.push(new Lines(leftAnimStartX, animStartY, LcurGridX, LcurGridY, num, leftCValue, lRate));
    } else {
      L_pattern.push(new Waves(leftAnimStartX, animStartY, LcurGridX, LcurGridY, num, leftCValue, lRate));
    }

    if(L_pattern.length >= maxPatternItem) {
      isLeftFinished = true;
      return;
    }

    //shift the grid position
    if(L_pattern.length % gridItemRow === 0) {
      LcurGridX = patternStartX;
      LcurGridY += gridSize;
    } else {
      LcurGridX += gridSize;
    }
  } else {
    let num = getRightmostDigit(rRate);
    if(rRate < 70) {
      R_pattern.push(new Circles(rightAnimStartX, animStartY, RcurGridX, RcurGridY, num, rightCValue, rRate));
    } else if(rRate < 80) {
      R_pattern.push(new Triangles(rightAnimStartX, animStartY, RcurGridX, RcurGridY, num, rightCValue, rRate));
    } else{
      R_pattern.push(new Squares(rightAnimStartX, animStartY, RcurGridX, RcurGridY, num, rightCValue, rRate));
    }

    if(R_pattern.length >= maxPatternItem) {
      isRightFinished = true;
      return;
    }

    //shift the grid position
    if(R_pattern.length % gridItemRow === 0) {
      RcurGridX = patternStartX;
      RcurGridY += gridSize;
    } else {
      RcurGridX += gridSize;
    }
  }
}

function drawCenterGrid(x, y, g = window) {
  for(let i = 0; i < gridItemRow; i++) {
    for(let j = 0; j < gridItemRow; j++) {
      g.strokeWeight(3);
      g.stroke(255);
      g.noFill();
      g.rect(x + i*gridSize, y + j*gridSize, gridSize);
    }
  }
}

function drawIndicator(sensor, cValue, offsetX, offsetY, state, rate) {
  //temp circle
  noStroke();
  fill(cValue, sat, brt);
  circle(offsetX, offsetY + 90, 60);

  interval = (60 / rate) * 1000; // ms per beat
  // check if it's time for a new beat
  if (millis() - state.lastBeat > interval) {
    state.lastBeat = millis();
    state.pulse = 1; // reset pulse to max when beat hits
  }

  // decay the pulse smoothly
  state.pulse *= 0.95;
  let scaleFactor = map(state.pulse, 0, 1, 1.8, 2.8);

  fill(0);
  stroke(360, 0, 100);

  //heart rate
  push();
  drawingContext.shadowBlur = 30;
  drawingContext.shadowColor = color(255);
  if(sensor.isActive) {
    beginShape();
    for (let t = 0; t < TWO_PI; t += 0.01) {
      let x = 16 * pow(sin(t), 3);
      let y = 13 * cos(t) - 5 * cos(2 * t) - 2 * cos(3 * t) - cos(4 * t);

      // scale and move
      x = x * scaleFactor + offsetX;
      y = -y * scaleFactor + offsetY; // flip y axis

      vertex(x, y);
    }
    endShape(CLOSE);
  } else {
    circle(offsetX, offsetY, 60);
  }
  pop();
}

function resetGrid() {
  L_pattern = [];
  R_pattern = [];
  LcurGridX = patternStartX;
  LcurGridY = patternStartY;
  RcurGridX = patternStartX;
  RcurGridY = patternStartY;
  isLeftFinished = false;
  isRightFinished = false;
  isFinishing = false;
}

function downloadPattern() {
  //draw on the offscreen canvas to save
  pg.clear();
  pg.background(10);
  pg.push();
  //move the half of the stroke width to include the whole grid stroke
  pg.translate(1.5, 1.5);
  drawCenterGrid(0, 0, pg);
  pg.pop();
  for(let pat of L_pattern) pat.draw(pg);
  for(let pat of R_pattern) pat.draw(pg);

  //save using the current timestamp
  let timestamp = Date.now();
  save(pg, `${timestamp.toString()}.png`);
  addPatternSlide(timestamp);
}

function savePattern() {
  pg.clear();
  pg.background(10);
  pg.push();
  pg.translate(1.5, 1.5);
  drawCenterGrid(0, 0, pg);
  pg.pop();

  for (let pat of L_pattern) pat.draw(pg);
  for (let pat of R_pattern) pat.draw(pg);

  const timestamp = Date.now();
  const filename = `${timestamp}.png`;

  // get canvas as base64 string
  const dataUrl = pg.canvas.toDataURL("image/png");

  // send to backend
  fetch("/save-pattern", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dataUrl, filename })
  })
  .then(res => res.json())
  .then(result => {
    if (result.success) {
      addPatternSlide(result.path); // load from backend URL
      goToLastSlide();
    } else {
      console.error("Save failed:", result);
    }
  });
}

function getRightmostDigit(number) {
  return Math.abs(number % 10);
}

function logg(val) {
  if(frameCount % 100 === 0) {
    console.log(val);
  }
}

// key functions
function keyPressed(){
  if(keyCode == ENTER){
    noLoop();
  }

  if(key == "n") {
    // resetGrid();
    let temp = leftSensors;
    leftSensors = rightSensors;
    rightSensors = temp;
  }

  if(key == "d"){
    downloadPattern();
  }

  if(key == "g"){
    hideCanvas();
  }

  if(key == "h") {
    showCanvas();
  }
}

function keyReleased() {
  // rate = 40;
}

function showSample() {
  let index = 0;
  for(let i = 0; i < gridItemRow; i++) {
    for(let j = 0; j < gridItemRow; j++) {
      let num = Math.round(random(9));
      let col = Math.round(random(40, 120));

      L_pattern.push(new Waves(width, 0, LcurGridX, LcurGridY, index, col));
      LcurGridX += gridSize;

      if(index >= 9) index = 0;
      else index++;
    }
    LcurGridY += gridSize;
    LcurGridX = patternStartX;
  }

  // for(let i = 0; i < gridItemRow; i++) {
  //   for(let j = 0; j < gridItemRow; j++) {
  //     let num = Math.round(random(9));
  //     let col = Math.round(random(40, 120));

  //     // num = 7;
  //     R_pattern.push(new Dots(width, 0, RcurGridX, RcurGridY, num, col));
  //     RcurGridY += gridSize;
  //   }
  //   RcurGridY = patternStartY;
  //   RcurGridX += gridSize;
  // }
}
let myCanvas;

const minIr = 40000;
const defalutRate = 40;
const maxRate = 140;
let rRate = defalutRate;
let lRate = defalutRate;
let prevRate = defalutRate;

//for arduino sensors
let leftReader;
let rightReader;

//gradual change for the temperature
const tempStart = 25;
const tempEnd = 39;
const colorStart = 100;
const colorEnd = 360;
let leftCTemp = 20;
let rightCTemp = 20;
let leftCValue = colorStart;
let rightCValue = colorStart;

//pulse animation
let indicatorState = {
  left: {lastBeat: 0, pulse: 0},
  right: {lastBeat: 0, pulse: 0}
}

//indicator
let indiLOffsetX;
let indiROffsetX;
let interval = 60;    // milliseconds per beat
const indicatorCircleSize = 60;

//progress bar
const progressBarWidth = 8;
const progMargin = 80;

//sarturation, brightness
const sat = 100;
const brt = 100;

//center rect
let rectSize;
let rectX, rectY;
let pg;

//grid
const gridItemRow = 6;
const maxPatternItem = gridItemRow ** 2;
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
let finishedFrame = 0;
let isFinishing = false;
let isReturning = false;

//sensor state
let leftState;
let rightState;

//time manager
let timeManager;

let font;

function setup() {
  myCanvas = createCanvas(windowWidth, windowHeight);
  myCanvas.parent('myCanvas');
  noFill();

  font = loadFont('./font/FuturaCyrillicMedium.ttf');
  textFont(font);

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

  leftReader = new SerialManager('/dev/tty.usbmodemFX2348N1');
  rightReader = new SerialManager('/dev/tty.usbmodem3');

  timeManager = new TimeManager();

  leftState = new SensorState('left', timeManager);
  rightState = new SensorState('right', timeManager);

  colorMode(HSB);

  //for saving pattern
  pg = createGraphics(rectSize + 3, rectSize + 3);
  pg.colorMode(HSB);
  pg.pixelDensity(3);

  // showSample();
}

function draw() {
  background(3);

  if(timeManager.hasElapsed('returnGallery', 3000)) {
    resetGrid();
    hideFinishedAnimation();
    hideCanvas();
    timeManager.mark('finishedTransition');
  }

  if(leftState.isFinished && rightState.isFinished) {
    finishedFrame = frameCount;
    isFinishing = true;
    leftState.isFinished = false;
    rightState.isFinished = false;
  }

  if(isFinishing && frameCount - finishedFrame > 300) {
    savePattern();
    resetGrid();
    hideFinishedAnimation();
    hideCanvas();
    timeManager.mark('finishedTransition');
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

  // logg('lBPM: ' + leftReader.bpmValue + ', lTemp: ' + leftReader.tempValue);
  // logg('rBPM: ' + rightReader.bpmValue + ', rTemp: ' + rightReader.tempValue);
  // logg('leftBeat: ' + leftReader.isBeatChecked);
  // logg('rightBeat: ' + rightReader.isBeatChecked);
  // logg('BPM: ' + bpmValue + ', Temp: ' + tempValue);

  //left color
  leftCTemp = lerp(leftCTemp, leftReader.tempValue, 0.1);
  leftCValue = Math.round(map(leftCTemp, tempStart, tempEnd, colorStart, colorEnd));
  if(leftCValue < 0) leftCValue = 360 + leftCValue;

  //right color
  rightCTemp = lerp(rightCTemp, rightReader.tempValue, 0.1);
  rightCValue = Math.round(map(rightCTemp, tempStart, tempEnd, colorStart, colorEnd));
  if(rightCValue < 0) rightCValue = 360 + rightCValue;

  //detect the hand and add pattern
  processTouch('left', leftReader, leftState);
  processTouch('right', rightReader, rightState);

  //left indicator
  drawIndicator(leftState, leftCValue, indiLOffsetX, rectY + 30, indicatorState.left, lRate);
  //right indicator
  drawIndicator(rightState, rightCValue, indiROffsetX, rectY + 30, indicatorState.right, rRate);

  drawCenterGrid(rectX, rectY);

  //draw progress bar
  if(leftState.isActive && !leftState.isFinished) drawProgress('left');
  if(rightState.isActive && !rightState.isFinished) drawProgress('right');

  //handle edge cases
  handleInactivity();
  // handleAsymmetricFinish();
  // handleFinishedTransition();
}

function handleInactivity() {
  if(!leftState.isTouched && !rightState.isTouched && !leftState.isFinished && !rightState.isFinished) {
    if (timeManager.hasElapsed('lastTouch', 5000)) {
      showMessage('center', 'Returning to gallery.');
      hideMessage('left');
      hideMessage('right');
      if(!isReturning) timeManager.mark('returnGallery');
      isReturning = true;
      return;
    }
  }

  if(leftState.isStarted && !leftState.isTouched && !leftState.isFinished && !isFinishing && !leftState.isLost) {
    leftState.markLost();
  }

  if(rightState.isStarted && !rightState.isTouched && !rightState.isFinished && !isFinishing && !rightState.isLost) {
    rightState.markLost();
  }

  // mark when each side last touched
  if (leftState.isTouched) timeManager.mark('lastTouch');
  if (rightState.isTouched) timeManager.mark('lastTouch');

  // mark when each pattern finishes
  if (leftState.isFinished) timeManager.mark('leftFinished');
  if (rightState.isFinished) timeManager.mark('rightFinished');
}

function handleAsymmetricFinish() {
  if (leftState.isFinished && !rightState.isFinished) {
    if (!timeManager.events['waitingRight']) {
      timeManager.mark('waitingRight');
      showMessage('center', 'One signal received — awaiting the other.');
    }
    if (timeManager.hasElapsed('waitingRight', 10000)) {
      showMessage('center', 'Connection incomplete — pattern saved.');
      finalizeSoloPattern('left');
      timeManager.clear('waitingRight');
    }
  }

  if (rightState.isFinished && !leftState.isFinished) {
    if (!timeManager.events['waitingLeft']) {
      timeManager.mark('waitingLeft');
      showMessage('center', 'One signal received — awaiting the other.');
    }
    if (timeManager.hasElapsed('waitingLeft', 10000)) {
      showMessage('center', 'Connection incomplete — pattern saved.');
      finalizeSoloPattern('right');
      timeManager.clear('waitingLeft');
    }
  }
}

function handleFinishedTransition() {
  if (timeManager.hasElapsed('finishedTransition', 2000)) {
    inputEnabled = true;
  } else {
    inputEnabled = false;
  }
}

//helper function for left/right sensor handling
function processTouch(side, reader, state) {
  const isLeft = side === 'left';
  const readerBpm = reader.bpmValue;

  if (reader.irValue > minIr && !state.isFinished) {
    state.start();
    state.markTouched();

    if (readerBpm > defalutRate) {
      if (isLeft) lRate = readerBpm; else rRate = readerBpm;
      state.markActive();
      hideLoader(side);
      hidePrompt(side);

      if (frameCount % 15 === 0) {
        const patternArray = isLeft ? L_pattern : R_pattern;
        if (patternArray.length < maxPatternItem) {
          addPatternItem(side);
        }
      }
    } else {
      if (reader.isBeatChecked) {
        showLoader(side);
        hidePrompt(side);
      } else {
        showPrompt(side);
        hideLoader(side);
      }
    }
  } else {
    if (isLeft) lRate = defalutRate; else rRate = defalutRate;
    state.markActive(false);
    state.markTouched(false);
    hideLoader(side);
    hidePrompt(side);
  }
}

let lProgHeight = 0;
let rPogHeight = 0;
let progressAmt = 0.1;
let rad = 4;

function drawProgress(side) {
  let x = indiLOffsetX + progMargin;
  let patternArray = L_pattern;

  if(side == 'right') {
    x = indiROffsetX - progMargin;
    patternArray = R_pattern;
  }

  // Calculate progress (0 to 1)
  let progress = constrain(patternArray.length / maxPatternItem, 0, 1);

  // Draw background bar
  noStroke();
  fill(255, 0.8); // semi-transparent background
  rect(x, rectY, progressBarWidth, rectSize, rad);

  // Draw progress fill
  fill(290, 100, 100); // bright color for progress

  // Calculate the filled height using gradua change
  let targetHeight = rectSize * progress;
  let filledHeight = 0;
  if(side == 'left') {
    filledHeight = lerp(lProgHeight, targetHeight, progressAmt);
    lProgHeight = filledHeight;
  } else {
    filledHeight = lerp(rPogHeight, targetHeight, progressAmt);
    rPogHeight = filledHeight;
  }

  // Draw the pregress bar
  rect(x, rectY, progressBarWidth, filledHeight, rad);
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
      leftState.markFinished();
      showFinishedAnimation('left');
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
      rightState.markFinished();
      showFinishedAnimation('right');
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
  if(sensor.isFinished) return;
  //temp circle
  noStroke();
  fill(cValue, sat, brt);
  circle(offsetX, offsetY + 90, indicatorCircleSize);

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
    circle(offsetX, offsetY, indicatorCircleSize);
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
  isFinishing = false;
  isReturning = false;
  lProgHeight = 0;
  rPogHeight = 0;
  leftReader.reset();
  rightReader.reset();
  timeManager.reset();
  leftState.reset();
  rightState.reset();
}

function downloadPattern() {
  //draw on the offscreen canvas to save
  pg.clear();
  pg.pixelDensity(8);
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
  save(pg, `example_patterns.png`);
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
    let temp = leftReader;
    leftReader = rightReader;
    rightReader = temp;
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
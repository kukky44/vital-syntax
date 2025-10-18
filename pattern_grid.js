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
let tempStart = 25;
let tempEnd = 39;
let colorStart = 100;
let colorEnd = 360;
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
let indicatorCircleSize = 60;

//progress bar
let progressBarWidth = 8;
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
let isLeftStarted = false;
let isRightStarted = false;
let isLeftLost = false;
let isRightLost = false;
let isLeftFinished = false;
let isRightFinished = false;
let finishedFrame = 0;
let isFinishing = false;
let isReturning = false;

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

  leftSensors = new SerialManager('/dev/tty.usbmodemFX2348N1');
  rightSensors = new SerialManager('/dev/tty.usbmodem3');

  timeManager = new TimeManager();

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

  if(isLeftFinished && isRightFinished) {
    finishedFrame = frameCount;
    isFinishing = true;
    isLeftFinished = false;
    isRightFinished = false;
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

  // logg('lBPM: ' + leftSensors.bpmValue + ', lTemp: ' + leftSensors.tempValue);
  // logg('rBPM: ' + rightSensors.bpmValue + ', rTemp: ' + rightSensors.tempValue);
  // logg('leftBeat: ' + leftSensors.isBeatChecked);
  // logg('rightBeat: ' + rightSensors.isBeatChecked);
  // logg('BPM: ' + bpmValue + ', Temp: ' + tempValue);

  //left color
  leftCTemp = lerp(leftCTemp, leftSensors.tempValue, 0.1);
  leftCValue = Math.round(map(leftCTemp, tempStart, tempEnd, colorStart, colorEnd));
  if(leftCValue < 0) leftCValue = 360 + leftCValue;

  //right color
  rightCTemp = lerp(rightCTemp, rightSensors.tempValue, 0.1);
  rightCValue = Math.round(map(rightCTemp, tempStart, tempEnd, colorStart, colorEnd));
  if(rightCValue < 0) rightCValue = 360 + rightCValue;

  //detect the hand and add pattern
  //left
  if(leftSensors.irValue > minIr && !isLeftFinished){
    showCanvas();
    isLeftStarted = true;
    leftSensors.isTouched = true;
    if(isLeftLost) {
      hideMessage('left');
      isLeftLost = false;
    }
    if(leftSensors.bpmValue > defalutRate) {
      lRate = leftSensors.bpmValue;
      leftSensors.isActive = true;
      hideLoader('left');
      hidePrompt('left');

      if(frameCount % 15 === 0) {
        if(L_pattern.length < maxPatternItem) {
          addPatternItem('left');
        }
      }
    } else {
      if(leftSensors.isBeatChecked) {
        showLoader('left');
        hidePrompt('left');
      } else {
        showPrompt('left');
        hideLoader('left');
      }
    }
  } else {
    lRate = defalutRate;
    leftSensors.isActive = false;
    leftSensors.isTouched = false;
    hideLoader('left');
    hidePrompt('left');
  }

  //right
  if(rightSensors.irValue > minIr && !isRightFinished){
    showCanvas();
    rightSensors.isTouched = true;
    isRightStarted = true;
    hideMessage('right');
    isRightLost = false;
    if(rightSensors.bpmValue > defalutRate) {
      rRate = rightSensors.bpmValue;
      rightSensors.isActive = true;
      hideLoader('right');
      hidePrompt('right');

      if(frameCount % 15 === 0) {
        if(R_pattern.length < maxPatternItem) {
          addPatternItem('right');
        }
      }
    } else {
      if(rightSensors.isBeatChecked) {
        showLoader('right');
        hidePrompt('right');
      } else {
        showPrompt('right');
        hideLoader('right');
      }
    }
  } else {
    rRate = defalutRate;
    rightSensors.isActive = false;
    rightSensors.isTouched = false;
    hideLoader('right');
    hidePrompt('right');
  }

  //left indicator
  drawIndicator(leftSensors, leftCValue, indiLOffsetX, rectY + 30, indicatorState.left, lRate);
  //right indicator
  drawIndicator(rightSensors, rightCValue, indiROffsetX, rectY + 30, indicatorState.right, rRate);

  drawCenterGrid(rectX, rectY);

  //draw progress bar
  if(leftSensors.isActive && !isLeftFinished) drawProgress('left');
  if(rightSensors.isActive && !isRightFinished) drawProgress('right');

  //handle edge cases
  handleInactivity();
  // handleAsymmetricFinish();
  // handleFinishedTransition();
}

function handleInactivity() {
  if(!leftSensors.isTouched && !rightSensors.isTouched && !isLeftFinished && !isRightFinished) {
    if (timeManager.hasElapsed('lastTouch', 5000)) {
      showMessage('center', 'Returning to gallery.');
      hideMessage('left');
      hideMessage('right');
      if(!isReturning) timeManager.mark('returnGallery');
      isReturning = true;
      return;
    }
  }

  if(isLeftStarted && !leftSensors.isTouched && !isLeftFinished && !isFinishing && !isLeftLost) {
    showMessage('left', 'Connection lost. Please place your hand again.');
    isLeftLost = true;
  }

  if(isRightStarted && !rightSensors.isTouched && !isRightFinished && !isFinishing && !isRightLost) {
    showMessage('right', 'Connection lost. Please place your hand again.');
    isRightLost = true;
  }

  // mark when each side last touched
  if (leftSensors.isTouched) timeManager.mark('lastTouch');
  if (rightSensors.isTouched) timeManager.mark('lastTouch');

  // mark when each pattern finishes
  if (isLeftFinished) timeManager.mark('leftFinished');
  if (isRightFinished) timeManager.mark('rightFinished');
}

function handleAsymmetricFinish() {
  if (isLeftFinished && !isRightFinished) {
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

  if (isRightFinished && !isLeftFinished) {
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

// function showMessage(type, msg) {
//   let textX = width / 2;
//   let offset = indicatorCircleSize / 2;
//   textAlign(CENTER);
//   textSize(24);
//   if(type == 'left') {
//     textX = indiLOffsetX - offset;
//     textSize(16);
//     textAlign(LEFT);
//   } else if (type == 'right') {
//     textX = indiROffsetX + offset;
//     textSize(16);
//     textAlign(RIGHT);
//   }
//   fill(255);
//   noStroke();
//   text(msg, textX, height / 6);
// }

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
      isLeftFinished = true;
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
      isRightFinished = true;
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
  isLeftStarted = false;
  isRightStarted = false;
  isLeftFinished = false;
  isRightFinished = false;
  isFinishing = false;
  isReturning = false;
  lProgHeight = 0;
  rPogHeight = 0;
  leftSensors.reset();
  rightSensors.reset();
  timeManager.reset();
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
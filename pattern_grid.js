let myCanvas;

let minIr = 40000;
let defalutRate = 40;
let maxRate = 140;
let rate = defalutRate;
let lRate = defalutRate;
let prevRate = defalutRate;

//for arduino sensors
let serial;
let irValue = 40000;
let bpmValue = "waiting...";
let tempValue = 20;
let leftSensors;

//is hand on the sensor
let isActive = true;

//gradual change for the temperature
let cTemp = tempValue;
let cValue = 140;

//pulse animation
let lastBeat = 0;
let interval = 60;    // milliseconds per beat
let pulse = 0;   // animation value (0 → 1)
let maxPulseNum = 180;
let isRightReached = false;

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


let isChaaaaaaaaaaged = false;

function setup() {
  myCanvas = createCanvas(windowWidth, windowHeight);
  myCanvas.parent('myCanvas');
  noFill();
  strokeWeight(1.2);

  colorMode(HSB);

  rectSize = height / 3 * 2;
  rectX = width / 2 - rectSize / 2;
  rectY = height / 2 - rectSize / 2;
  gridSize = rectSize / gridItemRow;

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

  console.log("startX: " + patternStartX);

  pg = createGraphics(0, 0);

  serial = new p5.SerialPort();
  serial.on('connected', serverConnected);
  serial.on('open', portOpen);
  serial.on('data', gotData);
  serial.on('error', gotError);
  serial.on('close', portClose);
  serial.openPort('/dev/tty.usbmodem14101');

  leftSensors = new SerialManager('/dev/tty/...');

  // for(let i = 0; i < gridItemRow; i++) {
  //   for(let j = 0; j < gridItemRow; j++) {
  //     let num = Math.round(random(9));
  //     let col = Math.round(random(40, 120));

  //     L_pattern.push(new Lines(width, 0, LcurGridX, LcurGridY, num, col));
  //     LcurGridY += gridSize;
  //   }
  //   LcurGridY = patternStartY;
  //   LcurGridX += gridSize;
  // }

  // for(let i = 0; i < gridItemRow; i++) {
  //   for(let j = 0; j < gridItemRow; j++) {
  //     let num = Math.round(random(9));
  //     let col = Math.round(random(40, 120));

  //     // num = 7;
  //     R_pattern.push(new Waves(width, 0, RcurGridX, RcurGridY, num, col));
  //     RcurGridY += gridSize;
  //   }
  //   RcurGridY = patternStartY;
  //   RcurGridX += gridSize;
  // }
}

function draw() {
  background(3);

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

  logg('BPM: ' + bpmValue + ', Temp: ' + tempValue);

  //color
  cTemp = lerp(cTemp, tempValue, 0.1);
  cValue = Math.round(map(cTemp, 24, 40, 140, 360));
  if(cValue < 0) cValue = 360 + cValue;

  //detect the hand and draw if detected
  if(irValue > minIr){
    if(bpmValue > defalutRate) {
      rate = bpmValue;
      isActive = true;

      if(frameCount % 15 === 0) {
        if(L_pattern.length < maxPatternItem) {
          addPatternItem('left');
        }

        if(R_pattern.length < maxPatternItem) {
          if(isChaaaaaaaaaaged) addPatternItem('right');
        }
      }
    } else {
      textAlign(CENTER);
      fill(255, 0, 100);
      noStroke();
      textSize(20);
      text("Please press your finger firmly and keep it there for at least 10 seconds...", width / 2, 120);
    }
  } else {
    rate = defalutRate;
    isActive = false;
  }

  if(isRightReached) {
    stroke(0, 0, 100);
    strokeWeight(3);
    noFill();
    // rect(rectX, rectY, rectSize);
  }

  drawIndicator();
  drawCenterGrid(rectX, rectY);

  // if(frameCount > 100) noLoop();
}

//adds an item for the pattern based on the current rate and temp
function addPatternItem(side) {
  let num = getRightmostDigit(rate);

  if(side === 'left') {
    if(rate < 70) {
      L_pattern.push(new Dots(leftAnimStartX, animStartY, LcurGridX, LcurGridY, num, cValue, rate));
    } else if(rate < 80) {
      L_pattern.push(new Lines(leftAnimStartX, animStartY, LcurGridX, LcurGridY, num, cValue, rate));
    } else {
      L_pattern.push(new Waves(leftAnimStartX, animStartY, LcurGridX, LcurGridY, num, cValue, rate));
    }

    //shift the grid position
    if(L_pattern.length % gridItemRow === 0) {
      LcurGridX = patternStartX;
      LcurGridY += gridSize;
    } else {
      LcurGridX += gridSize;
    }
  } else {
    if(rate < 70) {
      R_pattern.push(new Squares(rightAnimStartX, animStartY, RcurGridX, RcurGridY, num, cValue, rate));
    } else if(rate < 80) {
      R_pattern.push(new Circles(rightAnimStartX, animStartY, RcurGridX, RcurGridY, num, cValue, rate));
    } else{
      R_pattern.push(new Triangles(rightAnimStartX, animStartY, RcurGridX, RcurGridY, num, cValue, rate));
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

function drawCenterGrid(x, y) {
  for(let i = 0; i < gridItemRow; i++) {
    for(let j = 0; j < gridItemRow; j++) {
      strokeWeight(3);
      stroke(255);
      noFill();
      rect(x + i*gridSize, y + j*gridSize, gridSize);
    }
  }
}

function drawIndicator() {
  //temp circle
  let offsetX;
  let offsetY;
  if(isChaaaaaaaaaaged) {
    offsetX = width - height / 7;
    offsetY = height / 7;
  }else {
    offsetX = height / 7;
    offsetY = height / 7;
  }

  //temp circle
  noStroke();
  fill(cValue, sat, brt);
  circle(offsetX, offsetY + 90, 60);

  interval = (60 / rate) * 1000; // ms per beat
  // check if it's time for a new beat
  if (millis() - lastBeat > interval) {
    lastBeat = millis();
    pulse = 1; // reset pulse to max when beat hits
  }

  // decay the pulse smoothly
  pulse *= 0.95;
  let scaleFactor = map(pulse, 0, 1, 1.8, 2.8);

  fill(0);
  stroke(360, 0, 100);

  //heart rate
  push();
  drawingContext.shadowBlur = 30;
  drawingContext.shadowColor = color(255);
  if(isActive) {
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
}

function getRightmostDigit(number) {
  return Math.abs(number % 10);
}

// --- callback functions ---
function printList(portList) {
  for (let i = 0; i < portList.length; i++) {
    print(i + " " + portList[i]);
  }
}

function serverConnected() {
  print("Connected to Server");
}

function portOpen() {
  print("Port is open");
}

function gotData() {
  let currentString = serial.readLine().trim();
  if (currentString.length > 0) {
    let parts = currentString.split(",");
    if (parts.length === 3) {
      irValue = parseInt(parts[0].trim().replace(/[^0-9.]/g, ""));
      bpmValue = parseInt(parts[1].trim().replace(/[^0-9.]/g, ""));
      tempValue = parseFloat(parts[2].trim().replace(/[^0-9.]/g, ""));
    }
  }
}

function gotError(theerror) {
  print('error:');
  print(theerror);
}

function portClose() {
  print("The port was closed");
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
    console.log("------- RESET ------");
    maxPulseNum *= 2;

    // resetGrid();
    isChaaaaaaaaaaged = true;
  }

  if(key == "d"){
    let timestamp = Date.now();
    saveCanvas(timestamp.toString(), "png");
  }

  if(key == "g"){
    hideCanvas();
  }
}

function keyReleased() {
  // rate = 40;
}

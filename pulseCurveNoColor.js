let history = [];
let cHistory = [];
let t = 0;
let minIr = 40000;
// let defalutRate = 40000;
// let maxRate = 100000;
let defalutRate = 40;
let maxRate = 140;
let rate = defalutRate;
let prevRate = defalutRate;
let layers = 10;
let spread = 8.2;

//for arduino sensors
let serial;
let irValue = 40000;
let bpmValue = "waiting...";
let tempValue = 20;

//color
let tempPoints = [];
let prevColor;
let sat = 90;
let brt = 90;
let prevTempValue = 20;

let isActive = true;
const HISTORY_MAX = 600;
const TEMP_POINTS_MAX = 48;

function setup() {
  createCanvas(600, 600);
  noFill();
  strokeWeight(1.2);

  colorMode(HSB);
  prevColor = color(190, sat, brt);

  serial = new p5.SerialPort();
  serial.on('connected', serverConnected);
  serial.on('open', portOpen);
  serial.on('data', gotData);
  serial.on('error', gotError);
  serial.on('close', portClose);
  serial.openPort('/dev/tty.usbmodem14101');
}

function draw() {
  background(0);
  colorMode(HSB);

  if(irValue > minIr && bpmValue > defalutRate){
    rate = bpmValue;
    // rate = irValue;
    isActive = true;
  } else {
    rate = defalutRate;
    isActive = false;
  }

  logg(bpmValue)

  let amt = lerp(prevRate, rate, 0.1);
  if (abs(amt - rate) < 0.5) amt = rate;
  prevRate = amt;

  let amp = map(amt, defalutRate, maxRate, 0, 220);
  let y = height/2 + sin(t) * amp;

  let framePoints = [];
  for (let j = 0; j < layers; j++) {
    let offset = (j - layers/2) * spread * abs(y - height/2) / amp;
    if(y === height / 2) offset = 0;
    framePoints.push(y + offset);
  }

  let cValue = Math.round(map(tempValue, 20, 38, 100, -60));
  if(cValue < 0) cValue = 360 + cValue;

  let newColor = color(240, sat, brt);
  if(!isNaN(cValue)) newColor = color(cValue, sat, brt);

  // Only interpolate color if temperature changes
  if (tempValue !== prevTempValue) {
    prevColor = lerpColor(prevColor, newColor, 0.1);
    prevTempValue = tempValue;
  }
  fill(prevColor);
  noStroke();
  circle(width - 80, 80, 40);

  // Maintain fixed history size
  history.push(framePoints);
  cHistory.push(prevColor);
  if (history.length > HISTORY_MAX){
    history.shift();
    cHistory.shift();
  }

  // if(isActive) {
    let px = width;
    let py = random(height / 2 - 40, height / 2 + 40);
    tempPoints.push({x: px, y: py, c: prevColor});
  // }

  // Move and remove tempPoints
  for(let pt of tempPoints) {
    pt.x -= 1;
  }
  tempPoints = tempPoints.filter(pt => pt.x > 0);

  // Draw tempPoints
  colorMode(HSB);
  for(let pt of tempPoints) {
    stroke(pt.c, sat, brt);
    strokeWeight(2);
    point(pt.x, pt.y);
  }

  // Draw all points from history
  colorMode(RGB);
  for (let j = 0; j < layers; j++) {
    beginShape();
    for (let i = 0; i < history.length; i++) {
      strokeWeight(2);
      stroke(255, 100);
      noFill();
      curveVertex(i, history[i][j]);
    }
    endShape();
  }

  t += 0.05;
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
  if(keyCode == 32) {
    // rate = 62;
  }
}

function keyReleased() {
  // rate = 40;
}

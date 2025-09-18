let history = [];
let cHistory = [];
let t = 0;
let prevRate = 40;
let defalutRate = 40000;
let rate = defalutRate;
let layers = 10;
let spread = 8.2;

//for arduino sensors
let serial;
let irValue = "waiting...";
let bpmValue = "waiting...";
let tempValue = 255;
let prevColor;

function setup() {
  createCanvas(600, 600);
  noFill();
  strokeWeight(1.2);

  serial = new p5.SerialPort();

  // serial.on('list', printList);
  // serial.list();

  // get called when we connect to the serial server
  serial.on('connected', serverConnected);

  // get called when the serial port is opened
  serial.on('open', portOpen);

  // this gets called whenever new data arrives
  serial.on('data', gotData);

  // this gets called on errors
  serial.on('error', gotError);

  // when the port closes
  serial.on('close', portClose);
  // connect to the serial server
  serial.openPort('/dev/tty.usbmodem14101');
}

function draw() {
  background(0);
  if(irValue > defalutRate){
    rate = irValue;
  } else {
    rate = defalutRate;
  }

  let amt = lerp(prevRate, rate, 0.1);
  if (abs(amt - rate) < 0.5) amt = rate; // Snap to exact rate
  prevRate = amt;

  // Map heart rate to amplitude
  let amp = map(amt, defalutRate, 100000, 0, 160);
  let y = height/2 + sin(t) * amp;

  // Store y-values and hues for all layers at this t
  let framePoints = [];
  for (let j = 0; j < layers; j++) {
    let offset = (j - layers/2) * spread * abs(y - height/2) / amp;
    if(y === height / 2) offset = 0;
    framePoints.push(y + offset);

    // Calculate hue for each layer (customize as needed)
  }
  history.push(framePoints);
  let cValue = Math.round(map(tempValue, 10, 38, 190, 0));
  cHistory.push(cValue);
  if (history.length > width){
    history.shift();
    cHistory.shift();
  }

  // Draw all points from history
  for (let j = 0; j < layers; j++) {
    for (let i = 0; i < history.length; i++) {
      strokeWeight(2);
      colorMode(RGB);
      // stroke(255, cHistory[i], 0, 0.3);
      stroke(255, cHistory[i], 0, 60);
      point(i, history[i][j]);
    }
  }

  t += 0.03;
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
    rate = 62;
  }
}

function keyReleased() {
  rate = 40;
}

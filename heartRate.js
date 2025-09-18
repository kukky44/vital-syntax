let baseline = 107500;
let maxAmplitude = 100; // max visual wave amplitude

let serial;
let irValue = "waiting...";
let bpmValue = "waiting...";
let tempValue = "waiting...";
let prevColor, tempHue;
let circleSize, newCircleSize;

// pulse wave
let radius = 30;
let cNum = 32;
let angle = 0;

function setup() {
  createCanvas(400, 400);
  noFill();
  stroke(255, 0, 0);

  colorMode(HSB);
  prevColor = color(220, 80, 80);
  tempHue = color(220, 80, 80);
  circleSize = 20;
  newCircleSize = 20;

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
  serial.openPort('/dev/tty.usbmodem14301');
}

function draw() {
  background(0);

  // Smooth IR with moving average
  // let amplitude = map(irValue - baseline, -40, 40, 0, maxAmplitude);

  // let cx = width/2;
  // let cy = height/2;
  // let baseRadius = 20;

  // beginShape();
  // for(let angle=0; angle<TWO_PI; angle+=0.1) {
  //   let n = noise(angle*1.5, frameCount*0.02); // organic variation
  //   let r = baseRadius + amplitude * n;
  //   let x = cx + r * cos(angle);
  //   let y = cy + r * sin(angle);
  //   vertex(x, y);
  // }
  // endShape(CLOSE);

  strokeWeight(2);
  stroke(255);

  //Circle size based on the IR value
  let amplitude = irValue - baseline; // fluctuation

  // logg(bpmValue);

  let newSize = map(amplitude, 0, 10000, 50, 100); // map tiny IR changes to visible size

  if(newSize < 20 || isNaN(newSize)) {
    newSize = 20;
  }

  circleSize = lerp(circleSize, parseInt(newSize), 0.06);

  //Circle color based on the temp
  tempHue = parseInt(map(tempValue, 20, 40, 230, -60));

  if(tempHue < 0) tempHue += 360;

  //Calculate lerp color
  colorMode(HSB);

  let newColor = color(240, 100, 100);
  if(!isNaN(tempHue)) newColor = color(tempHue, 100, 100);
  if(frameCount % 100 === 0) {
    // console.table(lerpColor(prevColor, newColor, lerpStep));
  }

  let interpolatedColor = lerpColor(prevColor, newColor, 0.06);

  fill(interpolatedColor);

  //update the prev color
  prevColor = interpolatedColor;

  // ellipse(width/2, height/2, circleSize);

  translate(width/2, height/2);
  beginShape();
  fill(interpolatedColor);
  stroke(255);
  for (let i = 0; i <= cNum; i++) {
    let x, y;
    if(i % 2 === 0) {
      x = cos(angle) * (radius + circleSize * 4);
      y = sin(angle) * (radius + circleSize * 4);
    } else {
      x = cos(angle) * (radius * 4);
      y = sin(angle) * (radius * 4);
    }
    vertex(x, y);
    angle += TAU / cNum;
  }
  endShape();

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

function keyPressed(){
  if(keyCode == ENTER){
    noLoop();
  }
}

function logg(val) {
  if(frameCount % 100 === 0) {
    console.log(val);
  }
}
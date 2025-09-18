let myCanvas;

let minIr = 40000;
let defalutRate = 40;
let maxRate = 140;
let rate = defalutRate;
let prevRate = defalutRate;

//for arduino sensors
let serial;
let irValue = 40000;
let bpmValue = "waiting...";
let tempValue = 20;

//is hand on the sensor
let isActive = true;

//gradual change for the temperature
let cTemp = tempValue;

//pulse animation
let lastBeat = 0;
let interval = 60;    // milliseconds per beat
let pulse = 0;   // animation value (0 → 1)
let PULSES = [];
let maxPulseNum = 180;
let pulseMaxHeight = 62;
let pluseMinHeight = 6;
let isRightReached = false;

//sarturation, brightness
let sat = 100;
let brt = 100;

//center rect
let rectSize = 400
let rectX, rectY;
let pg;

function setup() {
  myCanvas = createCanvas(windowWidth, windowHeight);
  myCanvas.parent('myCanvas');
  noFill();
  strokeWeight(1.2);

  rectX = width / 2 - rectSize / 2;
  rectY = height / 2 - rectSize / 2;

  pg = createGraphics(rectSize, rectSize);

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

  logg('BPM: ' + bpmValue + ', Temp: ' + tempValue);

  //detect the hand and draw if detected
  if(irValue > minIr){

    if(bpmValue > defalutRate) {
      rate = bpmValue;
      isActive = true;
      drawPulse();
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

  for(let pl of PULSES) {
    if(pl.x < -50) {
      PULSES.shift();
    }
    else pl.update();
  }

  //color
  cTemp = lerp(cTemp, tempValue, 0.1);
  let cValue = Math.round(map(cTemp, 24, 40, 140, 360));
  if(cValue < 0) cValue = 360 + cValue;
  noStroke();
  fill(cValue, sat, brt);
  circle(width - 70, 180, 60);

  if(isRightReached) {
    stroke(0, 0, 100);
    strokeWeight(3);
    noFill();
    // rect(rectX, rectY, rectSize);
  }

  drawIndicator();
}

function drawPulse() {
  if(PULSES.length > maxPulseNum) {
    isRightReached = true;
    // hideCanvas();
    return;
  }

  interval = (60 / rate) * 1000; // ms per beat
  // check if it's time for a new beat
  if (millis() - lastBeat > interval) {
    lastBeat = millis();
    pulse = 1; // reset pulse to max when beat hits
  }

  // decay the pulse smoothly
  pulse *= 0.95;

  //color
  let cValue = Math.round(map(tempValue, 24, 40, 140, 360));
  if(cValue < 0) cValue = 360 + cValue;

  //height
  let h = map(pulse, 0, 1, pluseMinHeight, rate);

  if(frameCount % 3 === 0) {
    let targetX = random(rectSize);
    let targetY = random(rectSize);
    let rotation = Math.round(random(4));
    PULSES.push(new Pwave(h, cValue, targetX, targetY, rotation));
  }
}

function drawIndicator() {
  let scaleFactor = map(pulse, 0, 1, 1.8, 2.8);
  let offsetX = width - 70;
  let offsetY = 70;

  fill(0);
  stroke(360, 0, 100);

  push();
  drawingContext.shadowBlur = 30;
  drawingContext.shadowColor = color(255, 0, 255);
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

class Pwave {
  constructor(h, c, targetX, targetY, targetRotation) {
    this.h = h;
    this.x = width;
    this.y = height / 2;
    this.c = c;
    this.targetX = targetX;
    this.targetY = targetY;
    this.rotation = 0;
    this.targetRotation = targetRotation;
    this.isInside = false;
    this.reached = false;
  }

  update() {
    // fill(this.c, 100, 100, 0.6);
    // circle(this.x, this.y, this.h);
    // circle(this.x, this.y - this.h, 12);

    // if(this.reached) {
    //   pg.background(0);
    //   pg.drawingContext.shadowBlur = 30;
    //   pg.drawingContext.shadowColor = color(255, 0, 255);
    //   pg.strokeWeight(5);
    //   pg.stroke(this.c, sat, brt, 0.6);
    //   pg.push();
    //   pg.blendMode(ADD);
    //   pg.translate(rectX + this.x, rectY + this.y);
    //   pg.rotate(this.rotation);
    //   pg.line(0, 0 - this.h, 0, 0);
    // }

    strokeWeight(2);
    stroke(this.c, sat, brt, 0.8);

    if(this.isInside) {
      if(abs(this.x - this.targetX) < 0.1 && abs(this.y - this.targetY) < 0.1) {
        this.reached = true;
        // return;
      }

      let lerpAmt = 0.1;
      this.x = lerp(this.x, this.targetY, lerpAmt);
      this.y = lerp(this.y, this.targetX, lerpAmt);
      this.rotation = lerp(this.rotation, this.targetRotation, lerpAmt);

      strokeWeight(5);
      stroke(this.c, sat, brt, 0.6);
      push();
      blendMode(ADD);
      translate(rectX + this.x, rectY + this.y);
      rotate(this.rotation);
      line(0, 0 - this.h, 0, 0);
      // fill(this.c, 80, 40, 0.4);
      // circle(0, 0, this.h);
      pop();
      return;
    }

    if(this.x < rectX + rectSize) {
      this.isInside = true;
      this.x = rectSize;
      this.y = rectSize / 2;
    } else {
      push(rectX, rectY);
      line(this.x, this.y - this.h, this.x, this.y);
      pop();
      this.x -= 1;
    }
  }
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
    console.log("------- RESET ------");
    maxPulseNum *= 2;
  }

  if(key == "s"){
    pg.save();
  }
}

function keyReleased() {
  // rate = 40;
}

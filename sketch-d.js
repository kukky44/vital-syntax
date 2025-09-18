let fromLeft = [];
let fromRight = [];
let sx, sy, sSize;
let sField = [];
let speed = 0.006;
let sg;
let pLife = 300;
let fNum = 1000;
let spawning = false;
let lastSpawnTime = 0;
let spawnInterval = 100;
let serial;
let latestData = "waiting...";
let qText = "What does it mean when your inner state becomes visible?";
let myFont;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  strokeWeight(1);

  myFont = loadFont("/font/RubikGlitch-Regular.ttf");

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

  sSize = height / 2.2;
  sx = width / 2 - sSize / 2;
  sy = height / 2 - sSize / 2;

  for(let i = 0; i < fNum; i++){
    sField[i] = {
      x: random(sx, sx + sSize),
      y: random(sy, sy + sSize)
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
  let currentString = serial.readLine();  // read until newline
  if (currentString.length > 0) {
    latestData = currentString.trim().replace(/\D/g, "");
  }
}

function gotError(theerror) {
  print('error:');
  print(theerror);
}

function portClose() {
  print("The port was closed");
}

function draw() {
  // semi-transparent background for trails
  fill(0, 15);
  noStroke();
  // Left
  rect(0, 0, sx, height);
  // Right
  rect(sx + sSize, 0, width - (sx + sSize), height);
  // Top
  rect(sx, 0, sSize, sy);
  // Bottom
  rect(sx, sy + sSize, sSize, height - (sy + sSize));

  fill(0, 20)
  stroke(240, 30);
  strokeWeight(1);
  // rect(sx, sy, sSize);

  // drawTempCircle();

  //question text
  textAlign(CENTER);
  textFont(myFont);
  textSize(28);
  // text(qText, width / 2, 70);

  if(parseInt(latestData) < 5) {
    spawning = true;
  }else{
    // spawning = false;
  }

  if (spawning && millis() - lastSpawnTime > spawnInterval) {
    spawnParticles(3); // control how many per interval
    lastSpawnTime = millis();
  }

  for(let i=0; i < sField.length; i++){
    if(!isInside(sField[i])) {
      sField[i].x = random(sx, sx + sSize);
      sField[i].y = random(sy, sy + sSize);
    }

    stroke(230, 20);
    point(sField[i].x, sField[i].y);

    let dx = 3*sin(0.5 - noise(sField[i].x/sSize*5, sField[i].y/sSize*5, 2));
    let dy = 0.5 - noise(sField[i].x/sSize*15, sField[i].y/sSize*15, 3.2);

    sField[i].x += dx
    sField[i].y += dy
  }


  // update and draw particles
  for (let i = fromLeft.length - 1; i >= 0; i--) {

    updateParticle(fromLeft[i]);
    drawParticle(fromLeft[i]);
    if (fromLeft[i].state === "reached") fromLeft[i].life--;
    if (fromLeft[i].life <= 0) fromLeft.splice(i, 1);
  }

  for (let i = fromRight.length - 1; i >= 0; i--) {
    updateParticle(fromRight[i]);
    drawParticle(fromRight[i]);
    if (fromRight[i].state === "reached") fromRight[i].life--;
    if (fromRight[i].life <= 0) fromRight.splice(i, 1);
  }
}

function mousePressed() {
  spawning = true;
  lastSpawnTime = millis();
}

function mouseReleased() {
  spawning = false;
}

function spawnParticles(n) {
  for (let i = 0; i < n; i++) {
    let randY = random(0, height);
    let leftColor = color(random(80, 200), random(100, 150), 200, 150);
    let rightColor = color(random(30, 100), random(70, 130), 20, 150);

    fromLeft.push({
      x: 0,
      y: randY,
      stColor: leftColor,
      state: "approaching",
      targetX: sx + sSize / 2,
      targetY: sy + sSize / 2,
      angle: 0,
      life: pLife, // frames to live
      maxLife: pLife
    });

    fromRight.push({
      x: width,
      y: randY,
      stColor: rightColor,
      state: "approaching",
      targetX: sx + sSize / 2,
      targetY: sy + sSize / 2,
      angle: 0,
      life: pLife,
      maxLife: pLife
    });
  }
}

function updateParticle(pt) {
  if (pt.state === "approaching") {
    let steerX = (pt.targetX - pt.x) * speed;
    let steerY = (pt.targetY - pt.y) * speed;

    let noiseDx = (noise(pt.x * 0.005, pt.y * 0.005) - 0.5) * 0.8;
    let noiseDy = (noise(pt.x * 0.005 + 200, pt.y * 0.005) - 0.5) * 1.2;

    pt.x += steerX + noiseDx;
    pt.y += steerY + noiseDy;

    if (isInside(pt)) {
      pt.state = "reached";
    }
  } else if (pt.state === "reached") {
      // Update targetAngle for clockwise movement
      // let noiseVal = noise(pt.x * 0.01, pt.y * 0.01, frameCount * 0.05);
      // let angleStep = 0.008 + (noiseVal - 0.5) * 0.02;
      // pt.angle += angleStep;

      // pt.x += cos(pt.angle);
      // pt.y += sin(pt.angle);

    if(!isInside(pt)) {
      pt.x = random(sx, sx + sSize);
      pt.y = random(sy, sy + sSize);
    }

    stroke(230, 20);
    point(pt.x, pt.y);

    let dx = 3*sin(0.5 - noise(pt.x/sSize*5, pt.y/sSize*5, 2));
    let dy = 0.5 - noise(pt.x/sSize*15, pt.y/sSize*15, 3.2);

    pt.x += dx
    pt.y += dy
  }
}

function drawParticle(pt) {
  let alpha = map(pt.life, 0, pt.maxLife, 0, 255);
  stroke(red(pt.stColor), green(pt.stColor), blue(pt.stColor), alpha);
  fill(red(pt.stColor), green(pt.stColor), blue(pt.stColor), alpha);

  if(pt.state === "reached") {
    point(pt.x, pt.y);
  } else {
    // point(pt.x, pt.y);
    circle(pt.x, pt.y, 3);
  }
}

let lerpAmount = 0;
let lerpStep = 0.06;
function drawTempCircle() {
  let offset = 60;
  let size = 30;
  let activeColor = color(255, 20, 40);
  let defaultColor = color(255);

  if(latestData < 5) {
    if(lerpAmount < 1) lerpAmount += lerpStep;
  }else {
    if(lerpAmount > 0) lerpAmount -= lerpStep;
  }

  let interpolatedColor = lerpColor(defaultColor, activeColor, lerpAmount);

  noStroke();
  fill(interpolatedColor);
  circle(offset, offset, size);
  circle(width - offset, offset, size);
}

function isInside(pt) {
  if(pt.x >= sx && pt.x <= sx + sSize && pt.y >= sy && pt.y <= sy + sSize) return true;
  return false;
}

function keyPressed(){
  if(keyCode == ENTER){
    noLoop();
  }

  if(key == "s"){
    save();
  }

  if(keyCode == 32) {
    spawning = true;
  }
}

function keyReleased() {
  spawning = false;
}

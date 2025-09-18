let point_num = 3000;
let fromLeft = [];
let fromRight = [];
let cx, cy, r;
let speed = 0.007;
let centerCircle;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  strokeWeight(1);

  // define target circle
  cx = width / 2;
  cy = height / 2;
  r = height * 0.25;
  centerCircle = new CenterCircle(width, height, r);

  for(let i = 0; i < 500; i++){
    centerCircle.createPoint();
  }

  for (let i = 0; i < point_num; i++) {
    let randY = random(0, height);
    let leftColor = color(random(80, 200), random(100, 150), 200, 30);
    let rightColor = color(random(30, 100), random(70, 130), 200, 30);

    let dx = cx;
    let dy = cy - randY;
    let mag = sqrt(dx * dx + dy * dy);

    // nearest perimeter point
    let randFactor = random(-40, 40);
    let targetXL = cx + (dx / mag) * r + randFactor;
    let targetXR = cx - (dx / mag) * r + randFactor;
    let targetY = cy + (dy / mag) * r + randFactor;

    fromLeft[i] = {
      x: 0, y: randY,
      stColor: leftColor,
      state: "approaching",
      angle: 0,
      targetX: targetXL,
      targetY: targetY
    };

    fromRight[i] = {
      x: width,
      y: randY,
      stColor: rightColor,
      state: "approaching",
      angle: 0,
      targetX: targetXR,
      targetY: targetY
    };
  }
}

function draw() {
  centerCircle.movePoint();
  centerCircle.deletePoint();

  for (let i = 0; i < point_num; i++) {
    // ===== RIGHT POINTS =====
    let pt = fromRight[i];
    if (pt.state === "approaching") {
      // steering vector (small factor)
      let steerX = (pt.targetX - pt.x) * speed;
      let steerY = (pt.targetY - pt.y) * speed;

      // add some flow/noise
      let noiseDx = (noise(pt.x * 0.005, pt.y * 0.005) - 0.5) * 0.5;
      let noiseDy = (noise(pt.x * 0.005 + 100, pt.y * 0.005) - 0.5) * 0.5;

      pt.x += steerX + noiseDx;
      pt.y += steerY + noiseDy;

      // Check if reached perimeter
      if (dist(pt.x, pt.y, cx, cy) <= r + 0.5) {
        pt.state = "onPerimeter";
        pt.angle = atan2(pt.y - cy, pt.x - cx);
        pt.targetAngle = pt.angle;
        pt.quasion = random(0.05, 0.2); // random easing factor for each point
        pt.radius = r;
        pt.x = cx + cos(pt.angle) * r;
        pt.y = cy + sin(pt.angle) * r;
      }
    } else if (pt.state === "onPerimeter") {
      // Update targetAngle for clockwise movement
      let noiseVal = noise(pt.x * 0.01, pt.y * 0.01, frameCount * 0.05);
      let angleStep = 0.008 + (noiseVal - 0.5) * 0.02;
      pt.targetAngle += angleStep;

      // Gradually ease angle toward targetAngle using quasion
      pt.angle += (pt.targetAngle - pt.angle) * pt.quasion;

      // Gradually decrease radius to spiral inward
      pt.radius -= 0.05;

      // Add noise to radius for organic movement, but keep it inside the circle
      let radiusNoise = noise(pt.x * 0.02, pt.y * 0.02, frameCount * 0.02);
      let noisyR = pt.radius + (radiusNoise - 0.5) * 40;
      noisyR = constrain(noisyR, 0, r);

      pt.x = cx + cos(pt.angle) * noisyR;
      pt.y = cy + sin(pt.angle) * noisyR;
    }

    stroke(pt.stColor);
    point(pt.x, pt.y);

    // ===== LEFT POINTS =====
    pt = fromLeft[i];
    if (pt.state === "approaching") {


      let steerX = (pt.targetX - pt.x) * speed;
      let steerY = (pt.targetY - pt.y) * speed;

      let noiseDx = (noise(pt.x * 0.005, pt.y * 0.005) - 0.5) * 0.5;
      let noiseDy = (noise(pt.x * 0.005 + 200, pt.y * 0.005) - 0.5) * 0.5;

      pt.x += steerX + noiseDx;
      pt.y += steerY + noiseDy;

      if (dist(pt.x, pt.y, cx, cy) <= r + 0.5) {
        pt.state = "onPerimeter";
        pt.angle = atan2(pt.y - cy, pt.x - cx);
        pt.targetAngle = pt.angle;
        pt.quasion = random(0.05, 0.2); // random easing factor for each point
        pt.radius = r;
        pt.x = cx + cos(pt.angle) * r;
        pt.y = cy + sin(pt.angle) * r;
      }
    } else if (pt.state === "onPerimeter") {
      // Update targetAngle for clockwise movement
      let noiseVal = noise(pt.x * 0.01, pt.y * 0.01, frameCount * 0.05);
      let angleStep = 0.008 + (noiseVal - 0.5) * 0.02;
      pt.targetAngle += angleStep;

      // Gradually ease angle toward targetAngle using quasion
      pt.angle += (pt.targetAngle - pt.angle) * pt.quasion;

      // Gradually decrease radius to spiral inward
      pt.radius -= 0.05;

      // Add noise to radius for organic movement, but keep it inside the circle
      let radiusNoise = noise(pt.x * 0.02, pt.y * 0.02, frameCount * 0.02);
      let noisyR = pt.radius + (radiusNoise - 0.5) * 40;
      noisyR = constrain(noisyR, 0, r);

      pt.x = cx + cos(pt.angle) * noisyR;
      pt.y = cy + sin(pt.angle) * noisyR;
    }

    stroke(pt.stColor);
    point(pt.x, pt.y);
  }

  if (frameCount > 2000) noLoop();
}

function keyPressed() {
  if (keyCode == ENTER) {
    saveCanvas();
  }
}

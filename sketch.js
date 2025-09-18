let point_num = 2000;
let fromLeft = [];
let fromRight = [];
let cx, cy, r;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // background(0);
  background(0);
  strokeWeight(2);

  cx = width / 2;
  cy = height / 2;
  r = min(width, height) * 0.25;

  for (let i = 0; i < point_num; i++) {
    let randY = random(0, height);
    let leftColor = color(random(80, 200), random(100, 150), 40, 20);
    let rightColor = color(random(30, 100), random(70, 130), 200, 20);
    fromLeft[i] = { x: 0, y: randY, stColor: leftColor}
    fromRight[i] = { x: width, y: randY, stColor: rightColor };
  }
}

function draw() {
  for (let i = 0; i < point_num; i++) {
    // let dx = sin(
    //   2 *
    //   noise((pos[i].x / width) * 5, (pos[i].y / height) * 5, 0.5)
    // );
    // let dy =
    //   0.5 -
    //   noise((pos[i].x / width) * 10, (pos[i].y / height) * 10, 7.0);


    let rightDx = sin(0 - noise(fromRight[i].x/width, fromRight[i].y/width, 0.1));
    let rightDy = 0.5 - noise(fromRight[i].x/height*20, fromRight[i].y/height*20, 10)

    stroke(fromRight[i].stColor);
    strokeWeight(1);
    point(fromRight[i].x, fromRight[i].y);
    fromRight[i].x += rightDx;
    fromRight[i].y += rightDy;

    let leftDx = sin(1.1 - noise(fromLeft[i].x/width, fromLeft[i].y/width, 0.1));
    let leftDy = 0.5 - noise(fromLeft[i].x/height*20, fromLeft[i].y/height*20, 10)

    stroke(fromLeft[i].stColor);
    strokeWeight(1);
    point(fromLeft[i].x, fromLeft[i].y);
    fromLeft[i].x += leftDx;
    fromLeft[i].y += leftDy;
  }

  if (frameCount > 2000) {

    noLoop();
  }
}

function keyPressed(){
  if(keyCode == ENTER){
    saveCanvas();
  }
}
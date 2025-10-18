//track current grid position to draw pattern
let patternStartX;
let patternStartY;
let LcurGridX;
let LcurGridY;
let RcurGridX;
let RcurGridY;

//grid
let gridItemRow = 6;
let maxPatternItem = gridItemRow ** 2;
let gridSize;

//patterns
let L_pattern = [];
let R_pattern = [];
let leftAnimStartX;
let rightAnimStartX;
let animStartY;
const ANIM_SPEED = 0.01;

let pg;

function setup() {
  myCanvas = createCanvas(windowWidth, windowHeight);
  myCanvas.parent('myCanvas');
  noFill();

  rectSize = height / 2;
  rectX = 40;
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

  colorMode(HSB);

  pg = createGraphics(gridSize*1+3, gridSize+3);
  pg.colorMode(HSB);
  pg.pixelDensity(6);

  showSample();
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

  drawGrid(rectX, rectY);

  if(frameCount > 100) noLoop();
}

function drawGrid(x, y, g = window) {
  for(let i = 0; i < 1; i++) {
    g.strokeWeight(3);
    g.stroke(255);
    g.noFill();
    g.rect(x + i*gridSize, y, gridSize);
  }
}

// key functions
function keyPressed(){
  if(keyCode == ENTER){
    noLoop();
  }

  if(key == "s") {
    downloadPattern();
  }
}

function downloadPattern() {
  //draw on the offscreen canvas to save
  pg.clear();
  pg.background(10);
  pg.push();
  //move the half of the stroke width to include the whole grid stroke
  pg.translate(1.5, 1.5);
  // drawGrid(0, 0, pg);
  pg.pop();
  for(let pat of L_pattern) pat.draw(pg);
  for(let pat of R_pattern) pat.draw(pg);

  //save using the current timestamp
  // save(pg, '360_pattern_table.png');
  save(pg, '360_pattern_info.png');
}

function showSample() {
  let index = 5;
  let col = 280;

  // for(let i = 0; i < 6; i++) {
  //   let num = Math.round(random(0, 9));
  //   L_pattern.push(new Dots(width, 0, LcurGridX, LcurGridY, num, col));
  //   LcurGridX += gridSize;
  // }
  // for(let i = 0; i < 10; i++) {
    //   L_pattern.push(new Dots(width, 0, LcurGridX, LcurGridY, i, col));
    //   LcurGridX += gridSize;
    // }

    col = 240
    for(let i = 0; i < 1; i++) {
      let num = Math.round(random(0, 9));
      R_pattern.push(new Squares(width, 0, RcurGridX, LcurGridY, 7, col));
      RcurGridX += gridSize;
    }
  // L_pattern.push(new Circles(width, 0, LcurGridX, LcurGridY, 7, col));
  // col = 200;
  // R_pattern.push(new Dots(width, 0, LcurGridX, LcurGridY, 7, col));

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
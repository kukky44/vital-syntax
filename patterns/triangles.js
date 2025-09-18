class Triangles extends PatternItem {
  constructor(x, y, targetX, targetY, num, col, rate) {
    super(x, y, targetX, targetY, num, col, rate)
    this.gap = gridSize / 6;
    this.size = gridSize / 8;
  }

  draw() {
    super.draw();
    noFill();

    rectMode(CENTER)

    //center 1
    if(this.num === 0) {
      let scaled = this.size*1.3;
      this.drawTriangle(0, 0, scaled, 0);
    }

    //horizontal 2
    if(this.num === 1) {
      let scaledGap = this.gap*0.7;
      this.drawTriangle(-scaledGap, 0, this.size, 0);
      this.drawTriangle(scaledGap, 0, this.size, PI);
    }

    //vertical 2 facing outside
    if(this.num === 2) {
      this.drawTriangle(0, -this.gap, this.size, 0);
      this.drawTriangle(0, this.gap, this.size, PI);
    }

    //vertical 2 facing inside
    if(this.num === 3) {
      this.drawTriangle(0, this.gap, this.size, 0);
      this.drawTriangle(0, -this.gap, this.size, PI);
    }

    //vertical 1-2(pyramid), 3
    if(this.num === 4) {
      this.drawTriangle(0, -this.gap, this.size, 0);
      this.drawTriangle(-this.gap, this.gap, this.size, 0);
      this.drawTriangle(this.gap, this.gap, this.size, 0);
    }

    //vertical 2-1, 3
    if(this.num === 5) {
      this.drawTriangle(-this.gap, -this.gap, this.size, 0);
      this.drawTriangle(this.gap, -this.gap, this.size, 0);
      this.drawTriangle(0, this.gap, this.size, 0);
    }

    //overlap 3
    if(this.num === 6) {
      let scaledGap = this.gap*0.4;
      this.drawTriangle(-scaledGap, -scaledGap, this.size, 0);
      this.drawTriangle(scaledGap, -scaledGap, this.size, 0);
      this.drawTriangle(0, scaledGap, this.size, 0);
    }

    //4 up and down
    if(this.num === 7) {
      this.drawTriangle(-this.gap, -this.gap, this.size, PI);
      this.drawTriangle(this.gap, -this.gap, this.size, PI);
      this.drawTriangle(-this.gap, this.gap, this.size, 0);
      this.drawTriangle(this.gap, this.gap, this.size, 0);
    }

    //4 facing inside
    if(this.num === 8) {
      let scaled = this.size*0.8;
      let scaledGap = this.gap*0.9;
      this.drawTriangle(0, -scaledGap, scaled, PI);
      this.drawTriangle(-scaledGap, 0, scaled, HALF_PI);
      this.drawTriangle(0, scaledGap, scaled, 0);
      this.drawTriangle(scaledGap, 0, scaled, -HALF_PI);
    }

    //4 facing outside
    if(this.num === 9) {
      let scaled = this.size*0.8;
      let scaledGap = this.gap*1.6;
      this.drawTriangle(0, -scaledGap, scaled, 0);
      this.drawTriangle(scaledGap, 0, scaled, HALF_PI);
      this.drawTriangle(0, scaledGap, scaled, PI);
      this.drawTriangle(-scaledGap, 0, scaled, -HALF_PI);
    }

    pop();
  }

  drawTriangle(x, y, size, angle) {
    push();
    translate(x, y);
    rotate(angle);
    triangle(0, -size*0.85, -size, size, size, size);
    pop();
  }
}

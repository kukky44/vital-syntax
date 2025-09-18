class Circles extends PatternItem {
  constructor(x, y, targetX, targetY, num, col, rate) {
    super(x, y, targetX, targetY, num, col, rate)
    this.gap = gridSize / 7;
    this.size = gridSize / 5;
  }

  draw() {
    super.draw();
    noFill();

    rectMode(CENTER)

    //center 1
    if(this.num === 0) {
      let scaled = this.size*1.5;
      circle(0, 0, scaled)
    }

    //horizontal 2
    if(this.num === 1) {
      circle(-this.gap, 0, this.size);
      circle(this.gap, 0, this.size);
    }

    //vertical 2
    if(this.num === 2) {
      circle(0, -this.gap, this.size);
      circle(0, this.gap, this.size);
    }

    //vertical diamond
    if(this.num === 3) {
      let scaled = this.size*0.9;
      let scaledGap = this.gap*0.8;
      rotate(QUARTER_PI);
      circle(-scaledGap, -scaledGap, scaled);
      circle(scaledGap, scaledGap, scaled);
    }

    //vertical 3
    if(this.num === 4) {
      circle(0, -this.gap*0.9, this.size);
      circle(-this.gap, this.gap, this.size);
      circle(this.gap, this.gap, this.size);
    }

    //vertical 3 flipped
    if(this.num === 5) {
      circle(0, this.gap*0.9, this.size);
      circle(-this.gap, -this.gap, this.size);
      circle(this.gap, -this.gap, this.size);
    }

    //overlap 3
    if(this.num === 6) {
      let wrap = this.size*0.4;
      let scaled = this.size*1.3;
      circle(-wrap, -wrap, scaled);
      circle(wrap, -wrap, scaled);
      circle(0, wrap, scaled);
    }

    //four cross
    if(this.num === 7) {
      let scaled = this.size*1.2;
      let offset = scaled / 2;
      let wrap = offset / 3;
      circle(-offset, -offset, scaled);
      circle(offset, offset, scaled);
      circle(-wrap, -wrap, scaled);
      circle(wrap, wrap, scaled);
    }

    //four circles
    if(this.num === 8) {
      circle(-this.gap, -this.gap, this.size);
      circle(-this.gap, this.gap, this.size);
      circle(this.gap, -this.gap, this.size);
      circle(this.gap, this.gap, this.size);
    }

    //in diamond
    if(this.num === 9) {
      let scaled = this.size*0.8;
      let scaledGap = this.gap*0.8;
      rotate(QUARTER_PI);
      circle(-scaledGap, -scaledGap, scaled);
      circle(-scaledGap, scaledGap, scaled);
      circle(scaledGap, -scaledGap, scaled);
      circle(scaledGap, scaledGap, scaled);
    }

    pop();
  }
}

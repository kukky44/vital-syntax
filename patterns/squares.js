class Squares extends PatternItem {
  constructor(x, y, targetX, targetY, num, col, rate) {
    super(x, y, targetX, targetY, num, col, rate)
    this.gap = gridSize / 6;
    this.size = gridSize / 5;
  }

  draw() {
    super.draw();
    noFill();

    rectMode(CENTER)

    //center 1
    if(this.num === 0) {
      let scaled = this.size*1.5;
      rect(0, 0, scaled)
    }

    //horizontal 2
    if(this.num === 1) {
      rect(-this.gap, 0, this.size);
      rect(this.gap, 0, this.size);
    }

    //vertical 2
    if(this.num === 2) {
      rect(0, -this.gap, this.size);
      rect(0, this.gap, this.size);
    }

    //vertical diamond
    if(this.num === 3) {
      let scaled = this.size*0.9;
      let scaledGap = this.gap*0.8;
      rotate(QUARTER_PI);
      rect(-scaledGap, -scaledGap, scaled);
      rect(scaledGap, scaledGap, scaled);
    }

    //vertical 3
    if(this.num === 4) {
      rect(0, -this.gap*0.9, this.size);
      rect(-this.gap, this.gap, this.size);
      rect(this.gap, this.gap, this.size);
    }

    //vertical 3 flipped
    if(this.num === 5) {
      rect(0, this.gap*0.9, this.size);
      rect(-this.gap, -this.gap, this.size);
      rect(this.gap, -this.gap, this.size);
    }

    //overlap 3
    if(this.num === 6) {
      let wrap = this.size*0.4;
      let scaled = this.size*1.2;
      rect(0, wrap, scaled);
      rect(-wrap, -wrap, scaled);
      rect(wrap, 0, scaled);
    }

    //four cross
    if(this.num === 7) {
      let scaled = this.size*1.2;
      let offset = scaled / 2;
      let wrap = offset / 3;
      rect(-offset, -offset, scaled);
      rect(offset, offset, scaled);
      rect(-wrap, -wrap, scaled);
      rect(wrap, wrap, scaled);
    }

    //four rects
    if(this.num === 8) {
      rect(-this.gap, -this.gap, this.size);
      rect(-this.gap, this.gap, this.size);
      rect(this.gap, -this.gap, this.size);
      rect(this.gap, this.gap, this.size);
    }

    //in diamond
    if(this.num === 9) {
      let scaled = this.size*0.8;
      let scaledGap = this.gap*0.8;
      rotate(QUARTER_PI);
      rect(-scaledGap, -scaledGap, scaled);
      rect(-scaledGap, scaledGap, scaled);
      rect(scaledGap, -scaledGap, scaled);
      rect(scaledGap, scaledGap, scaled);
    }

    pop();
  }
}

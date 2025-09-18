class Waves extends PatternItem {
  constructor(x, y, targetX, targetY, num, col, rate) {
    super(x, y, targetX, targetY, num, col, rate)
    this.size = gridSize / 5;
    this.gap = gridSize / 6;
  }

  draw() {
    super.draw();
    noFill();

    rectMode(CENTER)

    //center 1
    if(this.num === 0) {
      let scaled = this.size*1.3;
      this.drawWave(0, -this.gap / 2, scaled, 0);
    }

    //center 1 flipped
    if(this.num === 1) {
      let scaled = this.size*1.3;
      this.drawWave(0, this.gap / 2, scaled, PI);
    }

    //vertical 2 facing outside
    if(this.num === 2) {
      this.drawWave(0, -this.gap, this.size, 0);
      this.drawWave(0, this.gap, this.size, PI);
    }

    //horizontal 2 facing ouside
    if(this.num === 3) {
      this.drawWave(-this.gap, 0, this.size, -HALF_PI);
      this.drawWave(this.gap, 0, this.size, HALF_PI);
    }

    //vertical connected
    if(this.num === 4) {
      let scaledGap = this.gap*0.4
      this.drawWave(-scaledGap, -this.size/2, this.size, HALF_PI);
      this.drawWave(scaledGap, this.size/2, this.size, -HALF_PI);
    }

    //horizontal connected
    if(this.num === 5) {
      let scaledGap = this.gap*0.4
      this.drawWave(this.size/2, scaledGap, this.size, 0);
      this.drawWave(-this.size/2, -scaledGap, this.size, PI);
    }

    //vertical chain
    if(this.num === 6) {
      let scaledGap = this.gap*0.1;
      this.drawWave(-scaledGap, -this.size/4, this.size, HALF_PI);
      this.drawWave(scaledGap, this.size/4, this.size, -HALF_PI);
    }

    //horizontal chain
    if(this.num === 7) {
      let scaledGap = this.gap*0.1
      this.drawWave(this.size/4, scaledGap, this.size, 0);
      this.drawWave(-this.size/4, -scaledGap, this.size, PI);
    }

    //3 fasing inside
    if(this.num === 8) {
      let scaledGap = this.gap*0.9;
      this.drawWave(-scaledGap, -scaledGap, this.size, -QUARTER_PI);
      this.drawWave(scaledGap, -scaledGap, this.size, QUARTER_PI);
      this.drawWave(0, scaledGap*0.7, this.size, PI);
    }

    //4 facing outside
    if(this.num === 9) {
      let scaled = this.size*0.9;
      let scaledGap = this.gap*1.3;
      this.drawWave(0, -scaledGap, scaled, 0);
      this.drawWave(scaledGap, 0, scaled, HALF_PI);
      this.drawWave(0, scaledGap, scaled, PI);
      this.drawWave(-scaledGap, 0, scaled, -HALF_PI);
    }

    pop();
  }

  drawWave(x, y, size, angle) {
    push();
    translate(x, y);
    rotate(angle);
    arc(0, 0, size, size, 0, PI, OPEN);
    pop();
  }
}

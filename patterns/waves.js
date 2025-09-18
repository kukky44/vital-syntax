class Waves extends PatternItem {
  constructor(x, y, targetX, targetY, num, col, rate) {
    super(x, y, targetX, targetY, num, col, rate)
    this.size = gridSize / 5;
    this.gap = gridSize / 6;
  }

  draw(g = window) {
    super.draw(g);
    g.noFill();

    g.rectMode(CENTER)

    //center 1
    if(this.num === 0) {
      let scaled = this.size*1.3;
      this.drawWave(g, 0, -this.gap / 2, scaled, 0);
    }

    //center 1 flipped
    if(this.num === 1) {
      let scaled = this.size*1.3;
      this.drawWave(g, 0, this.gap / 2, scaled, PI);
    }

    //vertical 2 facing outside
    if(this.num === 2) {
      this.drawWave(g, 0, -this.gap, this.size, 0);
      this.drawWave(g, 0, this.gap, this.size, PI);
    }

    //horizontal 2 facing ouside
    if(this.num === 3) {
      this.drawWave(g, -this.gap, 0, this.size, -HALF_PI);
      this.drawWave(g, this.gap, 0, this.size, HALF_PI);
    }

    //vertical connected
    if(this.num === 4) {
      let scaledGap = this.gap*0.4
      this.drawWave(g, -scaledGap, -this.size/2, this.size, HALF_PI);
      this.drawWave(g, scaledGap, this.size/2, this.size, -HALF_PI);
    }

    //horizontal connected
    if(this.num === 5) {
      let scaledGap = this.gap*0.4
      this.drawWave(g, this.size/2, scaledGap, this.size, 0);
      this.drawWave(g, -this.size/2, -scaledGap, this.size, PI);
    }

    //vertical chain
    if(this.num === 6) {
      let scaledGap = this.gap*0.1;
      this.drawWave(g, -scaledGap, -this.size/4, this.size, HALF_PI);
      this.drawWave(g, scaledGap, this.size/4, this.size, -HALF_PI);
    }

    //horizontal chain
    if(this.num === 7) {
      let scaledGap = this.gap*0.1
      this.drawWave(g, this.size/4, scaledGap, this.size, 0);
      this.drawWave(g, -this.size/4, -scaledGap, this.size, PI);
    }

    //3 fasing inside
    if(this.num === 8) {
      let scaledGap = this.gap*0.9;
      this.drawWave(g, -scaledGap, -scaledGap, this.size, -QUARTER_PI);
      this.drawWave(g, scaledGap, -scaledGap, this.size, QUARTER_PI);
      this.drawWave(g, 0, scaledGap*0.7, this.size, PI);
    }

    //4 facing outside
    if(this.num === 9) {
      let scaled = this.size*0.9;
      let scaledGap = this.gap*1.3;
      this.drawWave(g, 0, -scaledGap, scaled, 0);
      this.drawWave(g, scaledGap, 0, scaled, HALF_PI);
      this.drawWave(g, 0, scaledGap, scaled, PI);
      this.drawWave(g, -scaledGap, 0, scaled, -HALF_PI);
    }

    g.pop();
  }

  drawWave(g, x, y, size, angle) {
    g.push();
    g.translate(x, y);
    g.rotate(angle);
    g.arc(0, 0, size, size, 0, PI, OPEN);
    g.pop();
  }
}

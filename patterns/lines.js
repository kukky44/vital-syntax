class Lines extends PatternItem {
  constructor(x, y, targetX, targetY, num, col, rate) {
    super(x, y, targetX, targetY, num, col, rate)
    this.gap = gridSize / 10;
    this.size = gridSize / 8;
  }

  draw(g = window) {
    super.draw(g);
    g.noFill();

    if(this.num === 0) {
      g.line(-this.size / 2, 0, this.size / 2, 0);
    }

    if(this.num === 1) {
      g.line(0, -this.size / 2, 0, this.size / 2);
    }

    // horizontal 2
    if(this.num === 2) {
      g.line(-this.size - this.gap, 0, -this.gap, 0);
      g.line(this.gap, 0, this.size + this.gap, 0);
    }

    // vertical 2
    if(this.num === 3) {
      g.line(0, -this.size - this.gap, 0, -this.gap);
      g.line(0, this.gap, 0, this.size + this.gap);
    }

    // horizontal 3
    if(this.num === 4) {
      let scaled = this.size * 0.77;
      let scaledGap = this.gap * 0.7;
      g.line(0 - scaled - scaledGap - scaled / 2, 0, 0 - scaledGap - scaled / 2, 0);
      g.line(0 - scaled / 2, 0, scaled / 2, 0);
      g.line(scaledGap + scaled / 2, 0, scaled + scaledGap + scaled / 2, 0);
    }

    // vertical 3
    if(this.num === 5) {
      let scaled = this.size * 0.7;
      let scaledGap = this.gap * 0.7;
      g.line(0, 0 - scaled - scaledGap - scaled / 2, 0, 0 - scaledGap - scaled / 2);
      g.line(0, 0 - scaled / 2, 0, scaled / 2);
      g.line(0, scaledGap + scaled / 2, 0, scaled + scaledGap + scaled / 2);
    }

    // cross
    if(this.num === 6) {
      g.line(-this.size, -this.size, this.size, this.size);
      g.line(this.size, -this.size, -this.size, this.size);
    }

    //spaced cross
    if(this.num === 7) {
      g.line(-this.size - this.gap, 0, -this.gap, 0);
      g.line(this.gap, 0, this.size + this.gap, 0);
      g.line(0, -this.size - this.gap, 0, -this.gap);
      g.line(0, this.gap, 0, this.size + this.gap);
    }

    //spaced corss rotated
    if(this.num === 8) {
      g.rotate(QUARTER_PI);
      g.line(-this.size - this.gap, 0, -this.gap, 0);
      g.line(this.gap, 0, this.size + this.gap, 0);
      g.line(0, -this.size - this.gap, 0, -this.gap);
      g.line(0, this.gap, 0, this.size + this.gap);
    }

    //rotated cross sorrounded
    if(this.num === 9) {
      let scaled = this.size * 0.6;
      g.line(-scaled, -scaled, scaled, scaled);
      g.line(scaled, -scaled, -scaled, scaled);

      //surround
      scaled = this.size * 1.8;
      let offset = this.size * 0.6;
      g.line(-scaled, -offset, -offset, -scaled);
      g.line(offset, -scaled, scaled, -offset);
      g.line(-scaled, offset, -offset, scaled);
      g.line(offset, scaled, scaled, offset);
    }

    g.pop();
  }
}

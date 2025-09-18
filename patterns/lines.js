class Lines extends PatternItem {
  constructor(x, y, targetX, targetY, num, col, rate) {
    super(x, y, targetX, targetY, num, col, rate)
    this.gap = gridSize / 10;
    this.size = gridSize / 8;
  }

  draw() {
    super.draw();
    noFill();

    if(this.num === 0) {
      line(-this.size / 2, 0, this.size / 2, 0);
    }

    if(this.num === 1) {
      line(0, -this.size / 2, 0, this.size / 2);
    }

    // horizontal 2
    if(this.num === 2) {
      line(-this.size - this.gap, 0, -this.gap, 0);
      line(this.gap, 0, this.size + this.gap, 0);
    }

    // vertical 2
    if(this.num === 3) {
      line(0, -this.size - this.gap, 0, -this.gap);
      line(0, this.gap, 0, this.size + this.gap);
    }

    // horizontal 3
    if(this.num === 4) {
      let scaled = this.size * 0.77;
      let scaledGap = this.gap * 0.7;
      line(0 - scaled - scaledGap - scaled / 2, 0, 0 - scaledGap - scaled / 2, 0);
      line(0 - scaled / 2, 0, scaled / 2, 0);
      line(scaledGap + scaled / 2, 0, scaled + scaledGap + scaled / 2, 0);
    }

    // vertical 3
    if(this.num === 5) {
      let scaled = this.size * 0.7;
      let scaledGap = this.gap * 0.7;
      line(0, 0 - scaled - scaledGap - scaled / 2, 0, 0 - scaledGap - scaled / 2);
      line(0, 0 - scaled / 2, 0, scaled / 2);
      line(0, scaledGap + scaled / 2, 0, scaled + scaledGap + scaled / 2);
    }

    // cross
    if(this.num === 6) {
      line(-this.size, -this.size, this.size, this.size);
      line(this.size, -this.size, -this.size, this.size);
    }

    //spaced cross
    if(this.num === 7) {
      line(-this.size - this.gap, 0, -this.gap, 0);
      line(this.gap, 0, this.size + this.gap, 0);
      line(0, -this.size - this.gap, 0, -this.gap);
      line(0, this.gap, 0, this.size + this.gap);
    }

    //spaced corss rotated
    if(this.num === 8) {
      rotate(QUARTER_PI);
      line(-this.size - this.gap, 0, -this.gap, 0);
      line(this.gap, 0, this.size + this.gap, 0);
      line(0, -this.size - this.gap, 0, -this.gap);
      line(0, this.gap, 0, this.size + this.gap);
    }

    //rotated cross sorrounded
    if(this.num === 9) {
      let scaled = this.size * 0.6;
      line(-scaled, -scaled, scaled, scaled);
      line(scaled, -scaled, -scaled, scaled);

      //surround
      scaled = this.size * 1.8;
      let offset = this.size * 0.6;
      line(-scaled, -offset, -offset, -scaled);
      line(offset, -scaled, scaled, -offset);
      line(-scaled, offset, -offset, scaled);
      line(offset, scaled, scaled, offset);
    }

    pop();
  }
}

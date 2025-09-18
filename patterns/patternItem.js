class PatternItem {
  constructor(x, y, targetX, targetY, num, col, rate) {
    this.x = x;
    this.y = y;
    this.targetX = targetX;
    this.targetY = targetY;
    this.num = num;
    this.col = col;
    this.reached = false;
    this.size = gridSize / 12;
    this.finalSize = gridSize / 12;
    this.gap = gridSize / 4;
    this.rate = rate;
    this.scl = 1;
    this.alp = 0.9;
  }

  update() {
    if(abs(this.x - this.targetX) < 0.1 && abs(this.y - this.targetY) < 0.1) {
      this.reached = true;
      this.x = this.targetX;
      this.y = this.targetY;
      return;
    }

    // this.x = lerp(this.x, this.targetX, ANIM_SPEED);
    // this.y = lerp(this.y, this.targetY, ANIM_SPEED);

    let v = 0;
    let stiffness = 0.08;
    let damping = 0;

    let xforce = (this.targetX - this.x) * stiffness;
    v = v * damping + xforce;
    this.x += v;

    let yforce = (this.targetY - this.y) * stiffness;
    v = v * damping + yforce;
    this.y += v;
  }

  draw() {
    push();
    translate(this.x, this.y);
    scale(this.scl);
    blendMode(ADD);

    strokeWeight(3);
    stroke(this.col, 100, 100, this.alp);
    fill(this.col, 100, 100, this.alp);
  }
}

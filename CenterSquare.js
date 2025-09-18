class CenterSquare {
  constructor(wWidth, wHeight){
    this.x = wWidth / 2;
    this.y = wHeight / 2;
    this.points = [];
  }

  createPoint() {
    // Random angle and distance within the circle
    const angle = Math.random() * 2 * Math.PI;
    const r = Math.random() * this.radius;
    const px = this.x + r * Math.cos(angle);
    const py = this.y + r * Math.sin(angle);
    this.points.push({ x: px, y: py, angle });
  }

  movePoint() {
    for (let p of this.points) {
      const dir = noise(p.x * 0.02, p.y * 0.02, frameCount * 0.02);
      p.angle += dir; // Update angle based on flow field

      // Move point
      const speed = 0.01;
      p.x += speed * Math.cos(p.angle);
      p.y += speed * Math.tan(p.angle);

      // Constrain to circle
      const dx = p.x - this.x;
      const dy = p.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > this.radius) {
        // Move back to edge
        p.x = this.x + this.radius * Math.cos(p.angle);
        p.y = this.y + this.radius * Math.sin(p.angle);
      }
      stroke(255);
      point(p.x, p.y);
    }
  }

  deletePoint() {
    if (this.points.length > 0) {
      this.points.shift(); // Remove oldest point
    }
  }
}
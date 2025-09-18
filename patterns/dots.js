class Dots extends PatternItem {
  constructor(x, y, targetX, targetY, num, col, rate) {
    super(x, y, targetX, targetY, num, col, rate)
    this.margin = this.gap / 2 * 1.25;
  }

  draw(g = window) {
    super.draw(g);
    g.noStroke();

    if(this.num === 0) {
      g.circle(0, 0, this.size);
    }

    if(this.num === 1) {
      g.circle(-this.gap/2, 0, this.size);
      g.circle(this.gap/2, 0, this.size);
    }

    if(this.num === 2) {
      g.circle(0, -this.gap/2, this.size);
      g.circle(0, this.gap/2, this.size);
    }

    if(this.num === 3) {
      let verts = equilateralTriangleVertices(0, 0, this.gap);
      for (let v of verts) {
        g.circle(v[0], v[1], this.size);
      }
    }

    if(this.num === 4) {
      let verts = equilateralTriangleVertices(0, 0, this.gap);
      g.translate(0, -this.gap / 5);
      g.rotate(QUARTER_PI);
      for (let v of verts) {
        g.circle(v[0], v[1], this.size);
      }
    }

    if(this.num === 5) {
      g.circle(-this.gap/2, -this.gap/2, this.size);
      g.circle(this.gap/2, -this.gap/2, this.size);
      g.circle(-this.gap/2, this.gap/2, this.size);
      g.circle(this.gap/2, this.gap/2, this.size);
    }

    if(this.num === 6) {
      g.circle(-this.margin, 0, this.size);
      g.circle(this.margin, 0, this.size);
      g.circle(0, -this.margin, this.size);
      g.circle(0, this.margin, this.size);
    }

    if(this.num === 7) {
      g.circle(-this.gap/2, -this.gap/2, this.size);
      g.circle(this.gap/2, -this.gap/2, this.size);
      g.circle(-this.gap/2, this.gap/2, this.size);
      g.circle(this.gap/2, this.gap/2, this.size);
      g.circle(0, 0, this.size);
    }

    if(this.num === 8) {
      g.circle(-this.margin, 0, this.size);
      g.circle(this.margin, 0, this.size);
      g.circle(0, -this.margin, this.size);
      g.circle(0, this.margin, this.size);
      g.circle(0, 0, this.size);
    }

    if(this.num === 9) {
      g.circle(-this.margin, -this.margin, this.size);
      g.circle(-this.margin, this.margin, this.size);
      g.circle(this.margin, -this.margin, this.size);
      g.circle(this.margin, this.margin, this.size);
      g.circle(-this.margin, 0, this.size);
      g.circle(this.margin, 0, this.size);
      g.circle(0, -this.margin, this.size);
      g.circle(0, this.margin, this.size);
      g.circle(0, 0, this.size);
    }

    g.pop();
  }
}

function equilateralTriangleVertices(x, y, h) {
  // 辺の長さ
  h *= 0.8;
  let a = (2 * h) / Math.sqrt(3);

  // 頂点座標を格納
  let vertices = [];

  // 上の頂点
  vertices.push([x, y - (2/3) * h]);

  // 左下の頂点
  vertices.push([x - a/2, y + (1/3) * h]);

  // 右下の頂点
  vertices.push([x + a/2, y + (1/3) * h]);

  return vertices;
}
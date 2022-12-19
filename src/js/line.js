class Line {
  constructor(x1,y1,x2,y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }

  draw() {
    ctx.moveTo(this.x1, this.y1)
    ctx.lineTo(this.x2, this.y2)
  }

  reverse() {
    const x = this.x1
    const y = this.y1
    this.x1 = this.x2
    this.y1 = this.y2
    this.x2 = x
    this.y2 = y
    return this
  }
}
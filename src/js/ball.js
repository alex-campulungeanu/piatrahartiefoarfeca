class Ball {
  constructor(idx, type, newType, x, y, vx, vy, r = 45, m = 4 / 3 * Math.PI * (r ** 3)) {
    this.idx = idx
    this.r = r
    this.m = m
    this.x = x
    this.y = y
    this.vx = vx
    this.vy = vy
    this.type = type
    this.newType = newType
    this.base_image = new Image();
    this.base_image.src = `assets/${type}.png`;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += GRAVITY;
    let cur = this
    this.type = this.newType
    cur.base_image.onload = function() {
        cur.base_image.src = `assets/${cur.newType}.png`;
        // ctx.drawImage(cur.base_image, cur.x + cur.r, cur.y);
    }
  }

  draw() {
    ctx.drawImage(this.base_image, this.x, this.y);
    // ctx.moveTo(this.x + this.r, this.y);
    // ctx.arc(this.x, this.y, this.r, 0, TAU);
  }

  interceptLineTime(l, time) {
      const u = interceptLineBallTime(this.x, this.y, this.vx, this.vy, l.x1, l.y1, l.x2, l.y2,  this.r);
      if(u >= time && u <= 1) {
          return u;
      }
  }

  checkBallBallTime(t, minTime) {
      return t > minTime && t <= 1;
  }

  interceptBallTime(b, time) {
      const x = this.x - b.x;
      const y = this.y - b.y;
      const d = (x * x + y * y) ** 0.5;
      if(d > this.r + b.r) {
          const times = circlesInterceptUnitTime(
              this.x, this.y, 
              this.x + this.vx, this.y + this.vy, 
              b.x, b.y,
              b.x + b.vx, b.y + b.vy, 
              this.r, b.r
          );
          if(times.length) {
              if(times.length === 1) {
                  if(this.checkBallBallTime(times[0], time)) { return times[0] }
                  return;
              }
              if(times[0] <= times[1]) {
                  if(this.checkBallBallTime(times[0], time)) { return times[0] }
                  if(this.checkBallBallTime(times[1], time)) { return times[1] }
                  return
              }
              if(this.checkBallBallTime(times[1], time)) { return times[1] }                
              if(this.checkBallBallTime(times[0], time)) { return times[0] }
          }
      }
  }

  collideLine(l, time) {
      const x1 = l.x2 - l.x1;
      const y1 = l.y2 - l.y1;
      const d = (x1 * x1 + y1 * y1) ** 0.5;
      const nx = x1 / d;
      const ny = y1 / d;            
      const u = (this.vx  * nx + this.vy  * ny) * 2;
      this.x += this.vx * time;   
      this.y += this.vy * time;   
      this.vx = (nx * u - this.vx) * WALL_LOSS;
      this.vy = (ny * u - this.vy) * WALL_LOSS;
      this.x -= this.vx * time;
      this.y -= this.vy * time;
  }

  collide(b, time) {
      const a = this;
      const m1 = a.m;
      const m2 = b.m;
      const x = a.x - b.x
      const y = a.y - b.y  
      const d = (x * x + y * y);
      const u1 = (a.vx * x + a.vy * y) / d
      const u2 = (x * a.vy - y * a.vx ) / d
      const u3 = (b.vx * x + b.vy * y) / d
      const u4 = (x * b.vy - y * b.vx ) / d
      const mm = m1 + m2;
      const vu3 = (m1 - m2) / mm * u1 + (2 * m2) / mm * u3;
      const vu1 = (m2 - m1) / mm * u3 + (2 * m1) / mm * u1;
      a.x = a.x + a.vx * time;
      a.y = a.y + a.vy * time;
      b.x = b.x + b.vx * time;
      b.y = b.y + b.vy * time;
      b.vx = x * vu1 - y * u4;
      b.vy = y * vu1 + x * u4;
      a.vx = x * vu3 - y * u2;
      a.vy = y * vu3 + x * u2;
      a.x = a.x - a.vx * time;
      a.y = a.y - a.vy * time;
      b.x = b.x - b.vx * time;
      b.y = b.y - b.vy * time;
      
      if (a.type == 'rock' && b.type == 'paper') {
        a.newType = b.type
      } else if (a.type == 'rock' && b.type == 'scissor') {
        b.newType = a.type
      } else if (a.type == 'paper' && b.type == 'rock') {
        b.newType = a.type
      } else if (a.type == 'paper' && b.type == 'scissor') {
        a.newType = b.type
      } else if (a.type == 'scissor' && b.type == 'paper') {
        b.newType = a.type
      } else if (a.type == 'scissor' && b.type == 'rock') {
        a.newType = b.type
      }
  }

  doesOverlap(ball) {
      const x = this.x - ball.x;
      const y = this.y - ball.y;
      return  (this.r + ball.r) > ((x * x + y * y) ** 0.5);  
  }  
}
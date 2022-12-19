/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas')
canvas.width = innerWidth -20
canvas.height = innerHeight - 20
const ctx = canvas.getContext("2d")

const GRAVITY = 0
const WALL_LOSS = 1
const TAU = Math.PI * 2 // circle constant representing the ratio between circumference and radius. 
const BALL_COUNT = 30
const MIN_BALL_SIZE = 13
const MAX_BALL_SIZE = 20
const VEL_MIN = 1 // speend min
const VEL_MAX = 3 // speend max
const MAX_RESOLUTION_CYCLES = 100

const lines = []
const balls = []

const gameTypes = [
  'rock', 
  'paper', 
  'scissor'
]

function createLines () {
  lines.push(new Line(-10, 10, ctx.canvas.width + 10, 5));
  lines.push((new Line(-10, ctx.canvas.height - 2, ctx.canvas.width + 10, ctx.canvas.height - 10)).reverse());
  lines.push((new Line(10, -10, 4, ctx.canvas.height + 10)).reverse());
  lines.push(new Line(ctx.canvas.width - 3, -10, ctx.canvas.width - 10, ctx.canvas.height + 10)); 
}

function canAdd(ball) {
  for(const b of balls) {
    if (ball.doesOverlap(b)) { return false }
  }
  return true;
}

function createBalls(bCount) {
  while (bCount--) {
    let tries = 100;
    // debugger
    let idx = 1
    while (tries--) {
      const dir = rand(0, TAU);
      const vel = rand(VEL_MIN, VEL_MAX);
      const randomType = Math.floor(Math.random() * gameTypes.length)
      const rndt = gameTypes[randomType]
      const ball = new Ball(
        idx,
        rndt,
        rndt,
        rand(MAX_BALL_SIZE + 10, canvas.width - MAX_BALL_SIZE - 10), 
        rand(MAX_BALL_SIZE + 10, canvas.height - MAX_BALL_SIZE - 10),
        Math.cos(dir) * vel,
        Math.sin(dir) * vel,
        rand(MIN_BALL_SIZE, MAX_BALL_SIZE)
      );
      if (canAdd(ball)) {
        balls.push(ball);
        idx ++ 
        break;
      }
    }
  }
}

function resolveCollisions() {
  var minTime = 0, minObj, minBall, resolving = true, idx = 0, idx1, after = 0, e = 0;
  while(resolving && e++ < MAX_RESOLUTION_CYCLES) { // too main ball may create very lone resolution cycle. e limits this
      resolving = false;
      minObj = undefined;
      minBall = undefined;
      minTime = 1;
      idx = 0;
      for(const b of balls) {
          idx1 = idx + 1;
          while(idx1 < balls.length) {
              const b1 = balls[idx1++];
              const time = b.interceptBallTime(b1, after);
              if(time !== undefined) {
                  if(time <= minTime) {
                      minTime = time;
                      minObj = b1;
                      minBall = b;
                      resolving = true;
                  }
              }
          }
          for(const l of lines) {
              const time = b.interceptLineTime(l, after);
              if(time !== undefined) {
                  if(time <= minTime) {
                      minTime = time;
                      minObj = l;
                      minBall = b;
                      resolving = true;
                  }
              }
          }
          idx ++;
      }
      if(resolving) {
          if (minObj instanceof Ball) {
              minBall.collide(minObj, minTime);
          } else {
              minBall.collideLine(minObj, minTime);
          }
          after = minTime;
      }
  }
}

createLines()
createBalls(BALL_COUNT)

function mainLoop() {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  resolveCollisions()
  for(const b of balls) { b.update() }
  ctx.strokeStyle = 'red'
  ctx.beginPath();
  for (const b of balls) {b.draw()}
  for (const l of lines) {l.draw()}
  ctx.stroke()
  requestAnimationFrame(mainLoop);
}
// setInterval(mainLoop, 100)

mainLoop()
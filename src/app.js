const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

// singular boid blueprint
class Entity {
  // setup each point of triangle
  constructor(p1, p2, p3) {
    this.points[0].x = p1.x;
    this.points[0].y = p1.y;
    this.points[1].x = p2.x;
    this.points[1].y = p2.y;
    this.points[2].x = p3.x;
    this.points[2].y = p3.y;
  }

  // vec2 array - holds coordinates of 3 different points,
  // each point represents a corner of a triangle (init to 0 by default):
  points = [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 }
  ];
  
  move() {
    // testing only x direction right now:
    this.points[0].x += 2.0;
    this.points[1].x += 2.0;
    this.points[2].x += 2.0;
    if ((this.points[1].x || this.points[2].x) > canvasWidth) {
      this.points[0].x = 0; this.points[0].y = 50;
      this.points[1].x = -50; this.points[1].y = 75;
      this.points[2].x = -50; this.points[2].y = 25;
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    ctx.lineTo(this.points[1].x, this.points[1].y);
    ctx.lineTo(this.points[2].x, this.points[2].y);
    ctx.closePath();
    ctx.stroke();
  }
}

// test points:
let a = { x: 0, y: 50 };
let b = { x: -50, y: 75 };
let c = { x: -50, y: 25 };

const boids = new Entity(a, b, c);

/* main loop */
(function update() {
  ctx.fillStyle = "#687782";
  ctx.fillRect(0, 0, canvas.width, canvas.height);  
  
  boids.move();
  boids.draw(ctx);
  requestAnimationFrame(update);
})();

// helper functions:
function clear() {
  ctx.fillStyle = "#687782";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}
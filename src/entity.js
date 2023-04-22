import { canvasWidth } from "./app.js";

// singular boid blueprint
export default class Entity {
  // setup each point of triangle
  constructor() {
    this.generateStartingPosition();
  }

  // vec2 array - holds coordinates of 3 different points,
  // each point represents a corner of a triangle (init to 0 by default):
  points = [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 }
  ];

  // generate random starting positions for boids,
  // will be outside of the canvas, and will all be angled differently:
  // hardcoded for now - testing
  generateStartingPosition() {
    this.points[0].x = 0;   this.points[0].y = 50;
    this.points[1].x = -50; this.points[1].y = 75;
    this.points[2].x = -50; this.points[2].y = 25;
  }
  
  move() {
    // testing only x direction right now:
    this.points[0].x += 2.0;
    this.points[1].x += 2.0;
    this.points[2].x += 2.0;

    // if boid goes off screen, generate a new position for it: 
    if ((this.points[1].x || this.points[2].x) > canvasWidth) {
      this.generateStartingPosition();
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
};
import { canvasWidth, canvasHeight } from "./app.js";

// singular boid blueprint
export default class Entity {
  // setup each point of triangle
  constructor() {
    this.generateNewBoidPosition();
    this.speed = 2;
    this.angle = 0;
    this.width = 10,
    this.height = 15;
  }

  // generate random starting positions for boids,
  // will be outside of the canvas, and will all be angled differently:
  generateNewBoidPosition() {
    this.angle = this.randomNumberGenerator();

    // if (isBetween(this.angle, 0, 180)) {
    //   console.log('between...');
    //   this.x = Math.floor(Math.random() * canvasWidth);
    //   this.y = -10;
    // }

    this.x = canvasWidth / 2;
    this.y = canvasHeight / 2;
  }

  randomNumberGenerator() {
    return Math.floor(Math.random() * 360);
  }

  isBetween(x, min, max) {
    return x >= min && x <= max;
  }

  move() {
    this.radians = this.angle * Math.PI / 180;

    this.x += Math.cos(this.radians) * this.speed;
    this.y += Math.sin(this.radians) * this.speed;

    // if boid goes off screen, generate a new position for it: 
    if ((this.x < 0 || this.x > canvasWidth) || 
         this.y < 0 || this.y > canvasHeight) {
      this.generateNewBoidPosition();
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.radians);
    ctx.beginPath();
    ctx.moveTo(this.height, 0);
    ctx.lineTo(-this.height, this.width);
    ctx.lineTo(-this.height, -this.width);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }
};
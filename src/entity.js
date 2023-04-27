import { canvasWidth, canvasHeight } from "./app.js";

// singular boid blueprint
export default class Entity {
  // setup each point of triangle
  constructor() {
    this.generateNewBoidPosition();
    this.speed = 5;
    this.width = 10,
    this.height = 15;
  }

  // generate random starting positions for boids,
  // will be outside of the canvas, and will all be angled differently:
  generateNewBoidPosition() {
    this.angle = this.getRandomAngle(-45, 315);
    
    // facing east:
    if (this.isBetween(this.angle, -45, 45)) {
      this.x = 0;
      this.y = this.getRandomAngle(0, canvasHeight)
    }
    // facing south:
    else if (this.isBetween(this.angle, 45, 135)) {
      this.x = this.getRandomAngle(0, canvasWidth);
      this.y = 0;
    }
    // facing west:
    else if (this.isBetween(this.angle, 135, 225)) {
      this.x = canvasWidth;
      this.y = this.getRandomAngle(0, canvasHeight);
    }
    // facing north:
    else if (this.isBetween(this.angle, 225, 315)) {
      this.x = this.getRandomAngle(0, canvasWidth);
      this.y = canvasHeight;
    }
  }

  // return random angle between -45 and 315:
  getRandomAngle(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

  // check angles between 90 deg:
  isBetween(x, min, max) {
    return x >= min && x <= max;
  }

  move() {
    this.radians = this.angle * Math.PI / 180;
    
    this.x += Math.cos(this.radians) * this.speed;
    this.y += Math.sin(this.radians) * this.speed;

    // if boid goes off screen, generate a new position for it: 
    if ((this.x + this.width < 0 || this.x - this.width > canvasWidth) || 
         this.y + this.height < 0 || this.y - this.height > canvasHeight) {
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
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.restore();
  }
};
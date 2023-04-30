import { canvasWidth, canvasHeight } from "./app.js";

// singular boid blueprint
export default class Entity {
  // setup each point of triangle
  constructor() {
    this.generateNewBoidPosition();
    this.speed = 1;
    this.width = 8,
    this.height = 10;
    this.radius = 100;    // boid view angle radius
    this.viewAngle = this.toRadians(100);
    this.target = false;
  }

  // generate random starting positions for boids,
  // will be outside of the canvas, and will all be angled differently:
  generateNewBoidPosition() {
    this.angle = this.getRandomNumber(-45, 315);

    // facing east:
    if (this.isBetween(this.angle, -45, 45)) {
      this.x = 0;
      this.y = this.getRandomNumber(0, canvasHeight)
    }
    // facing south:
    else if (this.isBetween(this.angle, 45, 135)) {
      this.x = this.getRandomNumber(0, canvasWidth);
      this.y = 0;
    }
    // facing west:
    else if (this.isBetween(this.angle, 135, 225)) {
      this.x = canvasWidth;
      this.y = this.getRandomNumber(0, canvasHeight);
    }
    // facing north:
    else if (this.isBetween(this.angle, 225, 315)) {
      this.x = this.getRandomNumber(0, canvasWidth);
      this.y = canvasHeight;
    }
  }

  // return random angle between -45 and 315:
  getRandomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

  // check if generated angle is between a given 90 deg range:
  isBetween(x, min, max) {
    return x >= min && x <= max;
  }

  // degree -> radians conversion:
  toRadians(degree) {
    return degree * Math.PI / 180;
  }

  move() {
    this.radians = this.toRadians(this.angle);

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
    
    // boid's view angle:
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, this.radius, -this.viewAngle, this.viewAngle);
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";   // view angle
    ctx.fill();
    if (this.target) {
    }
    
    // the boid:
    ctx.beginPath();
    ctx.moveTo(this.height, 0);
    ctx.lineTo(-this.height, this.width);
    ctx.lineTo(-this.height, -this.width);
    ctx.closePath();
    if (this.target)
      ctx.fillStyle = 'red';
    else 
      ctx.fillStyle = 'white';
    ctx.fill();

    ctx.restore();
  }
};
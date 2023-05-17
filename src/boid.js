import { canvasWidth, canvasHeight } from './app.js';

// singular boid blueprint
export default class Boid {
  // setup each point of triangle
  constructor() {
    this.generateNewBoidPosition();
    this.speed = 2.0;
    this.width = 8,
    this.height = 10;
    this.radius = 100.0;    // boid view angle radius
    this.viewAngle = 1.0;
    this.isInsideViewAngle = false;
    this.dir = 0.0;
    this.target = false;
  }

  // generate random starting positions for boids,
  // will be outside of the canvas, and will all be angled differently:
  generateNewBoidPosition() {
    this.angle = this.getRandomNumber(-45, 315);
    this.radians = this.toRadians(this.angle);

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

  update() {
    if (this.isInsideViewAngle) {
      if (this.dir > Math.PI)
        this.radians -= this.toRadians(this.dir);
      else 
        this.radians += this.toRadians(this.dir);
      this.x += Math.cos(this.radians) * this.speed;
      this.y += Math.sin(this.radians) * this.speed;
    }
    else {
      this.x += Math.cos(this.radians) * this.speed;
      this.y += Math.sin(this.radians) * this.speed;
    }

    // if boid goes off screen, generate a new position for it:
    if ((this.x + this.width < 0 || this.x - this.width > canvasWidth) ||
    this.y + this.height < 0 || this.y - this.height > canvasHeight) {
      this.generateNewBoidPosition();
      this.isInsideViewAngle = false;
    }
  }
    
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);    // realign origin to center of current boid.
    ctx.rotate(this.radians);

    //boid's view angle:
    // if (this.target) {
    // }
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, this.radius, -this.viewAngle, this.viewAngle, false);
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";   // view angle
    ctx.fill();
    
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
import { canvasWidth, canvasHeight } from './app.js';

// singular boid blueprint
export default class Boid {
  // setup each point of triangle
  constructor() {
    this.generateInitialBoidPosition();
    this.speed = 1.5;
    this.width = 5,
    this.height = 7;
    this.perceptionRadius = 80;    // boid view angle radius
    this.perceptionArc = 2.0;
    this.isInsideArc = false;
    this.dirForce = 0.0;
    this.target = false;
  }

  // generate random starting positions for boids,
  // will be outside of the canvas, and will all be angled differently:
  generateInitialBoidPosition() {
    this.angle = this.getRandomNumber(-45, 315);
    this.radians = this.toRadians(this.angle);

    // pos = center of canvas: 
    this.x = canvasWidth / 2;
    this.y = canvasHeight / 2;
  }

  // return random angle between -45 and 315:
  getRandomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

  // degree -> radians conversion:
  toRadians(degree) {
    return degree * Math.PI / 180;
  }

  alignment(boids) {
    const currentBoidRotation = this.radians;
    // get main boid's current direction/velocity:
    // vecB:
    let currentBoidDir = {
      x: Math.cos(currentBoidRotation), 
      y: Math.sin(currentBoidRotation),
    };

    let avgPosition = { x: 0, y: 0 };

    for (let other of boids) {
      const otherBoidRotation = other.radians;
      // get other boid's current direction/velocity:
      // vecB:
      let otherBoidDir = {
        x: Math.cos(otherBoidRotation), 
        y: Math.sin(otherBoidRotation),
      };
      // don't compare ourselves - skip current loop if so:
      if (other != this) {
        // vecA:
        // - used as the distance between 2 boids.
        // - also gives us direction pointing from 'us' to the 'other' boid.
        //    - this is used to turn 'us' in opposite direction to 'other' boid.
        let diff = {
          dx: this.x - other.x,
          dy: this.y - other.y,
        };
        // distance between 2 boids:
        const dst = Math.sqrt(diff.dx*diff.dx + diff.dy*diff.dy);
        
        // normalise vecA:
        normalise(diff, dst);
        
        // dot product between vecA and vecB:
        let dp = dot(diff, currentBoidDir);
  
        // check if boid is within other's radius:
        let isInsideRadius = dst < this.perceptionRadius;
        // check if boid comes within the view angle defined:
        let isInsideAngle = Math.abs(Math.acos(dp)) < this.perceptionArc;
        this.isInsideArc = isInsideRadius && isInsideAngle;
  
        // only true if boid is within other's radius AND perception arc:
        if (this.isInsideArc) {
          avgPosition.x += otherBoidDir.x;
          avgPosition.y += otherBoidDir.y;
          avgPosition.x -= currentBoidDir.x;
          avgPosition.y -= currentBoidDir.y;
          
          this.dirForce = Math.atan2(avgPosition.y, avgPosition.x);
          // exit loop early if boid detection == true 
          // update + draw result: 
          return this.dirForce;
        }
      }
      else 
        continue;
    }
  }

  cohesion(boids) {
    const currentBoidRotation = this.radians;
    // get main boid's current direction/velocity:
    // vecB:
    let currentBoidDir = {
      x: Math.cos(currentBoidRotation), 
      y: Math.sin(currentBoidRotation),
    };

    let avgPosition = { x: 0, y: 0 };

    for (let other of boids) {
      // don't compare ourselves - skip current loop if so:
      if (other != this) {
        // vecA:
        // - used as the distance between 2 boids.
        // - also gives us direction pointing from 'us' to the 'other' boid.
        //    - this is used to turn 'us' in opposite direction to 'other' boid.
        let diff = {
          dx: this.x - other.x,
          dy: this.y - other.y,
        };
        // distance between 2 boids:
        const dst = Math.sqrt(diff.dx*diff.dx + diff.dy*diff.dy);
        
        // normalise vecA:
        normalise(diff, dst);
        
        // dot product between vecA and vecB:
        let dp = dot(diff, currentBoidDir);
  
        // check if boid is within other's radius:
        let isInsideRadius = dst < this.perceptionRadius;
        // check if boid comes within the view angle defined:
        let isInsideAngle = Math.abs(Math.acos(dp)) < this.perceptionArc;
        this.isInsideArc = isInsideRadius && isInsideAngle;
  
        // only true if boid is within other's radius AND perception arc:
        if (this.isInsideArc) {
          avgPosition.x += other.x;
          avgPosition.y += other.y;
          avgPosition.x -= this.x;
          avgPosition.y -= this.y;

          this.dirForce = Math.atan2(avgPosition.y, avgPosition.x);
          // exit loop early if boid detection == true 
          // update + draw result: 
          return this.dirForce;
        }
      }
      else 
        continue;
    }
  }

  separation(boids) {
    const currentBoidRotation = this.radians;
    // get main boid's current direction:
    // vecB:
    let currentBoidDir = {
      x: Math.cos(currentBoidRotation), 
      y: Math.sin(currentBoidRotation),
    };

    let avgPosition = { x: 0, y: 0 };

    for (let other of boids) {
      // don't compare ourselves - skip current loop if so:
      if (other != this) {
        // vecA:
        // - used as the distance between 2 boids.
        // - also gives us direction pointing from 'us' to the 'other' boid.
        //    - this is used to turn 'us' in opposite direction to 'other' boid.
        let diff = {
          dx: other.x - this.x,
          dy: other.y - this.y,
        };
        // distance between 2 boids:
        const dst = Math.sqrt(diff.dx*diff.dx + diff.dy*diff.dy);
        
        // normalise vecA:
        normalise(diff, dst);
  
        // dot product between vecA and vecB:
        let dp = dot(diff, currentBoidDir);
  
        // check if boid is within other's radius:
        let isInsideRadius = dst < this.perceptionRadius;
        // check if boid comes within the view angle defined:
        let isInsideAngle = Math.abs(Math.acos(dp)) < this.perceptionArc;
        this.isInsideArc = isInsideRadius && isInsideAngle;
  
        // only true if boid is within other's radius AND perception arc:
        if (this.isInsideArc) {
          avgPosition.x += diff.dx;
          avgPosition.y += diff.dy;

          // dirForce = opposite distance direction:
          this.dirForce = -Math.atan2(avgPosition.y, avgPosition.x);
          // exit loop early if boid detection == true 
          // update + draw result: 
          return this.dirForce;
        }
      }
      else 
        continue;
    }
  }

  update() {
    if (this.isInsideArc) {
      (this.dirForce > Math.PI) 
        ? this.radians -= this.toRadians(this.dirForce) 
        : this.radians += this.toRadians(this.dirForce);
    }
    this.x += Math.cos(this.radians) * this.speed;
    this.y += Math.sin(this.radians) * this.speed;

    // screen wrapping:
    // if boid goes off screen, wrap its position to the other side:
    // horizontal wrap:
    if      (this.x + this.width < 0)           this.x = canvasWidth + this.width;
    else if (this.x - this.width > canvasWidth) this.x = 0 - this.width;
    // vertical wrap:
    if      (this.y + this.height < 0)            this.y = canvasHeight + this.height;
    else if (this.y - this.height > canvasHeight) this.y = 0 - this.height;
  }
    
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);    // realign origin to center of current boid.
    ctx.rotate(this.radians);

    //boid's view angle:
    if (this.target) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, this.perceptionRadius, -this.perceptionArc, this.perceptionArc, false);
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";   // view angle
      ctx.fill();
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

// utility functions:
function normalise(vec, dst) {
  vec.dx /= dst, vec.dy /= dst;
}

function dot(vec1, vec2) {
  return vec1.dx*vec2.x + vec1.dy*vec2.y;
}
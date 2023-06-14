import { canvasWidth, canvasHeight } from './app.js';

// singular boid blueprint
export default class Boid {
  // setup each point of triangle
  constructor() {
    this.generateInitialBoidPosition();
    this.speed = 1.5;
    this.width = 5,
    this.height = 7;
    this.perceptionRadius = 100;    // boid view angle radius
    this.perceptionArc = 2.0;
    this.isInsideArc = false;
    this.turnAngle = 0.0;
    this.target = false;
  }

  // generate random starting positions for boids,
  // will be outside of the canvas, and will all be angled differently:
  generateInitialBoidPosition() {
    this.angle = this.getRandomNumber(-45, 315);
    this.radians = this.toRadians(this.angle);

    // pos = center of canvas: 
    this.x = this.getRandomNumber(0, canvasWidth);
    this.y = this.getRandomNumber(0, canvasHeight);
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

  flock(boids) {
    let alignment = this.alignment(boids);
    this.turnAngle = Math.atan2(alignment.y, alignment.x)
    this.radians += this.toRadians(this.turnAngle);

    let cohesion = this.cohesion(boids);
    this.turnAngle = Math.atan2(cohesion.y, cohesion.x)
    this.radians += this.toRadians(this.turnAngle);

    // let separation = this.cohesion(boids);
    // this.turnAngle = Math.atan2(separation.y, separation.x)
    // this.radians += this.toRadians(this.turnAngle);
  }

  alignment(boids) {
    const currentBoidRotation = this.radians;
    // get main boid's current direction/velocity:
    // vecB:
    let currentBoidDir = {
      x: Math.cos(currentBoidRotation) * this.speed, 
      y: Math.sin(currentBoidRotation) * this.speed,
    };

    let steering = { x: 0, y: 0 };
    let total = 0;

    for (let other of boids) {
      const otherBoidRotation = other.radians;
      // get other boid's current direction/velocity:
      // vecB:
      let otherBoidDir = {
        x: Math.cos(otherBoidRotation) * this.speed, 
        y: Math.sin(otherBoidRotation) * this.speed,
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
          steering.x += otherBoidDir.x;
          steering.y += otherBoidDir.y;
          total++;
        }
      }
      else 
        continue;
    }

    if (total > 0) {
      steering.x /= total;
      steering.y /= total;

      steering.x -= currentBoidDir.x;
      steering.y -= currentBoidDir.y;
    }
    return steering;
  }

  cohesion(boids) {
    const currentBoidRotation = this.radians;
    // get main boid's current direction/velocity:
    // vecB:
    let currentBoidDir = {
      x: Math.cos(currentBoidRotation) * this.speed, 
      y: Math.sin(currentBoidRotation) * this.speed,
    };

    let steering = { x: 0, y: 0 };
    let total = 0;

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
          steering.x += other.x;
          steering.y += other.y;
          total++;
        }
      }
      else 
        continue;
    }

    if (total > 0) {
      steering.x /= total;
      steering.y /= total;

      steering.x -= this.x;
      steering.y -= this.y;
    }
    return steering;
  }

  separation(boids) {
    const currentBoidRotation = this.radians;
    // get main boid's current direction:
    // vecB:
    let currentBoidDir = {
      x: Math.cos(currentBoidRotation) * this.speed, 
      y: Math.sin(currentBoidRotation) * this.speed,
    };

    let steering = { x: 0, y: 0 };
    let total = 0;

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
          steering.x += diff.dx;
          steering.y += diff.dy;
          total++;
        }
      }
      else 
        continue;
    }

    if (total > 0) {
      steering.x /= total;
      steering.y /= total;

      steering.x -= currentBoidDir.x;
      steering.y -= currentBoidDir.y;
    }
    return steering;
  }

  update() {
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
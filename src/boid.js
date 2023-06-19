import { canvasWidth, canvasHeight } from './app.js';

// singular boid blueprint
export default class Boid {
  // setup each point of triangle
  constructor() {
    this.speed = 1.2;
    this.width = 5,
    this.height = 7;
    this.perceptionRadius = 100;    // boid view angle radius
    this.perceptionArc = 2.0;
    this.isInsideArc = false;
    this.turnAngle = 0.0;
    this.target = false;

    // boid will be facing random direction: 
    this.angle = this.getRandomNumber(-45, 315);
    this.radians = this.toRadians(this.angle);

    this.maxForce = 5;

    // generate random starting positions for boids:
    this.position = { 
      x: this.getRandomNumber(0, canvasWidth),
      y: this.getRandomNumber(0, canvasHeight),
    };

    // set velocity of each boid based on its direction:
    this.velocity = { 
      x: Math.cos(this.radians) * this.speed,
      y: Math.sin(this.radians) * this.speed 
    };
    
    this.acceleration = { x: 0, y: 0 };
  }

  flock(boids) {
    const limitTurnForce = 1.1;
    
    // let separation = this.separation(boids);
    // this.turnAngle = Math.atan2(separation.y, separation.x);
    // this.radians += this.toRadians(this.turnAngle);

    let alignment = this.alignment(boids);
    this.acceleration = alignment;
    //this.turnAngle = Math.atan2(alignment.y, alignment.x);
    //this.turnAngle /= limitTurnForce;
    //this.radians += this.toRadians(this.acceleration);
    
    // let cohesion = this.cohesion(boids);
    // this.turnAngle = Math.atan2(cohesion.y, cohesion.x);
    // this.turnAngle /= limitTurnForce;
    // this.radians += this.toRadians(this.turnAngle);
  }

  alignment(boids) {
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
          x: this.position.x - other.position.x,
          y: this.position.y - other.position.y,
        };
        // distance between 2 boids:
        const dst = Math.hypot(diff.x, diff.y);
        
        // normalise vecA:
        normalise(diff, dst);
        
        // dot product between vecA and vecB:
        let dp = dot(diff, this.velocity);
  
        // check if boid is within other's radius:
        let isInsideRadius = dst < this.perceptionRadius;
        // check if boid comes within the view angle defined:
        let isInsideAngle = Math.abs(Math.acos(dp)) < this.perceptionArc;
        this.isInsideArc = isInsideRadius && isInsideAngle;
  
        // only true if boid is within other's radius AND perception arc:
        if (this.isInsideArc) {
          this.add2DVec(steering, other.velocity);
          total++;
        }
      }
      else 
        continue;
    }

    if (total > 0) {
      normalise(steering, total);
      this.sub2DVec(steering, this.velocity);
      let hypot = Math.hypot(steering.x, steering.y);
      this.clamp(hypot, 0, this.maxForce);

      console.log(hypot);
    }
    return steering;
  }

  clamp(num, min, max) {
    return Math.max(min, Math.min(num, max));
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
          dx: this.position.x - other.position.x,
          dy: this.position.y - other.position.y,
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
          dx: this.position.x - other.position.x,
          dy: this.position.y - other.position.y,
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
    // this.x += Math.cos(this.radians) * this.speed;
    // this.y += Math.sin(this.radians) * this.speed;

    // update position:
    this.add2DVec(this.position, this.velocity);

    // update velocity:
    this.add2DVec(this.velocity, this.acceleration);

    // screen wrapping:
    // if boid goes off screen, wrap its position to the other side:
    // horizontal wrap:
    if      (this.position.x + this.width < 0)           this.position.x = canvasWidth + this.width;
    else if (this.position.x - this.width > canvasWidth) this.position.x = 0 - this.width;
    // vertical wrap:
    if      (this.position.y + this.height < 0)            this.position.y = canvasHeight + this.height;
    else if (this.position.y - this.height > canvasHeight) this.position.y = 0 - this.height;
  }
    
  draw(ctx) {
    ctx.save();
    ctx.translate(this.position.x, this.position.y);    // realign origin to center of current boid.
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

  /*** helper methods: ***/
  add2DVec(vec1, vec2) {
    vec1.x += vec2.x; 
    vec1.y += vec2.y;
  }

  sub2DVec(vec1, vec2) {
    vec1.x -= vec2.x; 
    vec1.y -= vec2.y;
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
};

// utility functions:
function normalise(vec, dst) {
  vec.x /= dst, vec.y /= dst;
}

function dot(vec1, vec2) {
  return vec1.x*vec2.x + vec1.y*vec2.y;
}
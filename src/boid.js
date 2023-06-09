import { canvasWidth, canvasHeight } from './app.js';

// singular boid blueprint
export default class Boid {
  // setup each point of triangle
  constructor() {
    this.width = 5;
    this.height = 7;
    this.perceptionRadius = 100;    // boid view angle radius
    this.perceptionArc = 2.0;
    this.turnAngle = 0.0;
    this.target = false;

    // boid will be facing random direction: 
    this.angle = getRandomNumber(0, 360);
    this.radians = toRadians(this.angle);

    /* tunable forces */
    // boid behaviour:
    this.avoidForce = 0.08;     // separation force
    this.alignForce = 0.08;      // alignment force
    this.centerForce = 0.02;   // cohesion force

    this.maxSpeed = 3.0;

    // generate random starting positions for boids:
    this.position = { 
      x: getRandomNumber(0, canvasWidth),
      y: getRandomNumber(0, canvasHeight)
    };

    // set velocity of each boid based on its direction:
    this.velocity = { 
      x: toRadians(getRandomNumber(-180, 180)) * this.maxSpeed,
      y: toRadians(getRandomNumber(-180, 180)) * this.maxSpeed
    };

    this.acceleration = { 
      x: toRadians(getRandomNumber(-180, 180)) * this.maxSpeed, 
      y: toRadians(getRandomNumber(-180, 180)) * this.maxSpeed
    };
  }

  flock(boids) {
    let alignment = this.alignment(boids);
    let cohesion = this.cohesion(boids);
    let separation = this.separation(boids);

    add2DVec(this.acceleration, alignment);
    add2DVec(this.acceleration, cohesion);
    add2DVec(this.acceleration, separation);
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
        let isInsideArc = isInsideRadius && isInsideAngle;
        
        // only true if boid is within other's radius AND perception arc:
        if (isInsideArc) {
          add2DVec(steering, other.velocity);
          total++;
        }
      }
      else 
        continue;
    }
    
    if (total > 0) {
      // says normalise but it calculates average...
      normalise(steering, total);

      // set vec magnitude to max speed - to avoid slowing down: 
      let mag = Math.hypot(steering.x, steering.y);
      setMag(steering, this.maxSpeed, mag);
      
      sub2DVec(steering, this.velocity);
      
      // limits magnitude to a force (tunable to achieve stronger/weaker behaviour):
      steering = clampVec(steering, -this.alignForce, this.alignForce);
    }
    return steering;
  }

  cohesion(boids) {
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
        let isInsideArc = isInsideRadius && isInsideAngle;
  
        // only true if boid is within other's radius AND perception arc:
        if (isInsideArc) {
          add2DVec(steering, other.position);
          total++;
        }
      }
      else 
        continue;
    }

    if (total > 0) {
      normalise(steering, total);
      sub2DVec(steering, this.position);
      sub2DVec(steering, this.velocity);
      
      // set vec magnitude to max speed - to avoid slowing down: 
      let mag = Math.hypot(steering.x, steering.y);
      setMag(steering, this.maxSpeed, mag);
      
      // limits magnitude to a force (tunable to achieve stronger/weaker behaviour):
      steering = clampVec(steering, -this.centerForce, this.centerForce);
    }
    return steering;
  }
  
  separation(boids) {
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
        let isInsideArc = isInsideRadius && isInsideAngle;
        
        // only true if boid is within other's radius AND perception arc:
        if (isInsideArc) {
          add2DVec(steering, diff);
          total++;
        }
      }
      else 
        continue;
    }
    
    if (total > 0) {
      normalise(steering, total);
      sub2DVec(steering, this.velocity);
      
      // set vec magnitude to max speed - to avoid slowing down:
      let mag = Math.hypot(steering.x, steering.y);
      setMag(steering, this.maxSpeed, mag);
      
      // limits magnitude to a force (tunable to achieve stronger/weaker behaviour):
      steering = clampVec(steering, -this.avoidForce, this.avoidForce);
    }
    return steering;
  }
  
  update() {
    // update position based on velocity:
    add2DVec(this.position, this.velocity);
    
    // update velocity based on acceleration:
    add2DVec(this.velocity, this.acceleration);
    
    this.turnAngle = Math.atan2(this.velocity.y, this.velocity.x);
    this.radians = this.turnAngle;
    
    // limit to max speed:
    this.velocity = clampVec(this.velocity, -this.maxSpeed, this.maxSpeed);
    
    // reset acceleration:
    this.acceleration.x = 0;
    this.acceleration.y = 0;
    
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
};

/* utility functions: */
// limit a vector (x, y) within a given range:
function clampVec(num, min, max) {
  return { 
    x: Math.max(min, Math.min(num.x, max)), 
    y: Math.max(min, Math.min(num.y, max)) 
  };
}

// vector operations:
function add2DVec(vec1, vec2) {
  vec1.x += vec2.x; 
  vec1.y += vec2.y;
}

function sub2DVec(vec1, vec2) {
  vec1.x -= vec2.x; 
  vec1.y -= vec2.y;
}

// degree -> radians conversion:
function toRadians(degree) {
  return degree * Math.PI / 180;
}

// return random between a given range:
function getRandomNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function normalise(vec, dst) {
  vec.x /= dst, vec.y /= dst;
}

function setMag(vec, newMag, currMag) {
  vec.x = vec.x * newMag / currMag;
  vec.y = vec.y * newMag / currMag;
}

// dot product
function dot(vec1, vec2) {
  return vec1.x*vec2.x + vec1.y*vec2.y;
}
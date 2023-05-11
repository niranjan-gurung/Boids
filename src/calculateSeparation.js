export function insideViewAngle(boids) {
  // vecA:
  // - used as the distance between 2 boids.
  // - also gives us direction from 'other' boid to 'main' boid.
  //    - this is used to turn 'main' boid in opposite direction to 'other' boid.  
  let diff = {
    dx: (boids[1].x) - (boids[0].x),
    dy: (boids[1].y) - (boids[0].y),
  };
  // distance between 2 boids:
  let dst = Math.sqrt(diff.dx*diff.dx + diff.dy*diff.dy);

  // normalise vecA:
  normalise(diff, dst);

  const currentBoidAngle = boids[0].radians;
  //const otherBoidAngle = boids[1].radians;
  const perceptionRadius = 95.0;
  const boidViewAngle = 1.0;

  // get main boid's current direction:
  // vecB:
  let currentBoidDir = {
    x: Math.cos(currentBoidAngle), 
    y: Math.sin(currentBoidAngle),
  };

  // dot product between vecA and vecB:
  let dp = dot(diff, currentBoidDir);
  
  // check if boid is within other's radius:
  let isInsideRadius = dst < perceptionRadius;
  // check if boid comes within the view angle defined:
  let isInsideAngle = Math.abs(Math.acos(dp)) < boidViewAngle;
  let isInsideArc = isInsideRadius && isInsideAngle;
  
  // only true if boid is within other's radius AND view angle:
  if (isInsideArc) {
    // apply opposite direction vector (steer away from other boids):
    boids[0].x += -diff.dx;
    boids[0].y += -diff.dy;
    
    /* used for alignment possibly:
     * boid follows nearby boid! 
     */
    // boids[0].radians = Math.atan2(diff.dy, diff.dx); 
    
    // bool flag to trigger direction change...
    boids[0].isInsideViewAngle = true;

    return true; 
  }
  else { 
    boids[0].isInsideViewAngle = false;
    return false; 
  }
}

export function drawDetectionLines(boids, ctx) {
  ctx.beginPath();
  ctx.moveTo(boids[0].x, boids[0].y);
  ctx.lineTo(boids[1].x, boids[1].y);
  ctx.strokeStyle = "rgba(222, 27, 27, 1)";
  ctx.stroke();
}

// utility functions:
function normalise(vec, dst) {
  vec.dx /= dst, vec.dy /= dst;
}

function dot(vec1, vec2) {
  return vec1.dx*vec2.x + vec1.dy*vec2.y;
}
export function insideViewAngle(boids) {
  
  const perceptionRadius = 100.0;
  const boidViewAngle = 1.0;

  for (let i = 0; i < boids.length; i++) {

    const currentBoidRotation = boids[i].radians;
    // get main boid's current direction:
    // vecB:
    let currentBoidDir = {
      x: Math.cos(currentBoidRotation), 
      y: Math.sin(currentBoidRotation),
    };
    
    for (let j = 1; j < boids.length; j++) {
      
      // vecA:
      // - used as the distance between 2 boids.
      // - also gives us direction pointing from 'us' to the 'other' boid.
      //    - this is used to turn 'us' in opposite direction to 'other' boid. 
      let diff = {
        dx: (boids[j].x) - (boids[i].x),
        dy: (boids[j].y) - (boids[i].y),
      };
      // distance between 2 boids:
      const dst = Math.sqrt(diff.dx*diff.dx + diff.dy*diff.dy);
      
      // normalise vecA:
      normalise(diff, dst);
    
      // dot product between vecA and vecB:
      let dp = dot(diff, currentBoidDir);
    
      // check if boid is within other's radius:
      let isInsideRadius = dst < perceptionRadius;
      // check if boid comes within the view angle defined:
      let isInsideAngle = Math.abs(Math.acos(dp)) < boidViewAngle;
      let isInsideArc = isInsideRadius && isInsideAngle;
    
      // only true if boid is within other's radius AND view angle:
      if (isInsideArc) {
        // dir = opposite distance direction:
        boids[j].dir = Math.atan2(diff.dy, diff.dx);
        boids[i].dir = -Math.atan2(diff.dy, diff.dx);
        
        /* used for alignment possibly:
        * boid follows nearby boid! 
        */
        // boids[0].radians = Math.atan2(diff.dy, diff.dx); 
        
        // bool flag to trigger direction change...
        boids[j].isInsideViewAngle = true;
        boids[i].isInsideViewAngle = true;
      }
      else { 
        boids[j].isInsideViewAngle = false;
        boids[i].isInsideViewAngle = false;
      }
    }
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
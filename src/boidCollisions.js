export function insideViewAngle(boids) {
  // distance between 2 boids:
  // vecA:
  let dx = (boids[1].x) - (boids[0].x);
  let dy = (boids[1].y) - (boids[0].y); 
  let distance = Math.sqrt(dx*dx + dy*dy);

  // normalise vecA:
  dx /= distance, dy /= distance;

  const boidAngle = boids[0].radians;
  const boidRadius = 100.0;
  const boidViewAngle = 1.0;

  // get main boid's current direction:
  // vecB:
  let currentBoidDir = {
    x: Math.cos(boidAngle), 
    y: Math.sin(boidAngle),
  };

  // dot product between vecA and vecB:
  let dot = dx*currentBoidDir.x + dy*currentBoidDir.y;

  // check if boid is within other's radius:
  let isInsideRadius = distance < boidRadius;
  // check if boid comes within the view angle defined:
  let isInsideAngle = Math.abs(Math.acos(dot)) < boidViewAngle;
  let isInsideArc = isInsideRadius && isInsideAngle;

  // only true if boid is within other's radius AND view angle:
  if (isInsideArc) return true;
}

export function drawDetectionLines(boids, ctx) {
  ctx.beginPath();
  ctx.moveTo(boids[0].x, boids[0].y);
  ctx.lineTo(boids[1].x, boids[1].y);
  ctx.strokeStyle = "rgba(222, 27, 27, 1)";
  ctx.stroke();
}
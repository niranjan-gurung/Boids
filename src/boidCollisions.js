export function insideViewAngle(boids) {
  // check if boid comes within the view angle defined (ignore if not)
  //let distance = distanceBetweenBoids(boids[0], boids[1]);
  
  let dx = (boids[1].x) - (boids[0].x);
  let dy = (boids[1].y) - (boids[0].y); 
  let distance = Math.sqrt(dx*dx + dy*dy);

  dx /= distance;
  dy /= distance;

  const boidAngle = boids[0].radians;
  const boidRadius = 100;
  const boidViewAngle = 1;


  let arcStartX = Math.sin(boidAngle);
  let arcStartY = -Math.cos(boidAngle);
  arcStartX /= distance;
  arcStartY /= distance;

  // dot product:
  //let dp = dx*bx + dx*by;
  let dp = arcStartX*dx + arcStartY*dy;

  let arcLength = boidViewAngle/2;

  let isInsideRadius = distance < boidRadius;
  //let isInsideAngle = Math.acos(dx*bx + dy*by) < arcLength;
  let isInsideAngle = Math.abs(Math.acos(dp)) < boidViewAngle;
  let isInsideArc = isInsideRadius && isInsideAngle;
  // detects if boid is within its circle radius!
  // doesn't detect if boid is within the view angle
  if (isInsideArc) {
    return true;
  }
}

// export function drawOutline(boids, ctx) {
//   const boidAngle = boids[1].radians;
//   const boidRadius = boids[1].radius;
//   const boidViewAngle = boids[1].viewAngle;
//   ctx.beginPath();
//   ctx.moveTo(boids[1].x, boids[1].y);
//   ctx.arc(boids[1].x, boids[1].y, boidRadius, boidAngle-boidViewAngle, boidAngle+boidViewAngle);
//   ctx.strokeStyle = "black";
//   ctx.closePath();
//   ctx.stroke();
// }

export function drawDetectionLines(boids, ctx) {
  ctx.beginPath();
  ctx.moveTo(boids[0].x, boids[0].y);
  ctx.lineTo(boids[1].x, boids[1].y);
  ctx.strokeStyle = "rgba(222, 27, 27, 1)";
  ctx.stroke();
}

function distanceBetweenBoids(b1, b2) {
  let dx = (b2.x) - (b1.x);
  let dy = (b2.y) - (b1.y); 
  return Math.sqrt(dx*dx + dy*dy);
}
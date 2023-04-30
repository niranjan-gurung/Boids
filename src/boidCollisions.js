export function insideViewAngle(boids) {
  // check if boid comes within the view angle defined (ignore if not)
  let distance = distanceBetweenBoids(boids[0], boids[1]);

  let isInsideRadius = distance < boids[0].radius;

  // detects if boid is within its circle radius!
  // doesn't detect if boid is within the view angle
  if (isInsideRadius) {
    return true;
  }

  // ctx.beginPath();
  // ctx.moveTo(boids[1].x, boids[1].y);
  // ctx.arc(boids[1].x, boids[1].y, radius, angle-arcEnd, angle+arcEnd);
  // ctx.strokeStyle = "black";
  // ctx.closePath();
  // ctx.stroke();
}

export function drawDetectionLines(boids, ctx) {
  ctx.beginPath();
  ctx.moveTo(boids[0].x, boids[0].y);
  ctx.lineTo(boids[1].x, boids[1].y);
  ctx.strokeStyle = "rgba(222, 27, 27, 0.5)";
  ctx.stroke();
}

function distanceBetweenBoids(b1, b2) {
  let dx = (b2.x) - (b1.x);
  let dy = (b2.y) - (b1.y); 
  return Math.sqrt(dx*dx + dy*dy);
}
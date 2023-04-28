import Entity from './entity.js';

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

// populate boids:
let boids = [];
for (let i = 0; i < 10; i++) {
  boids[i] = new Entity();
}
boids[1].target = true;

function insideViewAngle() {
  // check if boid comes within the view angle defined (ignore if not)
  return true; 
}

function detectSurroundingBoids(boid) {
  // not fully working (doesn't compare all boids):  
  for (let i = 0; i < boids.length; i++) {
    for (let j = 1; j < boids.length; j++) {
      let dx = (boid[i].x) - (boid[j].x);
      let dy = (boid[i].y) - (boid[j].y);
      let distance = Math.sqrt(dx*dx + dy*dy);
  
      if (distance < boid[i].radius + boid[j].radius && insideViewAngle()) {
        // red line between boids within each others view angles: 
        ctx.beginPath();
        ctx.moveTo(boid[i].x, boid[i].y);
        ctx.lineTo(boid[j].x, boid[j].y);
        ctx.strokeStyle = "rgba(222, 27, 27, 0.5)";
        ctx.stroke();
        return true;
      }
      else 
        return false;
    }
  }
}

/* main loop */
(function update() {
  clearScreen();
  
  boids.forEach(element => {
    element.move();
    element.draw(ctx);
  });
  
  if (detectSurroundingBoids(boids)) {
    // change direction...
  }
  
  requestAnimationFrame(update);
})();

// helper functions:
function clearScreen() {
  ctx.fillStyle = "#687782";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}

// exports:
export { canvasWidth, canvasHeight };
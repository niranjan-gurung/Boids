import Entity from './entity.js';
import { insideViewAngle, drawDetectionLines } from './boidCollisions.js';

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

// populate boids:
let boids = [];
for (let i = 0; i < 2; i++) {
  boids[i] = new Entity();
}
boids[1].target = true;

/* main loop */
(function update() {
  clearScreen();
  
  boids.forEach(element => {
    element.move();
    element.draw(ctx);
  });
  
  // if boids are inside each other's view angle, then change direction: 
  if (insideViewAngle(boids)) {
    // red line connection:
    drawDetectionLines(boids, ctx);

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
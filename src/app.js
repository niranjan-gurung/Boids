import Boid from './boid.js';

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

// populate boids:
let boids = [];
for (let i = 0; i < 100; i++) {
  boids.push(new Boid());
}
boids[0].target = true;

/* main loop */
(function update() {
  clearScreen();
  
  boids.forEach(element => {
    element.flock(boids);
    element.update();
    element.draw(ctx);
  });
  
  requestAnimationFrame(update);
})();

// helper functions:
function clearScreen() {
  ctx.fillStyle = "#687782";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}

// exports:
export { canvasWidth, canvasHeight };
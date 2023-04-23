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

console.log(boids);

/* main loop */
(function update() {
  clearScreen();

  boids.forEach(element => {
    element.move();
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
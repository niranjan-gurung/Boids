import Entity from './entity.js';

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

// test points:
const boids = new Entity();

/* main loop */
(function update() {
  clearScreen();
  boids.move();
  boids.draw(ctx);
  requestAnimationFrame(update);
})();

// helper functions:
function clearScreen() {
  ctx.fillStyle = "#687782";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}

// exports:
export { canvasWidth, canvasHeight };
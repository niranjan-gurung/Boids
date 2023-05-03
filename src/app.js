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
boids[0].target = true;


var bounds = {top: 0.0, left: 0.0};
var circle = {
  x: (canvasWidth * 0.5)|0,
  y: (canvasHeight * 0.5)|0,
  radius: 50.0,
  rotation: 0.0, // In Radians
  arcSize: 1.0
};

var point = {
  x: 0.0,
  y: 0.0
};

window.onmousemove = function(e) {
  point.x = e.clientX - bounds.left;
  point.y = e.clientY - bounds.top;
}

// runs after the page has loaded
window.onload = function() {
  //canvas = document.getElementById("canvas");
  // canvas.width = canvasWidth;
  // canvas.height = canvasHeight;
  bounds = canvas.getBoundingClientRect();
  //ctx = canvas.getContext("2d");
  update();
}

/* main loop */
function update() {
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
};

// helper functions:
function clearScreen() {
  ctx.fillStyle = "#687782";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}

// exports:
export { canvasWidth, canvasHeight };
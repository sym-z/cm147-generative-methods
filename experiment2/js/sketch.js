// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
const VALUE1 = 1;
const VALUE2 = 2;

const WATER = [0, 0, 255, 255];
const LAND = [0, 255, 0, 255];
const SKY = [255, 0, 0, 255];

// Globals
let canvasContainer;
let canvas;
var centerHorz, centerVert;

// setup() function is called once when the program starts
function setup() {
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic

  paint();
}
function paint(){
  drawWater();
  drawRocks();
}
const ROCK_COUNT_MIN = 5;
const ROCK_COUNT_MAX = 20;
const ROCK_COLOR = [133, 75, 48, 180];
const ROCK_THICK_MIN = 20;
const ROCK_THICK_MAX = 45;
function drawRocks() {
  noStroke();
  randomSeed(millis());
  let numRocks = random(ROCK_COUNT_MIN,ROCK_COUNT_MAX)
  for (let i = 0; i < numRocks; i++) {
    let randomX = random(canvas.width);
    let randomY = random(canvas.height);
    let randomW = random(ROCK_THICK_MIN, ROCK_THICK_MAX);
    let randomH = random(ROCK_THICK_MIN, ROCK_THICK_MAX);
    fill(ROCK_COLOR);
    arc(randomX, randomY, randomW, randomH,PI, 0);
    console.log(`drawing rock at ${randomX},${randomY}`)
  }
}
function drawWater() {
  noStroke();
  noiseSeed(millis());
  let noiseLevel = 255;
  let noiseScale = 0.055;
  let brightness = 165;
  let tileW = 5;
  let tileH = 5;
  for (let x = 0; x < canvas.width; x += tileW) {
    for (let y = 0; y < canvas.height; y += tileH) {
      let nx = noiseScale * x;
      let ny = noiseScale * y;
      let c = 255 * noise(nx, ny) + brightness;
      let color = [c / 4, c / 1.5, c, 255];
      fill(color);
      rect(x, y, x + tileW, y + tileH);
    }
  }
}
// draw() function is called repeatedly, it's the main animation loop
function draw() {
  //drawWater();
}

function mousePressed() {
  paint();
}

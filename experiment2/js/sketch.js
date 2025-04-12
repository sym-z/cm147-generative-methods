// sketch.js - purpose and description here
// Author: Your Name
// Date:

// LAND LEVELS
const SEA_LEVEL = 128;
const SEA_THICK = 256;
const SKY_THICK = 64;
let bgHeight;
const BG_THICK = 64;
let mgHeight;
const MG_THICK = 64;
let fgHeight;
const FG_THICK = 64;

// COLORS
const WATER = [0.25, 0.66, 1, 1];
const SKY = [0.4, 0.48, 0.6, 1];
const LAND = [0, 255, 0, 255];
const LAND2 = [255, 255, 0, 150];
const LAND3 = [255, 0, 0, 150];

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
function paint() {
  drawSky();
  drawWater();
  drawBackground();
  drawMidground();
  drawForeground();
  drawRocks();
}
// Trees
function drawBackground(){
  bgHeight = random(SKY_THICK,SEA_LEVEL)
  fill(LAND);
  beginShape();
  vertex(0,bgHeight);
  vertex(canvas.width,bgHeight);
  vertex(canvas.width,bgHeight+BG_THICK);
  vertex(0,bgHeight+BG_THICK);
  endShape(CLOSE);
}
// Far Coast
function drawMidground(){
  mgHeight = random(bgHeight,bgHeight+BG_THICK)
  fill(LAND2);
  beginShape();
  vertex(0,mgHeight);
  vertex(canvas.width,mgHeight);
  vertex(canvas.width,mgHeight+MG_THICK);
  vertex(0,mgHeight+MG_THICK);
  endShape(CLOSE);

}
// Close coast
function drawForeground(){
  fgHeight = random(mgHeight+MG_THICK+SEA_THICK,canvas.height-FG_THICK)
  fill(LAND3);
  beginShape();
  vertex(0,fgHeight);
  vertex(canvas.width,fgHeight);
  vertex(canvas.width,canvas.height);
  vertex(0,canvas.height);
  endShape(CLOSE);
}
const ROCK_COUNT_MIN = 5;
const ROCK_COUNT_MAX = 20;
const ROCK_COLOR = [70, 60, 52, 255];
const ROCK_THICK_MIN = 20;
const ROCK_THICK_MAX = 45;
let rockSeed = 265;
function drawRocks() {
  randomSeed(rockSeed);
  noStroke();
  let numRocks = random(ROCK_COUNT_MIN, ROCK_COUNT_MAX);
  for (let i = 0; i < numRocks; i++) {
    let randomX = random(canvas.width);
    let randomY = random(mgHeight+MG_THICK+ROCK_THICK_MAX, fgHeight);
    let randomW = random(ROCK_THICK_MIN, ROCK_THICK_MAX);
    let randomH = random(ROCK_THICK_MIN, ROCK_THICK_MAX);
    fill(ROCK_COLOR);
    let offset = sin(millis() / 800);
    offset = constrain(offset, -PI / 4, PI / 4);
    arc(randomX, randomY, randomW, randomH, PI - offset, 0 + offset, OPEN);
    console.log(`drawing rock at ${randomX},${randomY}`);
  }
}
const FOAM_LEVEL = 180;
function drawWater() {
  noStroke();
  let noiseLevel = 255;
  let noiseScale = 0.055;
  let brightness = 165;
  let tileW = 6;
  let tileH = 6;
  for (let x = 0; x < canvas.width; x += tileW) {
    for (let y = SEA_LEVEL; y < canvas.height; y += tileH) {
      let nx = noiseScale * x;
      let ny = noiseScale * y;
      let c = noiseLevel * noise(nx, ny);
      let color = [];
      if (c < FOAM_LEVEL) {
        c += brightness;
        WATER.forEach((item, index) => {
          color.push(c * item);
        });
      } else {
        color = 255;
      }
      fill(color);
      rect(x, y, x + tileW, y + tileH);
    }
  }
}
const CLOUD_BRIGHTNESS = 150;
function drawSky() {
  noStroke();
  let noiseLevel = 255;
  let noiseScale = 0.055;
  let brightness = 140;
  let tileW = 7;
  let tileH = 7;
  for (let x = 0; x < canvas.width; x += tileW) {
    for (let y = 0; y < canvas.height; y += tileH) {
      let nx = noiseScale * x;
      let ny = noiseScale * y;
      let c = noiseLevel * noise(nx, ny);
      let color = [];
      if (c < CLOUD_BRIGHTNESS) {
        c += brightness;
        SKY.forEach((item, index) => {
          color.push(c * item);
        });
      } else {
        color = c + brightness;
      }
      fill(color);
      rect(x, y, x + tileW, y + tileH);
    }
  }
}
// draw() function is called repeatedly, it's the main animation loop
function draw() {
  clear();
  paint();
}

function mousePressed() {
  noiseSeed(millis());
  rockSeed = millis();
  paint();
}

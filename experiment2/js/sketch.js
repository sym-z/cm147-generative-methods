// sketch.js - purpose and description here
// Author: Your Name
// Date:

// LAND LEVELS
const SEA_LEVEL = 128;
const SEA_THICK = 256;
const SKY_THICK = 64;
let bgHeight;
const BG_THICK = 32;
let mgHeight;
const MG_THICK = 64;
let fgHeight;
const FG_THICK = 64;

// HORIZON DRAWING
const LAND_LOD = 5;

// COLORS
const WATER = [0.25, 0.66, 1, 1];
const SKY = [0.4, 0.48, 0.6, 1];
const FG_COLOR = [156, 138, 117, 255];
const MG_COLOR = [103, 102, 87, 255];
const BG_COLOR = [70, 89, 56, 255];

// Globals
let canvasContainer;
let canvas;
var centerHorz, centerVert;

// Randomization
let seed = 265;
let mgSeed = 264;
let bgSeed = 512;
let fgSeed = 420;
// setup() function is called once when the program starts
function setup() {
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic

  //paint();
}
function paint() {
  drawSky();
  drawWater();
  drawBackground();
  drawMidground();
  drawForeground();
  drawRocks();
  addSunlight();
}
function addSunlight()
{
  let sunLevel = random(70,150)
  let sunSlope = random(0.7,1.5)
  for(let x = 0; x < canvas.width; x+=10)
  {
    for (let y = 0; y < canvas.height; y+=10)
    {
      if(y > x/sunSlope)
      {
        fill(255,255,255,sunLevel)
        rect(x,y,10,10)
      }
    }
  }
}
// Trees
function drawBackground() {
  randomSeed(seed);
  noiseSeed(bgSeed);
  bgHeight = random(SKY_THICK, SEA_LEVEL);
  fill(BG_COLOR);
  beginShape();
  // TOP SIDE
  for (let x = LAND_LOD; x < canvas.width + LAND_LOD; x += LAND_LOD) {
    let y = bgHeight;
    let noiseScale = 0.08;
    let nx = x * noiseScale;
    let noiseVal = BG_THICK * noise(nx);
    let xPos = x;
    if (x == LAND_LOD) {
      xPos = 0;
    }
    let yPos = y + noiseVal;
    vertex(xPos, yPos);
  }
  // BOTTOM SIDE
  for (let x = canvas.width + LAND_LOD; x >= 0 - LAND_LOD; x -= LAND_LOD) {
    let y = bgHeight + BG_THICK / 2;
    let noiseScale = 0.01;
    let nx = x * noiseScale;
    let noiseVal = BG_THICK * noise(nx);
    let yPos = y + noiseVal + BG_THICK;
    vertex(x, yPos);
  }
  endShape(TRIANGLE_FAN);
}
// Far Coast
// First draw a line that cuts through the center of the background, then draw the underside of the midground
function drawMidground() {
  randomSeed(seed);
  noiseSeed(mgSeed);
  mgHeight = bgHeight;
  fill(MG_COLOR);
  beginShape();
  // TOP SIDE
  for (let x = LAND_LOD; x < canvas.width + LAND_LOD; x += LAND_LOD) {
    let y = mgHeight;
    let noiseScale = 0.08;
    let nx = x * noiseScale;
    let noiseVal = MG_THICK * noise(nx);
    let xPos = x;
    if (x == LAND_LOD) {
      xPos = 0;
    }
    let yPos = y + noiseVal;
    vertex(xPos, yPos);
  }
  // BOTTOM SIDE
  for (let x = canvas.width + LAND_LOD; x >= 0 - LAND_LOD; x -= LAND_LOD) {
    let y = mgHeight + MG_THICK / 2;
    let noiseScale = 0.01;
    let nx = x * noiseScale;
    let noiseVal = MG_THICK * noise(nx);
    let yPos = y + noiseVal + MG_THICK;
    vertex(x, yPos);
  }
  // vertex(0, mgHeight);
  // vertex(canvas.width, mgHeight);
  // vertex(canvas.width, mgHeight + MG_THICK);
  // vertex(0, mgHeight + MG_THICK);
  endShape(CLOSE);
}
// Close coast
const FG_SLOPE_FACTOR = 5;
function drawForeground() {
  randomSeed(seed);
  noiseSeed(fgSeed);
  // fgHeight = random(mgHeight + MG_THICK + SEA_THICK, canvas.height - FG_THICK);
  fgHeight = canvas.height - FG_THICK;
  fill(FG_COLOR);
  beginShape();

  // TOP SIDE
  for (let x = LAND_LOD; x < canvas.width + LAND_LOD; x += LAND_LOD) {
    let y = fgHeight;
    let noiseScale = 0.08;
    let nx = x * noiseScale;
    let noiseVal = FG_THICK * noise(nx);
    let xPos = x;
    if (x == LAND_LOD) {
      xPos = 0;
    }
    let yPos = y + noiseVal - x/FG_SLOPE_FACTOR;
    vertex(xPos, yPos);
  }
  // BOTTOM SIDE
  vertex(canvas.width + LAND_LOD,canvas.height+LAND_LOD);
  vertex(-LAND_LOD,canvas.height+LAND_LOD);
  // for (let x = canvas.width + LAND_LOD; x >= 0 - LAND_LOD; x -= LAND_LOD) {
  //   let y = fgHeight + FG_THICK / 2;
  //   let noiseScale = 0.01;
  //   let nx = x * noiseScale;
  //   let noiseVal = FG_THICK * noise(nx);
  //   let yPos = y + noiseVal + FG_THICK;
  //   vertex(x, yPos);
  // }
  endShape(CLOSE);
}
const ROCK_COUNT_MIN = 5;
const ROCK_COUNT_MAX = 20;
const ROCK_COLOR = [70, 60, 52, 255];
const ROCK_THICK_MIN = 20;
const ROCK_THICK_MAX = 45;
function drawRocks() {
  randomSeed(seed);
  noStroke();
  let numRocks = random(ROCK_COUNT_MIN, ROCK_COUNT_MAX);
  for (let i = 0; i < numRocks; i++) {
    let randomX = random(canvas.width);
    let randomY = random(mgHeight + MG_THICK + ROCK_THICK_MAX * 2, fgHeight-fgHeight/FG_SLOPE_FACTOR);
    let randomW = random(ROCK_THICK_MIN, ROCK_THICK_MAX);
    let randomH = random(ROCK_THICK_MIN, ROCK_THICK_MAX);
    fill(ROCK_COLOR);
    let offset = sin(millis() / 800);
    offset = constrain(offset, -PI / 4, PI / 4);
    arc(randomX, randomY, randomW, randomH, PI - offset, 0 + offset, OPEN);
    // console.log(`drawing rock at ${randomX},${randomY}`);
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
    for (let y = mgHeight + MG_THICK; y < canvas.height; y += tileH) {
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
  bgSeed = millis();
  mgSeed = millis() + frameCount;
  fgSeed = millis() * random(0.2,0.9)
  seed = millis();
  paint();
}

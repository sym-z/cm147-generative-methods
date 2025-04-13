// sketch.js - Living Impressions: Sea Ranch, CA
// Author: Jack Sims
// Date: 14 April 2025

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
const GRASS_COLOR = [112, 147, 80, 180];
const FLOWER_COLOR = [196, 90, 180, 150];
const STONE_COLOR = [71, 71, 71, 45];

// Globals
let canvasContainer;
let canvas;

// Randomization
let seed = 265;
let mgSeed = 264;
let bgSeed = 512;
let fgSeed = 420;

function setup() {
  canvasContainer = $("#canvas-container");
  canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
}
let night = false;
function paint() {
  drawSky();
  drawWater();
  drawBackground();
  drawMidground();
  drawForeground();
  drawRocks();
  addFoliage();
  drawStrata();
  if (!night) {
    addSunlight();
  } else {
    nightTime();
  }
}

function draw() {
  clear();
  paint();
}

function mousePressed() {
  night = !night;
  noiseSeed(millis());
  bgSeed = millis();
  mgSeed = millis() + frameCount;
  fgSeed = millis() * random(0.2, 0.9);
  seed = millis();
  paint();
}

function addFoliage() {
  let flowerCount = 0;
  let maxFlowers = 50;
  fill(GRASS_COLOR);
  let flowerBoundaryX = canvas.width / 2;
  let flowerBoundaryY = canvas.height - FG_THICK;
  let grassBoundaryX = 256;
  let grassBoundaryY = 24;
  rect(flowerBoundaryX, flowerBoundaryY, canvas.width / 2, FG_THICK);
  triangle(
    flowerBoundaryX,
    flowerBoundaryY,
    flowerBoundaryX,
    canvas.height,
    flowerBoundaryX - grassBoundaryX,
    canvas.height
  );
  triangle(
    flowerBoundaryX,
    flowerBoundaryY,
    canvas.width,
    flowerBoundaryY - grassBoundaryY,
    canvas.width,
    flowerBoundaryY
  );
  // TODO: Multiple Flower colors
  fill(FLOWER_COLOR);
  while (flowerCount < maxFlowers) {
    let xPos = random(flowerBoundaryX, canvas.width);
    let yPos = random(flowerBoundaryY, canvas.height);
    rect(xPos, yPos, 5, 8);
    flowerCount++;
  }
}
function nightTime() {
  let nightShade = [0, 0, 0, 100];
  fill(nightShade);
  rect(0, 0, canvas.width, canvas.height);
  night = true;
}
function drawStrata() {
  fill(STONE_COLOR);
  let stoneBorderDarkening = 0.95;
  let stoneBorderColor = [];
  STONE_COLOR.forEach((channel, index) => {
    if (index < 3) {
      stoneBorderColor.push(channel * stoneBorderDarkening);
    } else {
      stoneBorderColor.push(channel);
    }
  });
  stroke(stoneBorderColor);
  let blurFactor = 15;
  strokeWeight(blurFactor);
  let stoneThickness = 32;
  let slateSize = 4;
  let slateSlant = random(0, 12);
  let stoneMinY = mgHeight + MG_THICK;
  beginShape(QUAD_STRIP);
  vertex(0, stoneMinY);
  vertex(canvas.width, stoneMinY + slateSlant);
  for (let i = 0; i < stoneThickness; i += slateSize) {
    vertex(0, stoneMinY + i);
    vertex(canvas.width, stoneMinY + i + slateSlant);
  }
  endShape();
  noStroke();
}

function addSunlight() {
  let sunLevel = random(70, 150);
  let sunSlope = random(0.2, 0.95);
  sunSlope += sin(millis() / 3000);
  sunSlope = constrain(sunSlope, 0.2, 1.1);
  for (let x = 0; x < canvas.width; x += 10) {
    for (let y = 0; y < canvas.height; y += 10) {
      if (y > x / sunSlope) {
        fill(255, 255, 255, sunLevel);
        rect(x, y, 10, 10);
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
  let bgBorderShift = 0.85;
  let bgBorderColor = [];
  BG_COLOR.forEach((channel, index) => {
    if (index < 3) {
      bgBorderColor.push(channel * bgBorderShift);
    } else {
      bgBorderColor.push(channel);
    }
  });
  stroke(bgBorderColor);
  let bgBorderWeight = 1;
  strokeWeight(bgBorderWeight);
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
    let y = bgHeight + BG_THICK;
    let noiseScale = 0.01;
    let nx = x * noiseScale;
    let noiseVal = BG_THICK * noise(nx);
    let yPos = y + noiseVal + BG_THICK;
    vertex(x, yPos);
  }
  endShape();
  noStroke();
}

// Far Coast
// First draw a line that cuts through the center of the background, then draw the underside of the midground
function drawMidground() {
  randomSeed(seed);
  noiseSeed(mgSeed);
  mgHeight = bgHeight + BG_THICK / 2;
  fill(MG_COLOR);
  let mgBorderLightening = 1.05;
  let mgBorderColor = [];
  MG_COLOR.forEach((channel, index) => {
    if (index < 3) {
      mgBorderColor.push(channel * mgBorderLightening);
    } else {
      mgBorderColor.push(channel);
    }
  });
  stroke(mgBorderColor);
  let mgBorderWeight = 5;
  strokeWeight(mgBorderWeight);
  beginShape();
  // TOP SIDE
  for (
    let x = LAND_LOD;
    x < canvas.width + LAND_LOD + mgBorderWeight;
    x += LAND_LOD
  ) {
    let y = mgHeight;
    let noiseScale = 0.01;
    let nx = x * noiseScale;
    let noiseVal = MG_THICK * noise(nx);
    let xPos = x;
    if (x == LAND_LOD) {
      xPos = 0 - mgBorderWeight;
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
  endShape(CLOSE);
  noStroke();
}

// Close coast
const FG_SLOPE_FACTOR = 5;

function drawForeground() {
  randomSeed(seed);
  noiseSeed(fgSeed);
  fgHeight = canvas.height - FG_THICK;
  let fgBorderDarkening = 0.9;
  let fgBorderColor = [];
  FG_COLOR.forEach((channel, index) => {
    if (index < 3) {
      fgBorderColor.push(channel * fgBorderDarkening);
    } else {
      fgBorderColor.push(channel);
    }
  });
  stroke(fgBorderColor);
  let fgBorderWeight = 8;
  strokeWeight(fgBorderWeight);
  fill(FG_COLOR);
  beginShape();

  // TOP SIDE
  for (
    let x = LAND_LOD;
    x < canvas.width + LAND_LOD + fgBorderWeight;
    x += LAND_LOD
  ) {
    let y = fgHeight;
    let noiseScale = 0.031;
    let nx = x * noiseScale;
    let noiseVal = FG_THICK * noise(nx);
    let xPos = x;
    if (x == LAND_LOD) {
      xPos = 0 - fgBorderWeight;
    }
    let yPos = y + noiseVal - x / FG_SLOPE_FACTOR;
    vertex(xPos, yPos);
  }
  // BOTTOM SIDE
  vertex(canvas.width + LAND_LOD, canvas.height + LAND_LOD);
  vertex(-LAND_LOD, canvas.height + LAND_LOD);
  endShape(CLOSE);
  noStroke();
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
    let randomY = random(
      mgHeight + MG_THICK + ROCK_THICK_MAX * 2,
      fgHeight - fgHeight / FG_SLOPE_FACTOR
    );
    let randomW = random(ROCK_THICK_MIN, ROCK_THICK_MAX);
    let randomH = random(ROCK_THICK_MIN, ROCK_THICK_MAX);
    fill(ROCK_COLOR);
    let tideSpeed = 800;
    if (night) tideSpeed *= 2;
    let offset = sin(millis() / tideSpeed);
    offset = constrain(offset, -PI / 4, PI / 4);
    arc(randomX, randomY, randomW, randomH, PI - offset, 0 + offset, OPEN);
  }
}

const FOAM_LEVEL = 180;
function drawWater() {
  noStroke();
  let noiseLevel = 255;
  let noiseScale = 0.055;
  let brightness = 165;
  if (night) brightness /= 2;
  let tileW = 6;
  let tileH = 6;
  for (let x = 0; x < canvas.width; x += tileW) {
    for (let y = mgHeight + MG_THICK; y < canvas.height; y += tileH) {
      let nx = noiseScale * x;
      let ny = noiseScale * y;
      let c = noiseLevel * noise(nx, ny);
      let color = [];
      if (c < FOAM_LEVEL || night) {
        c += brightness;
        WATER.forEach((item) => {
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
  if (night) brightness /= 2;
  let tileW = 7;
  let tileH = 7;
  for (let x = 0; x < canvas.width; x += tileW) {
    for (let y = 0; y < canvas.height; y += tileH) {
      let nx = noiseScale * x;
      let ny = noiseScale * y;
      let c = noiseLevel * noise(nx, ny);
      let color = [];
      if (c < CLOUD_BRIGHTNESS || night) {
        c += brightness;
        SKY.forEach((item) => {
          color.push(c * item);
        });
      } else {
        color = c + brightness;
      }
      fill(color);
      rect(x, y, x + tileW, y + tileH);
    }
  }
  let starSize = 4;
  let maxStars = 50;
  let starCount = 0;
  if (night) {
    while (starCount < maxStars) {
      let starSizeModifier =
        sin(millis() / 1000) +
        random(-1, 4) +
        map(mouseX, 0, canvas.width, -1, 2);
      let xPos = random(0, canvas.width);
      let yPos = random(0, 128);
      fill(255, 255, 0, 255);
      rect(
        xPos,
        yPos,
        starSize + starSizeModifier,
        starSize + starSizeModifier
      );
      starCount++;
    }
  }
}

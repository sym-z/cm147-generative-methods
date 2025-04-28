"use strict";

/* global XXH */
/* exported --
    p3_preload
    p3_setup
    p3_worldKeyChanged
    p3_tileWidth
    p3_tileHeight
    p3_tileClicked
    p3_drawBefore
    p3_drawTile
    p3_drawSelectedTile
    p3_drawAfter
*/
// CHAT GPT CONVERSATION I USED TO HELP WITH THIS PROJECT: https://chatgpt.com/share/680d6b12-f084-800b-8c05-0dc2c42f5de7
function p3_preload() {
  biteSound = loadSound(
    "./bite.mp3"
  );
  biteSound.setVolume(0.15)
}

let biteSound;

// GPT HELPED ME WITH THIS, I wanted to prevent scrolling when the mouse was over the canvas.
function p3_setup() { 
    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
    }, { passive: false });
  }


let worldSeed;

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
}

function p3_tileWidth() {
  return 24;
}
function p3_tileHeight() {
  return 12;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};
let bitesTaken = 0;
function p3_tileClicked(i, j) {
  let key = [i, j];
  clicks[key] = 1 + (clicks[key] | 0);
  for (let x = 0; x < 5; x++) {
    key = [i + x, j + x];
    clicks[key] = 1 + (clicks[key] | 0);
    key = [i, j + x];
    clicks[key] = 1 + (clicks[key] | 0);
    key = [i + x, j];
    clicks[key] = 1 + (clicks[key] | 0);
    key = [i - x, j - x];
    clicks[key] = 1 + (clicks[key] | 0);
    key = [i, j - x];
    clicks[key] = 1 + (clicks[key] | 0);
    key = [i - x, j];
    clicks[key] = 1 + (clicks[key] | 0);
  }
  biteSound.play();
  bitesTaken++
}

function p3_drawBefore() {
  //biteSound.play()
  background(220,220,170,255)
}
let sliceSize = 25;
let offsetSlice = 8;
let cornerTuckAmount = 10;
let xOffset = 0;
let yOffset = 0;
let fillColor = (200, 200);
let toppings = [drawBun, drawPatty, drawCheese, drawLettuce, drawOnions];
function p3_drawTile(i, j) {
  if (
    i > -10 &&
    j > -10 &&
    i % sliceSize > offsetSlice &&
    j % sliceSize > offsetSlice &&
    abs(i - j) < cornerTuckAmount
  ) {
    noStroke();
    let n = clicks[[i, j]] | 0;
    if (n > 0) {
      fill(0, 0, 0, 0);
    } else {
      let sliceNum = floor(i / sliceSize);
      if (sliceNum == 0) {
        let newOffsets = [];
        newOffsets = drawTopBun(i, j);
        xOffset = newOffsets[0];
        yOffset = newOffsets[1];
      } else {
        let sliceHash =
          XXH.h32("slice:" + sliceNum, worldSeed) % toppings.length;
        console.log(sliceNum % toppings.length);
        let newOffsets = [];
        newOffsets = toppings[sliceHash](i, j);
        xOffset = newOffsets[0];
        yOffset = newOffsets[1];
      }

      fill(fillColor);
      push();

      beginShape();
      vertex(-tw + xOffset, 0 + yOffset);
      vertex(0 + xOffset, th + yOffset);
      vertex(tw + xOffset, 0 + yOffset);
      vertex(0 + xOffset, -th + yOffset);
      endShape(CLOSE);
      // Can use the same push and pop method to add onions, tomatoes, etc.

      pop();
    }
  }
}

function drawTopBun(i, j) {
  if (XXH.h32("tile:" + [i, j], worldSeed) % 4 == 0) {
    fillColor = [255];
  } else {
    fillColor = [153, 93, 30, 255];
  }
  let xOffset = 0;
  let yOffset = 0;
  //if (i % sliceSize > sliceSize /1.7)
  //fillColor = [0]
  yOffset = sin(millis() / 1000) * i * 2;
  return [xOffset, yOffset];
}
function drawBun(i, j) {
  let xOffset = 0;
  let yOffset = 0;
  console.log("BUN");

  if (XXH.h32("tile:" + [i, j], worldSeed) % 4 == 0) {
    fillColor = [252, 165, 72, 255];
  } else {
    fillColor = [245, 181, 113, 255];
  }
  // Isolate the edges
  if (
    i % sliceSize == sliceSize - 1 ||
    j % sliceSize == sliceSize - 1 ||
    i % sliceSize == 9 ||
    j % sliceSize == 9 ||
    abs(i - j) == 9
  ) {
    //fillColor = [0]
    yOffset -= 2;
    fillColor = [204, 121, 32, 255];
  }
  yOffset += sin(millis() / 1000) * (i % sliceSize);
  return [xOffset, yOffset];
}
function drawPatty(i, j) {
  let xOffset = 0;
  let yOffset = 0;
  //console.log("PATTY");
  if (XXH.h32("tile:" + [i, j], worldSeed) % 4 == 0) {
    fillColor = [74, 56, 37];
  } else {
    fillColor = [110, 84, 57, 255];
  }
  yOffset += sin(millis() / 1000) * (i % sliceSize);
  if (XXH.h32("tile:" + [i, j], worldSeed) % 2 == 0) {
    push();
    fill(255, 255, 255, sin(frameCount / 2) + 30);
    translate(0, -40 + yOffset);
    ellipse(0, 0, 10, XXH.h32("tile:" + [i, j], worldSeed) % 100);
    pop();
  }

  return [xOffset, yOffset];
}
function drawCheese(i, j) {
  let xOffset = 0;
  let yOffset = 0;
  if (XXH.h32("tile:" + [i, j], worldSeed) % 4 == 0) {
    fillColor = [232, 172, 46, 255];
  } else {
    fillColor = [226, 187, 35, 255];
  }
  return [xOffset, yOffset];
}
function drawOnions(i, j) {
  let xOffset = 0;
  let yOffset = 0;
  fillColor = [0, 0, 255, 0];
  yOffset += sin(millis() / 1000) * (i % sliceSize);

  if(XXH.h32("tile:" + [i, j], worldSeed) % 20 == 0)
    {
    push();
    onion();
    pop();
  }

  return [xOffset, yOffset];
}
function onion() {
  fill(150, 0, 255, 255);
  ellipse(0, 0, 200, 50);
  fill(255, 255, 255, 255);
  ellipse(0, 0, 175, 40);
  fill(200, 200, 200, 255);
  ellipse(0, 0, 150, 30);
  fill(255, 255, 255, 255);
  ellipse(0, 0, 145, 25);
}
function drawLettuce(i, j) {
  let xOffset = 0;
  let yOffset = 0;
  //console.log("LETTUCE");
  fillColor = [95, 214, 91, 255];
  let noiseVal = 255;
  let noiseScale = 0.2;
  let ni = noiseScale * i;
  let nj = noiseScale * j;
  let colorMod = 1.3 * noise(ni, nj);
  fillColor = [95 / colorMod, 214 / colorMod, 91 / colorMod, 255];
  yOffset = sin(millis() / 1000) * (i % sliceSize);
  return [xOffset, yOffset];
}

function p3_drawSelectedTile(i, j) {
  //   noFill();
  //   stroke(0, 255, 0, 128);
  //   beginShape();
  //   vertex(-tw, 0);
  //   vertex(0, th);
  //   vertex(tw, 0);
  //   vertex(0, -th);
  //   endShape(CLOSE);
  //   noStroke();
  //   fill(0);
  //   text("tile " + [i, j], 0, 0);
}

function p3_drawAfter() {
  textSize(25);
  text("SCROLL DOWN TO OBSERVE THE INFINITE BURGER", 100 - 25, 50);
  text(`BITES TAKEN: ${bitesTaken}`, 300, 350);
  textSize(12);
}

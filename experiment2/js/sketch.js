// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
const VALUE1 = 1;
const VALUE2 = 2;

const WATER = [0,0,255,255];
const LAND = [0,255,0,255];
const SKY = [255,0,0,255];

// Globals
let myInstance;
let canvasContainer;
var centerHorz, centerVert;

class MyClass {
    constructor(param1, param2) {
        this.property1 = param1;
        this.property2 = param2;
    }

    myMethod() {
        // code to run when method is called
    }
}

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}

// setup() function is called once when the program starts
function setup() {
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  // resize canvas is the page is resized

  // create an instance of the class
  myInstance = new MyClass("VALUE1", "VALUE2");

  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();
  drawWater();
}
function drawWater(){
  noStroke();
  noiseSeed(millis());
  let noiseLevel = 255;
  let noiseScale = 0.055;
  let brightness = 165;
  let tileW = 5;
  let tileH = 5;
  for(let x = 0; x < canvas.width; x+= tileW)
  {
    for(let y = 0; y < canvas.height; y += tileH)
    {
      let nx = noiseScale * x;
      let ny = noiseScale * y;
      let c = 255 * noise(nx,ny) + brightness;
      let color = [c/4,c/1.5,c,255]
      fill(color);
      rect(x,y,x+tileW,y+tileH)
      //point(x,y);
    }
  }
}
// draw() function is called repeatedly, it's the main animation loop
function draw() {
  //drawWater();
}

// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
    // code to run when mouse is pressed
    noiseSeed(millis());
    clear();
    drawWater();
}
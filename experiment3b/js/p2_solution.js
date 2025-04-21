/* exported generateGrid, drawGrid */
/* global placeTile */

let rows, cols;
function generateGrid(numCols, numRows) {
  let grid = [];
  rows = numRows;
  cols = numCols;
  // Draw Grass
  for (let i = 0; i < numRows; i++) {
    let row = [];
    for (let j = 0; j < numCols; j++) {
      row.push("G");
    }
    grid.push(row);
  }
  // Draw Forest
  drawForest(grid);

  // Draw River
  drawRiver(grid);
  return grid;
}

function drawRiver(grid) {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let noiseScale = 0.065;
      let noiseOffset = 0.1;
      let nx = noiseScale * j;
      let ny = noiseScale * i;
      let nRiver = noiseOffset + noise(nx, ny);
      if (nRiver > 0.65) {
        grid[i][j] = "R";
      } else if (nRiver > 0.55) {
        grid[i][j] = "F";
      } else if (nRiver < 0.5 && nRiver > 0.45) {
        grid[i][j] = "H";
      }
    }
  }
}

function drawForest(grid) {
  let forestSizeMin = 5;
  let forestSizeMax = 10;

  let forestSizeX = floor(random(forestSizeMin, forestSizeMax));
  let forestSizeY = floor(random(forestSizeMin, forestSizeMax));

  let forestX = floor(random(0, cols - forestSizeX));
  let forestY = floor(random(0, rows - forestSizeY));
  console.log(forestX, forestY, forestSizeX, forestSizeY, rows, cols);

  for (let i = forestY; i < forestY + forestSizeY; i++) {
    for (let j = forestX; j < forestX + forestSizeX; j++) {
      grid[i][j] = "F";
    }
  }
}
function gridCheck(grid, i, j, target) {
  if (i >= 0 && i < rows && j >= 0 && j < cols && grid[i][j] == target) {
    return true;
  }
  return false;
}
function gridCode(grid, i, j, target) {
  let northBit = gridCheck(grid, i - 1, j, target);
  let southBit = gridCheck(grid, i + 1, j, target);
  let eastBit = gridCheck(grid, i, j + 1, target);
  let westBit = gridCheck(grid, i, j - 1, target);
  return (northBit << 3) + (southBit << 2) + (eastBit << 1) + (westBit << 0);
}
// Draw context takes an empty space and draws the wall accordingly to the target
function drawContext(grid, i, j, target, ti, tj) {
  let totalCode = 0;
  target.forEach((t) => {
    totalCode = totalCode | gridCode(grid, i, j, t);
  });
  const context = lookup[totalCode];
  // Background Tile
  placeTile(i, j, ti, tj + 1);

  context.forEach((tile) => {
    placeTile(i, j, ti + tile[0], tj + tile[1]);
  });
}
// NORTH, SOUTH, EAST, WEST
const lookup = [
  [[1, 1]], //0000 NO FLOORS AROUND ME
  [[4, 1]], //0001 FLOOR TO MY LEFT,
  [[6, 1]], //0010 FLOOR TO MY RIGHT
  [
    [4, 1],
    [6, 1],
  ], //0011 FLOOR ON BOTH X SIDES, LEFT AND RIGHT WALL
  [[5, 2]], //0100 FLOOR BELOW ME
  [[4, 2]], //0101 BOTTOM LEFT CORNER
  [[6, 2]], //0110 BOTTOM RIGHT CORNER
  [
    [4, 1],
    [6, 1],
    [5, 2],
  ], //0111 U SHAPE WALL LEFT BOTTOM AND RIGHT WALL
  [[5, 0]], //1000 FLOOR ABOVE ME
  [[4, 0]], //1001 TOP LEFT CORNER
  [[6, 0]], //1010 TOP RIGHT CORNER
  [
    [4, 1],
    [6, 1],
    [5, 0],
  ], //1011 UPSIDE DOWN U WALL
  [
    [5, 0],
    [5, 2],
  ], //1100 FLOOR ON Y SIDES
  [
    [4, 1],
    [5, 0],
    [5, 2],
  ], //1101 C WALL
  [
    [6, 1],
    [5, 0],
    [5, 2],
  ], //1110 BACKWARDS C WALL
  [[16, 1]], //1111  SURROUNDED BY FLOORS
];
function drawGrid(grid) {
  background(128);

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      switch (grid[i][j]) {
        case "F":
          placeTile(i, j, floor(random(4)), floor(random(0, 2)));
          let treeOptions = [
            [14, 0],
            [20, 0],
            [14, 6],
            [20, 6],
          ];
          let treeChoice = treeOptions[floor(random(0, treeOptions.length))];
          placeTile(i, j, treeChoice[0], treeChoice[1]);
          break;
        case "R":
          placeTile(i, j, floor(random(1, 3)) + sin(millis() / 1000), 13);
          break;
        case "H":
          placeTile(i, j, floor(random(4)), 0);
          placeTile(i, j, floor(random(26, 28)), floor(random(0, 4)));
          break;
        default:
          drawContext(grid, i, j, ["F", "R", "H"], 0, 0);
          break;
      }
    }
  }
}

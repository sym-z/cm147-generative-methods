/* exported generateGrid, drawGrid */
/* global placeTile */
let rows;
let cols;
function generateGrid(numCols, numRows) {
  rows = numRows;
  cols = numCols;
  let grid = [];
  for (let i = 0; i < numRows; i++) {
    let row = [];
    for (let j = 0; j < numCols; j++) {
      row.push("W");
    }
    grid.push(row);
  }

  let roomCount = floor(random(3, 5));
  let roomSizeMax = 10;
  let roomSizeMin = 2;
  let maxAttempts = 20;
  while (roomCount != 0) {
    let roomSizeX = floor(random(roomSizeMin, roomSizeMax));
    let roomSizeY = floor(random(roomSizeMin, roomSizeMax));
    if (
      drawRectRoom(
        grid,
        floor(random(numRows - roomSizeX)),
        floor(random(numCols - roomSizeY)),
        roomSizeX,
        roomSizeY,
        "R"
      ) == true
    ) {
      roomCount -= 1;
    } else {
      maxAttempts -= 1;
      if (maxAttempts == 0) {
        maxAttempts = 10;
        break;
      }
    }
  }
  return grid;
}
function gridCheckArea(grid, i, j, width, height, target) {
  let retval = 0;
  for (let y = i; y < i + height; y++) {
    for (let x = j; x < j + width; x++) {
      retval = retval | gridCheck(grid, y, x, target);
    }
  }
  return retval;
}
function drawRectRoom(grid, x, y, sizeX, sizeY, symbol) {
  if (!gridCheckArea(grid, y, x, sizeX, sizeY, "R")) {
    for (let i = x; i < x + sizeX; i++) {
      for (let j = y; j < y + sizeY; j++) {
        grid[j][i] = symbol;
      }
    }
    // Draw cross pattern hallways
    // Top Middle
    let hallWayX = floor(x + sizeX / 2);
    if (y > 0) {
      for (let i = y - 1; i >= 0; i--) {
        if (
          !gridCheck(grid, i, hallWayX, symbol) &&
          !gridCheck(grid, i, hallWayX, "H") &&
          !gridCheck(grid, i, hallWayX, "D")
        ) {
          if (i < y - 1) {
            grid[i][hallWayX] = "H";
          } else {
            grid[i][hallWayX] = "D";
          }
        } else {
          break;
        }
      }
    }
    // Bottom Middle
    if (y + sizeY < rows) {
      for (let i = y + sizeY; i < rows; i++) {
        if (
          !gridCheck(grid, i, hallWayX, symbol) &&
          !gridCheck(grid, i, hallWayX, "H") &&
          !gridCheck(grid, i, hallWayX, "D")
        ) {
          if (i > y + sizeY) {
            grid[i][hallWayX] = "H";
          } else {
            grid[i][hallWayX] = "D";
          }
        } else {
          break;
        }
      }
    }
    let hallWayY = floor(y + sizeY / 2);
    // Left Middle
    if (x != 0) {
      for (let i = x - 1; i >= 0; i--) {
        if (
          !gridCheck(grid, hallWayY, i, symbol) &&
          !gridCheck(grid, hallWayY, i, "H") &&
          !gridCheck(grid, hallWayY, i, "D")
        ) {
          if (i < x - 1) {
            grid[hallWayY][i] = "H";
          } else {
            grid[hallWayY][i] = "D";
          }
        } else {
          break;
        }
      }
    }
    if (x + sizeX < cols) {
      for (let i = x + sizeX; i < cols; i++) {
        if (
          !gridCheck(grid, hallWayY, i, symbol) &&
          !gridCheck(grid, hallWayY, i, "H") &&
          !gridCheck(grid, hallWayY, i, "D")
        ) {
          if (i > x + sizeX) {
            grid[hallWayY][i] = "H";
          } else {
            grid[hallWayY][i] = "D";
          }
        } else {
          break;
        }
      }
    }
    return true;
  }
  return false;
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
      if (grid[i][j] == "R") {
        if (floor(random(0, 50)) < 2) {
          let chestY = floor(random(28,31));
          let chestX = floor(random(0,6));
          placeTile(i, j, chestX, chestY);
        } else {
          placeTile(i, j, random(4) | 0, 9);
        }
      } else if (grid[i][j] == "H") {
        placeTile(i, j, 21 + floor(random(0, 3)), 21);
      } else if (grid[i][j] == "D") {
        placeTile(i, j, 5 + floor(random(0, 2)), 27);
      } else {
        // DRAW WALL STARTING FROM...
        if (floor(random(0, 2)) == 0) {
          drawContext(grid, i, j, ["R", "H", "D"], 0, 3);
        } else {
          drawContext(grid, i, j, ["R", "H", "D"], 0, 6);
        }
      }
    }
  }
  if (floor(millis()) % 10 < 5) {
    crt(0);
  } else {
    crt(1);
  }
}

//TODO: CRT FILTER
function crt(offset) {
  let draw = true;
  noStroke();
  let opacity = (abs(sin(millis() / 800)) + 0.6) * 255;
  let color = [0, 0, 0, opacity];
  fill(color);
  for (let i = 0 + offset; i < rows * 16; i++) {
    if (draw) {
      rect(0, i, cols * 16, 1);
      draw = false;
    } else {
      draw = true;
    }
  }
}

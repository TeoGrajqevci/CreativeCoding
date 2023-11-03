let cellSize = 90;
let grid = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);

  initializeGrid();
}

function draw() {
  background(220);
  for (let i = 0; i < width; i += cellSize) {
    for (let j = 0; j < height; j += cellSize) {
      const cell = grid[i / cellSize][j / cellSize];
      cell.display(i, j);
    }
  }
}

function initializeGrid() {
  for (let i = 0; i < width; i += cellSize) {
    grid.push([]);
    for (let j = 0; j < height; j += cellSize) {
      grid[i / cellSize][j / cellSize] = new CellA(i, j);
    }
  }
}

function mouseMoved() {
  const i = Math.floor(mouseX / cellSize);
  const j = Math.floor(mouseY / cellSize);
  if (i >= 0 && i < grid.length && j >= 0 && j < grid[0].length) {
    const cell = grid[i][j];
    if (cell instanceof CellA) {
      grid[i][j] = new CellB(cell.x, cell.y);
    } else if (cell instanceof CellB) {
      grid[i][j] = new CellA(cell.x, cell.y);
    }
  }
}

class CellA {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  display(x, y) {
    push();
    noFill();
    strokeWeight(10);
    translate(x, y);
    arc(0, 0, cellSize, cellSize, 0, 90);
    arc(cellSize, cellSize, cellSize, cellSize, 180, 270);
    pop();
  }
}

class CellB {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  display(x, y) {
    push();
    noFill();
    strokeWeight(10);
    translate(x, y);
    arc(cellSize, 0, cellSize, cellSize, 90, 180);
    arc(0, cellSize, cellSize, cellSize, 270, 360);
    pop();
  }
}


let w;
let columns;
let rows;
let board;
let next;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch');
  w = 20;
  // Calculate columns and rows
  columns = floor(width / w) + 1;
  rows = floor(height / w) + 1;
  // Wacky way to make a 2D array is JS
  board = new Array(columns);
  for (let i = 0; i < columns; i++) {
    board[i] = new Array(rows);
  }
  // Going to use multiple 2D arrays and swap them
  next = new Array(columns);
  for (i = 0; i < columns; i++) {
    next[i] = new Array(rows);
  }
  init();
}

let paused = false
function draw() {
  background(255);
  if(!paused) generate()
  for ( let i = 0; i < columns;i++) {
    for ( let j = 0; j < rows;j++) {


      let mousePos = createVector(mouseX, mouseY)
      let cellPos = createVector((i * w) + (w/2), (j * w) + (w/2))
      if(mousePos.dist(cellPos) <= w*0.5 && mouseIsPressed){
        if(mouseButton == LEFT){
          board[i][j] = 1
        }
        if(mouseButton == RIGHT){
          board[i][j] = 0
        }
      }

      if ((board[i][j] == 1)) fill(lerp(0, 255, j/rows), lerp(0, 255, i/columns), lerp(255, 0, ((i+j)/2)/((rows+columns)/2)));
      else fill(255);
      stroke(255);
      rect(i * w, j * w, w-1, w-1);
    }
  }
}

function keyPressed(){
  if(keyCode == 32){
    paused = !paused
  }

  if(keyCode == 8){
    paused = true
    for(let i = 0; i < columns; i++){
      for(let j = 0; j < rows; j++){
        board[i][j] = 0
      }
    }
  }
}

// // reset board when mouse is pressed
// function mousePressed() {
//   init();
// }

// Fill board randomly
function init() {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      if(j == floor(rows/2) && i != 0 && i != columns - 1){
        board[i][j] = 1
      } else{
        board[i][j] = 0;
      }
      next[i][j] = 0;
    }
  }
}

// The process of creating the new generation
function generate() {

  // Loop through every spot in our 2D array and check spots neighbors
  for (let x = 0; x < columns; x++) {
    for (let y = 0; y < rows; y++) {
      // Add up all the states in a 3x3 surrounding grid
      let neighbors = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          let nx = x + i
          let ny = y + j
          if(nx < 0){
            nx = columns - 1
          }
          if(nx > columns - 1){
            nx = 0
          }
          if(ny < 0){
            ny = rows - 1
          }
          if(ny > rows - 1){
            ny = 0
          }
          neighbors += board[nx][ny];
        }
      }

      // A little trick to subtract the current cell's state since
      // we added it in the above loop
      neighbors -= board[x][y];
      // Rules of Life
      if      ((board[x][y] == 1) && (neighbors <  2)) next[x][y] = 0;           // Loneliness
      else if ((board[x][y] == 1) && (neighbors >  3)) next[x][y] = 0;           // Overpopulation
      else if ((board[x][y] == 0) && (neighbors == 3)) next[x][y] = 1;           // Reproduction
      else                                             next[x][y] = board[x][y]; // Stasis
    }
  }

  // Swap!
  let temp = board;
  board = next;
  next = temp;
}
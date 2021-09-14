let blocks = []
let grid = {x: 15, y: 15}
let interval = 50
let lerpspeed = 0.3
let size = 27
let distance = {x: 50, y: 50}

class block {
  constructor(x, y){
    this.x = x
    this.y = y
    this.tx = x
    this.ty = y
  }
  
  reposition(tx, ty){
    this.tx = tx
    this.ty = ty
  }
  
  update(){
    this.x = lerp(this.x, this.tx, lerpspeed)
    this.y = lerp(this.y, this.ty, lerpspeed)
  }
  
  show(){
    let mydist = dist(0, 0, this.tx*distance.x, this.ty*distance.y) / 100
    fill(color(255-mydist, 50, mydist/2))
    rect(this.x, this.y, size, size)
  }
}

function setup() {
  let mycanvas = createCanvas(461, 461);
  mycanvas.parent("topcanvas")
  noStroke()
  
  distance.x = width/grid.x
  distance.y = height/grid.y
  for(let i=0; i<width; i+=distance.x){
    for(let j=0; j<height; j+=distance.y){
      blocks.push(new block(i+grid.x, j+grid.y))
    }
  }
}

let time = 0
function draw() {
  background(255);
  
  for(bl of blocks){
    bl.update()
    bl.show()
  }
  
  time += 1
  if(time >= interval){
    time = 0
    for(bl of blocks){
      move = getRandomVector()
      bl.reposition(bl.x + move.x, bl.y + move.y)
    }
  }
}

function getRandomVector(){
  moves = [
    {x:distance.x, y:0},
    {x:-distance.x, y:0},
    {x:0, y:distance.y},
    {x:0, y:-distance.y}
  ]
  return(round(random(0, 1)) == 0 ? random(moves) : {x:0, y:0})
}
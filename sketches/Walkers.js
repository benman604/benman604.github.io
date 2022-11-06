let _bl = 0
let _br = 0
let _tl = 0
let _tr = 0

class Walker{
    constructor(color, pos, randomness, velocity){
      this.color = color
      this.pos = pos
      this.randomness = randomness
      this.velocity = velocity
      this.angle = 0
      this.score = 0
    }
    
    update(){
      let closest = foods[0]
      // let closestDist = max(width, height)
      // for(let i=0; i<foods.length; i++){
      //   let thisDist = dist(foods[i].x, foods[i].y, this.pos.x, this.pos.y)
      //   closestDist = dist(closest.x, closest.y, this.pos.x, this.pos.y)
      //   if(thisDist < closestDist){
      //     closest = foods[i]
      //   }
      // }

      closest = {x: mouseX, y: mouseY}
      
      // closest.eaters++
      // if(dist(closest.x, closest.y, this.pos.x, this.pos.y) <= s){
      //   closest.x = random(0, width)
      //   closest.y = random(0, height)
      //   closest.eaters = 0
      //   this.score++
      // }
      
      let angleToFood = atan2(closest.y-this.pos.y, closest.x-this.pos.x)
      let randAngle = random(angleToFood - PI/this.randomness, angleToFood + PI/this.randomness)
      if( (
        this.pos.y + round(sin(randAngle) * this.velocity) > _tl.y &&
        this.pos.y + round(sin(randAngle) * this.velocity) < _bl.y ) && (
        this.pos.x + round(cos(randAngle) * this.velocity) > _bl.x &&
        this.pos.x + round(cos(randAngle) * this.velocity) < _br.x )
      ) {
        randAngle += PI
      }

      this.angle += randAngle
      this.pos.x += round(cos(randAngle) * this.velocity)
      this.pos.y += round(sin(randAngle) * this.velocity)
      
      strokeWeight(s)
      stroke(this.color.r, this.color.g, this.color.b)
      point(this.pos.x, this.pos.y)
      
      strokeWeight(0)
      fill(255)
      if(showScores)
        text(this.score, this.pos.x-s/2, this.pos.y-s)
    }
  }

let s = 10;
let foods = []
let walkers = []
let numFoods = 10
let numWalkers = 500
let showScores = false

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch')
  background(255)
  
  for(let i=0; i<numFoods; i++){
    let f = {
      x: random(0, width), 
      y: random(0, height),
      eaters: 0
    }
    foods.push(f)
  }
  
  for(let i=0; i<numWalkers; i++){
    let w = new Walker(
      {r: random(255), g: random(255), b: random(255)},
      {x: random(width), y: random(height)},
      random(1, 3),
      random(1, 10)
    )
    
    walkers.push(w)
  }

  _bl = createVector(width/2 - 540/2, height/2 + 380/2)
  _br = createVector(width/2 + 540/2, height/2 + 380/2)
  _tl = createVector(width/2 - 540/2, height/2 - 380/2)
  _tr = createVector(width/2 + 540/2, height/2 - 380/2)
}

let paused = false
function draw() {
  if(paused) return
  
  background(255)
  strokeWeight(s)
  stroke(0)
  // for(let food of foods){
  //   point(food.x, food.y)
  // }
  for(let walker of walkers){
    walker.update()
  }
}

function mouseClicked(){
//   paused = !paused
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}




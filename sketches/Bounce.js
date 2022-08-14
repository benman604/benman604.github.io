const gravity = 1;
const initialNumBalls = 5;
let balls = []

function randRange(min, max) {
    return Math.random() * (max - min) + min;
}

function setup() {
  let mycanvas = createCanvas(windowWidth, windowHeight);
  mycanvas.parent('sketch')
  
  // Create initial balls with random values
  for(let i=0; i<initialNumBalls; i++){
    let pos = {x: randRange(0, width), y: 0}
    let vel = {x: randRange(10, 20) * random([-1, 1]), y: 0}
    let bounce = randRange(30, 45)
    let rgb = [randRange(0, 255),randRange(0, 255),randRange(0, 255)]
    let ball = new bouncy(pos, vel, bounce, rgb, [0, 0, 0])
    balls.push(ball)
  }
}

class bouncy{
  constructor(pos, vel, height, fill, stroke){
    this.pos = pos
    this.vel = vel
    this.speed = abs(vel.x)
    this.jumpHeight = height
    this.fill = fill
    this.stroke = stroke
  }
  
  draw(){
    stroke(this.stroke[0], this.stroke[1], this.stroke[2])
    fill(this.fill[0], this.fill[1], this.fill[2])
    

    let bl = createVector(this.pos.x - 25, this.pos.y + 25)
    let br = createVector(this.pos.x + 25, this.pos.y + 25)
    let tl = createVector(this.pos.x - 25, this.pos.y - 25)
    let tr = createVector(this.pos.x + 25, this.pos.y - 25)

    let _bl = createVector(width/2 - 530/2, height/2 + 380/2)
    let _br = createVector(width/2 + 530/2, height/2 + 380/2)
    let _tl = createVector(width/2 - 530/2, height/2 - 380/2)
    let _tr = createVector(width/2 + 530/2, height/2 - 380/2)


    // // collide bottom
    // if(tr.x > _tl.x && tl.x < _tr.x && tr.y < _br.y && !(br.y < _tl.y)){
    //   this.vel.y = -this.jumpHeight
    // }
    // // collide top not working
    // else if(br.x > _tl.x && bl.x < _tr.x && br.y < tr.y){
    //   this.vel.y = this.jumpHeight
    // }
    // // collide left side
    // if(br.x > _bl.x && br.y > _tl.y && tr.y < _br.y) {
    //   this.vel.x = -this.vel.x
    // }
    // // collide right side
    // if(bl.x < _br.x && tl.y < _br.y && bl.y > _tl.y) {
    //   this.vel.x = - this.vel.x
    // }

    let buffer = this.speed

    // collide top/bottom
    if(tr.x > _tl.x && tl.x < _tr.x){

      if(br.y < _tl.y + 100){
        if(br.y + this.vel.y > _tr.y){
          this.vel.y = this.jumpHeight / 3
        }
      } 
      else if(tr.y + this.vel.y < _br.y){
        this.vel.y = -this.jumpHeight / 3
      }
      // if(tr.y > bl.y - 50){

      // }
    } else {
      if(this.vel.x > 0 && br.x > _bl.x - buffer && br.x < _bl.x + buffer && br.y > _tl.y - buffer && br.y < _bl.y + buffer){
        this.vel.x = -this.speed
      }

      if(this.vel.x < 0 && bl.x < _br.x + buffer && bl.x > _br.x - buffer && bl.y > _tl.y - buffer && bl.y < _bl.y + buffer){
        this.vel.x = this.speed
      }
    }
  
    if(this.pos.x + 30 > width){ // if ball touches the left part of the screen
      this.vel.x = -this.speed // set horizontal velocity left
    } else if(this.pos.x - 35 < 0){ // if ball touches the right part of the screen
      this.vel.x = this.speed // set horizontal velocity right
    }

    if(this.pos.y + 30 > height){ // if ball touches the ground
      this.vel.y = this.jumpHeight // set velocity to jump up
    }

    this.vel.y -= gravity    // constantly subtract gravity
    this.pos.y -= this.vel.y // add velocity components to position
    this.pos.x += this.vel.x

    rect(this.pos.x, this.pos.y, 50, 50) // draw the ball
    fill(50)
  }
}
  
function draw() {
  background(255, 255, 255, 255*0.7) // background alpha is 70%, creating fade effect
  rectMode(CENTER)
  strokeWeight(0)
  
  fill(255, 0, 0)
  // rect(width/2, height/2, 550, 380)
  // draw all balls
  for(let ball of balls){
    ball.draw()
  }
}

// create a ball on click
function mouseClicked(){
    let pos = {x: mouseX, y: mouseY}
    let vel = {x: randRange(10, 20) * random([-1, 1]), y: 15}
    let bounce = randRange(30, 45)
    let rgb = [randRange(0, 255),randRange(0, 255),randRange(0, 255)]
    let ball = new bouncy(pos, vel, bounce, rgb, [0, 0, 0])
    balls.push(ball)
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight)
}
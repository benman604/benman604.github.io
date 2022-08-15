function shape(points, lerp, times, max){
    lerped = []
    for(let i=0; i<points.length-1; i++){
        line(points[i].x, points[i].y, points[i+1].x, points[i+1].y)

        let dx = points[i+1].x - points[i].x
        let dy = points[i+1].y - points[i].y
        let lx = points[i].x + dx * lerp
        let ly = points[i].y + dy * lerp
        lerped.push(createVector(lx, ly))
    }
    lerped.push(lerped[0])
    times++
    if(times < max){
        shape(lerped, lerp, times, max)
    }
}

function polygon(radius, sides, center){
    let verticies = []
    let angle = TWO_PI / sides
    for(let i=1; i<sides+1; i++){
        let rot = i * angle
        let x = center.x + cos(rot) * radius
        let y = center.y + sin(rot) * radius
        verticies.push(createVector(x, y))
    }
    verticies.push(verticies[0])
    return verticies
}

let _lerp = 0
let lerpIncrement = 0.0001
let squares = 10
let v = 4

let ceneter
function setup(){
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('sketch')
    v = random(3, 10)
}

function draw(){
    background(255)
    center = createVector(0, (width <= 600) ? height/3 - 400 : 0)
    translate(width/2 - center.x, height/2 - center.y)
    let r = (width <= 600) ? 200 : 500
    shape(polygon(r, v, createVector(0, 0)), _lerp, 0, squares)

    _lerp += lerpIncrement
    if(_lerp > 1){
        _lerp = 0
    }
}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight)
  }
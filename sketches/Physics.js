var Engine = Matter.Engine,
    World = Matter.World,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    Bodies = Matter.Bodies;

let engine,
    world,
    boxes = [],
    circles = [],
    grounds = [],
    things = [],
    possibleThingPositions = [],
    thingPositions = [0, 2], // these are indicies of possibleThingPositions
    constraint

class Boundary {
    constructor(x, y, w, h) {
        let options = {
            friction: 1,
            restitution: 2,
            isStatic: true,
        }
        this.body = Bodies.rectangle(x, y, w, h, options);
        this.w = w;
        this.h = h;
        World.add(world, this.body);
    }

    updatePos(x, y){
        Matter.Body.set(this.body, 'position', {x: x, y: y});
    }
    
    show() {
        let pos = this.body.position;
        let angle = this.body.angle;
        
        push();
        translate(pos.x, pos.y);
        rotate(angle);
        rectMode(CENTER);
        strokeWeight(10);
        noStroke()
        fill(0);
        rect(0, 0, this.w, this.h);
        pop();
    }
}

class Box {
    constructor(x, y, w, h) {
        let options = {
            friction: 1,
            restitution: 0.6
        }  
        this.color = color(random(255), random(255), random(255));
        this.body = Bodies.rectangle(x, y, w, h, options);
        this.w = w;
        this.h = h;
        World.add(world, this.body);
    }
    
    show() {
        let pos = this.body.position;
        let angle = this.body.angle;
        
        push();
        translate(pos.x, pos.y);
        rotate(angle);
        rectMode(CENTER);
        strokeWeight(1);
        fill(this.color);
        rect(0, 0, this.w, this.h);
        pop();
    }
}

class Circle {
    constructor(x, y, r) {
        let options = {
            friction: 1,
            restitution: 0.6
        };
        this.color = color(random(255), random(255), random(255));
        this.body = Bodies.circle(x, y, r, options);
        this.r = r;
        World.add(world, this.body);
    }
    
    show() {
        let pos = this.body.position;
        let angle = this.body.angle;
        
        push();
        translate(pos.x, pos.y);
        rotate(angle);
        rectMode(CENTER);
        strokeWeight(1);
        fill(this.color);
        ellipse(0, 0, this.r * 2);
        pop();
    }
}

let x1, y1, x2, y2

function setup(){
    let mycanvas = createCanvas(windowWidth, windowHeight);
    mycanvas.parent('sketch')
    
    // middle box is 542x372 px
    x1 = (width/2 - 542/2) / 2
    x2 = (width/2 + 542/2 + width) / 2
    y1 = (height/2 - 372/2) / 2
    y2 = (height/2 + 372/2 + height) / 2
    possibleThingPositions = [
        {x: x1, y: y1},
        {x: x1, y: y2},
        {x: x2, y: y2},
        {x: x2, y: y1}
    ]

    engine = Engine.create()
    world = engine.world
    grounds.push(new Boundary(0, height / 2, 1, height));
    grounds.push(new Boundary(width, height / 2, 1, height));
    grounds.push(new Boundary(width/2, 0, width, 1));
    grounds.push(new Boundary(width/2, height, width, 1));
    grounds.push(new Boundary(width/2, height/2, 542, 372));
    World.add(world, grounds)

    // things.push(new Boundary(possibleThingPositions[thingPositions[0]].x, possibleThingPositions[thingPositions[0]].y, x2/4, y2/4))
    // things.push(new Boundary(possibleThingPositions[thingPositions[1]].x, possibleThingPositions[thingPositions[1]].y, x2/4, y2/4))
    // World.add(world, things)
    
    let mouse = Mouse.create(document.body)
    mouse.pixelRatio = pixelDensity()
    constraint = MouseConstraint.create(engine, {mouse: mouse})
    World.add(world, constraint)
}

function generateBoxes(x, y){
    let s = random(25, 60)
    if(random() < 0.5){
        boxes.push(new Box(x, y, s, s))
    }
    else {
        circles.push(new Circle(x, y, s))
    }
}

let thingEnabled = false
function keyPressed(){
    if(keyCode == 32 && !thingEnabled){
        thingEnabled = true
        things.push(new Boundary(possibleThingPositions[thingPositions[0]].x, possibleThingPositions[thingPositions[0]].y, x2/4, y2/4))
        things.push(new Boundary(possibleThingPositions[thingPositions[1]].x, possibleThingPositions[thingPositions[1]].y, x2/4, y2/4))
        World.add(world, things)
    } 
}

function draw(){
    background(255)
    noStroke()
    fill(0)
    
    let s = random(25, 60)
    
    if(mouseIsPressed && mouseButton === RIGHT){
        generateBoxes(mouseX, mouseY)
    }
    if(millis() < 1000){
        generateBoxes(random(width), random(height))
    }

    Engine.update(engine)
    for(let b of boxes){
        b.show()
    }
    for(let c of circles){
        c.show()
    }

    for(let t of things){
        let i = things.indexOf(t)
        let pos = possibleThingPositions[thingPositions[i]]

        v1 = createVector()

        t.updatePos(lerp(t.body.position.x, pos.x, 0.1), lerp(t.body.position.y, pos.y, 0.1))
        t.show()
    }
}

// update the position of the things
setInterval(() => {
    for(let i = 0; i < things.length; i++){
        thingPositions[i]++
        if(thingPositions[i] >= possibleThingPositions.length){
            thingPositions[i] = 0
        }
    }
}, 1000)
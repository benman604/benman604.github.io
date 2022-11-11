let padw = 30,
    padh = 150,
    oppy = 0,
    opps = 10,
    bx = 0,
    by = 0,
    bvx = 10,
    bvy = 0,
    bw = 30,
    buffer = 50,
    speed = [10, 15]

let pscore = 0,
    oscore = 0

let _pause = false,
    _pause2 = false,
    pausedbutlikeforreal = false

let autopilot = false

let font
function preload(){
    font = loadFont("../bit5x3.ttf")
}

function setup(){
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('sketch');

    bx = padw + bw/2
    by = height/2
    bvy = random(speed[0], speed[1]) * random([-1, 1])
}

function draw(){

    let bl = createVector(width/2 - 542/2, height/2 + 372/2),
        br = createVector(width/2 + 542/2, height/2 + 372/2),
        tl = createVector(width/2 - 542/2, height/2 - 372/2),
        tr = createVector(width/2 + 542/2, height/2 - 372/2)
    
    let _bl = createVector(bx - bw, by + bw),
        _br = createVector(bx + bw, by + bw),
        _tl = createVector(bx - bw, by - bw),
        _tr = createVector(bx + bw, by - bw)

    background(255)
    fill(0)
    noStroke()
    rectMode(CENTER)

    textFont(font)
    textSize(100)
    text(pscore, 50, 100)
    text(oscore, width - 100, 100)
    
    if(_pause && !_pause2){
        _pause2 = true 
        bvx = 0
        bvy = 0

        setTimeout(() => {
            fill(255, 0, 0)
            _pause = false
            _pause2 = false
            by = height/2
            opps++
            bvx = random(speed[0], speed[1]) * random([-1, 1])
            bvy = random(speed[0], speed[1]) * random([-1, 1])
            if(random() > 0.5){
                bx = padw + bw/2
            } else{
                bx = width - padw - bw/2
                bvx *= -1
            }
        }, 2000)
    }

    rect(bx, by, bw, bw)

    if(!pausedbutlikeforreal){
        bx += bvx
        by += bvy
    } else{
        mouseY = height/2
        oppy = height/2
    }

    if(autopilot){
        mouseY = by
    }
    
    if(bvy > 0){
        // box top
        if(bx > bl.x && bx < br.x){
            if(by > tl.y && by < tl.y + buffer){
                bvy = -bvy
            }
        }
    } else{
        // box bottom
        if(bx > bl.x && bx < br.x){
            if(by < bl.y && by > bl.y - buffer){
                bvy = -bvy
            }
        }
    }

    if(bvx > 0){
        // box left
        if(bl.y > _tr.y && tl.y < _br.y){
            if(_br.x > bl.x && _br.x < bl.x + buffer){
                bvx = -bvx
            }
        }

        if(bx + bw/2 >= width - padw){
            if(by > oppy - padh/2 && by < oppy + padh/2){
                bvx = -bvx
            } else{
                if(!_pause){
                    pscore++
                }
                _pause = true
            }
        }

        if(bx > width/2){
            if(by > oppy) {
                oppy += opps
            }
            if(by < oppy) {
                oppy -= opps
            }
        }
    } else {
        // box right
        if(bl.y > _tr.y && tl.y < _br.y){
            if(_bl.x < br.x && _bl.x > br.x - buffer){
                bvx = -bvx
            }
        }

        if(bx - bw/2 <= padw){
            if(by > mouseY - padh/2 && by < mouseY + padh/2){
                bvx = -bvx
            } else {
                if(!_pause){
                    oscore++
                }
                _pause = true
            }
        }

        if(oppy > height/2){
            oppy -= opps
        }
        if(oppy < height/2){
            oppy += opps
        }
    }

    if(bvy > 0){
        // box top
        if(bx > bl.x && bx < br.x){
            if(by > tl.y && by < tl.y + buffer){
                bvy = -bvy
            }
        }
    } else{
        // box bottom
        if(bx > bl.x && bx < br.x){
            if(by < bl.y && by > bl.y - buffer){
                bvy = -bvy
            }
        }
    }

    if((by - bw/2) <= 0 || (by + bw/2) >= height){
        bvy = -bvy
    }

    fill(0)
    rect(padw/2, mouseY, padw, padh)
    rect(width-padw/2, oppy, padw, padh)
}

function keyPressed(){
    // spacebar
    if(keyCode == 32){
        pausedbutlikeforreal = !pausedbutlikeforreal
    }

    // A
    if(keyCode == 65){
        autopilot = !autopilot
    }
}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
}
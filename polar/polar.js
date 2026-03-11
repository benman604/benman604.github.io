let __curvesize = 180;
let curvesize = __curvesize;
let curvesize_multiplier = 1
const numlines = 100
const numballs = 2
const ballsize = 30
let xoff = 368 / 2
let yoff = 0
const gravity = 0.4
const elasticity = 0.96

let a = 5
document.getElementById('newshape').addEventListener('click', () => {
    let olda = a;
    while (olda == a) {
        a = random([3,4,5,6,7])
    }
})

document.getElementById('addball').addEventListener('click', () => {
    let t = random(0, 2 * PI);
    let radius = r(t) - ballsize;
    addBall(radius * cos(t), radius * sin(t));
})

document.getElementById('remball').addEventListener('click', () => {
    balls.pop();
})

const r = (t) => curvesize * (1 + sin(a * t + millis() / 1000) / a)
const drdt = (t) => curvesize * cos(a * t + millis() / 1000)
const dx = (v) => drdt(v) * cos(v) - sin(v) * r(v);
const dy = (v) => drdt(v) * sin(v) + cos(v) * r(v);

let balls = []

function addBall(x, y) {
    balls.push({
        x: x,
        y: y,
        vx: 0,
        vy: 0,
        r: ballsize,
        color: {h: random(0, 360), s: 70, l: 50}
    })
}

function setup() {
    const container = document.getElementById('sketch');
    const w = container ? container.offsetWidth : windowWidth;
    const h = container ? container.offsetHeight : windowHeight;
    let canvas = createCanvas(w, h);
    canvas.parent('sketch');

    for (let i=0; i<numballs; i++) {
        let t = random(0, 2 * PI);
        let radius = r(t) - ballsize;
        addBall(radius * cos(t), radius * sin(t));
    }
}

function draw() {
    background(backgroundColor.r, backgroundColor.g, backgroundColor.b);
    // fill(highlightColor.r, highlightColor.g, highlightColor.b);
    translate(width/2 + xoff, height/2 + yoff);
    // ellipse(0, 0, 5)
        
    let prevx = r(0) * cos(0)
    let prevy = -1 * (r(0) * sin(0))
    let increment = 2 * PI / numlines
        
    // Draw the vector field
    stroke(lighterColor)
    strokeWeight(1)
    for (let i=-(width/2)-xoff; i<-(width/2)-xoff+width; i+=30) {
        for (let j=-(height/2)-yoff; j<-(height/2)-yoff+height+1; j+=30) {
            let ballr = atan2(j, i);
            let mtan = dy(ballr) / dx(ballr);
            if (dx(ballr) == 0) mtan = 0;
    
            let x1 = sqrt(1 / (1 + mtan * mtan));
            let y1 = x1 * mtan;
    
            x1 *= 3;
            y1 *= 3;
    
            line(i - x1, j - y1, i + x1, j + y1);
        }
    }
        
    stroke(outlineColor)
    strokeWeight(2.5)
    for (let i = increment; i <= 2 * PI; i += increment) {
        let x = r(i) * cos(i)
        let y = r(i) * sin(i)
        line(prevx, prevy, x, y)
        prevx = x
        prevy = y
    }
    
    for (let i=0; i<balls.length; i++) {
        let ball = balls[i]
        let ballr = atan2(ball.y, ball.x)
        let bound = r(ballr)
        let bdist = dist(0, 0, ball.x, ball.y) + ball.r / 2

        for (let j=i+1; j<balls.length; j++) {
            let otherball = balls[j];
            let posdx = otherball.x - ball.x
            let posdy = otherball.y - ball.y
            let bdist = dist(0, 0, posdx, posdy)
            let overlap = ball.r/2 + otherball.r/2 - bdist
            if (bdist < ball.r/2 + otherball.r/2) {
                let normx = posdx / bdist
                let normy = posdy / bdist
                let tanx = -normy
                let tany = normx
                let viBallNorm = ball.vx * normx + ball.vy * normy
                let viOtherballNorm = otherball.vx * normx + otherball.vy * normy
                let viBallTan = ball.vx * tanx + ball.vy * tany
                let viOtherballTan = otherball.vx * tanx + otherball.vy * tany
                let vfBall = viOtherballNorm * elasticity
                let vfOtherball = viBallNorm * elasticity
                ball.vx = vfBall * normx + viBallTan * tanx
                ball.vy = vfBall * normy + viBallTan * tany
                otherball.vx = vfOtherball * normx + viOtherballTan * tanx
                otherball.vy = vfOtherball * normy + viOtherballTan * tany

                ball.x -= normx * overlap / 2
                ball.y -= normy * overlap / 2
                otherball.x += normx * overlap / 2
                otherball.y += normy * overlap / 2
            }
        }
            
        if (bdist > bound) {
            let mtan = dy(ballr) / dx(ballr)
            let mnorm = -1 / mtan
            let x1 = mtan / sqrt(pow(mtan, 2) + 1)
            
            let orthAngle = atan2(mnorm * x1, x1)
            let viAngle = atan2(ball.vy, ball.vx)
            let vMag = -elasticity * dist(0, 0, ball.vx, ball.vy)
            let vfAngle = 2 * orthAngle - viAngle
            
            ball.vx = vMag * cos(vfAngle)
            ball.vy = vMag * sin(vfAngle)
            ball.x = (bound - ball.r / 2) * cos(ballr)
            ball.y = (bound - ball.r / 2) * sin(ballr)
        }
            
        noStroke()
        colorMode(HSL)
        fill(ball.color.h, ball.color.s, ball.color.l)
        ellipse(ball.x, ball.y, ball.r)
        colorMode(RGB)
        
        ball.x += ball.vx
        ball.y += ball.vy
        
        ball.vy += gravity
    }
}

function mousePressed() {
    let relMouseX = mouseX - width/2 - xoff
    let relMouseY = mouseY - height/2 - yoff
    let mouser = atan2(relMouseY, relMouseX)
    let bound = r(mouser)
    if (dist(0, 0, relMouseX, relMouseY) < bound) {
        balls.push({
            x: relMouseX,
            y: relMouseY,
            vx: 0,
            vy: 0,
            r: ballsize,
            color: {h: random(0, 360), s: 70, l: 50}
        })
    }
}

function windowResized() {
    const container = document.getElementById('sketch');
    const w = container ? container.offsetWidth : windowWidth;
    const h = container ? container.offsetHeight : windowHeight;
    resizeCanvas(w, h)
}

function onUpdateColorTheme() {}

// for mobile devices
const mediaQuery = window.matchMedia('(max-width: 850px)');

function checkMediaQuery() {
  if (mediaQuery.matches) {
    xoff = 0;
    yoff = 0;
    curvesize_multiplier = 0.7;
    curvesize = __curvesize * curvesize_multiplier;
  } else {
    xoff = 368 / 2;
    yoff = 0;
    curvesize_multiplier = 1;
    curvesize = __curvesize * curvesize_multiplier;
  }
}

checkMediaQuery();
mediaQuery.addEventListener('change', checkMediaQuery);
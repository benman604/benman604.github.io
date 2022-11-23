function setup(){
    let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    canvas.parent('sketch');
}

let spacing = 100
function draw(){
    background(255);
    for(let i=0; i<width+50; i+=spacing+50){
        for(let j=0; j<height+50; j+=spacing+50){
            push()
            let x = i - width/2 + 10
            let y = j - height/2 + 10
            translate(x, y, -10)
            let angle = atan2((mouseY - height/2) - y, (mouseX - width/2) - x)
            rotateX(angle)
            rotateY(angle)
            rotateZ(angle)
            
            let d = dist(i, j, mouseX, mouseY)
            fill(0, 0, 0, 150 - d)
            box(min(spacing/2 + 2000/d, 100))
            pop()
        }
    }
}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
}
function setup(){
    let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    canvas.parent('sketch');
}

let spacing = 100
function draw(){
    background(255);
    for(let i=0; i<width; i+=spacing){
        for(let j=0; j<height; j+=spacing){
            push()
            let x = i - width/2 + 10
            let y = j - height/2 + 10
            translate(x, y, -10)
            let angle = atan2(mouseY - height/2, mouseX - width/2)
            rotateX(angle)
            rotateY(angle)
            rotateZ(angle)
            
            let d = dist(i, j, mouseX, mouseY)
            if(d < spacing*0.5){
                fill(0)
                rotateX(frameCount * 0.01)
                rotateY(frameCount * 0.01)
            }
            box(min(spacing/2 + 2000/d, 200))
            pop()
        }
    }
}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
}
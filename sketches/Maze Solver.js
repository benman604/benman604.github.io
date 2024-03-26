let tl = {x: 0, y: 0}
let tr = {x: 630, y: 0}
let bl = {x: 0, y: 430}
let br = {x: 630, y: 430}
let w = 50
let rows
let cols
let grid = []

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight)
    canvas.parent('sketch')
    tl.x = (windowWidth / 2) - 335
    tl.y = (windowHeight / 2) - 245
    tr.x += tl.x; bl.x += tl.x; br.x += tl.x
    tr.y += tl.y; bl.y += tl.y; br.y += tl.y

    rows = floor(height / w)
    cols = floor(width / w)
    w = min(width / cols, height / rows) 

    for (var j = 0; j < rows; j++) {
        for (var i = 0; i < cols; i++) {
            var cell = new Cell(i, j);
            grid.push(cell);
        }
    }
}

function draw() {
    background(255) 
    fill(0) 

    rect(tl.x, tl.y, w) 
    rect(tr.x, tr.y, w) 
    rect(bl.x, bl.y, w) 
    rect(br.x, br.y, w) 

    for(let i=0; i<grid.length; i++) {
        grid[i].draw()
    }
}

function Cell(i, j) {
    this.i = i
    this.j = j
    this.walls = { t: true, r: true, b: true, l: true }

    this.draw = () => {
        let x = this.i * w;
        let y = this.j * w;
        
        if(this.walls.t) { line(x, y, x + w, y) }
        if(this.walls.r) { line(x + w, y, x + w, y + w) }
        if(this.walls.b) { line(x + w, y + w, x, y + w) }
        if(this.walls.l) { line(x, y + w, x, y) }
    }
}
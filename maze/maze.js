var _strokeWeight = 2
var padding = 50
var boxSize = 27.5

var leftx = 409
var rightx = 368
var yfromcenter = (380 / 2)

var grid = []
let current
var first
var last
let stack = []

var msBetweenSteps = 10
var generateMazeInstantly = true

let done = false

let canvasWidth;
let canvasHeight;

var _end_y = 255;

function setup() {
	// document.querySelectorAll('.buttons-map').forEach(element => {
	// 	element.style.display = 'none';
	// });
	// document.getElementById('buttons-maze').style.display = 'block';

	const container = document.getElementById('sketch');
	canvasWidth = container ? container.offsetWidth : windowWidth;
	canvasHeight = container ? container.offsetHeight : windowHeight;
	let canvas = createCanvas(canvasWidth, canvasHeight);
	canvas.parent('sketch');

	generateMaze()
}

function generateMaze() {
	let numCellsAbove = floor((canvasHeight / 2 - yfromcenter) / boxSize)
	numCellsAbove = 0
	let startY = (canvasHeight / 2 - yfromcenter) - numCellsAbove * boxSize + 10
	let endY = (canvasHeight / 2 + yfromcenter) + numCellsAbove * boxSize 

	boxSize = 380 / 15 + 0.1

	let i = 0
	let j = 0
	grid = []
	done = false
	setButtonsEnabled(false)
	dfsstack = []
	bfsqueue = []
	distTo = new Map()

	if (windowWidth < 850) {
		document.getElementById('topSection').style.borderBottom = 'none'

		// let bottomOfStage = document.getElementById('panel').getBoundingClientRect().bottom 
		// let stageWidth = canvasWidth - padding - _strokeWeight
		// boxSize = canvasWidth / 25
		boxSize = canvasWidth / Math.round(canvasWidth / 25)

		let y = 0;

		for (let x = 0; x < canvasWidth - boxSize + 1; x += boxSize){
			grid.push([])
			for(y = 0; y < canvasHeight - boxSize - 1; y += boxSize){
				let cell = new Cell(i, j, x, y)
				cell.enable = true
				grid[i].push(cell)
				j++
			}
			i++
			j=0
		}
		_end_y = y;

	} else {

		// boxSize = 27.5
		for (let x = leftx; x < canvasWidth - boxSize - padding / 2 - 50; x += boxSize){
			grid.push([])
			for(let y = startY; y < endY; y += boxSize){
				let cell = new Cell(i, j, x, y)
				if((y > height / 2 + yfromcenter || y < height / 2 - yfromcenter) || (x > rightx)){
					cell.enable = true
				}
				grid[i].push(cell)
				j++
			}
			i++
			j=0
		}

	}

	// set first and last to random cells in the grid until they are not the same and they are enabled
	do {
		first = grid[floor(random(grid.length))][floor(random(grid[0].length))]
		last = grid[floor(random(grid.length))][floor(random(grid[0].length))]
	} while(first == last || !first.enable || !last.enable)

	do {
		current = grid[floor(random(grid.length))][floor(random(grid[0].length))]
	} while(!current.enable)

	nextStepMaze()
}

function nextStepMaze() {
	background(20)

	current.visited = true
	current.ready = true

	let next = random(current.getNeighbors())
	if(next && !done) {

		if(next.i == current.i + 1) {
			current.right = false
			next.left = false
		}
		if(next.i == current.i - 1) {
			current.left = false
			next.right = false
		}
		if(next.j == current.j + 1) {
			current.bottom = false
			next.top = false
		}
		if(next.j == current.j - 1) {
			current.top = false
			next.bottom = false
		}


		next.visited = true
		stack.push(current)
		current = next
	} else if(stack.length > 0) {
		current = stack.pop()
	} else if(!done){
		done = true
		current = null
		onMazeGenerated()
	}

	if(!done) {
		if (generateMazeInstantly) {nextStepMaze()}
		else {setTimeout(nextStepMaze, 1)}
	}
}

function onMazeGenerated() {
	setButtonsEnabled(true)
	points = []
	dfsstack = []
	bfsqueue = []
	distTo = new Map()

	for(let i=0; i<grid.length; i++){
		for(let j=0; j<grid[i].length; j++){
			grid[i][j].visited = false
			grid[i][j].ready = true
		}
	}
}

function draw() {
	background(backgroundColor.r, backgroundColor.g, backgroundColor.b)

	if (windowWidth >= 430) {
		translate(0, -6)
	} 

	// rectMode(CENTER)
	// fill(255, 0, 0)
	// ellipse(rightx, height / 2 + yfromcenter, 10, 10)
	// ellipse(rightx, height / 2 - yfromcenter, 10, 10)

	// fill(0, 255, 0)
	// ellipse(leftx, height / 2 + yfromcenter, 10, 10)
	// ellipse(leftx, height / 2 - yfromcenter, 10, 10)

	for(let i=0; i<grid.length; i++){
		for(let j=0; j<grid[i].length; j++){
			grid[i][j].show()
		}
	}

	if(current) {
		fill(outlineColor)
		noStroke()
		rectMode(CORNER)
		rect(current.x, current.y, boxSize)
	}

	distTo.forEach((value, key, innerMap) => {
		if (value.score) {
			fill(lighterColor)
			noStroke()
			text(Math.round(value.score * 1000) / 1000, key.x + 5, key.y + 15)
		}
	})

	if(dfsstack.length > 1){	
		for(let i=0; i<dfsstack.length-1; i++) {
			stroke(highlightColor.r, highlightColor.g, highlightColor.b)
			strokeWeight(3)  
			line(dfsstack[i].x + boxSize/2, dfsstack[i].y + boxSize/2, dfsstack[i+1].x + boxSize/2, dfsstack[i+1].y + boxSize/2) 
		}
	}

	if (done) {
		fill(highlightColor.r, highlightColor.g, highlightColor.b)
		noStroke()
		rectMode(CENTER)
		ellipse(first.x + boxSize / 2, first.y + boxSize / 2, boxSize / 2)
		triangle(last.x + boxSize / 2, last.y + boxSize / 2 - boxSize / 3, last.x + boxSize / 2 - Math.sqrt(3) * boxSize / 6, last.y + boxSize / 2 + boxSize / 6, last.x + boxSize / 2 + Math.sqrt(3) * boxSize / 6, last.y + boxSize / 2 + boxSize / 6);
	}

	if (windowWidth < 850) {
		// Since we got rid of the bottom border
		// and are now relying on the bottom of the maze be be a border
		// draw a rect of page background color to make it
		// look like its part of the page (and not the sketch)
		fill(pageBackgroundColor.r, pageBackgroundColor.g, pageBackgroundColor.b)
		rectMode(CORNER);
		noStroke();
		rect(0, _end_y + _strokeWeight, canvasWidth, canvasHeight);
	}
	// rect(0, 0, leftx + boxSize / 2, canvasHeight)
}

document.getElementById('regen').addEventListener('click', generateMaze)

function setButtonsEnabled(val) {
	document.getElementById('regen').disabled = !val
	document.getElementById('astar').disabled = !val
	// document.getElementById('dijkstra').disabled = !val
	document.getElementById('dfs').disabled = !val
	document.getElementById('bfs').disabled = !val
}

function windowResized() {
	const container = document.getElementById('sketch');
	const w = container ? container.offsetWidth : windowWidth;
	const h = container ? container.offsetHeight : windowHeight;
	resizeCanvas(w, h)
}

function onUpdateColorTheme() {}
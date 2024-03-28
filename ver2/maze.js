var _strokeWeight = 2
var padding = 3
var boxSize = 51
var tlx = 314 + _strokeWeight + padding
var tcx = 8 + _strokeWeight + padding 
var tcy = 412 + _strokeWeight + padding
var grid = []
let current
var first
var last
let stack = []

var msBetweenSteps = 10
var generateMazeInstantly = true

let done = false

function setup() {
	let canvas = createCanvas(windowWidth, windowHeight);
	canvas.parent('sketch');

	generateMaze()
	// frameRate(5)
}

function generateMaze() {
	let i = 0
	let j = 0
	grid = []
	done = false
	setButtonsEnabled(false)
	dfsstack = []
	bfsqueue = []

	for (let x = tcx - _strokeWeight; x < windowWidth - boxSize - _strokeWeight - padding - 5; x += boxSize){
		grid.push([])
		for(let y = padding - _strokeWeight; y < windowHeight - boxSize - _strokeWeight - padding - 5; y += boxSize){
			let cell = new Cell(i, j, x, y)
			if(x > tlx || y > tcy){
				cell.enable = true
			}
			grid[i].push(cell)
			j++
		}
		i++
		j=0
	}

	// set first and last to random cells in the grid until they are not the same and they are enabled
	do {
		first = grid[floor(random(grid.length))][floor(random(grid[0].length))]
		last = grid[floor(random(grid.length))][floor(random(grid[0].length))]
	} while(first == last || !first.enable || !last.enable)

	current = grid[floor(grid.length / 2)][floor(grid[0].length / 2)]
	nextStepMaze()
}

function draw() {
	background(20)

	for(let i=0; i<grid.length; i++){
		for(let j=0; j<grid[i].length; j++){
			grid[i][j].show()
		}
	}

	if(current) {
		fill(100)
		noStroke()
		rectMode(CORNER)
		rect(current.x, current.y, boxSize)
	}

	distTo.forEach((value, key, innerMap) => {
		if (value.score) {
			fill(100)
			noStroke()
			text(Math.round(value.score * 1000) / 1000, key.x + 5, key.y + 15)
		}
	})

	if(dfsstack.length > 1){	
		for(let i=0; i<dfsstack.length-1; i++) {
			stroke(200,255,40)
			strokeWeight(2)  
			line(dfsstack[i].x + boxSize/2, dfsstack[i].y + boxSize/2, dfsstack[i+1].x + boxSize/2, dfsstack[i+1].y + boxSize/2) 
		}
	}

	if (done) {
		fill(200,255,40)
		noStroke()
		rectMode(CENTER)
		ellipse(first.x + boxSize / 2, first.y + boxSize / 2, boxSize / 2)
		triangle(last.x + boxSize / 2, last.y + boxSize / 2 - boxSize / 3, last.x + boxSize / 2 - Math.sqrt(3) * boxSize / 6, last.y + boxSize / 2 + boxSize / 6, last.x + boxSize / 2 + Math.sqrt(3) * boxSize / 6, last.y + boxSize / 2 + boxSize / 6);
	}
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

document.getElementById('regen').addEventListener('click', generateMaze)

function setButtonsEnabled(val) {
	document.getElementById('regen').disabled = !val
	document.getElementById('astar').disabled = !val
	// document.getElementById('dijkstra').disabled = !val
	document.getElementById('dfs').disabled = !val
	document.getElementById('bfs').disabled = !val
}

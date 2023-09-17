var _strokeWeight = 2
var padding = 3
var boxSize = 51
var tlx = 314 + _strokeWeight + padding
var tcx = 9 + _strokeWeight + padding 
var tcy = 412 + _strokeWeight + padding
var grid = []
let current
var last
let stack = []

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

	current = grid[7][0]
	last = grid[grid.length-1][grid[grid.length-1].length - 1]
}

function draw() {
	background(20)

	for(let i=0; i<grid.length; i++){
		for(let j=0; j<grid[i].length; j++){
			grid[i][j].show()
		}
	}

	current.visited = true
	let next = current.checkNeighbors()
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
	} else {
		rectMode(CENTER)
		noStroke()
		fill(100, 255, 100) 
		rect(last.x + boxSize/2, last.y + boxSize/2, boxSize/2) 

		if(!done){
			done = true
			onMazeGenerated()
		}
	}

	if(dfsstack.length > 1){	
		for(let i=0; i<dfsstack.length-1; i++) {
			stroke(0,0,255)
			strokeWeight(2)  
			line(dfsstack[i].x + boxSize/2, dfsstack[i].y + boxSize/2, dfsstack[i+1].x + boxSize/2, dfsstack[i+1].y + boxSize/2) 
		}
	}
}

function onMazeGenerated() {
	setButtonsEnabled(true)
	points = []
	for(let i=0; i<grid.length; i++){
		for(let j=0; j<grid[i].length; j++){
			grid[i][j].visited = false
			grid[i][j].k = 0
			grid[i][j].visitTimes = 0
			grid[i][j].doneForGood = false
		}
	}
}

document.getElementById('regen').addEventListener('click', generateMaze)

function setButtonsEnabled(val) {
	document.getElementById('astar').disabled = !val
	document.getElementById('dijkstra').disabled = !val
	document.getElementById('dfs').disabled = !val
	document.getElementById('bfs').disabled = !val
}

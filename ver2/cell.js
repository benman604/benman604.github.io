const directions = [
	[-1, 0], // top
	[0, 1],  // right
	[1, 0],  // bottom
	[0, -1]  // left
];

function Cell(i, j, x, y) {
	this.x = x
	this.y = y

	this.i = i
	this.j = j

	this.top = true
	this.bottom = true
	this.left = true
	this.right = true

	this.visited = false

	this.show = () => {
		if (!this.enable) {return}
		noFill()
		strokeWeight(_strokeWeight)
		stroke(255)
		// rect(i, j, boxSize) 

		if (this.top)
			line(x, y, x+boxSize, y)
		if (this.right)
			line(x+boxSize, y, x+boxSize, y+boxSize)
		if (this.bottom)
			line(x+boxSize, y+boxSize, x, y+boxSize)
		if(this.left)
			line(x, y+boxSize, x, y)

		if(this == current) {
			fill(255)
			noStroke() 
            rectMode(CENTER)
			rect(x + boxSize/2, y + boxSize/2, boxSize/2) 
		}

		// stroke(255)
		// text(i + ", " + j, x, y+10) 
	}

	this.checkNeighbors = () => {
		let neighbors = [];
		
		for (const [dx, dy] of directions) {
			const newRow = i + dx;
			const newCol = j + dy;
		
			if (
				newRow >= 0 &&
				newRow < grid.length &&
				newCol >= 0 &&
				newCol < grid[newRow].length &&
				!grid[newRow][newCol].visited &&
				grid[newRow][newCol].enable
			) {
				neighbors.push(grid[newRow][newCol]);
			}
		}

		if (neighbors.length > 0) {
			return random(neighbors) 
		} else {
			return undefined
		}
	}
}
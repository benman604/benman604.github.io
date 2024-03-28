const directions = [
	[-1, 0],
	[0, 1], 
	[1, 0],  
	[0, -1]
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

	this.enable = false
	this.ready = false

	this.show = () => {
		if (!this.enable || !this.ready) {return}

        if(this.visited && done){
            fill(50)
            noStroke()
            rectMode(CORNER)
            rect(x, y, boxSize) 
        } 
		
		if(this.isCurrent) {
			fill(100)
			noStroke() 
            rectMode(CORNER)
			// ellipse(x + boxSize/2, y + boxSize/2, boxSize/5 - padding) 
			rect(x, y, boxSize)
		}

		noFill()
		strokeWeight(_strokeWeight)
		stroke(180)

		if (this.top)
			line(x, y, x+boxSize, y)
		if (this.right)
			line(x+boxSize, y, x+boxSize, y+boxSize)
		if (this.bottom)
			line(x+boxSize, y+boxSize, x, y+boxSize)
		if(this.left)
			line(x, y+boxSize, x, y)

		// stroke(255)
		// text(i + "," + j, x, y+10) 
	}

	this.getNeighbors = () => {
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
				neighbors.push(grid[newRow][newCol])
			}
		}

		return neighbors
	}

    this.whereCanGo = () => {
		let neighbors = [];

        let dir = []
        if (!this.right)    dir.push([1, 0])
        if (!this.bottom)   dir.push([0, 1])
        if (!this.left)     dir.push([-1, 0])
        if (!this.top)      dir.push([0, -1])

		for (const [dx, dy] of dir) {
			const newRow = i + dx;
			const newCol = j + dy;

            let m = grid[newRow]
			let n
			if (m) {n = m[newCol]}
            if (n && !n.visited){
			    neighbors.push(n);
            }
		}

		return neighbors
	}
}
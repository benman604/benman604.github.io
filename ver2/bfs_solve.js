let bfsstack = []
let bfsdone = false

function bfs(current) {
    current.visited = true
    current.isCurrent = true
    // points.push({x: current.x, y: current.y})

    if(current.i == last.i && current.j == last.j) {
        bfsstack.push(current)
        return bfsstack
    }

    let next = current.whereCanGo()
    if(next) {
        next.visited = true
        next.visitTimes = next.visitTimes + 1
        bfsstack.push(current)

        setTimeout(() => {
            current.isCurrent = false
            return bfs(next)
        }, 10)
        
        // return bfs(next)
    } else if(bfsstack.length > 0) {
        // console.log(bfsstack)
        setTimeout(() => {
            current.isCurrent = false
            return bfs(bfsstack.pop())
        }, 10)
    } else {
        return
    }
}

document.getElementById('bfs').addEventListener('click', async () => {    
    onMazeGenerated()
    bfsstack = []
    
    let result = bfs(grid[7][0])
    console.log(result)
})
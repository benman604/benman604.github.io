let dfsstack = []

function dfs(current) {
    current.visited = true
    current.isCurrent = true
    // points.push({x: current.x, y: current.y})

    if(current.i == last.i && current.j == last.j) {
        dfsstack.push(current)
        return dfsstack
    }

    let next = current.whereCanGo()
    if(next) {
        next.visited = true
        dfsstack.push(current)

        setTimeout(() => {
            current.isCurrent = false
            return dfs(next)
        }, msBetweenSteps)
        
    } else if(dfsstack.length > 0) {
        setTimeout(() => {
            current.isCurrent = false
            return dfs(dfsstack.pop())
        }, msBetweenSteps)
    } else {
        return
    }
}

document.getElementById('dfs').addEventListener('click', async () => {    
    onMazeGenerated()
    dfsstack = []
    
    let result = dfs(grid[7][0])
    console.log(result)
})
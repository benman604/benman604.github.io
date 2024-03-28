let dfsstack = []

function dfs(current) {
    current.visited = true
    current.isCurrent = true

    if(current.i == last.i && current.j == last.j) {
        dfsstack.push(current)
        return dfsstack
    }

    let n = current.whereCanGo()
    let next = n[0]
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
    
    let result = dfs(grid[first.i][first.j])
    console.log(result)
})
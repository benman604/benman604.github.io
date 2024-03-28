let bfsqueue = []
let found = false
let prevVisited = new Map()

function bfs(current) {
    if(current.i == last.i && current.j == last.j) {
        current.visited = true
        current.isCurrent = true
        found = true

        let trace = prevVisited.get(current)
        while(trace) {
            dfsstack.push(trace)
            trace = prevVisited.get(trace)
        }
        dfsstack.unshift(grid[last.i][last.j])
        return
    }

    current.visited = true
    current.isCurrent = true

    let possible = current.whereCanGo(true)
    for (let neighbor of possible) {
        bfsqueue.push(neighbor)
        prevVisited.set(neighbor, current)
    }

    if (bfsqueue.length > 0) {
        setTimeout(() => {
            current.isCurrent = false
            return bfs(bfsqueue.shift())
        }, msBetweenSteps)
    } else {
        return
    }
}

document.getElementById('bfs').addEventListener('click', async () => {
    onMazeGenerated()
    bfsqueue = []
    found = false
    let result = bfs(grid[first.i][first.j])
    console.log(result + " okkk")
})
let bfsqueue = []

function bfs(current) {
    current.visited = true
    current.isCurrent = true
    bfsqueue.unshift(current)

    while (bfsqueue.length > 0) {
        let v = bfsqueue.pop()

        if (v.i == last.i && v.j == last.j) {
            return v
        }

        for (let w of v.whereCanGo(true)) {
            if (!w.visited) {
                w.visited = true
                w.parent = v
                bfsqueue.unshift(w)
            }
        }
    }
}

document.getElementById('bfs').addEventListener('click', () => {
    onMazeGenerated()
    bfsqueue = []
    console.log(bfs(grid[0][7]))
})
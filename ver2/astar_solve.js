class PriorityQueue {
    constructor() {
        this.heap = [];
    }

    push(entry) {
        this.heap.push(entry);
        this.bubbleUp(this.heap.length - 1);
    }

    shift() {
        if (this.isEmpty()) {
            return null;
        }
        const min = this.heap[0];
        const end = this.heap.pop();
        if (this.heap.length > 0) {
            this.heap[0] = end;
            this.bubbleDown(0);
        }
        return min;
    }

    bubbleUp(index) {
        const entry = this.heap[index];
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            const parent = this.heap[parentIndex];
            if (entry.value.score >= parent.value.score) {
                break;
            }
            this.heap[parentIndex] = entry;
            this.heap[index] = parent;
            index = parentIndex;
        }
    }

    bubbleDown(index) {
        const length = this.heap.length;
        const entry = this.heap[index];
        while (true) {
            let leftChildIndex = 2 * index + 1;
            let rightChildIndex = 2 * index + 2;
            let swap = null;

            if (leftChildIndex < length && this.heap[leftChildIndex].value.score < entry.value.score) {
                swap = leftChildIndex;
            }
            if (rightChildIndex < length && this.heap[rightChildIndex].value.score < (swap === null ? entry.value.score : this.heap[swap].value.score)) {
                swap = rightChildIndex;
            }

            if (swap === null) {
                break;
            }
            this.heap[index] = this.heap[swap];
            this.heap[swap] = entry;
            index = swap;
        }
    }

    isEmpty() {
        return this.heap.length === 0;
    }
}


function manhattanDistance(node1, node2) {
    return Math.abs(node1.x - node2.x) + Math.abs(node1.y - node2.y);
}

let pq = new PriorityQueue()
let distTo = new Map()

function astar(start) {
    distTo.set(start, {dist: 0, prev: null})
    pq.push({key: start, value: distTo.get(start)})
    nextAstar(start)
}

function nextAstar(current) {
    current.visited = true
    current.isCurrent = true

    if(current.i == last.i && current.j == last.j) {
        let trace = distTo.get(current)
        dfsstack.push(current)
        while(trace.prev) {
            dfsstack.push(trace.prev)
            trace = distTo.get(trace.prev)
        }
        return
    }

    let neighbors = current.whereCanGo()
    for (let neighbor of neighbors) {
        let distFromStart = distTo.get(current).dist + 1
        let distToEnd = manhattanDistance(neighbor, last) / boxSize
        let score = distFromStart + distToEnd
        if (!distTo.has(neighbor) || score < distTo.get(neighbor).score) {
            distTo.set(neighbor, {dist: distFromStart, score: score, prev: current})
            pq.push({key: neighbor, value: distTo.get(neighbor)})
        }
    }

    setTimeout(() => {
        current.isCurrent = false
        return nextAstar(pq.shift().key)
    }, msBetweenSteps)
}

document.getElementById('astar').addEventListener('click', async () => {
    onMazeGenerated()
    pq = new PriorityQueue()
    distTo = new Map()
    let result = astar(grid[first.i][first.j])
    console.log(result + " dij")
})
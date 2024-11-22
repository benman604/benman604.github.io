document.getElementById('mbfs').addEventListener('click', () => {
	if (startSelection.state === "Selecting" || endSelection.state === "Selecting") return;
    prepareForSearch();
	startSearch();

	readyToStartNextSearch = false;
    bfs(startSelection.nodeId, endSelection.nodeId);
});

async function bfs(start, end) {
	let searchID = currentSearchID;
	let bfsqueue = [];
    let tick = 0;
    let drawBuffer = [];  // Buffer to collect lines to draw

    bfsqueue.push(start);
    while (bfsqueue.length > 0) {
		// end current search if new search is started or clicked select button
		if (searchID != currentSearchID || startSelection.state === "Selecting" || endSelection.state === "Selecting") {
			bfsqueue = []
			drawBuffer = []
			readyToStartNextSearch = true;
			return;
		}
        let current = bfsqueue.shift();
		console.log(searchID, currentSearchID)

        if (tick % waitOneMsEvery === 0) {
            await new Promise(resolve => setTimeout(resolve, 1));
        }
        tick++;

        if (tick > 100) waitOneMsEvery = 100;
        if (tick > 500) waitOneMsEvery = 500;
        if (tick % 1000 === 0) waitOneMsEvery = tick * 3;

        if (current === end) {
            found = true;
            let trace = backtrace.get(current);
            while (trace) {
                path.push(trace);
                trace = backtrace.get(trace);
            }
            path.reverse();
            path.push(end);
            console.log("Path found: ", path);
            endSearch();
            return;
        }

        visited.add(current);
        let cloc = nodesMap.get(current);

        for (let neighbor of roadMap.get(current)) {
            if (!visited.has(neighbor)) {
                bfsqueue.push(neighbor);
                backtrace.set(neighbor, current);

                let nloc = nodesMap.get(neighbor);
                drawBuffer.push([cloc.x, cloc.y, nloc.x, nloc.y]);
            }
        }

        // Draw lines in batches
        if (tick % 2000 === 0 && drawBuffer.length > 0) {
            for (let line of drawBuffer) {
                mapPathOverlay.line(...line);
            }
            drawBuffer = [];  // Clear the buffer after drawing
        }
    }

    if (!found) {
        console.log("No path found");
    }
	endSearch();
}

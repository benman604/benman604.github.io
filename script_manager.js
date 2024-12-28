const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
let currSketch = 0;

let addScript = (info) => { 
    return new Promise(function(resolve, reject) { 
        let gfgData = document.createElement('script'); 
        gfgData.src = info; 
        gfgData.async = false; 
        gfgData.onload = () => { 
            resolve(info); 
        }; 
        gfgData.onerror = () => { 
            reject(info); 
        }; 
        document.body.appendChild(gfgData); 
    }); 
};


let common = ["theme.js", "priority_queue.js"]
let sketches = {
    "map": {
        scripts: ["map/map.js", "map/bfs_map.js", "map/astar_map.js"],
        buttons: ".buttons-map",
        displayname: "Map",
        source: "https://github.com/benman604/benman604.github.io/tree/v2/map"
    },
    "maze": {
        scripts: ["maze/cell.js", "maze/maze.js", "maze/astar_maze.js", "maze/bfs_maze.js", "maze/dfs_maze.js"],
        buttons: ".buttons-maze",
        displayname: "Maze",
        source: "https://github.com/benman604/benman604.github.io/tree/v2/maze"
    },
    "balls": {
        scripts: ["polar/polar.js"],
        buttons: ".buttons-polar",
        displayname: "Bouncing Balls",
        source: "https://github.com/benman604/benman604.github.io/tree/v2/polar"
    }
}

let scripts = [];
const params = new URLSearchParams(window.location.search);
if(params.has("sketch") && sketches[params.get("sketch")] !== undefined) {
    currSketch = params.get("sketch");
    scripts = sketches[params.get("sketch")].scripts
} else {
    currSketch = "map"
    scripts = sketches[currSketch].scripts
}

document.querySelectorAll(sketches[currSketch].buttons).forEach(element => {
  element.style.display = 'block';
});

const sketchesList = document.getElementById("sketchesList");

for (const [name, value] of Object.entries(sketches)) {
    if (name !== currSketch) {
        document.querySelectorAll(value.buttons).forEach(element => {
            element.style.display = 'none';
        });

        let a = document.createElement("a")
        a.innerText = value.displayname
        a.href = `?sketch=${name}`;
        sketchesList.appendChild(a);
        sketchesList.appendChild(document.createElement("br"));
    }
}

document.getElementById('sketchName').innerText = sketches[currSketch].displayname;
document.getElementById('sourceLink').href = sketches[currSketch].source;

let promiseData = []; 
[...common, ...scripts].forEach(function(info) { 
    promiseData.push(addScript(info)); 
});

console.log(promiseData)
Promise.all(promiseData).then(function() { 
    console.log('required scripts loaded successfully');
}).catch(function(gfgData) {
    console.log(gfgData + ' failed to load');
}); 

let skeys = Object.keys(sketches);
let curri = skeys.indexOf(currSketch);
prevBtn.onclick = () => {
    curri = (curri - 1 + skeys.length) % skeys.length;
    window.location.href = `?sketch=${skeys[curri]}`;
}

nextBtn.onclick = () => {
    curri = (curri + 1) % skeys.length;
    window.location.href = `?sketch=${skeys[curri]}`;
}

const whatsThisButton = document.getElementById("whatsThis");
const whatsThisModal = document.getElementById("whatsThisModal");
const whatsThisClose = document.getElementById("whatsThisClose");

whatsThisButton.onclick = () => {
    whatsThisModal.style.display = (whatsThisModal.style.display == "none") ? "block" : "none";
    sketchesModal.style.display = "none";
}

whatsThisClose.onclick = () => {
    whatsThisModal.style.display = "none";
}

const sketchesButton = document.getElementById("allSketches");
const sketchesModal = document.getElementById("allSketchesModal");
const sketchesClose = document.getElementById("allSketchesClose");

sketchesButton.onclick = () => {
    sketchesModal.style.display = (sketchesModal.style.display == "none") ? "block" : "none";
    whatsThisModal.style.display = "none";
}

sketchesClose.onclick = () => {
    sketchesModal.style.display = "none";
}

const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

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
let currSketch = params.get("sketch");
if(params.has("sketch") && sketches[currSketch] !== undefined) {
    scripts = sketches[currSketch].scripts
} else {
    currSketch = "map"
    scripts = sketches[currSketch].scripts
}

document.querySelectorAll(sketches[currSketch].buttons).forEach(element => {
  element.style.display = 'block';
});

const sketchesList = document.getElementById("sketchesList");

for (const [name, sketch] of Object.entries(sketches)) {
    if (name !== currSketch) {
        document.querySelectorAll(sketch.buttons).forEach(element => {
            element.style.display = 'none';
        });

        let a = document.createElement("a")
        a.innerText = sketch.displayname
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

// Define all the modals and their associated buttons and close buttons
const allModals = [
    {
        buttonId: "whatsThis",
        modalId: "whatsThisModal",
        closeId: "whatsThisClose"
    },
    {
        buttonId: "allSketches",
        modalId: "allSketchesModal",
        closeId: "allSketchesClose"
    },
    {
        buttonId: "projects",
        modalId: "projectsModal",
        closeId: "projectsClose"
    }
];

// Function to initialize modals
function initializeModals(modals) {
    modals.forEach(({ buttonId, modalId, closeId }) => {
        const button = document.getElementById(buttonId);
        const modal = document.getElementById(modalId);
        const close = document.getElementById(closeId);

        // Toggle modal visibility when the button is clicked
        button.onclick = () => {
            // Open the clicked modal
            modal.style.display = (modal.style.display === "none") ? "block" : "none";
            button.classList.toggle("activemodal");
            // Close all other modals
            modals.forEach(({ modalId: otherModalId, buttonId: otherButtonId }) => {
                if (otherModalId !== modalId) {
                    const otherModal = document.getElementById(otherModalId);
                    const otherButton = document.getElementById(otherButtonId);
                    if (otherModal) {
                        otherModal.style.display = "none"
                        otherButton.classList.remove("activemodal");
                    };
                }
            });
        };

        // Close modal when the close button is clicked
        close.onclick = () => {
            modal.style.display = "none";
            button.classList.remove("activemodal");
        };
    });
}

// Close all modals and hide main panel
document.getElementById('hide-panel').addEventListener('click', () => {
    let panel = document.getElementById('panel');
    if (panel.style.display === "none") {
        panel.style.display = "block";
        document.getElementById('hide-panel').innerText = "Hide panel";
    } else {
        panel.style.display = "none";
        document.getElementById('hide-panel').innerText = "Show panel";
    }

    // Close all modals when the panel is hidden
    allModals.forEach(({ closeId }) => {
        document.getElementById(closeId).click();
    });
});

// Initialize all modals
initializeModals(allModals);

document.getElementById("projects").click();
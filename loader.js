let scripts = ["Bounce", "Walkers", "Twist", "Cubes", "Wavemaker", "Penrose Tiles", "Game of Life", "Physics"]
let notes = ["", "", "", "", "", "adapted from David Blitz", "adapted from natureofcode", "mouse left: drag\nmouse right: create\nspace: enable thing"]
let nextbtn = document.getElementById("next")
let prevbtn = document.getElementById("prev")
let sktname = document.getElementById("sketchName")

const params = new URLSearchParams(window.location.search);
if(params.has("sketch")){
    loadScript(params.get("sketch"))
} else{
    loadScript(Math.floor(Math.random() * scripts.length))
}

function loadScript(scriptIndex){
    let script = scripts[scriptIndex]
    document.getElementById("sketchScript").src = "sketches/" + script + ".js"
    document.getElementById("author").innerText = notes[scriptIndex]

    sktname.innerText = script
}

function gotoScript(scriptIndex){
    window.location.href = "?sketch=" + scriptIndex
}

nextbtn.addEventListener("click", function(){
    let scriptIndex = scripts.indexOf(sktname.innerText)
    if(scriptIndex < scripts.length - 1){
        gotoScript(scriptIndex + 1)
    } else{
        gotoScript(0)
    }
})

prevbtn.addEventListener("click", function(){
    let scriptIndex = scripts.indexOf(sktname.innerText)
    if(scriptIndex > 0){
        gotoScript(scriptIndex - 1)
    } else{
        gotoScript(scripts.length - 1)
    }
})
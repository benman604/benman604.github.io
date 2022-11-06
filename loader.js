let scripts = ["Bounce", "Walkers", "Twist", "Cubes", "Wavemaker", "Penrose Tiles", "Game of Life", "Physics"]
let notes = [
    "", 
    "", 
    "", 
    "", 
    "", 
    "adapted from David Blitz", 
    "mouse left: create\nmouse right: destroy\nspace: pause/play\nbackspace: clear\n", 
    "mouse left: drag\nmouse right: create\nspace: enable thing"
]
let disableOnMobile = ["Bounce", "Physics", "Game of Life"]

// if device is mobile, disable some scripts
if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
    for(let i=0; i<disableOnMobile.length; i++){
        let index = scripts.indexOf(disableOnMobile[i])
        if(index > -1){
            scripts.splice(index, 1)
            notes.splice(index, 1)
        }
    }
}

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
    document.getElementById("sourceLink").href = "https://github.com/benman604/benman604.github.io/blob/v2/sketches/" + script + ".js"
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

// prevent context menu when right clicking the canvas
document.addEventListener("contextmenu", function(e){
    if(e.target.className === "container"){
        e.preventDefault();
    }
})

// prevent text select when dragging mouse on canvas
window.addEventListener('selectstart', function(e){
    if(e.target.className === "container"){
        e.preventDefault();
    }
});
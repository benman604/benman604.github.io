let scripts = ["Bounce", "Walkers", "Twist", "Cubes", "Wavemaker", "Penrose Tiles", "Game of Life"]
let authors = ["Benjamin Man", "Benjamin Man", "Benjamin Man", "Benjamin Man", "Aatish Bhatia", "David Blitz", "natureofcode"]
let nextbtn = document.getElementById("next")
let prevbtn = document.getElementById("prev")
let sktname = document.getElementById("sketchName")

const params = new URLSearchParams(window.location.search);
if(params.has("script")){
    loadScript(params.get("script"))
} else{
    loadScript(Math.floor(Math.random() * scripts.length))
}

function loadScript(scriptIndex){
    let script = scripts[scriptIndex]
    document.getElementById("sketchScript").src = "sketches/" + script + ".js"
    if(authors[scriptIndex] !== "Benjamin Man"){
        document.getElementById("author").innerText = "adapted from " + authors[scriptIndex]
    }
    sktname.innerText = script
}

function gotoScript(scriptIndex){
    window.location.href = "?script=" + scriptIndex
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

document.getElementById('clickmail').addEventListener("click", function(event) {
    event.preventDefault();
    window.location.href = "mailto:8k1x54yhv@relay.firefox.com"
})
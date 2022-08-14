let scripts = ["Bounce", "Walkers", "Twist"]
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
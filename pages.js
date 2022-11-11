// let projectsbtn = document.getElementById("projectsbtn")
// let projects = document.getElementById("projects")
let homebtn = document.querySelectorAll(".homebtn")
let home = document.getElementById("home")
let sketchesbtn = document.getElementById("sketchesbtn")
let sketches = document.getElementById("sketches")

// projectsbtn.addEventListener("click", function(){
//     projects.style.display = "block"
//     sketches.style.display = "none"
//     home.style.display = "none"
// })

for(let b of homebtn){
    b.addEventListener("click", function(){
        // projects.style.display = "none"
        sketches.style.display = "none"
        home.style.display = "block"
    })
}

sketchesbtn.addEventListener("click", function(){
    // projects.style.display = "none"
    sketches.style.display = "block"
    home.style.display = "none"
})

document.getElementById('clickmail').addEventListener("click", function(event) {
    event.preventDefault();
    window.location.href = "mailto:8k1x54yhv@relay.firefox.com"
})
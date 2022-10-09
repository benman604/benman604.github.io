let projectsbtn = document.getElementById("projectsbtn")
let projects = document.getElementById("projects")
let homebtn = document.getElementById("homebtn")
let home = document.getElementById("home")

projectsbtn.addEventListener("click", function(){
    projects.style.display = "block"
    home.style.display = "none"
})

homebtn.addEventListener("click", function(){
    projects.style.display = "none"
    home.style.display = "block"
})

document.getElementById('clickmail').addEventListener("click", function(event) {
    event.preventDefault();
    window.location.href = "mailto:8k1x54yhv@relay.firefox.com"
})
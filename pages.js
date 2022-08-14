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
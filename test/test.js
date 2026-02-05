var sketch_container_id = "sketch"

function setup() {
    let container = document.getElementById(sketch_container_id);
    let canvas = createCanvas(container.offsetWidth, container.offsetHeight);
    canvas.parent(sketch_container_id);
    strokeWeight(10);
    stroke(255, 0, 0);
    fill(0, 0, 255);
    background(220);
    rect(0, 0, width, height); 
}
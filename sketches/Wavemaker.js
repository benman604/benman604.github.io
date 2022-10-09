let t = 0; // time variable

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch');
  noStroke();
}

function draw() {
  background(255);
  fill('rgb(55, 80, 224)');

  // make a x and y grid of ellipses
  for (let x = 0; x <= width + 10; x = x + 50) {
    for (let y = 0; y <= height + 5; y = y + 50) {
      // starting point of each circle depends on mouse position
      const xAngle = map(0, 0, width, -4 * PI, 4 * PI, true);
      const yAngle = map(0, 0, height, -4 * PI, 4 * PI, true);
      // and also varies based on the particle's location
      const angle = xAngle * (x / width) + yAngle * (y / height);

      // each particle moves in a circle
      const myX = x + 20 * cos(2 * PI * t + angle);
      const myY = y + 20 * sin(2 * PI * t + angle);

      ellipse(myX, myY, 5); // draw particle
    }
  }

  t = t + 0.01; // update time
}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight)
}
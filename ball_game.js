let cam;
let thresholdLevel;
let x = 50;
let y = 50;
let speedX = 2;
let speedY = 3;
let circleRadius = 25;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Create a video capture object for webcam
  cam = createCapture(VIDEO);
  cam.hide(); // Hide the video element since we'll be drawing it to the canvas

  thresholdLevel = 127;
}

function draw() {
  background(255);
  
  // Draw the webcam video feed onto the canvas
  image(cam, 0, 0, width, height);

  fill(0, 250, 255);
  ellipse(x, y, 2 * circleRadius, 2 * circleRadius);

  x += speedX;
  y += speedY;

  if (x - circleRadius < 0 || x + circleRadius > width || isCircleOverlappingThreshold()) {
    speedX *= -1;
  }

  if (y - circleRadius < 0 || y + circleRadius > height || isCircleOverlappingThreshold()) {
    speedY *= -1;
  }

  drawThresholdSlider();
}

function drawThresholdSlider() {
  fill(200);
  rect(50, height - 50, 200, 20);

  fill(100);
  let sliderX = map(thresholdLevel, 0, 255, 50, 250);
  rect(sliderX - 5, height - 55, 10, 30);
}

function mouseDragged() {
  if (mouseY > height - 60 && mouseY < height - 30 && mouseX > 50 && mouseX < 250) {
    thresholdLevel = map(mouseX, 50, 250, 0, 255);
  }
}

function isCircleOverlappingThreshold() {
  let margin = 5; // Increase the margin for better detection

  for (let i = Math.floor(x - circleRadius - margin); i <= Math.ceil(x + circleRadius + margin); i++) {
    for (let j = Math.floor(y - circleRadius - margin); j <= Math.ceil(y + circleRadius + margin); j++) {
      if (i >= 0 && i < width && j >= 0 && j < height && brightness(cam.pixels[j * width + i]) < thresholdLevel) {
        return true;
      }
    }
  }
  return false;
}

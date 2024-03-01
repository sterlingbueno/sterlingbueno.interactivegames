let cam;                // Video capture object
let thresholdLevel;     // Threshold level for the video feed
let x = 50;             // Initial x-coordinate of the circle
let y = 50;             // Initial y-coordinate of the circle
let speedX = 2;         // Horizontal speed of the circle
let speedY = 3;         // Vertical speed of the circle
let circleRadius = 25;  // Radius of the circle

function setup() {
  createCanvas(640, 480); // Create a 640x480 pixel canvas
  
  // Initialize the video capture object
  cam = createCapture(VIDEO);
  cam.hide();
  
  thresholdLevel = 127; // Initial threshold level
}

function draw() {
  if (cam.loadedmetadata) {
    cam.loadPixels(); // Load pixels for processing
    
    // Apply threshold effect to the video feed
    for (let i = 0; i < cam.pixels.length; i++) {
      if (brightness(cam.pixels[i]) > thresholdLevel) {
        cam.pixels[i] = color(255); // Set pixel to white if above threshold
      } else {
        cam.pixels[i] = color(0);   // Set pixel to black if below threshold
      }
    }
    cam.updatePixels(); // Update the video feed
    
    background(255); // Clear the canvas
    image(cam, 0, 0); // Display the video feed
    
    // Draw the circle
    fill(0, 250, 255); // Fill color of the circle
    ellipse(x, y, 2 * circleRadius, 2 * circleRadius); // Draw the circle
    
    // Update the position of the circle
    x += speedX; // Move horizontally
    y += speedY; // Move vertically
    
    // Boundary checking for the x-coordinate
    if (x - circleRadius < 0 || x + circleRadius > width || isCircleOverlappingThreshold()) {
      speedX *= -1; // Reverse the horizontal direction
    }
    
    // Boundary checking for the y-coordinate
    if (y - circleRadius < 0 || y + circleRadius > height || isCircleOverlappingThreshold()) {
      speedY *= -1; // Reverse the vertical direction
    }
  }
  
  // Draw slider for threshold adjustment
  drawThresholdSlider();
}

function drawThresholdSlider() {
  // Draw slider background
  fill(200);
  rect(50, height - 50, 200, 20);
  
  // Draw slider handle
  fill(100);
  let sliderX = map(thresholdLevel, 0, 255, 50, 250);
  rect(sliderX - 5, height - 55, 10, 30);
}

function mouseDragged() {
  // Adjust threshold level based on mouse position
  if (mouseY > height - 60 && mouseY < height - 30 && mouseX > 50 && mouseX < 250) {
    thresholdLevel = map(mouseX, 50, 250, 0, 255);
  }
}

function isCircleOverlappingThreshold() {
  let margin = -25; // Adjust this margin value as needed
  
  // Check if the circle overlaps with any black pixel in the threshold
  for (let i = Math.floor(x - circleRadius - margin); i <= Math.ceil(x + circleRadius + margin); i++) {
    for (let j = Math.floor(y - circleRadius - margin); j <= Math.ceil(y + circleRadius + margin); j++) {
      if (i >= 0 && i < width && j >= 0 && j < height && brightness(cam.pixels[j * width + i]) < thresholdLevel) {
        return true; // Return true if the circle overlaps with a black pixel
      }
    }
  }
  return false; // Return false if the circle does not overlap with any black pixel
}

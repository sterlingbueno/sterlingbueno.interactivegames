let cam;
let thresholdLevel;
let x = 50;
let y = 50;
let speedX = 2;
let speedY = 3;
let circleRadius = 25;

function setup() {
  createCanvas(windowWidth, windowHeight);

  let cameras = Capture.list();
  if (cameras.length === 0) {
    console.log("No camera detected.");
    return;
  } else {
    cam = new Capture(this, cameras[0]);
    cam.start();
  }
  thresholdLevel = 127;
}

function draw() {
  if (cam.available()) {
    cam.read();
    cam.loadPixels();

    for (let i = 0; i < cam.pixels.length; i++) {
      if (brightness(cam.pixels[i]) > thresholdLevel) {
        cam.pixels[i] = color(255);
      } else {
        cam.pixels[i] = color(0);
      }
    }
    cam.updatePixels();
    background(255);
    image(cam, 0, 0);

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
  let margin = -25;

  for (let i = Math.floor(x - circleRadius - margin); i <= Math.ceil(x + circleRadius + margin); i++) {
    for (let j = Math.floor(y - circleRadius - margin); j <= Math.ceil(y + circleRadius + margin); j++) {
      if (i >= 0 && i < width && j >= 0 && j < height && brightness(cam.pixels[j * width + i]) < thresholdLevel) {
        return true;
      }
    }
  }
  return false;
}


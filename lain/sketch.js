var font

function preload() {
    font = loadFont("/fonts/lain.ttf");
} 

let words = ["lain","We are all connected","The wired","DISTORTION"];
let frames = 25;
function setup() {
    frameRate(frames);
    canvas = createCanvas(window.innerWidth, window.innerHeight);
    background(0, 0, 40);
    drawingContext.shadowOffsetX = 10;
    drawingContext.shadowOffsetY = 10;
    drawingContext.shadowBlur = 10;
    drawingContext.shadowColor = 'black';
    canvas.style("z-index", "-1")
}

function draw() {
    background(0, 0, 40, 10)
    textSize(50);
    textFont(font);
    textAlign(CENTER);
    stroke(0);
    strokeWeight(2);
    fill(255);
    text(random(words), random(width),random(height));
    filter(BLUR, 2);
}
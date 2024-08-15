var socket = io(window.location.origin)

var font

function preload() {
    font = loadFont("/fonts/lain.ttf");
} 

let frames = 10;
function setup() {
    frameRate(frames);
    canvas = createCanvas(window.innerWidth, window.innerHeight);
    background(0, 0, 40);
    drawingContext.shadowOffsetX = 10;
    drawingContext.shadowOffsetY = 10;
    drawingContext.shadowBlur = 10;
    drawingContext.shadowColor = 'black';
    canvas.style("z-index", "-1")

    textSize(50);
    textFont(font);
    textAlign(CENTER);
    stroke(0);
    strokeWeight(2);
    fill(255);

    socket.on("msg", (data)=>{        
        text(data, random(width/4, (width/4)*3),random(height));
    })

    text("Welcome to the void", width/2, (height/2)-50)
    text("Communicate...", width/2, (height/2))
    text("We are all connected", width/2, (height/2)+50)
            

    input = createInput();
    input.position(20, 30);
    button = createButton("Communicate");
    button.position(220, 30);
    button.mousePressed(sendMsg);
}

function draw() {
    background(0, 0, 40, 5)
    filter(BLUR, 0.1);
}

function sendMsg() {
    var msg = input.value();
    console.log(msg)
    socket.emit("msg", msg)

    input.value("")
}

function keyPressed() {
    if (keyCode === ENTER) {
        sendMsg()
    }
}
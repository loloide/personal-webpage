class Cube {
    constructor(x, y, props) {
        this.x = x;
        this.y = y;
        this.props = props;
    }

    applyProps(props) {
        if (props.images) {
            for (var image in images) {
                image(
                    props.image.url,
                    this.x * grid - boxSize / 2,
                    this.y * grid - boxSize / 2,
                    boxSize,
                    boxSize
                );
            }
        }
        if (props.rects) {
            for (var recta in rects) {
                fill(props.recta.color, props.recta.alpha);
                rect(
                    this.x * recta.y,
                    this.y + recta.x,
                    recta.width,
                    recta.height
                );
            }
        }
        if (props.texts) {
            for (var text in props.texts) {
                textFont(window[text.fontName]);
                fill(text.color);
                textAlign(CENTER, BOTTOM);
                textSize(text.size);
                text(text.text, text.x, text.y, text.width, text.height);
            }
        }
        if (props.texture) {
            texture(edgesTexture);
        }
    }

    display() {
        push();
        translate(
            grid * (boxSize * this.x),
            grid * (boxSize * this.y),
            (-boxSize * 10000) / 2
        );
        this.applyProps(this.props);
        fill(this.props.color);
        box(boxSize, boxSize, boxSize * 10000);

        pop();
    }
}

var boxSize = 150;
var grid = boxSize / 125;

var gridData = {};
function preload() {
    edgesTexture = loadImage("/assets/edges.png");
    lainImg = loadImage("/assets/Lain.jpg");
    missingTexture = loadImage("/assets/notexture.png");
    githubLogo = loadImage("/assets/githublogo.png");
    siteMap = loadImage("/assets/map.png");
    huethuetImg = loadImage("/assets/huethuet.JPG");
    drinksImg = loadImage("/assets/drinks.png");
    uodrumImg = loadImage("/assets/uodrum.png");
    skiImg = loadImage("/assets/ski.JPG");
    pixelsImg = loadImage("/assets/pixels.png");
    thWikiImg = loadImage("/assets/alicelogo.png");

    fetch("data.json")
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data.cells);
            gridData = data.cells;
        });

    lainFont = loadFont("/fonts/lain.ttf");
    arial = loadFont("/fonts/ARIAL.TTF");
}

var cubes = [];
function setup() {
    var canvas = createCanvas(window.innerWidth, window.innerHeight, WEBGL);
    canvas.parent("canvas");

    setAttributes({ perPixelLighting: true });
    pixelDensity(1);
    //debugMode();
    for (var element of gridData) {
        cubes.push(new Cube(element.x, element.y, element.props));
    }
}

var userPos = {
    x: 0,
    y: -1,
};
var rotation = {
    x: 0,
    y: 0,
};
var fov = 1 / 4;

var q = 1
var l = 0
var c = 0
function draw() {
    background(0);
    //orbitControl();
    noStroke();

    perspective(fov, width / height, 0.1, 1000000000);

    rotateX(rotation.x);
    rotateY(rotation.y);
    translate(-(grid * boxSize) * userPos.x, -(grid * boxSize) * userPos.y, 0);

    var white = color(255, 255, 255);
    var lightLoc = { x: 0, y: 0, z: 100 };
    lightFalloff(1, 0.001, 0);
    pointLight(white, lightLoc.x, lightLoc.y, lightLoc.z);
    directionalLight(white, 0, 0, -1);

    for (var cube of cubes) {
        cube.display();
    }

    document.getElementById("pos").innerHTML =
        "(" + parseInt(userPos.x) + ", " + -parseInt(userPos.y) + ")";
}

addEventListener("keydown", (event) => {
    switch (event.keyCode) {
        case 65:
            moveX(userPos.x - stepSize);
            break;
        case 87:
            moveY(userPos.y - stepSize);
            break;
        case 68:
            moveX(userPos.x + stepSize);
            break;
        case 83:
            moveY(userPos.y + stepSize);
            break;
        case 37:
            moveX(userPos.x - stepSize);
            break;
        case 38:
            moveY(userPos.y - stepSize);
            break;
        case 39:
            moveX(userPos.x + stepSize);
            break;
        case 40:
            moveY(userPos.y + stepSize);
            break;
        case 69:
            changeFov(0.25);
            break;
        case 81:
            changeFov(1.6);
            break;
    }
});

var stepTime = 5;
var moveSpeed = 250;
var stepSize = 1;
var moving = false;
function moveX(x) {
    if (moving != true) {
        moving = true;

        var targetValue = x;
        const steps = moveSpeed / stepTime;
        const increment = (targetValue - userPos.x) / steps;
        let currentValue = userPos.x;
        let currentStep = 0;

        const interval = setInterval(() => {
            currentValue += increment;
            currentStep++;
            userPos.x = currentValue;

            if (currentStep >= steps) {
                clearInterval(interval);
                currentValue = targetValue; // Ensure the final value is exact
                userPos.x = parseInt(currentValue);
            }
        }, stepTime);
    }
    moving = false;
}

function moveY(y) {
    if (moving != true) {
        moving = true;

        var targetValue = y;
        const steps = moveSpeed / stepTime;
        const increment = (targetValue - userPos.y) / steps;
        let currentValue = userPos.y;
        let currentStep = 0;

        const interval = setInterval(() => {
            currentValue += increment;
            currentStep++;
            userPos.y = currentValue;

            if (currentStep >= steps) {
                clearInterval(interval);
                currentValue = targetValue; // Ensure the final value is exact
                userPos.y = parseInt(currentValue);
            }
        }, stepTime);
    }
    moving = false;
}

function changeFov(x) {
    if (moving != true) {
        moving = true;

        var targetValue = x;
        const steps = moveSpeed / stepTime;
        const increment = (targetValue - fov) / steps;
        let currentValue = fov;
        let currentStep = 0;

        const interval = setInterval(() => {
            currentValue += increment;
            currentStep++;
            fov = currentValue;

            if (currentStep >= steps) {
                clearInterval(interval);
                currentValue = targetValue; // Ensure the final value is exact
            }
        }, stepTime);

        moving = false;
    }
}

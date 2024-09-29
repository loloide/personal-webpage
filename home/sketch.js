var windowAspRatio = window.innerWidth / window.innerHeight;
var edgesTexture;
var lainImg;
var githubLogo;
var missingTexture;
var grid = 150;
var boxSize = 120;
var gridData = {};
var stepTime = 5;
var moveSpeed = 500;
var cameraMoveSpeed = moveSpeed / 2;
var fov = 0.15;
var aspRatio = windowAspRatio;
var userPos = {
    x: 0,
    y: -1,
};
var moving = false;
let fogColor;
let fogDensity = 0.01;

function preload() {
    edgesTexture = loadImage("/assets/edges.png");
    lainImg = loadImage("/assets/Lain.jpg");
    missingTexture = loadImage("/assets/notexture.png");
    githubLogo = loadImage("/assets/githublogo.png");

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

function setup() {
    var canvas = createCanvas(window.innerWidth, window.innerHeight, WEBGL);
    canvas.parent("canvas");
    setAttributes({ antialias: false, perPixelLighting: false });
    pixelDensity(1);
    cursor(CROSS);
    frameRate(30);
    fov = 0.15;
    background(0);
}

function draw() {
    background(0);
    strokeWeight(2);
    translate(-(grid * userPos.x), -(grid * userPos.y), -100);
    perspective(fov, aspRatio, 10, 1000000);

    var lightIntensity = 255;
    lightFalloff(0, 0.004, 0);
    pointLight(lightIntensity, lightIntensity, lightIntensity, 0, 0, 100);
    var c = color(255, 255, 255);
    directionalLight(c, 0, 0, -1);

    for (cell in gridData) {
        if (gridData[cell].value) {
            push();
            translate(
                gridData[cell].x * grid,
                gridData[cell].y * grid,
                -(boxSize * 100000) / 2
            );

            fill(gridData[cell].value);

            gridData[cell].texture
                ? applyTexture(gridData[cell].texture)
                : null;

            box(boxSize, boxSize, boxSize * 100000);
            pop();

            gridData[cell].speciality
                ? applySpeciality(gridData[cell].speciality)
                : null;
        }
    }
}

addEventListener("keydown", (event) => {
    switch (event.keyCode) {
        case 65 || 37:
            //go left
            console.log("left");
            if (moving != true) {
                moving = true;

                var targetValue = userPos.x - 1;
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

                moving = false;
            }
            break;
        case 87 || 38:
            //go up
            console.log("up");
            if (moving != true) {
                moving = true;

                var targetValue = userPos.y - 1;
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

                moving = false;
            }
            break;
        case 68 || 39:
            //go right
            console.log("right");
            if (moving != true) {
                moving = true;

                var targetValue = userPos.x + 1;
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

                moving = false;
            }
            break;
        case 83 || 40:
            //go down
            console.log("down");
            if (moving != true) {
                moving = true;

                var targetValue = userPos.y + 1;
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

                moving = false;
            }
            break;

        case 32:
            redirect(userPos.x, userPos.y);
            break;

        case 69:
            if (fov >= 0.15) {
                warpPerspective(0.15, aspRatio);
            }

            break;

        case 81:
            if (fov <= 1.35) {
                warpPerspective(1.35, aspRatio);
            }
            break;
    }
});

function applyTexture(name) {
    switch (name) {
        case "edges":
            texture(edgesTexture);
            break;
        case "missing":
            texture(missingTexture);
            break;
    }
}

function applySpeciality(speciality) {
    switch (speciality) {
        case "home":
            push();
            fill("#000");
            textFont(arial);
            textAlign(CENTER, CENTER);
            textSize(15);
            text(
                "Welcome\nto my\nWebsite",
                gridData[cell].x * grid,
                gridData[cell].y * grid
            );
            pop();
            break;
        case "lain":
            image(
                lainImg,
                gridData[cell].x * grid - boxSize / 2,
                gridData[cell].y * grid - boxSize / 2,
                boxSize,
                boxSize
            );
            fill(0, 0, 0, 127);
            rect(
                gridData[cell].x * grid - boxSize / 2,
                gridData[cell].y * grid - boxSize / 2,
                boxSize,
                boxSize
            );

            push();
            fill("#FFF");
            textFont(lainFont);
            textAlign(CENTER, CENTER);
            textSize(12.5);
            text(
                "We are all\nConnected!!",
                gridData[cell].x * grid,
                gridData[cell].y * grid
            );
            pop();
            break;
        case "github":
            image(
                githubLogo,
                gridData[cell].x * grid - boxSize / 2,
                gridData[cell].y * grid - boxSize / 2,
                boxSize,
                boxSize
            );
            fill(0, 0, 0, 125);
            rect(
                gridData[cell].x * grid - boxSize / 2,
                gridData[cell].y * grid - boxSize / 2,
                boxSize,
                boxSize
            );
            push();
            fill("#FFF");
            textFont(arial);
            textAlign(CENTER, CENTER);
            textSize(15);
            text(
                "Visit\nmy GitHub ~",
                gridData[cell].x * grid,
                gridData[cell].y * grid
            );
            pop();
            break;
        case "connect":
            image(
                lainImg,
                gridData[cell].x * grid - boxSize / 2,
                gridData[cell].y * grid - boxSize / 2,
                boxSize,
                boxSize
            );
            fill(0, 0, 0, 127);
            rect(
                gridData[cell].x * grid - boxSize / 2,
                gridData[cell].y * grid - boxSize / 2,
                boxSize,
                boxSize
            );

            push();
            fill("#FFF");
            textFont(lainFont);
            textAlign(CENTER, CENTER);
            textSize(12.5);
            text("Connect-", gridData[cell].x * grid, gridData[cell].y * grid);
            pop();
            break;
        case "monogatari":
            push();
            fill("#000");
            textFont(lainFont);
            textAlign(CENTER, CENTER);
            textSize(15);
            text(
                "My favourite\nanime is\nMonogatari",
                gridData[cell].x * grid,
                gridData[cell].y * grid
            );
            pop();
            break;
    }
}

async function redirect(x, y) {
    if (gridData[findIndex(gridData, x, y)].link) {
        await warpPerspective(0.1, 1);
        window.location.href = gridData[findIndex(gridData, x, y)].link;
        warpPerspective(0.15, windowAspRatio);
    }
}

function warpPerspective(fovTargetValue, aspRatioTargetValue) {
    return new Promise((resolve) => {
        const steps = cameraMoveSpeed / stepTime;
        const fovIncrement = (fovTargetValue - fov) / steps;
        const aspRatioIncrement = (aspRatioTargetValue - aspRatio) / steps;
        let fovCurrentValue = fov;
        let aspRatioCurrentValue = aspRatio;
        let currentStep = 0;

        const interval = setInterval(() => {
            fovCurrentValue += fovIncrement;
            aspRatioCurrentValue += aspRatioIncrement;
            currentStep++;
            fov = fovCurrentValue;
            aspRatio = aspRatioCurrentValue;

            if (currentStep >= steps) {
                clearInterval(interval);
                fovCurrentValue = fovTargetValue; // Ensure the final value is exact
                aspRatioCurrentValue = aspRatioTargetValue;
                resolve();
            }
        }, stepTime);
    });
}

function findIndex(Array, targetX, targetY) {
    const target = { x: targetX, y: targetY };
    return Array.findIndex(
        (element) => element.x === target.x && element.y === target.y
    );
}

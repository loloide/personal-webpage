var windowAspRatio = window.innerWidth / window.innerHeight;
var edgesTexture;
var lainImg;
var githubLogo;
var missingTexture;
var siteMap;
var grid = 150;
var boxSize = 120;
var gridData = {};
var stepTime = 5;
var moveSpeed = 250;
var cameraMoveSpeed = moveSpeed / 2;
var fov = 3.14;
var aspRatio = windowAspRatio;
var userPos = {
    x: 0,
    y: -1,
};
var moving = false;
const camHeightOriginal = 65;
var camHeight = camHeightOriginal;
var mapColors = [
    "#FFD6A5",
    "#FFADAD",
    "#FDFFB6",
    "#E4F1EE",
    "#D9EDF8",
    "#DEDAF4",
];

var stepSize = 1;

function preload() {
    edgesTexture = loadImage("/assets/edges.png");
    lainImg = loadImage("/assets/Lain.jpg");
    missingTexture = loadImage("/assets/notexture.png");
    githubLogo = loadImage("/assets/githublogo.png");
    siteMap = loadImage("/assets/map.png");

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
    setAttributes({ antialias: true, perPixelLighting: true });
    pixelDensity(1);
    cursor(CROSS);
    frameRate(30);
    fov = PI / 2;
    background(0);
}

function draw() {
    background(0);
    perspective(fov, aspRatio, 10, 1000000);

    camera(
        grid * userPos.x,
        grid * userPos.y,
        camHeight,
        grid * userPos.x,
        grid * userPos.y,
        0,
        0,
        1,
        0
    );

    var white = color(255, 255, 255);
    directionalLight(white, 0, 0, -1);

    lightFalloff(0, 5 / 1000, 0);
    pointLight(white, grid * userPos.x, grid * userPos.y, camHeightOriginal);

    // if (camHeight != camHeightOriginal) {
    //     rotateY(sin(frameCount * 0.01) / 200);
    //     rotateX(sin(frameCount * 0.01) / 200);
    //     rotateZ(sin(frameCount * 0.01) / 200);
    // }

    for (cell in gridData) {
        if (gridData[cell].value) {
            push();
            translate(
                gridData[cell].x * grid,
                gridData[cell].y * grid,
                -(boxSize * 25) / 2
            );

            fill(gridData[cell].value);

            gridData[cell].texture
                ? applyTexture(gridData[cell].texture)
                : null;

            box(boxSize, boxSize, boxSize * 25);
            pop();

            if (camHeight == camHeightOriginal) {
                gridData[cell].speciality
                    ? applySpeciality(gridData[cell].speciality)
                    : null;
            }
            // } else {
            //     fill("#fff");
            //     rect(grid * userPos.x - 2, grid * userPos.y - 25, 4, 50);
            //     rect(grid * userPos.x - 25, grid * userPos.y - 2, 50, 4);
            // }
        }
    }

    noStroke();

    document.getElementById("pos").innerHTML =
        "(" + parseInt(userPos.x) + ", " + -parseInt(userPos.y) + ")";
}

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

        moving = false;
    }
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

        moving = false;
    }
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

        case 32:
            redirect(userPos.x, userPos.y);
            break;

        case 69:
            if (camHeight >= camHeightOriginal) {
                var targetValue = camHeightOriginal;
                const steps = moveSpeed / stepTime;
                const increment = (targetValue - camHeight) / steps;
                let currentValue = camHeight;
                let currentStep = 0;

                const interval = setInterval(() => {
                    currentValue += increment;
                    currentStep++;
                    camHeight = currentValue;

                    if (currentStep >= steps) {
                        clearInterval(interval);
                        currentValue = targetValue; // Ensure the final value is exact
                        camHeight = parseInt(currentValue);
                    }
                }, stepTime);
                warpPerspective(PI / 2, aspRatio);
            }
            break;

        case 81:
            if (camHeight <= 10000) {
                var targetValue = 400;
                const steps = moveSpeed / stepTime;
                const increment = (targetValue - camHeight) / steps;
                let currentValue = camHeight;
                let currentStep = 0;

                const interval = setInterval(() => {
                    currentValue += increment;
                    currentStep++;
                    camHeight = currentValue;

                    if (currentStep >= steps) {
                        clearInterval(interval);
                        currentValue = targetValue; // Ensure the final value is exact
                        camHeight = parseInt(currentValue);
                    }
                }, stepTime);
                warpPerspective(PI - 1, aspRatio);
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
            // fill(0, 0, 0, 100);
            // rect(
            //     gridData[cell].x * grid - boxSize / 2,
            //     gridData[cell].y * grid - boxSize / 2,
            //     boxSize,
            //     boxSize
            // );
            // push();
            // fill("#FFF");
            // textFont(arial);
            // textAlign(CENTER, CENTER);
            // textSize(15);
            // text(
            //     "Visit\nmy GitHub ~",
            //     gridData[cell].x * grid,
            //     gridData[cell].y * grid
            // );
            // pop();
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
        case "homeContent":
            push();
            fill("#000");
            textFont(arial);
            textStyle(NORMAL);
            textAlign(LEFT, TOP);
            textSize(4);
            text(
                "\n\nIm a Junior web Developer and Ski instructor from VLA, Argentina.\nI created this website to register everything from my projects to my favourite media.\n\n",
                gridData[cell].x * grid - boxSize / 2 + 5,
                gridData[cell].y * grid - boxSize / 2 + 5,
                boxSize - 10,
                boxSize - 10
            );
            pop();
            push();
            fill("#000");
            textFont(arial);
            textAlign(LEFT, BOTTOM);
            textSize(4);
            text(
                "Move with W, A, S, D or the Arrows, Zoom out with Q and zoom in with E, Open pages with [Space]",
                gridData[cell].x * grid - boxSize / 2 + 5,
                gridData[cell].y * grid - boxSize / 2 + 5,
                boxSize - 10,
                boxSize - 10
            );
            pop();

            push();
            fill("#000");
            textFont(arial);
            textStyle(BOLD);
            textAlign(LEFT, TOP);
            textSize(8);
            text(
                "Hi, Welcome to my Website",
                gridData[cell].x * grid - boxSize / 2 + 5,
                gridData[cell].y * grid - boxSize / 2 + 5,
                boxSize - 10,
                boxSize - 10
            );
            pop();

                // fill("#FF0055");
                // rect(
                //     gridData[cell].x * grid - boxSize / 2 + 5,
                //     gridData[cell].y * grid - boxSize / 2 + 35,
                //     boxSize * (1 / 3) - 10,
                //     boxSize * (2 / 3) - 20
                // );

            // fill(0);
            // rect(
            //     gridData[cell].x * grid - boxSize / 2 + 5,
            //     gridData[cell].y * grid - boxSize / 2 + 36,
            //     boxSize - 10,
            //     boxSize - 53,
            // );
            image(
                siteMap,
                gridData[cell].x * grid - boxSize / 2 + 5,
                gridData[cell].y * grid - boxSize / 2 + 36,
                boxSize - 10,
                boxSize - 53,
                0,
                0,
                siteMap.width,
                siteMap.height,
                CONTAIN,
                CENTER,
                CENTER
            );

            push();
            fill("#000");
            textFont(arial);
            textStyle(NORMAL);
            textAlign(LEFT, TOP);
            textSize(3);
            text(
                "Central Island",
                gridData[cell].x * grid - boxSize / 2 + 47,
                gridData[cell].y * grid - boxSize / 2 + 62,
                boxSize - 10,
                boxSize - 53
            );
            pop();

            push();
            fill("#000");
            textFont(arial);
            textStyle(BOLD);
            textAlign(LEFT, TOP);
            textSize(3);
            text(
                "Ski",
                gridData[cell].x * grid - boxSize / 2 + 88,
                gridData[cell].y * grid - boxSize / 2 + 47,
                boxSize - 10,
                boxSize - 53
            );
            pop();

            push();
            fill("#000");
            textFont(arial);
            textStyle(BOLD);
            textAlign(LEFT, TOP);
            textSize(3);
            text(
                "Favourites\nIsland",
                gridData[cell].x * grid - boxSize / 2 + 34,
                gridData[cell].y * grid - boxSize / 2 + 39,
                boxSize - 10,
                boxSize - 53
            );
            pop();

            push();
            fill("#000");
            textFont(arial);
            textStyle(BOLD);
            textAlign(LEFT, TOP);
            textSize(2);
            text(
                "Projects Island",
                gridData[cell].x * grid - boxSize / 2 + 33,
                gridData[cell].y * grid - boxSize / 2 + 89.5,
                boxSize - 10,
                boxSize - 53
            );
            pop();

            break;
    }
}

async function redirect(x, y) {
    if (gridData[findIndex(gridData, x, y)].link) {
        await warpPerspective(1, 1);
        window.location.href = gridData[findIndex(gridData, x, y)].link;
        warpPerspective(PI / 2, windowAspRatio);
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

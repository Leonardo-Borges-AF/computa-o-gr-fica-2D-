const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const failSound = document.getElementById('failSound');
const jumpSound = document.getElementById('jumpSound');

// Game variables
let dino = {
    image: new Image(),
    x: 50,
    y: 150,
    width: 70,
    height: 70,
    dy: 0,
    jumpStrength: 7,
    maxJump:12,
    gravity: 0.5,
    grounded: false,
    collisionMargin: { top: 10, right: 10, bottom: 10, left: 10 } // Collision margins
};

let obstacle1 = {
    image: new Image(),
    x: canvas.width,
    y: 130, 
    width: 40,
    height: 70,
}

obstacle1.image.src = "images/cactus_1.png";
dino.image.src = "images/standing_still.png";

let obstacles = [obstacle1];
let gameSpeed = 5;
let score = 0;
let runAnimation = true;
let colisao = false;
let frameCount = 0;

// Function to draw the dino
function drawDino() {
    ctx.drawImage(dino.image, dino.x, dino.y, dino.width, dino.height);
}

function run() {
    if (frameCount === 20) {
        dino.image.src = runAnimation ? "images/dino_run1.png" : "images/dino_run2.png";
        runAnimation = !runAnimation;
        frameCount = 0;
    }
}

// Function to draw obstacles
function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.drawImage(obstacle.image, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function speed() {
    gameSpeed += 0.001;
    const fontSize = 10
     ctx.font = `${fontSize}px Verdana`;
     ctx.fillStyle = "black";
     let Speed = gameSpeed.toFixed(2)
     ctx.fillText("speed : " + Speed, 725, 16);
}

// Function to update obstacles
function updateObstacles() {
    let randomObstacle = randomIntFromRange(1,3)
        if (obstacles[obstacles.length - 1].x < canvas.width - randomIntFromRange(10,100)) {
            let obstacle = {
                image: new Image(),
                x: canvas.width + randomIntFromRange(200, 400),
                y: 130,
                width: 40,
                height: 70,
            };
            if(randomObstacle === 1){
                obstacle.image.src = "images/cactus_1.png";
            }
            if(randomObstacle === 2){
            obstacle.image.src = "images/cactus_2.png";
                obstacle.width = 80
            }
            if(randomObstacle === 3){
                obstacle.image.src = "images/bird.png";
                obstacle.width = 50
                obstacle.height = 30
                obstacle.y= 50
            }
            obstacles.push(obstacle);
        }

    obstacles.forEach(obstacle => {
        obstacle.x -= gameSpeed;
    });

    obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);
}

// Function to detect collision
function detectCollision() {
    obstacles.forEach(obstacle => {
        let dinoCollisionBox = { 
            x: dino.x + dino.collisionMargin.left,
            y: dino.y + dino.collisionMargin.top,
            width: dino.width - dino.collisionMargin.left - dino.collisionMargin.right,
            height: dino.height - dino.collisionMargin.top - dino.collisionMargin.bottom
        };

        if (
            dinoCollisionBox.x < obstacle.x + obstacle.width &&
            dinoCollisionBox.x + dinoCollisionBox.width > obstacle.x &&
            dinoCollisionBox.y < obstacle.y + obstacle.height &&
            dinoCollisionBox.y + dinoCollisionBox.height > obstacle.y
        ) {
            // Collision detected
            
            colisao = true
            fail();
        }
    });
}

function fail() {
    failSound.play();
    const fontSize = 70;
    ctx.font = `${fontSize}px Verdana`;
    ctx.fillStyle = "grey";
    const x = canvas.width / 4.5;
    const y = canvas.height / 2;
    ctx.fillText("GAME OVER", x, y);

    reset();
}

function reset() {
    if (colisao) {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.code === 'ArrowUp') {
                document.location.reload();
            }
        });
        const fontSize = 30;
        ctx.font = `${fontSize}px Verdana`;
        ctx.fillStyle = "grey";
        ctx.fillText("Press Space", 300, 150);
    }
}

function updateScore(){
     const fontSize = 17
     ctx.font = `${fontSize}px Verdana`;
     ctx.fillStyle = "black";
     ctx.fillText("score : " + score, 10, 20);
}



// Function to update the dino
function updateDino() {
    if (dino.grounded && dino.dy === 0 && isJumping) {
        jumpForce = dino.maxJump;
        dino.grounded = false;
    }

    if (isJumping && jumpForce > 0) {
        dino.dy = -dino.jumpStrength;
        jumpForce--;
    }

    dino.dy += dino.gravity;
    dino.y += dino.dy;

    if (dino.y + dino.height > canvas.height - 10) {
        dino.y = canvas.height - 10 - dino.height;
        dino.dy = 0;
        dino.grounded = true;
        jumpForce = 0; // Reseta a força de salto ao pousar
    }
    if(isJumping === true){
        dino.image.src = "images/standing_still.png";
    }
}

// Evento de tecla pressionada para controlar o salto
document.addEventListener('keydown', (e) => {
    if ((e.code === 'Space' || e.code === 'ArrowUp') && dino.grounded) {
        isJumping = true;
        jumpSound.play();
    }
});

// Variable to detect if the player is trying to jump
let isJumping = false;
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
        isJumping = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
        isJumping = false;
    }
});

// Function to draw the game
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawDino();
    drawObstacles();
}

// Function to update the game
function update() {
    updateDino();
    updateObstacles();
    detectCollision();
    updateScore()
    speed();
    run();
    score ++
}

// Main game loop function
function gameLoop() {
    draw();

    update();
    if (!colisao) {
        requestAnimationFrame(gameLoop);
    }
    frameCount++;
}

// Start the game loop
gameLoop();

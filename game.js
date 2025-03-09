const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 32,
    height: 32,
    speed: 5,
    color: "red",
    velocityX: 0,
    velocityY: 0
};

const keys = {}; // Stores pressed keys

// Event Listeners for movement
window.addEventListener("keydown", (e) => keys[e.key] = true);
window.addEventListener("keyup", (e) => keys[e.key] = false);

let cameraX = 0, cameraY = 0; // Camera position

function update() {
    let moveX = 0, moveY = 0;

    if (keys["ArrowRight"] || keys["d"]) moveX = player.speed;
    if (keys["ArrowLeft"] || keys["a"]) moveX = -player.speed;
    if (keys["ArrowDown"] || keys["s"]) moveY = player.speed;
    if (keys["ArrowUp"] || keys["w"]) moveY = -player.speed;

    cameraX += moveX;
    cameraY += moveY;
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background (simulate terrain)
    ctx.fillStyle = "#228B22"; // Green ground
    ctx.fillRect(-cameraX, -cameraY, 5000, 5000); // Large terrain

    // Draw player (fixed at center)
    ctx.fillStyle = player.color;
    ctx.fillRect(canvas.width / 2 - player.width / 2, canvas.height / 2 - player.height / 2, player.width, player.height);
}

// Start the game loop
function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}
gameLoop();

const tileSize = 64;
const worldWidth = 20;
const worldHeight = 10;

// World map: 0 = air, 1 = dirt, 2 = grass
const worldMap = [];
for (let row = 0; row < worldHeight; row++) {
    worldMap[row] = [];
    for (let col = 0; col < worldWidth; col++) {
        if (row === 5) worldMap[row][col] = 2; // Grass layer
        else if (row > 5) worldMap[row][col] = 1; // Dirt below grass
        else worldMap[row][col] = 0; // Air
    }
}

const gravity = 0.5; // Gravity force
const friction = 0.8; // To slow down horizontal movement

const player = {
    x: canvas.width / 2,
    y: 0, // Start falling from the sky
    width: 32,
    height: 32,
    speed: 5,
    velocityX: 0,
    velocityY: 0,
    jumping: false,
    color: "red"
};

function applyGravity() {
    player.velocityY += gravity;

    // Predict next Y position
    let nextX = player.x;
    let nextY = player.y + player.velocityY;

    if (canMove(nextX, nextY)) {
        player.y += player.velocityY;
    } else {
        player.velocityY = 0;
        player.jumping = false;
    }
}


function canMove(newX, newY) {
    let tileX = Math.floor(newX / tileSize);
    let tileY = Math.floor((newY + player.height) / tileSize);

    if (tileY >= worldHeight) return false; // Stop at the bottom of the map

    if (tileY >= 0 && tileX >= 0 && tileX < worldWidth) {
        let tile = worldMap[tileY][tileX];
        return tile === 0; // Can only move if it's air
    }
    return false;
}

function update() {
    let moveX = 0;

    if (keys["ArrowRight"] || keys["d"]) moveX = player.speed;
    if (keys["ArrowLeft"] || keys["a"]) moveX = -player.speed;

    if ((keys["ArrowUp"] || keys["w"] || keys[" "]) && !player.jumping) {
        player.velocityY = -10; // Jump power
        player.jumping = true;
    }

    // Apply movement with collision
    if (canMove(player.x + moveX, player.y)) {
        player.x += moveX;
    }

    applyGravity();
}


function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the blue sky
    ctx.fillStyle = "#87CEEB"; // Sky blue
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the world tiles
    for (let row = 0; row < worldHeight; row++) {
        for (let col = 0; col < worldWidth; col++) {
            let tile = worldMap[row][col];

            if (tile === 1) ctx.fillStyle = "#8B4513"; // Brown dirt
            else if (tile === 2) ctx.fillStyle = "#228B22"; // Green grass
            else continue; // Skip air tiles

            ctx.fillRect(col * tileSize - cameraX, row * tileSize - cameraY, tileSize, tileSize);
        }
    }

    // Draw the player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x - cameraX, player.y - cameraY, player.width, player.height);
}




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
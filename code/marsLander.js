// Github : https://github.com/openmarmot/mars_lander

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const restartButton = document.getElementById('restartButton');

// Load lander images
const landerImage = new Image();
landerImage.src = 'images/lander.png';
const landerThruster = new Image();
landerThruster.src = 'images/landerThruster.png'

// Load background image. 
const backgroundImage = new Image();
backgroundImage.src = 'images/background.png';

const fuelConsumption=100
const gravity=50

// Game objects
let lander = {};

let ground = {
    y: canvas.height - 10,
    height: 10
};

// Game state
let gameOver = false;
let crashed=false;
let lastTime = 0; // To keep track of the last update time

function resetGame() {
    lander = {
        x: canvas.width / 2 - 25,
        y: 50,
        width: 50,
        height: 50,
        speedY: 0,
        thrust: 90,  // Now this is speed per second
        fuel: 1000,
        isThrusting: false
    };
    gameOver = false;
    lastTime = 0;
    keys={};
    restartButton.style.display = 'none';
}

function drawLander() {
    if (lander.isThrusting) {
        ctx.drawImage(landerThruster, lander.x, lander.y, lander.width, lander.height);
    } else {
        ctx.drawImage(landerImage, lander.x, lander.y, lander.width, lander.height);
    }
}

function drawGround() {
    ctx.fillStyle = 'grey';
    ctx.fillRect(0, ground.y, canvas.width, ground.height);
}

function update(currentTime) {
    if (!gameOver) {
        if (lastTime === 0) lastTime = currentTime;  // First frame
        let deltaTime = (currentTime - lastTime) / 1000;  // Convert to seconds
        
        // Adjust speed based on deltaTime
        lander.y += lander.speedY * deltaTime;
        lander.speedY += gravity * deltaTime; // Gravity

        // Apply thrust if spacebar is pressed, adjust for deltaTime
        if (keys[' '] && lander.fuel > 0) {
            lander.speedY -= lander.thrust * deltaTime;
            lander.fuel -= fuelConsumption * deltaTime;
            lander.isThrusting = true;
        } else {
            lander.isThrusting = false;
        }

        // Collision detection
        if (lander.y + lander.height >= ground.y) {
            gameOver=true
            if (lander.speedY > 20) { // Too fast for safe landing
                crashed = true;
            }

            restartButton.style.display = 'block'; // Show restart button on game over
        }

        lastTime = currentTime;
    }
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    
    drawGround();
    drawLander();
    ctx.fillStyle = 'white';
    ctx.fillText(`Fuel: ${Math.round(lander.fuel)}`, 10, 20);
    ctx.fillText(`Speed: ${Math.round(lander.speedY)}`, 10, 40);
    if (gameOver) {
        ctx.fillText(`You Landed !`, 10, 60);

        if (crashed) {
            ctx.fillText(`.. poorly`, 10, 70);
        }
    }
}

// Game loop using requestAnimationFrame for smoother animation
function gameLoop(currentTime) {
    update(currentTime);
    render();
    if (!gameOver) requestAnimationFrame(gameLoop);
}

// Keyboard controls
let keys = {};

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

restartButton.addEventListener('click', () => {
    resetGame();
    requestAnimationFrame(gameLoop); // Restart the game loop
});

resetGame()
requestAnimationFrame(gameLoop);
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("start-btn");
const speedSelect = document.getElementById("speed-select");

// Images - Replace with your own filenames
const itemImg = new Image(); itemImg.src = 'item.png'; 
const playerImg = new Image(); playerImg.src = 'player.png';

let score = 0;
let ngCount = 0;
let gameRunning = false;
let items = [];
let player = { x: 175, y: 450, w: 50, h: 40 };
let keys = {};

document.addEventListener("keydown", (e) => keys[e.code] = true);
document.addEventListener("keyup", (e) => keys[e.code] = false);

function spawnItem() {
    if(!gameRunning) return;
    items.push({
        x: Math.random() * (canvas.width - 30),
        y: -30,
        size: 30,
        speed: parseInt(speedSelect.value) + (Math.random() * 2)
    });
    // Randomly spawn next item
    setTimeout(spawnItem, 1000 - (parseInt(speedSelect.value) * 50));
}

function update() {
    if (!gameRunning) return;

    // Player Movement
    if (keys["ArrowLeft"] && player.x > 0) player.x -= 7;
    if (keys["ArrowRight"] && player.x < canvas.width - player.w) player.x += 7;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Player
    if (playerImg.complete && playerImg.naturalWidth !== 0) {
        ctx.drawImage(playerImg, player.x, player.y, player.w, player.h);
    } else {
        ctx.fillStyle = "#ffcc33";
        ctx.fillRect(player.x, player.y, player.w, player.h);
    }

    // Update & Draw Items
    for (let i = items.length - 1; i >= 0; i--) {
        let it = items[i];
        it.y += it.speed;

        // Collision Check
        if (it.y + it.size > player.y && it.x < player.x + player.w && it.x + it.size > player.x) {
            items.splice(i, 1);
            score++;
            document.getElementById("score").textContent = score;
            continue;
        }

        // Miss Check
        if (it.y > canvas.height) {
            items.splice(i, 1);
            ngCount++;
            document.getElementById("ng-count").textContent = ngCount;
            if (ngCount >= 10) gameOver();
            continue;
        }

        // Draw Item
        if (itemImg.complete && itemImg.naturalWidth !== 0) {
            ctx.drawImage(itemImg, it.x, it.y, it.size, it.size);
        } else {
            ctx.fillStyle = "#ff5e5e";
            ctx.beginPath();
            ctx.arc(it.x + 15, it.y + 15, 15, 0, Math.PI*2);
            ctx.fill();
        }
    }

    requestAnimationFrame(update);
}

function gameOver() {
    gameRunning = false;
    alert("Game Over! Score: " + score);
    startBtn.disabled = false;
}

startBtn.addEventListener("click", () => {
    score = 0; ngCount = 0;
    items = [];
    document.getElementById("score").textContent = "0";
    document.getElementById("ng-count").textContent = "0";
    gameRunning = true;
    startBtn.disabled = true;
    spawnItem();
    update();
});
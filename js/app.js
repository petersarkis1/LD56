let canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
let aspectRatio = 16/9;
let windowedWidth = 1280;
let windowedHeight = 720;
canvas.width = windowedWidth;
canvas.height = windowedHeight;

let player = {
    x: 10,
    y: 10,
    width: 128,
    height: 128,
    maxSpd: 2,
    spd: 2,
    animationFrame: 0,
    maxAnimationFrame: 2,
    direction: {x: 0, y: 0}
};

let curKeys = [];
let frameCount = 0;

function update() {
    frameCount++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.drawImage(greenGuy, player.width * player.animationFrame, 0, player.width, player.width, player.x, player.y, player.width, player.height);
    player.direction = {x: 0, y: 0};
    if (curKeys.includes('w')) {
        player.direction.y -= 1;
    }
    if (curKeys.includes('a')) {
        player.direction.x -= 1;
    }
    if (curKeys.includes('s')) {
        player.direction.y += 1;
    }
    if (curKeys.includes('d')) {
        player.direction.x += 1;
    }

    let isPlayerMoving = player.direction.x != 0 || player.direction.y != 0

    if (frameCount % 15 == 0 && isPlayerMoving) {
        player.animationFrame++;
        if (player.animationFrame > player.maxAnimationFrame) {
            player.animationFrame = 0;
        }
    }

    //If player is moving diagonally we need to slow down their spd slightly
    let isMovingDiagonallySpd = (player.direction.x != 0 && player.direction.y != 0) ? 0.7 : 1;

    player.x += player.direction.x * player.spd * isMovingDiagonallySpd;
    player.y += player.direction.y * player.spd * isMovingDiagonallySpd;
    requestAnimationFrame(update);
}

window.addEventListener("load", function() {
    update();
});

document.addEventListener("keydown", function(e) {
    if (!curKeys.includes(e.key)) {
        curKeys.push(e.key);
    }
});

document.addEventListener("keyup", function(e) {
    let index = curKeys.indexOf(e.key);
    curKeys.splice(index, 1);
});
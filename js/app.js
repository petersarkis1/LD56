let canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
let aspectRatio = 16/9;
let windowedWidth = 1280;
let windowedHeight = 720;
canvas.width = windowedWidth;
canvas.height = windowedHeight;

let player = {
    x: 10,
    y: 1800,
    curSpr: greenyLeft,
    sprSpd: 10,
    velocityY: 0,
    width: 128,
    height: 128,
    gravity: 0.3,
    jumpStrength: 11,
    canJump: true,
    isJumping: false,
    maxSpd: 2,
    spd: 8,
    animationFrame: 0,
    maxAnimationFrame: 2,
    direction: {x: 0, y: 0}
};

let level = {
    width: 5120,
    height: 2160
}

const camera = {
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height,
    follow(target) {
        // Center the camera on the player
        this.x = target.x - this.width / 2 + target.width / 2;
        this.y = target.y - this.height / 2 + target.height / 2;

        // Optional: Prevent the camera from moving out of bounds
        this.x = Math.max(0, this.x);
        this.x = Math.min(level.width - windowedWidth, this.x);
        this.y = Math.max(0, this.y);
        this.y = Math.min(level.height - windowedHeight, this.y);
    }
};

let curKeys = [];
let frameCount = 0;
let groundLevel = 2160-128;
let currentLevel = level1;
let tileSize = 64;

function update() {
    // console.log(level1.length, level1[0].length);
    frameCount++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(background, 0 - camera.x, 0 - camera.y, 5120, 2160);
    drawLevel();
    camera.follow(player);
    player.direction = {x: 0};
    if (curKeys.includes('ArrowLeft')) {
        player.direction.x -= 1;
    }
    if (curKeys.includes('ArrowRight')) {
        player.direction.x += 1;
    }
    
    //check to change sprite
    if (player.direction.x != 0) {
        player.curSpr = player.direction.x > 0 ? greenyRight : greenyLeft;
    }
    // ctx.fillRect(player.x - camera.x, player.y - camera.y, player.width, player.height);
    ctx.drawImage(player.curSpr, player.width * player.animationFrame, 0, player.width, player.width, player.x - camera.x, player.y - camera.y, player.width, player.height);

    if (curKeys.includes(' ') && player.canJump) {
        player.canJump = false;
        player.isJumping = true;
        player.velocityY = -player.jumpStrength; // Set the initial jump velocity
        player.velocityY += player.gravity; // Increase downward velocity over time
        player.y += player.velocityY;
    }
    // Check collision under the player
    let yCol = checkYplatformCollision();
    if (!yCol) {
        player.velocityY += player.gravity; // Increase downward velocity over time
        player.y += player.velocityY; // Update the player's vertical position
        //check head bonk
        if (checkYplatformCollisionHead()) {
            player.velocityY = 0;
        }
    } else {
        player.y = yCol; // Reset to ground level
        player.isJumping = false;
        player.canJump = true; // Allow jumping again
        player.velocityY = 0; // Reset vertical velocity
    }


    let isPlayerMoving = player.direction.x != 0

    if (frameCount % player.sprSpd == 0 && isPlayerMoving) {
        player.animationFrame++;
        if (player.animationFrame > player.maxAnimationFrame) {
            player.animationFrame = 0;
        }
    }

    if (player.direction.x != 0) {
        player.x += player.direction.x * player.spd;
        let colX = checkXplatformCollision();
        console.log(colX)
        if (colX) {
            player.x = colX;
        }
    }

    requestAnimationFrame(update);
}

function checkYplatformCollision() {
    let YIndex = Math.floor((player.y + player.height)/tileSize);
    //LEFT
    let leftBottomXIndex = Math.floor(player.x/tileSize);
    //MIDDLE
    let midBottomXIndex = Math.floor((player.x + player.width/2)/tileSize);
    //RIGHT
    let rightBottomXIndex = Math.floor((player.x + player.width)/tileSize);
    if (currentLevel[YIndex][leftBottomXIndex] == 1 || currentLevel[YIndex][midBottomXIndex] == 1 || currentLevel[YIndex][rightBottomXIndex] == 1) {
        return YIndex * tileSize - player.height;
    }
    return false;
}

function checkYplatformCollisionHead() {
    let YIndex = Math.floor((player.y)/tileSize);
    //LEFT
    let leftBottomXIndex = Math.floor(player.x/tileSize);
    //MIDDLE
    let midBottomXIndex = Math.floor((player.x + player.width/2)/tileSize);
    //RIGHT
    let rightBottomXIndex = Math.floor((player.x + player.width - 1)/tileSize);
    if (currentLevel[YIndex][leftBottomXIndex] == 1 || currentLevel[YIndex][midBottomXIndex] == 1 || currentLevel[YIndex][rightBottomXIndex] == 1) {
        return true;
    }
    return false;
}

function checkXplatformCollision() {
    let isMovingRight = player.direction.x > 0;
    let XIndex = Math.floor((player.x + (isMovingRight ? player.width : 0))/tileSize);
    //TOP
    let topYIndex = Math.floor(player.y/tileSize);
    //MIDDLE
    let middleYIndex = Math.floor((player.y + player.height/2)/tileSize);
    //BOTTOM
    let bottomYIndex = Math.floor((player.y + player.height - 2)/tileSize);
    if (currentLevel[topYIndex][XIndex] == 1 || currentLevel[middleYIndex][XIndex] == 1 || currentLevel[bottomYIndex][XIndex] == 1) {
        return XIndex * tileSize - (isMovingRight ? player.width : tileSize - player.width);
    }
    return false;
}

function drawLevel() {
    
    for (let i = 0; i < currentLevel.length; i++) {
        for (let j = 0; j < currentLevel[i].length; j++) {
            // Get the sprite for the object
            let tile = currentLevel[i][j];
            if (tile == 1) {
                ctx.fillRect(j*tileSize - camera.x, i*tileSize - camera.y, tileSize, tileSize);
            }
        }
    }
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

function boxCollision(x1, y1, width1, height1, x2, y2, width2, height2) {
    if (x1+width1 > x2 && x1 < x2+width2 && y1+height1 > y2 && y1 < y2+height2) {
      return true;
    }
    return false;
  }
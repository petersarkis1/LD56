let canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
let aspectRatio = 16/9;
let windowedWidth = 1580;
let windowedHeight = 920;
canvas.width = windowedWidth;
canvas.height = windowedHeight;

let lastTime = 0;

let playerSprLeft = greenyLeft;
let playerSprRight = greenyRight;
let playerOldSprLeft = greenyLeft;
let playerOldSprRight = greenyRight;

let player = {
    x: 10,
    y: 1800,
    curSpr: greenyLeft,
    show: true,
    sprSpd: 10,
    power: 'base',
    isTransforming: false,
    TransformingTime: 0,
    TransformingToggleOld: true,
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
    lives: 3,
    canTakeDamage: true,
    damageTimer: 0,
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

let currentLevel = level1;
let currentTileLevel = JSON.parse(JSON.stringify(currentLevel));
let tileSize = 64;
let tileAlternates = ['a', 'b', 'c', 'd'];
let curKeys = [];
let enemies = [];
let powerups = [];
initEnemies();
let frameCount = 0;
let groundLevel = 2160-128;

function initEnemies() {
    for (let i = 0; i < currentLevel.length; i++) {
        for (let j = 0; j < currentLevel[i].length; j++) {
            // Get the sprite for the object
            let tile = currentLevel[i][j];
            if (tile == 1) {
                currentTileLevel[i][j] = 1 + tileAlternates[Math.floor(Math.random()* tileAlternates.length)];
            }
            if (tile == 2) {
                enemies.push({
                    type: 'amiba',
                    x: j*tileSize - 64,
                    y: i*tileSize - 64,
                    width: 101,
                    height: 128,
                    sprTotal: 2,
                    curSpr: 0,
                    sprSpd: 10,
                    spd: 4,
                    actionList: ['walkLeft', 'walkRight'],
                    currentAction: null,
                    timeToNextAction: 10
                });
            }
            if (tile == 5) {
                powerups.push({
                    type: 'fungus',
                    x: j*tileSize,
                    y: i*tileSize,
                    width: 64,
                    height: 64,
                    movingDir: -1,
                    movingCount: 0,
                    covingCountMax: 20
                });
            }
        }
    }
}

function update(currentTime) {
    // Calculate the delta time
    let deltaTime = (currentTime - lastTime) / 10; // Convert milliseconds to seconds
    lastTime = currentTime;

    if (currentLevel == 'gameOver') {
        ctx.drawImage(gameOverScreen, 0, 0, 1580, 920);
    } else {
        frameCount++;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(greenBlurred, 0 - camera.x, 0 - camera.y, 5120, 2160);
        drawLevel();
        enemyStep();
        drawEnemies();
        drawPowerups();
        camera.follow(player);
        player.direction = {x: 0};
        if (curKeys.includes('ArrowLeft')) {
            player.direction.x -= 1;
        }
        if (curKeys.includes('ArrowRight')) {
            player.direction.x += 1;
        }
        
        //check to change sprite
        if (player.direction.x != 0 && !player.isTransforming) {
            player.curSpr = player.direction.x > 0 ? playerSprRight : playerSprLeft;
        }
        if (player.show) {
            ctx.drawImage(player.curSpr, player.width * player.animationFrame, 0, player.width, player.width, player.x - camera.x, player.y - camera.y + 10, player.width, player.height);
        }
    
        if (curKeys.includes(' ') && player.canJump) {
            player.canJump = false;
            player.isJumping = true;
            player.velocityY = -player.jumpStrength; // Set the initial jump velocity
            player.velocityY += player.gravity; // Increase downward velocity over time
            player.y += player.velocityY * deltaTime; // Adjust for delta time
        }
        // Check collision under the player
        let yCol = checkYplatformCollision();
        if (!yCol) {
            player.velocityY += player.gravity * deltaTime; // Increase downward velocity over time
            player.y += player.velocityY * deltaTime; // Update the player's vertical position
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
            player.x += player.direction.x * player.spd * deltaTime;
            let colX = checkXplatformCollision();
            if (colX) {
                player.x = colX;
            }
        }
    
        if (player.damageTimer != 0) {
            player.damageTimer--;
            if (player.damageTimer % 5 == 0) {
                player.show = !player.show;
            }
            if (player.damageTimer == 0) {
                player.canTakeDamage = true;
                player.show = true;
            }
        }
    
        if (checkForEnemyCol()) {
            if (player.canTakeDamage) {
                player.canTakeDamage = false;
                player.damageTimer = 40;
                player.lives--;
                //check for death
                if (player.lives <= 0) {
                    currentLevel = 'gameOver';
                }
            }
        }
        let foundPowers = checkForPowerupCol()
        if (foundPowers) {
            
            player.power = foundPowers.type;
            player.isTransforming = true;
            player.TransformingTime = 80;
            playerOldSprLeft = greenyLeft;
            playerOldSprRight = greenyRight;
            playerSprLeft = orangeyRight;
            playerSprRight = orangeyRight;
        }

        if (player.isTransforming) {
            player.TransformingTime--;
            console.log(player.TransformingTime);
            if (player.TransformingTime % 10 == 0) {
                player.TransformingToggleOld = !player.TransformingToggleOld;
                if (player.TransformingToggleOld) {
                    player.curSpr = playerOldSprRight;
                } else {
                    player.curSpr = playerSprRight;
                }

            }
        }

        if (player.TransformingTime <= 0) {
            player.isTransforming = false;
            player.curSpr = playerSprRight;
        }

    }
    requestAnimationFrame(update);
}

function checkForEnemyCol() {
    for (let i = 0; i < enemies.length; i++) {
        let curEnemy = enemies[i];
        if (boxCollision(player.x, player.y, player.width, player.height, curEnemy.x, curEnemy.y, curEnemy.width, curEnemy.height)) {
            return true;
        }
    }
    return false;
}

function checkForPowerupCol() {
    let foundPowerupIndex = null;
    for (let i = 0; i < powerups.length; i++) {
        let curPowerup = powerups[i];
        if (boxCollision(player.x, player.y, player.width, player.height, curPowerup.x, curPowerup.y, curPowerup.width, curPowerup.height)) {
            foundPowerupIndex = curPowerup;
        }
    }
    if (foundPowerupIndex !== null) {
        return powerups.splice(foundPowerupIndex, 1)[0];
    }
    return false;
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

function checkForFloor(x, y) {
    let XIndex = Math.floor(x/tileSize);
    let YIndex = Math.floor(y/tileSize);
    if (currentLevel[YIndex][XIndex] == 1) {
        return true;
    }
    return false;
}

function drawLevel() {
    
    platformSpr = [lPlat1, lPlat2, lPlat3, lPlat4];

    for (let i = 0; i < currentLevel.length; i++) {
        for (let j = 0; j < currentLevel[i].length; j++) {
            // Get the sprite for the object
            let tile = currentTileLevel[i][j];
            if (tile == '1a') {
                ctx.drawImage(platformSpr[0], j*tileSize - camera.x, i*tileSize - camera.y, tileSize, tileSize);
            }
            if (tile == '1b') {
                ctx.drawImage(platformSpr[1], j*tileSize - camera.x, i*tileSize - camera.y, tileSize, tileSize);
            }
            if (tile == '1c') {
                ctx.drawImage(platformSpr[2], j*tileSize - camera.x, i*tileSize - camera.y, tileSize, tileSize);
            }
            if (tile == '1d') {
                ctx.drawImage(platformSpr[3], j*tileSize - camera.x, i*tileSize - camera.y, tileSize, tileSize);
            }
        }
    }
}

function enemyStep() {
    for (let i = 0; i < enemies.length; i++) {
        let curEnemy = enemies[i];
        if (curEnemy.timeToNextAction != 0) {
            curEnemy.timeToNextAction--;
        } else {
            if (curEnemy.currentAction == null) {
                curEnemy.currentAction = curEnemy.actionList[Math.floor(Math.random() * curEnemy.actionList.length)];
            } else {
                switch (curEnemy.currentAction) {
                    case 'walkLeft':
                        if (checkForFloor(curEnemy.x - curEnemy.spd, curEnemy.y + curEnemy.height + 4)) {
                            curEnemy.x -= curEnemy.spd;
                            if (frameCount % curEnemy.sprSpd == 0) {
                                curEnemy.curSpr++;
                                if (curEnemy.curSpr > curEnemy.sprTotal) {
                                    curEnemy.curSpr = 0;
                                }
                            }
                        } else {
                            curEnemy.currentAction = null;
                            curEnemy.timeToNextAction = Math.floor(Math.random()* 100);
                        }
                        break;
                    case 'walkRight':
                        if (checkForFloor(curEnemy.x + curEnemy.spd + curEnemy.width, curEnemy.y + curEnemy.height + 4)) {
                            curEnemy.x += curEnemy.spd;
                            if (frameCount % curEnemy.sprSpd == 0) {
                                curEnemy.curSpr++;
                                if (curEnemy.curSpr > curEnemy.sprTotal) {
                                    curEnemy.curSpr = 0;
                                }
                            }
                        } else {
                            curEnemy.currentAction = null;
                            curEnemy.timeToNextAction = Math.floor(Math.random()* 100);
                        }
                        break;
                }
            }
        }
    }
}

function drawEnemies() {
    let enemyMap = {
        amiba: amiba
    };
    for (let i = 0; i < enemies.length; i++) {
        let curEnemy = enemies[i];
        ctx.drawImage(enemyMap[curEnemy.type], curEnemy.curSpr * curEnemy.width, 0, curEnemy.width, curEnemy.height, curEnemy.x - camera.x, curEnemy.y - camera.y, curEnemy.width, curEnemy.height);
    }
}

function drawPowerups() {
    let powerupMap = {
        fungus: fungusPWRUP
    };
    for (let i = 0; i < powerups.length; i++) {
        let curPower = powerups[i];
        if (frameCount % 2 == 0) {
            curPower.y += 1 * curPower.movingDir;
            curPower.movingCount++;
        }
        if (curPower.movingCount >= curPower.covingCountMax) {
            curPower.movingDir *= -1;
            curPower.movingCount = 0;
        }
        ctx.drawImage(powerupMap[curPower.type], curPower.x - camera.x, curPower.y - camera.y, curPower.width, curPower.height);
    }
}

window.addEventListener("load", function() {
    requestAnimationFrame(update);
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
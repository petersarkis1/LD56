let canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
let aspectRatio = 16/9;
let windowedWidth = 1580;
let windowedHeight = 920;
canvas.width = windowedWidth;
canvas.height = windowedHeight;
let mouseX = 0;
let mouseY = 0;

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
    width: 128,
    height: 128,
    velocityY: 0,
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
    direction: {x: 0, y: 0},
    dying: false,
    dyingTime: 0,
    clearLvl: false,
    clearTime: 0
};

let currentWorldIndex = 1;
let tileSize = 64;
let lvlFinish = {};

const camera = {
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height,
    follow(target) {
        // Center the camera on the player
        this.x = target.x - this.width / 2 + target.width / 2;
        this.y = target.y - this.height / 2 + target.height / 2;

        lvlWidth = levels[currentWorldIndex][0].length * tileSize;
        lvlHeight = levels[currentWorldIndex].length * tileSize;
        // Optional: Prevent the camera from moving out of bounds
        this.x = Math.max(0, this.x);
        this.x = Math.min(lvlWidth - windowedWidth, this.x);
        this.y = Math.max(0, this.y);
        this.y = Math.min(lvlHeight - windowedHeight, this.y);
    }
};

let deltaTime;
let currentLevel = 'pressAnyKey';
let currentTileLevel;
let tileAlternates = ['a', 'b', 'c', 'd'];
let curKeys = [];
let enemies = [];
let powerups = [];
let frameCount = 0;
let outOfBounds = false;

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
                    y: i*tileSize - 32,
                    width: 128,
                    height: 128,
                    velocityY: 0,
                    velocityX: 0,
                    gravity: 0.3,
                    jumpStrength: 8,
                    sprTotal: 2,
                    dir: 0,
                    curSpr: 0,
                    sprSpd: 40,
                    spd: 3,
                    actionList: ['walkLeft', 'walkRight'],
                    currentAction: null,
                    timeToNextAction: 10,
                    dying: false,
                    dyingTime: 0
                });
            }
            if (tile == 3) {
                enemies.push({
                    type: 'blueman',
                    x: j*tileSize - 64,
                    y: i*tileSize - 50,
                    floorY: i*tileSize - 50,
                    width: 128,
                    height: 128,
                    velocityY: 0,
                    velocityX: 0,
                    gravity: 0.3,
                    jumpStrength: 8,
                    sprTotal: 2,
                    dir: 0,
                    curSpr: 0,
                    sprSpd: 10,
                    spd: 2,
                    hasJumped: false,
                    actionList: ['walkLeft', 'walkRight','jump'],
                    currentAction: null,
                    timeToNextAction: 4,
                    dying: false,
                    dyingTime: 0
                });
            }
            if (tile == 4) {
                enemies.push({
                    type: 'pinkguy',
                    x: j*tileSize - 64,
                    y: i*tileSize - 64,
                    width: 128,
                    height: 154,
                    velocityY: 0,
                    velocityX: 0,
                    gravity: 0.3,
                    jumpStrength: 8,
                    sprTotal: 2,
                    dir: 0,
                    curSpr: 0,
                    sprSpd: 10,
                    spd: 5,
                    actionList: ['walkLeft', 'walkRight'],
                    currentAction: null,
                    timeToNextAction: 10,
                    dying: false,
                    dyingTime: 0
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
                    covingCountMax: 20,
                    sprLeft: orangeyLeft,
                    sprRight: orangeyRight,
                    jumpStrength: 14,
                    spd: 8
                });
            }
            if (tile == 6) {
                powerups.push({
                    type: 'parasite',
                    x: j*tileSize,
                    y: i*tileSize,
                    width: 64,
                    height: 64,
                    movingDir: -1,
                    movingCount: 0,
                    covingCountMax: 20,
                    sprLeft: blueyLeft,
                    sprRight: blueyRight,
                    jumpStrength: 11,
                    spd: 14
                });
            }
            if (tile == 7) {
                powerups.push({
                    type: 'virus',
                    x: j*tileSize,
                    y: i*tileSize,
                    width: 64,
                    height: 64,
                    movingDir: -1,
                    movingCount: 0,
                    covingCountMax: 20,
                    sprLeft: darkGreenyLeft,
                    sprRight: darkGreenyRight,
                    jumpStrength: 11,
                    spd: 8
                });
            }
            if (tile == 8) {
                powerups.push({
                    type: 'star',
                    x: j*tileSize,
                    y: i*tileSize,
                    width: 64,
                    height: 64,
                    movingDir: -1,
                    movingCount: 0,
                    covingCountMax: 20,
                    sprLeft: greyLeft,
                    sprRight: greyRight,
                    jumpStrength: 11,
                    spd: 8
                });
            }
            if (tile == 9) {
                lvlFinish = {
                    x: j*tileSize,
                    y: i*tileSize,
                    width: 512,
                    height: 512,
                };
            }
        }
    }
}

let menus = ['mainMenu', 'credits', 'gameOver'];

function update(currentTime) {
    // Calculate the delta time
    deltaTime = (currentTime - lastTime) / 10; // Convert milliseconds to seconds
    lastTime = currentTime;

    if (typeof currentLevel == 'string') {
        switch (currentLevel) {
            case 'pressAnyKey':
                ctx.drawImage(pressAnyScreen, 0, 0, 1580, 920);
                if (curKeys.length >= 1) {
                    currentLevel = 'mainMenu';
                    [mouseX, mouseY] = [0,0];
                }
                break;
            case 'mainMenu':
                intro_music.play();
                ctx.drawImage(menuScreen, 0, 0, 1580, 920);
                ctx.fillStyle = "#616060";
                ctx.fillRect(732, 767, volume, 20);
                if (boxCollision(mouseX, mouseY, 1, 1, 650, 335, 270, 90)) {
                    currentWorldIndex = 0;
                    resetGame();
                    player.x = levelStarts[currentWorldIndex].x;
                    player.y = levelStarts[currentWorldIndex].y;
                    [mouseX, mouseY] = [0,0];
                    intro_music.pause();
                    main_theme.play();
                }
                if (boxCollision(mouseX, mouseY, 1, 1, 630, 460, 320, 90)) {
                    currentLevel = 'credits';
                    [mouseX, mouseY] = [0,0];
                }
                break;
            case 'credits':
                canvas.height = 1801;
                ctx.drawImage(creditsScreen, 0, 0, 1580, 1801);
                if (boxCollision(mouseX, mouseY, 1, 1, 660, 1650, 320, 80)) {
                    canvas.height = windowedHeight;
                    currentLevel = 'mainMenu';
                    [mouseX, mouseY] = [0,0];
                }
                break;
            case 'gameOver':
                ctx.drawImage(gameOverScreen, 0, 0, 1580, 920);
                if (boxCollision(mouseX, mouseY, 1, 1, 600, 260, 380, 90)) {
                    resetGame();
                    player.x = levelStarts[currentWorldIndex].x;
                    player.y = levelStarts[currentWorldIndex].y;
                    [mouseX, mouseY] = [0,0];
                    main_theme.play();
                }
                if (boxCollision(mouseX, mouseY, 1, 1, 625, 760, 325, 85)) {
                    currentLevel = 'mainMenu';
                    [mouseX, mouseY] = [0,0];
                }
                break;
            case 'winScreen':
                ctx.drawImage(winScreen, 0, 0, 1580, 920);
                if (boxCollision(mouseX, mouseY, 1, 1, 530, 780, 520, 90)) {
                    currentLevel = 'mainMenu';
                    [mouseX, mouseY] = [0,0];
                    winning_theme.pause();
                    main_theme.pause();
                    intro_music.play();
                }
                break;
        }
    } else {
        if (outOfBounds) {
            if (player.y > 200) {
                player.dying = true;
                player.velocityY = -player.jumpStrength; // Set the initial jump velocity
                player.velocityY += player.gravity; // Increase downward velocity over time
                player.y += player.velocityY * deltaTime; // Adjust for delta time
                player.dyingTime = 200;
                death_sound.play();
                main_theme.pause();
                star_sound.pause();
            }
            outOfBounds = false;
        }
        frameCount++;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(levelBackgrounds[currentWorldIndex], 0 - camera.x, 0 - camera.y, levels[currentWorldIndex][0].length * tileSize, levels[currentWorldIndex].length * tileSize);
        drawLevel();
        enemyStep();
        drawEnemies();
        drawFinish();
        drawPowerups();
        camera.follow(player);
        if (!player.dying) {
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
            let yCol = false;
            try {
                yCol = checkYplatformCollision();
              } catch (error) {
                outOfBounds = true;
              }
            if (!yCol) {
                player.canJump = false;
                player.velocityY += player.gravity * deltaTime; // Increase downward velocity over time
                player.y += player.velocityY * deltaTime; // Update the player's vertical position
                //check head bonk
                let yColHead = false;
                try {
                    yColHead = checkYplatformCollisionHead();
                  } catch (error) {
                  }
                if (yColHead) {
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
                let colX = false;
                try {
                    colX = checkXplatformCollision();
                  } catch (error) {
                    outOfBounds = true;
                  }
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
                    ouch.pause();
                    ouch.currentTime = 0;
                }
            }
        
            let enemyColIndex = checkForEnemyCol();
            if (enemyColIndex !== false) {
                console.log((player.y - enemies[enemyColIndex].y))
                if (player.power == 'star' || player.power == 'virus') {
                    enemies[enemyColIndex].dying = true;
                    enemies[enemyColIndex].dyingTime = 80;
                    enemies[enemyColIndex].timeToNextAction = 0;
                    enemies[enemyColIndex].currentAction = 'jump';
                    switch (enemies[enemyColIndex].type) {
                        case 'amiba':
                            amiba_hit.currentTime = 0
                            amiba_hit.play();
                            break;
                        case 'blueman':
                            blueman_hit.currentTime = 0
                            blueman_hit.play();
                            break;
                        case 'pinkguy':
                            pinkguy_hit.currentTime = 0
                            pinkguy_hit.play();
                            break;
                    }
                    if (player.power == 'virus') {
                        if (player.y - enemies[enemyColIndex].y <= -100) {
                            player.velocityY = -player.jumpStrength; // Set the initial jump velocity
                            player.velocityY += player.gravity; // Increase downward velocity over time
                            player.y += player.velocityY * deltaTime; // Adjust for delta time
                        } else {
                            player.power = 'base';
                            player.isTransforming = true;
                            player.TransformingTime = 80;
                            player.jumpStrength = 11;
                            player.spd = 8;
                            playerOldSprLeft = playerSprLeft;
                            playerOldSprRight = playerSprRight;
                            playerSprLeft = greenyLeft;
                            playerSprRight = greenyRight;
                        }
                    }
                } else {
                    if (player.power == 'base' || player.y - enemies[enemyColIndex].y > -100) {
                        if (player.canTakeDamage) {
                            player.canTakeDamage = false;
                            player.damageTimer = 80;
                            ouch.play();
                            if (player.power == 'base') {
                                player.lives--;
                            } else {
                                player.power = 'base';
                                player.isTransforming = true;
                                player.TransformingTime = 80;
                                player.jumpStrength = 11;
                                player.spd = 8;
                                playerOldSprLeft = playerSprLeft;
                                playerOldSprRight = playerSprRight;
                                playerSprLeft = greenyLeft;
                                playerSprRight = greenyRight;
                            }
                            //check for death
                            if (player.lives <= 0) {
                                player.dying = true;
                                player.velocityY = -player.jumpStrength; // Set the initial jump velocity
                                player.velocityY += player.gravity; // Increase downward velocity over time
                                player.y += player.velocityY * deltaTime; // Adjust for delta time
                                player.dyingTime = 200;
                                death_sound.play();
                                main_theme.pause();
                                star_sound.pause();
                            }
                        }
                    } else {
                        player.velocityY = -player.jumpStrength; // Set the initial jump velocity
                        player.velocityY += player.gravity; // Increase downward velocity over time
                        player.y += player.velocityY * deltaTime; // Adjust for delta time
                    }
                }
            }
            let foundPowers = checkForPowerupCol()
            if (foundPowers && !player.isTransforming) {
                power_up.play();
                player.power = foundPowers.type;
                if(player.power == 'star') {
                    star_sound.play();
                    main_theme.pause();
                }
                player.isTransforming = true;
                player.TransformingTime = 80;
                player.jumpStrength = foundPowers.jumpStrength;
                player.spd = foundPowers.spd;
                playerOldSprLeft = playerSprLeft;
                playerOldSprRight = playerSprRight;
                playerSprLeft = foundPowers.sprLeft;
                playerSprRight = foundPowers.sprRight;
            }


            if (player.clearLvl) {
                player.clearTime--;
                if (player.clearTime <= 0) {
                    if (currentWorldIndex == 3) {
                        currentLevel = 'winScreen';
                        main_theme.pause();
                        star_sound.pause();
                        winning_theme.play();
                        player.clearLvl = false;
                    } else {
                        currentWorldIndex++;
                        resetGame(player.lives);
                    }
                }
            } else {
                //check for exit
                if (boxCollision(player.x, player.y, player.width, player.height, lvlFinish.x, lvlFinish.y, lvlFinish.width, lvlFinish.height)) {
                    player.clearLvl = true;
                    player.clearTime = 30;
                }
            }
    
            if (player.isTransforming) {
                player.TransformingTime--;
                if (player.TransformingTime % 10 == 0) {
                    player.TransformingToggleOld = !player.TransformingToggleOld;
                    if (player.TransformingToggleOld) {
                        player.curSpr = playerOldSprRight;
                    } else {
                        player.curSpr = playerSprRight;
                    }
    
                }
            }
    
            if (player.isTransforming && player.TransformingTime <= 0) {
                player.isTransforming = false;
                player.curSpr = playerSprRight;
            }
            
            drawHud();
        } else {
            ctx.drawImage(player.curSpr, player.width * player.animationFrame, 0, player.width, player.width, player.x - camera.x, player.y - camera.y + 10, player.width, player.height);
            drawHud();
            player.velocityY += player.gravity * deltaTime; // Increase downward velocity over time
            player.y += player.velocityY * deltaTime; // Update the player's vertical position
            player.dyingTime--;
            if (player.dyingTime <= 0) {
                player.dying = false;
                currentLevel = 'gameOver';
                main_theme.pause();
                star_sound.pause();
            }
        }

    }
    requestAnimationFrame(update);
}

function resetGame(lives = 3) {
    player = {
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
        lives: lives,
        canTakeDamage: true,
        damageTimer: 0,
        direction: {x: 0, y: 0},
        dying: false,
        dyingTime: 0,
        clearLvl: false,
        clearTime: 0
    };
    player.y = levelStarts[currentWorldIndex].y
    currentLevel = levels[currentWorldIndex];
    currentTileLevel = JSON.parse(JSON.stringify(currentLevel));
    playerSprLeft = greenyLeft;
    playerSprRight = greenyRight;
    playerOldSprLeft = greenyLeft;
    playerOldSprRight = greenyRight;
    enemies = [];
    powerups = [];
    initEnemies();
}

function drawHud() {
    ctx.drawImage(player.lives >= 1 ? filledHeart : emptyHeart, 1280, 10, 68, 68);
    ctx.drawImage(player.lives >= 2 ? filledHeart : emptyHeart, 1360, 10, 68, 68);
    ctx.drawImage(player.lives >= 3 ? filledHeart : emptyHeart, 1440, 10, 68, 68);
}

function drawFinish() {
    ctx.drawImage(finishs[currentWorldIndex], lvlFinish.x  - camera.x, lvlFinish.y  - camera.y, lvlFinish.width, lvlFinish.height);
}

function checkForEnemyCol() {   
    for (let i = 0; i < enemies.length; i++) {
        let curEnemy = enemies[i];
        if (!curEnemy.dying && boxCollision(player.x, player.y, player.width, player.height, curEnemy.x, curEnemy.y, curEnemy.width, curEnemy.height)) {
            return i;
        }
    }
    return false;
}

function checkForPowerupCol() {
    let foundPowerupIndex = null;
    for (let i = 0; i < powerups.length; i++) {
        let curPowerup = powerups[i];
        if (boxCollision(player.x, player.y, player.width, player.height, curPowerup.x, curPowerup.y, curPowerup.width, curPowerup.height)) {
            foundPowerupIndex = i;
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
    
    platformSpr = [[lPlat1, lPlat2, lPlat3, lPlat4], [bugPlat1, bugPlat2, bugPlat3, bugPlat4], [bPlat1, bPlat2, bPlat3, bPlat4], [fPlat1, fPlat2, fPlat3, fPlat4]];

    for (let i = 0; i < currentLevel.length; i++) {
        for (let j = 0; j < currentLevel[i].length; j++) {
            // Get the sprite for the object
            let tile = currentTileLevel[i][j];
            if (tile == '1a') {
                ctx.drawImage(platformSpr[currentWorldIndex][0], j*tileSize - camera.x, i*tileSize - camera.y, tileSize, tileSize);
            }
            if (tile == '1b') {
                ctx.drawImage(platformSpr[currentWorldIndex][1], j*tileSize - camera.x, i*tileSize - camera.y, tileSize, tileSize);
            }
            if (tile == '1c') {
                ctx.drawImage(platformSpr[currentWorldIndex][2], j*tileSize - camera.x, i*tileSize - camera.y, tileSize, tileSize);
            }
            if (tile == '1d') {
                ctx.drawImage(platformSpr[currentWorldIndex][3], j*tileSize - camera.x, i*tileSize - camera.y, tileSize, tileSize);
            }
        }
    }
}

function enemyStep() {
    let enemiesToRemove = [];
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
                            curEnemy.x -= curEnemy.spd * deltaTime;
                            curEnemy.dir = -1;
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
                            curEnemy.x += curEnemy.spd * deltaTime;
                            if (frameCount % curEnemy.sprSpd == 0) {
                                curEnemy.curSpr++;
                                curEnemy.dir = 1;
                                if (curEnemy.curSpr > curEnemy.sprTotal) {
                                    curEnemy.curSpr = 0;
                                }
                            }
                        } else {
                            curEnemy.currentAction = null;
                            curEnemy.timeToNextAction = Math.floor(Math.random()* 100);
                        }
                        break;
                    case 'jump':
                        if (!curEnemy.hasJumped) {
                            curEnemy.hasJumped = true;
                            curEnemy.velocityY = -curEnemy.jumpStrength; // Set the initial jump velocity
                            curEnemy.velocityY += curEnemy.gravity; // Increase downward velocity over time
                            curEnemy.y += curEnemy.velocityY * deltaTime; // Adjust for delta time
                            if (curEnemy.dying) {
                                let min = -4
                                let max = 4
                                curEnemy.velocityX = Math.floor(Math.random() * (max - min + 1)) + min;
                                curEnemy.x += curEnemy.velocityX * deltaTime; // Adjust for delta time
                            }
                        } else {
                            if (curEnemy.dying) {
                                curEnemy.velocityY += curEnemy.gravity; // Increase downward velocity over time
                                curEnemy.y += curEnemy.velocityY * deltaTime; // Adjust for delta time
                                curEnemy.x += curEnemy.velocityX * deltaTime; // Adjust for delta time
                                curEnemy.dyingTime--;
                                if (curEnemy.dyingTime <= 0) {
                                    enemiesToRemove.push(i);
                                }
                            } else {
                                if (curEnemy.y < curEnemy.floorY) {
                                    curEnemy.velocityY += curEnemy.gravity; // Increase downward velocity over time
                                    curEnemy.y += curEnemy.velocityY * deltaTime; // Adjust for delta time
                                } else {
                                curEnemy.y = curEnemy.floorY;
                                curEnemy.hasJumped = false;
                                curEnemy.currentAction = null;
                                curEnemy.timeToNextAction = Math.floor(Math.random()* 100);
                                }
                            }
                        }
                        break;
                }
            }
        }
    }
    for (let i = enemiesToRemove.length-1; i >= 0; i--) {
        enemies.splice(enemiesToRemove[i], 1);
    }
}

function drawEnemies() {
    let enemyMap = {
        amiba: [amibaLeft, amibaRight],
        blueman: [blueman, blueman],
        pinkguy: [pinkGuyLeft, pinkGuyRight]
    };
    for (let i = 0; i < enemies.length; i++) {
        let curEnemy = enemies[i];

        ctx.drawImage(enemyMap[curEnemy.type][curEnemy.dir == 1 ? 1 : 0], curEnemy.curSpr * curEnemy.width, 0, curEnemy.width, curEnemy.height, curEnemy.x - camera.x, curEnemy.y - camera.y, curEnemy.width, curEnemy.height);
    }
}

function drawPowerups() {
    let powerupMap = {
        fungus: fungusPWRUP,
        virus: virusPWRUP,
        parasite: parasitePWRUP,
        star: starPWRUP
    };
    for (let i = 0; i < powerups.length; i++) {
        let curPower = powerups[i];
        if (frameCount % 2 == 0) {
            curPower.y += 1 * curPower.movingDir  * deltaTime;
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

window.addEventListener("mousedown", function(el) {
    let rect = canvas.getBoundingClientRect();
    mouseX = el.clientX - rect.left;
    mouseY = el.clientY - rect.top;
    if (boxCollision(732, 767, 290, 20, mouseX, mouseY, 1, 1)) {
        volume = mouseX - 732;
        musicVolume = 0.4 * (volume / 290);
        setMusicVolume();
    }
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
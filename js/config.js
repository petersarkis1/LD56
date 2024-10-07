let greenyLeft = new Image(384, 128);
greenyLeft.src = './assets/greenyLeft.png';
let greenyRight = new Image(384, 128);
greenyRight.src = './assets/greenyRight.png';
let darkGreenyLeft = new Image(384, 128);
darkGreenyLeft.src = './assets/darkGreenyLeft.png';
let darkGreenyRight = new Image(384, 128);
darkGreenyRight.src = './assets/darkGreenyRight.png';
let orangeyRight = new Image(384, 128);
orangeyRight.src = './assets/orangeyRight.png';
let orangeyLeft = new Image(384, 128);
orangeyLeft.src = './assets/orangeyLeft.png';
let greyRight = new Image(384, 128);
greyRight.src = './assets/greyRight.png';
let greyLeft = new Image(384, 128);
greyLeft.src = './assets/greyLeft.png';
let blueyRight = new Image(384, 128);
blueyRight.src = './assets/blueyRight.png';
let blueyLeft = new Image(384, 128);
blueyLeft.src = './assets/blueyLeft.png';
let amibaLeft = new Image(384, 105);
amibaLeft.src = './assets/amibaLeft.png';
let amibaRight = new Image(384, 105);
amibaRight.src = './assets/amibaRight.png';
let pinkGuyLeft = new Image(384, 154);
pinkGuyLeft.src = './assets/pinkGuyLeft.png';
let pinkGuyRight = new Image(384, 154);
pinkGuyRight.src = './assets/pinkGuyRight.png';
let blueman = new Image(384, 128);
blueman.src = './assets/blueman.png';
let background = new Image(5120, 2160);
background.src = './assets/background.png';
let menuScreen = new Image(1581, 921);
menuScreen.src = './assets/menuScreen.png';
let gameOverScreen = new Image(1581, 921);
gameOverScreen.src = './assets/gameOverScreen.png';
let greenBlurred = new Image(1375, 772);
greenBlurred.src = './assets/greenBlurred.png';
let lPlat1 = new Image(64, 64);
lPlat1.src = './assets/lPlat1.png';
let lPlat2 = new Image(64, 64);
lPlat2.src = './assets/lPlat2.png';
let lPlat3 = new Image(64, 64);
lPlat3.src = './assets/lPlat3.png';
let lPlat4 = new Image(64, 64);
lPlat4.src = './assets/lPlat4.png';
let bugPlat1 = new Image(64, 64);
bugPlat1.src = './assets/bugPlat1.png';
let fungusPWRUP = new Image(64, 64);
fungusPWRUP.src = './assets/fungusPWRUP.png';
let parasitePWRUP = new Image(64, 64);
parasitePWRUP.src = './assets/parasitePWRUP.png';
let starPWRUP = new Image(64, 64);
starPWRUP.src = './assets/starPWRUP.png';
let virusPWRUP = new Image(64, 64);
virusPWRUP.src = './assets/virusPWRUP.png';
let emptyHeart = new Image(68, 68);
emptyHeart.src = './assets/emptyHeart.png';
let filledHeart = new Image(68, 68);
filledHeart.src = './assets/filledHeart.png';
// let inserterSlide = new Image(1024, 640);
// inserterSlide.src = './assets/inserterSlide.png';
// let inserterImg = new Image(96, 96);
// inserterImg.src = './assets/inserter.png';
// let playerImg = new Image(896, 64);
// playerImg.src = './assets/player.png';
// let playerJump = new Image(576, 64);
// playerJump.src = './assets/jump.png';
// let cards = new Image(768, 160);
// cards.src = './assets/cards.png';
// let items = new Image(128, 64);
// items.src = './assets/items.png';
// let gameOver = new Image(448, 200);
// gameOver.src = './assets/gameover.png';
let intro_music = document.getElementById("intro_music");
intro_music.loop = true;

let main_theme = document.getElementById("main_theme");
main_theme.loop = true;

let power_up = document.getElementById("power_up");
power_up.loop = false;

let ouch = document.getElementById("ouch");
ouch.loop = false;

let amiba_hit = document.getElementById("amiba_hit");
amiba_hit.loop = false;

let pinkguy_hit = document.getElementById("pinkguy_hit");
pinkguy_hit.loop = false;

let blueman_hit = document.getElementById("blueman_hit");
blueman_hit.loop = false;

let star_sound = document.getElementById("star_sound");
star_sound.loop = true;

let death_sound = document.getElementById("death_sound");
death_sound.loop = false;

// let sound2 = document.getElementById("sound2");
// sound2.loop = true;
// sound.onended = function() {
//     sound2.play();
// };
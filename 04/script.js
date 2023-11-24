var canvas;
var context;
var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;
var playerX = (canvasWidth - 50) / 2;
var playerY = (canvasHeight - 50) / 2;
var targetX = playerX;
var targetY = playerY;
var playerSpeed = 10;
var elasticEase = 0.1;
var keys = {};
var bullets = [];

var botSize = 50;
var Player1Size = 50;

var chanceToShoot = 0.02;

var bot = {
  x: canvasWidth - 100,
  y: canvasHeight - 100,
  speed: 5,
  bullets: [],
  score: 0,
};

var player1 = {
  score: 0,
};

var mouseX = 0;
var mouseY = 0;

var gameState = "NOT PLAYING";

function createCanvas(width, height) {
  canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  context = canvas.getContext("2d");
  document.body.appendChild(canvas);
}

function drawPlayer() {
  // context.clearRect(0, 0, canvasWidth, canvasHeight);
  


  
  
  context.fillStyle = "black";
  context.beginPath();
  context.arc(playerX + 25, playerY + 25, botSize, 0, 2 * Math.PI);
  context.fill();

  context.closePath();

  context.arc(playerX + 25, playerY + 25, 20, 0, 2 * Math.PI);
  context.beginPath();
  
}

function drawBot() {


  context.fillStyle = "blue";
  context.beginPath();
  context.arc(bot.x + 25, bot.y + 25, Player1Size, 0, 2 * Math.PI);
  context.fill();
  context.closePath();
}

function movePlayer() {
  if (keys["a"] && keys["w"] && playerX > 0 && playerY > 0) {
    targetX -= playerSpeed;
    targetY -= playerSpeed;
  } else if (
    keys["a"] &&
    keys["s"] &&
    playerX > 0 &&
    playerY + 50 < canvasHeight
  ) {
    targetX -= playerSpeed;
    targetY += playerSpeed;
  } else if (
    keys["d"] &&
    keys["w"] &&
    playerX + 100 < canvasWidth &&
    playerY > 0
  ) {
    targetX += playerSpeed;
    targetY -= playerSpeed;
  } else if (
    keys["d"] &&
    keys["s"] &&
    playerX + 100 < canvasWidth &&
    playerY + 50 < canvasHeight
  ) {
    targetX += playerSpeed;
    targetY += playerSpeed;
  } else if (keys["a"] && playerX > 0) {
    targetX -= playerSpeed;
  } else if (keys["d"] && playerX + 100 < canvasWidth) {
    targetX += playerSpeed;
  } else if (keys["w"] && playerY > 0) {
    targetY -= playerSpeed;
  } else if (keys["s"] && playerY + 50 < canvasHeight) {
    targetY += playerSpeed;
  }

  var dx = targetX - playerX;
  var dy = targetY - playerY;
  playerX += dx * elasticEase;
  playerY += dy * elasticEase;
}

function drawBullets() {
  for (var i = 0; i < bullets.length; i++) {
    var bullet = bullets[i];
    context.beginPath();
    context.arc(bullet.x, bullet.y, 5, 0, 2 * Math.PI);
    context.fillStyle = "black";
    context.fill();
    context.closePath();
  }

  for (var i = 0; i < bot.bullets.length; i++) {
    var bullet = bot.bullets[i];
    context.beginPath();
    context.arc(bullet.x, bullet.y, 5, 0, 2 * Math.PI);
    context.fillStyle = "blue";
    context.fill();
    context.closePath();
  }
}

function checkCollision() {
  for (var i = bullets.length - 1; i >= 0; i--) {
    var bullet = bullets[i];
    var dx = bot.x + 25 - bullet.x;
    var dy = bot.y + 25 - bullet.y;
    var distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < botSize) {
      bullets.splice(i, 1);
      bot.score++;
      Player1Size += 10;
      setTimeout(() => {
        Player1Size -= 10;
      }, 100);
    }
  }

  for (var i = bot.bullets.length - 1; i >= 0; i--) {
    var bullet = bot.bullets[i];
    var dx = playerX + 25 - bullet.x;
    var dy = playerY + 25 - bullet.y;
    var distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < Player1Size) {
      bot.bullets.splice(i, 1);
      player1.score++;
      botSize += 10;
      const duration = 100; // in milliseconds
      const startSize = botSize;
      const endSize = botSize - 10;
      const easing = (t) => {
        const bounces = 4;
        const bounciness = 1.5;
        const t2 = t * bounces;
        const s = bounciness / bounces;
        const a = 1 - Math.cos(t2 * Math.PI * 2) * Math.exp(-t2 * s);
        return a;
      }; // bounce function

      let startTime = null;
      function decreaseBotSize(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsedTime = timestamp - startTime;
        const progress = elapsedTime / duration;
        const t = easing(Math.min(progress, 1));
        botSize = startSize + (endSize - startSize) * t;
        if (progress < 1) {
          requestAnimationFrame(decreaseBotSize);
        } else {
          startTime = null;
        }
      }
      setTimeout(() => {
        requestAnimationFrame(decreaseBotSize);
      }, 100);
    }
  }
}

function updateBot() {
  var dx = playerX - bot.x + 100;
  var dy = playerY - bot.y + 100;
  var distance = Math.sqrt(dx * dx + dy * dy) + 30;

  if (distance > 0) {
    bot.x += (dx / distance) * bot.speed;
    bot.y += (dy / distance) * bot.speed;
  }

  if (Math.random() < chanceToShoot) {
    // Chance to shoot a bullet
    var bullet = {
      x: bot.x + 25,
      y: bot.y + 25,
      targetX: playerX + 25,
      targetY: playerY + 25,
      speed: 10,
    };

    var dx = bullet.targetX - bullet.x;
    var dy = bullet.targetY - bullet.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    bullet.directionX = dx / dist;
    bullet.directionY = dy / dist;

    bot.bullets.push(bullet);
  }

  for (var i = bot.bullets.length - 1; i >= 0; i--) {
    var bullet = bot.bullets[i];
    bullet.x += bullet.directionX * bullet.speed;
    bullet.y += bullet.directionY * bullet.speed;

    if (
      bullet.x < 0 ||
      bullet.x > canvasWidth ||
      bullet.y < 0 ||
      bullet.y > canvasHeight
    ) {
      bot.bullets.splice(i, 1);
    }
  }
}

function draw() {
  console.log(player1.score, bot.score);

  startingScreen();

  if (keys["Enter"] && gameState === "NOT PLAYING") {
    gameState = "playing";
  }
  if (gameState === "playing") {
    document.body.style.cursor = "none";
    context.fillStyle = "rgba(255,255,255)"
    context.fillRect(0, 0, canvasWidth, canvasHeight)
    drawPlayer();
    checkCollision();
    movePlayer();
    drawBot();
    updateBot();
    drawBullets();
    moveBullets();
    sight();
    playerEyes()
    botEyes()
  }




  

  if (player1.score === 10) {
    gameState = "lose";
  } else if (bot.score === 10) {
    gameState = "win";
  }

  if (gameState === "win") {
    context.fillStyle = "white";
    context.fillRect(0, 0, canvasWidth, canvasHeight);
    context.fillStyle = "black";
    context.font = "40px Arial";
    context.fillText("YOU WIN!", canvasWidth / 2 - 100, canvasHeight / 2);
  } else if (gameState === "lose") {
    context.fillStyle = "white";
    context.fillRect(0, 0, canvasWidth, canvasHeight);
    context.fillStyle = "black";
    context.font = "40px Arial";
    context.fillText("YOU LOSE!", canvasWidth / 2 - 100, canvasHeight / 2);
  }
  requestAnimationFrame(draw);
}

function sight() {
  context.beginPath();
  context.arc(mouseX, mouseY, 5, 0, 2 * Math.PI);
  context.fillStyle = "rgba(0, 0, 0, 0.1)";
  context.strokeStyle = "black";
  context.lineWidth = 2;
  context.stroke();
  context.fill();

  context.moveTo(mouseX - 10, mouseY);
  context.lineTo(mouseX + 10, mouseY);
  context.moveTo(mouseX, mouseY - 10);
  context.lineTo(mouseX, mouseY + 10);
  context.strokeStyle = "black";
  context.stroke();

  context.beginPath();
  context.arc(mouseX, mouseY, 10, 0, 2 * Math.PI);
  context.strokeStyle = "black";
  context.lineWidth = 2;
  context.stroke();
}

function setup() {
  createCanvas(canvasWidth, canvasHeight);

  document.addEventListener("click", shootBullet);
  draw();
}

document.addEventListener("keydown", (event) => {
  keys[event.key] = true;
});

document.addEventListener("keyup", (event) => {
  keys[event.key] = false;
});

document.addEventListener("mousemove", (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
});

function mouseClick(event) {
  document.addEventListener("click", mouseClick);
}

function shootBullet(event) {
  var bullet = {
    x: playerX + 25,
    y: playerY + 25,
    targetX: event.clientX,
    targetY: event.clientY,
    speed: 20,
  };

  var dx = bullet.targetX - bullet.x;
  var dy = bullet.targetY - bullet.y;
  var distance = Math.sqrt(dx * dx + dy * dy);
  bullet.directionX = dx / distance;
  bullet.directionY = dy / distance;

  bullets.push(bullet);
}

function moveBullets() {
  for (var i = bullets.length - 1; i >= 0; i--) {
    var bullet = bullets[i];
    bullet.x += bullet.directionX * bullet.speed;
    bullet.y += bullet.directionY * bullet.speed;

    if (
      bullet.x < 0 ||
      bullet.x > canvasWidth ||
      bullet.y < 0 ||
      bullet.y > canvasHeight
    ) {
      bullets.splice(i, 1);
    }
  }

  for (var i = bot.bullets.length - 1; i >= 0; i--) {
    var bullet = bot.bullets[i];
    bullet.x += bullet.directionX * bullet.speed;
    bullet.y += bullet.directionY * bullet.speed;

    if (
      bullet.x < 0 ||
      bullet.x > canvasWidth ||
      bullet.y < 0 ||
      bullet.y > canvasHeight
    ) {
      bot.bullets.splice(i, 1);
    }
  }
}

function drawRoundedRect(ctx, lw, x, y, width, height, radius, color) {
  ctx.lineWidth = lw;
  ctx.fillStyle = color;

  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.arcTo(x + width, y, x + width, y + radius, radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
  ctx.lineTo(x + radius, y + height);
  ctx.arcTo(x, y + height, x, y + height - radius, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.closePath();

  ctx.fill();
}

function startingScreen() {
  var ControlsColor;
  var TextColor;

  context.fillStyle = "white";
  context.fillRect(0, 0, canvasWidth, canvasHeight);
  context.font = "Bold 80px Arial";
  context.fillStyle = "black";
  context.fillText("PRESS", canvasWidth / 2 - 150, canvasHeight / 2 - 50);
  context.fillStyle =
    "rgba(0, 0, 0, " + Math.abs(Math.sin(Date.now() / 500)) + " )";
  context.fillText("ENTER", canvasWidth / 2 - 150, canvasHeight / 2 + 50);

  if (keys["a"]) {
    ControlsColor = "grey";
    TextColor = "black";
  } else {
    ControlsColor = "black";
    TextColor = "white";
  }
  drawRoundedRect(context, 1, 90, 240, 100, 100, 10, ControlsColor);
  context.font = "bold 60px Arial";
  context.fillStyle = TextColor;
  context.fillText("A", 119, 310);

  if (keys["w"]) {
    ControlsColor = "grey";
    TextColor = "black";
  } else {
    ControlsColor = "black";
    TextColor = "white";
  }
  drawRoundedRect(context, 1, 210, 120, 100, 100, 10, ControlsColor);
  context.font = "bold 60px Arial";
  context.fillStyle = TextColor;
  context.fillText("W", 232, 190);

  if (keys["s"]) {
    ControlsColor = "grey";
    TextColor = "black";
  } else {
    ControlsColor = "black";
    TextColor = "white";
  }
  drawRoundedRect(context, 1, 210, 240, 100, 100, 10, ControlsColor);
  context.font = "bold 60px Arial";
  context.fillStyle = TextColor;
  context.fillText("S", 240, 310);

  if (keys["d"]) {
    ControlsColor = "grey";
    TextColor = "black";
  } else {
    ControlsColor = "black";
    TextColor = "white";
  }
  drawRoundedRect(context, 1, 330, 240, 100, 100, 10, ControlsColor);
  context.font = "bold 60px Arial";
  context.fillStyle = TextColor;
  context.fillText("D", 359, 310);

  drawRoundedRect(context, 1, 70, 40, 380, 930, 10, "rgba(0, 0, 0, 0.1)");
  context.font = "bold 34px Arial";
  context.fillStyle = "black";
  context.fillText("Controls:", 90, 80);

  context.fillText("Aim with cursor", 120, 430);
  context.fillText("and shoot with click", 90, 470);

  drawRoundedRect(context, 1, 94, 500, 330, 450, 10, "rgba(255,255,255)");

  if (mouseX > 94 && mouseX < 424 && mouseY > 500 && mouseY < 950) {
    document.body.style.cursor = "none";
    sight();
  } else {
    document.body.style.cursor = "default";
  }

 



  if ([keys["Enter"]]) {
    return;
  }

  requestAnimationFrame(startingScreen);
}

function playerEyes(){
  context.fillStyle = "white";
  context.beginPath()
  
  context.arc(playerX+5,playerY+20, 10, 0, 2 * Math.PI);
  context.fill()
  context.closePath()

  context.fillStyle = "white";
  context.beginPath()
  
  context.arc(playerX+45,playerY+20, 10, 0, 2 * Math.PI);
  context.fill()
  context.closePath()


  context.fillStyle = "black";
  context.beginPath()
  
  context.arc(playerX+5,playerY+20, 5, 0, 2 * Math.PI);
  context.fill()
  context.closePath()

  context.fillStyle = "black";
  context.beginPath()
  
  context.arc(playerX+45,playerY+20, 5, 0, 2 * Math.PI);
  context.fill()
  context.closePath()
}

function botEyes(){
  context.fillStyle = "white";
  context.beginPath()
  context.arc(bot.x+5,bot.y+20, 10, 0, 2 * Math.PI);
  context.fill()
  context.closePath()

  context.fillStyle = "white";
  context.beginPath()
  
  context.arc(bot.x+45,bot.y+20, 10, 0, 2 * Math.PI);
  context.fill()
  context.closePath()


  context.fillStyle = "black";
  context.beginPath()
  context.arc(bot.x+5,bot.y+20, 5, 0, 2 * Math.PI);
  context.fill()
  context.closePath()

  context.fillStyle = "black";
  context.beginPath()
  
  context.arc(bot.x+45,bot.y+20, 5, 0, 2 * Math.PI);
  context.fill()
  context.closePath()
}

window.onload = function () {
  setup();
};

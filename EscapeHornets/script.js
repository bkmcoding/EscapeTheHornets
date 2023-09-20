import Player from "./Player.js";
import Enemy from "./Enemy.js";

const enemySpeed = 0.01;
let lastTime = 0;
let totalSeconds = 0;
let enemyCount = 0;
let xyMultiplier = window.innerWidth / window.innerHeight;
let gameStart = false;
let bossSpawned = false;

const player = new Player(document.getElementById("player"));
const enemyArray = [];
let enemy = new Enemy(
  document.querySelector(`.enemy${enemyCount}`),
  enemyCount
);
enemyArray.push(enemy);
enemyCount++;

function update(time) {
  if (lastTime != null && gameStart == true) {
    const delta = time - lastTime;
    moveAllEnemy(delta, player.x, player.y);
    player.update(delta, keyPresses);
    if (totalSeconds >= 67 && !bossSpawned) {
      spawnBoss();
      bossSpawned = true;
    }
    if (touchBoundary() || touchEnemy()) {
      let score = countSeconds();
      setHighScore(score);
      gameOver();
    }
  }

  lastTime = time;
  window.requestAnimationFrame(update);
}

window.requestAnimationFrame(update);

let keyPresses = {};

const start = document.getElementById("game-start");
const menu = document.getElementById("menu");
let gameMusic = document.querySelector("#battleMusic");
let countSecondsInterval = setInterval(countSeconds, 1000);
let spawnEnemiesInterval = setInterval(spawnEnemies, 10000);

start.addEventListener("click", function () {
  menu.setAttribute("class", "hide");
  gameStart = true;
  gameMusic.play();
  countSecondsInterval;
  spawnEnemiesInterval;
  totalSeconds = 0;
});

window.addEventListener("keydown", keyDownListener, false);
function keyDownListener(event) {
  keyPresses[event.key] = true;
}

window.addEventListener("keyup", keyUpListener, false);
function keyUpListener(event) {
  keyPresses[event.key] = false;
}

function spawnEnemies() {
  if ((gameStart = true)) {
    const enemyContainer = document.querySelector(".enemies");
    const createEnemy = document.createElement("div");
    createEnemy.setAttribute("class", `enemy enemy${enemyCount}`);
    createEnemy.setAttribute(
      "style",
      `--enemyX${enemyCount}: 0; --enemyY${enemyCount}: 0; left: calc(var(--enemyX${enemyCount}) * 1vw); top: calc(var(--enemyY${enemyCount}) * 1vh);`
    );
    enemyContainer.append(createEnemy);
    let enemy = new Enemy(
      document.querySelector(`.enemy${enemyCount}`),
      enemyCount
    );
    enemyArray.push(enemy);
    enemyCount++;
    enemy.reset();
  }
}

function spawnBoss() {
  if ((gameStart = true)) {
    bossSpawning();
    let bossMusic = document.querySelector("#bossMusic");
    const enemyContainer = document.querySelector(".enemies");
    const createEnemy = document.createElement("div");
    createEnemy.setAttribute("class", `enemy enemy${enemyCount}`);
    createEnemy.setAttribute("id", `boss`);
    createEnemy.setAttribute(
      "style",
      `--enemyX${enemyCount}: 0; --enemyY${enemyCount}: 0; left: calc(var(--enemyX${enemyCount}) * 1vw); top: calc(var(--enemyY${enemyCount}) * 1vh);`
    );
    enemyContainer.append(createEnemy);
    let enemy = new Enemy(
      document.querySelector(`.enemy${enemyCount}`),
      enemyCount
    );
    enemyArray.push(enemy);
    enemyCount++;
    enemy.reset();
    let bossCount = enemyCount;
    gameMusic.pause();
    bossMusic.play();
    return bossCount;
  }
}

function bossSpawning() {
  const body = document.querySelector("body");
  const container = document.querySelector(".container");
  body.setAttribute("id", "pulse");
  container.setAttribute("id", "shake");
}

function touchBoundary() {
  const rect = player.rect();
  return (
    rect.right >= window.innerWidth ||
    rect.left <= 0 ||
    rect.bottom >= window.innerHeight ||
    rect.top <= 0
  );
}

function touchEnemy() {
  const playerRect = player.rect();

  for (let i = 0; i < enemyArray.length; i++) {
    let enemyRect = enemyArray[i].rect();
    if (
      playerRect.x < enemyRect.x + enemyRect.width &&
      playerRect.x + playerRect.width > enemyRect.x &&
      playerRect.y < enemyRect.y + enemyRect.height &&
      playerRect.y + playerRect.height > enemyRect.y
    ) {
      return true;
    }
  }
  return false;
}

function avoidOthersX(enemyJ) {
  let c = 0;

  enemyArray.forEach((enemy) => {
    if (enemy != enemyJ) {
      if (Math.abs(enemy.x - enemyJ.x) < 75) {
        c = c - (enemy.x - enemyJ.x);
      }
    }
  });
  return c;
}

function avoidOthersY(enemyJ) {
  let c = 0;

  enemyArray.forEach((enemy) => {
    if (enemy != enemyJ) {
      if (Math.abs(enemy.y - enemyJ.y) < 75) {
        c = c - (enemy.y - enemyJ.y);
      }
    }
  });
  return c;
}

function moveAllEnemy(delta, playerX, playerY) {
  let v1, v2, v2x, v2y, v1x, v1y, vx, vy;

  enemyArray.forEach((enemy) => {
    v1 = enemy.chasePlayer(playerX, playerY);
    v2x = avoidOthersX(enemy);
    v2y = avoidOthersY(enemy);

    if (v2x && v2y) {
      v2 = Math.sqrt(v2x ** 2 + v2y ** 2);
      v2x = v2x / v2;
      v2y = v2y / v2;
    }
    if (v1) {
      v1x = (playerX - enemy.x) / v1;
      v1y = (playerY - enemy.y) / v1;
    }

    vx = v1x + v2x * 0.5;
    vy = v1y + v2y * 0.5;

    if (vx > 1.2) {
      vx = 1.2;
    }
    if (vx < -1.2) {
      vx = -1.2;
    }
    if (vy > 1.2) {
      vy = 1.2;
    }
    if (vy < -1.2) {
      vy = -1.2;
    }

    enemy.x += vx * delta * enemySpeed * (1 / Math.sqrt(2));
    enemy.y += vy * delta * enemySpeed * (1 / Math.sqrt(2));
  });
}

function countSeconds() {
  if ((gameStart = true)) {
    ++totalSeconds;
    let score = document.getElementById("score");
    score.innerHTML = totalSeconds;

    return score.innerHTML;
  }
}

function setHighScore(score) {
  let highScore = document.querySelector("#high-score");
  if (score > highScore.innerHTML) {
    highScore.innerHTML = score - 1;
  }
}

function resetPage() {
  const body = document.querySelector("body");
  const container = document.querySelector(".container");
  const menu = document.getElementById("menu");
  body.removeAttribute("id", "pulse");
  container.removeAttribute("id", "shake");
  menu.removeAttribute("class", "hide");
}

function gameOver() {
  resetPage();
  player.reset();
  enemyArray.forEach(function (enemy) {
    enemy.enemyElem.remove();
  });
  totalSeconds = 0;
  score.innerHTML = totalSeconds;
  enemyCount = 0;
  gameStart = false;
  bossSpawned = false;
}

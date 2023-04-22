export default class Enemy {
    constructor(enemyElem, enemyCount) {
        this.enemyElem = enemyElem;
        this.reset();
        this.enemyCount = enemyCount;
    }

    get x() {
        return parseFloat(getComputedStyle(this.enemyElem).getPropertyValue(`--enemyX${this.enemyCount}`));
    }

    set x(value) {
        this.enemyElem.style.setProperty(`--enemyX${this.enemyCount}`, value);
    }

    get y() {
        return parseFloat(getComputedStyle(this.enemyElem).getPropertyValue(`--enemyY${this.enemyCount}`));
    }

    set y(value) {
        this.enemyElem.style.setProperty(`--enemyY${this.enemyCount}`, value);
    }

    rect() {
        return this.enemyElem.getBoundingClientRect();
    }

    reset() {
        let randomSide = Math.floor(Math.random() * 4);
        let spawnPoint = Math.floor(Math.random() * 100);
        this.x = 0;
        this.y = 0;
        if (randomSide == 0) {
            this.y = 0;
            this.x = spawnPoint;
        } else if (randomSide == 1) {
            this.y = spawnPoint;
            this.x = 100;
        } else if (randomSide == 2) {
            this.y = 100;
            this.x = spawnPoint;
        } else {
            this.y = spawnPoint;
            this.x = 0;
        }
    }

    chasePlayer(playerX, playerY) {
        let distanceX = playerX - this.x;
        let distanceY = playerY - this.y;
        let length = Math.sqrt(distanceX ** 2 + distanceY ** 2);

        return length;
    }
}

let speed = 0.025;

export default class Player {
    constructor(playerElem) {
        this.playerElem = playerElem;
        this.reset();
    }

    get x() {
        return parseFloat(getComputedStyle(this.playerElem).getPropertyValue('--playerX'));
    }

    set x(value) {
        this.playerElem.style.setProperty('--playerX', value);
    }

    get y() {
        return parseFloat(getComputedStyle(this.playerElem).getPropertyValue('--playerY'));
    }

    set y(value) {
        this.playerElem.style.setProperty('--playerY', value);
    }

    rect() {
        return this.playerElem.getBoundingClientRect();
    }

    reset() {
        this.x = 50;
        this.y = 50;
    }

    update(delta, keyPresses) {
        if (keyPresses.w) {
            this.y -= speed * delta;
        }
        if (keyPresses.s) {
            this.y += speed * delta;
        }

        if (keyPresses.a) {
            this.x -= speed * delta;
        }
        if (keyPresses.d) {
            this.x += speed * delta;
        }
    }
}

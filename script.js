/** @type {CanvasRenderingContext2D} */

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext("2d");
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
let ids = {
    p: 0,
    s: 0,
}

let height = canvas.height, 
    width = canvas.width,
    curSide = 1;

window.requestAnimationFrame(draw);

let particles = [];
let stars = [];

function draw () {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (let particle of particles) {
        particle.draw();
        particle.move();
        particle.checkNearbyParticles();
    }
    for (let star of stars) {
        star.draw();
        star.checkNearbyParticles();
    }
    
    setTimeout(() => {
        window.requestAnimationFrame(draw);
    }, 10)
}

setInterval(() => {
    let xCoord, yCoord;
    let offset = 100;
    switch (curSide) {
        case 1:
            yCoord = -offset;
            xCoord = getRandomInt(0, width);
            break;
        case 2:
            yCoord = getRandomInt(0, height);
            xCoord = width + offset;
            break;
        case 3:
            yCoord = height + offset;
            xCoord = getRandomInt(0, width);
            break;
        case 4:
            yCoord = getRandomInt(0, height);
            xCoord = -offset;            
            break;
    }
    curSide = curSide < 4 ? curSide + 1 : 1;
    new Particle(xCoord, yCoord);
}, 1000)
console.log(particles)

function Particle (x, y) {
    this.x = x;
    this.y = y;
    this.r = 20;
    this.tX;
    this.tY;
    this.speed = 2;
    this.vX = 0;
    this.vY = 0;
    this.curCos = 0;
    this.curSin = 0;
    this.occupied = false;
    this.id = ids.p;
    ids.p += 1;
    this.canConnect = false;

    setInterval(() => {
        this.setVelocities();
    }, 100)
    this.mouseUpdateInterval = setInterval(() => {
        this.tX = mouseX;
        this.tY = mouseY;
    }, 100)
    setTimeout(() => {
        this.canConnect = true;
    }, 2000)

    particles.push(this);
}
Particle.prototype.draw = function () {
    let {x, y, r} = this;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.stroke();
}
Particle.prototype.move = function () {
    this.x -= this.vX;
    this.y -= this.vY;
}
Particle.prototype.setVelocities = function () {
    let {curSin, curCos} = this;
    let {x, y, tX, tY} = this;
    let [x1, y1] = [x, y];
    // angle in rad
    let angle = Math.atan2(y1-tY, x1-tX);
    let sin = Math.sin(angle);
    let cos = Math.cos(angle);
    // console.log('sin: ' + sin + ' cos: ' + cos);
    let distCos = Math.abs(curCos - cos);
    if (distCos < 0.2) {
        this.curCos = cos;
    } else {
        this.curCos += cos > 0 ? 0.2 : -0.2
    }
    let distSin = Math.abs(curSin - sin);
    if (distSin < 0.2) {
        this.curSin = sin;
    } else {
        this.curSin += sin > 0 ? 0.2 : -0.2
    }
    // console.log('sin: ' + distSin + ' cos: ' + distCos);
    this.curSin = this.curSin < 1 ? this.curSin : 1;
    this.curSin = this.curSin > -1 ? this.curSin : -1;
    this.curCos = this.curCos < 1 ? this.curCos : 1;
    this.curCos = this.curCos > -1 ? this.curCos : -1;
    this.vX = this.curCos * this.speed;
    this.vY = this.curSin * this.speed;
}
Particle.prototype.checkNearbyParticles = function () {
    if (this.occupied || !this.canConnect) return
    let {x, y} = this;
    let [x1, y1] = [x, y];
    if (!isOnScreen(x, y)) return

    for (let p of particles) {
        if (p.id == this.id || p.occupied) continue

        let [x2, y2] = [p.x, p.y];
        if (getDistance(x1, y1, x2, y2) < 100) {
            let midPoint = getMidpoint(x1, y1, x2, y2);
            p.connectToStar(midPoint.x, midPoint.y);
            this.connectToStar(midPoint.x, midPoint.y);
            new Star(midPoint.x, midPoint.y)
            return;
        }
    }
}
Particle.prototype.connectToStar = function (x, y) {
    clearInterval(this.mouseUpdateInterval);
    this.occupied = true;
    this.tX = x;
    this.tY = y;
}
function Star (x, y) {
    this.x = x;
    this.y = y;
    this.r = 40;

    stars.push(this);
}
Star.prototype.draw = function () {
    let {x, y, r} = this;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.stroke();
}
Star.prototype.checkNearbyParticles = function () {
    let {x, y} = this;
    let [x1, y1] = [x, y];

    for (let p of particles) {
        if (p.occupied) continue

        let [x2, y2] = [p.x, p.y];
        if (getDistance(x1, y1, x2, y2) < 100) {
            this.r += 5;
            p.connectToStar(x1, y1);
        }
    }
}

let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;
window.addEventListener('mousemove', mousemoveHandler, false);
function mousemoveHandler(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
}

function getDistance (x1, y1, x2, y2) {
    return Math.sqrt((x2- x1) ** 2 + (y2- y1) ** 2);
}
function getMidpoint (x1, y1, x2, y2) {
    return {x: (x2 + x1) / 2, y: (y2 + y1) / 2};
}
function isOnScreen (x, y) {
    return x > 0 && y > 0 && x < width && y < height;
}

function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

prototypeFunction(Array, 'shuffleArray', function () {
    let result = [];
    while (this.length != 0) {
        result.push(...this.splice(random(this), 1));
    }
    return result;

    function random(arr) {
        return Math.floor(Math.random() * arr.length);
    }
});
prototypeFunction(Array, 'randomElement', function () {
    return this[Math.floor(Math.random() * this.length)];
})
prototypeFunction(Array, 'randomIndex', function () {
    return Math.floor(Math.random() * this.length);
})
function prototypeFunction (type, name, func) {
    Object.defineProperty(type['prototype'], name, {
        value: func
    });
}

/** @type {CanvasRenderingContext2D} */

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext("2d");
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;

window.requestAnimationFrame(draw);

let particles = [];

function draw () {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (let particle of particles) {
        particle.draw();
        particle.move();
    }
    
    setTimeout(() => {
        window.requestAnimationFrame(draw);
    }, 10)
}

let particle = new Particle(700, 100);
console.log(particles)

function Particle (x, y) {
    this.x = x;
    this.y = y;
    this.r = 20;
    this.tX = canvas.width / 2;
    this.tY = canvas.height / 2;
    this.speed = 2;
    this.vX = 0;
    this.vY = 0;
    this.curCos = 0;
    this.curSin = 0;
    this.tale = [];

    setInterval(() => {
        this.setVelocities();
        this.tale.push({x: this.x, y: this.y});
    }, 100)

    particles.push(this);
}
Particle.prototype.draw = function () {
    let {x, y, r} = this;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.stroke();
    let {tale} = this;
    for (let key in tale) {
        let line = tale[key];
        let line2 = tale[Number(key) + 1];
        if (key < tale.length - 1) {
            ctx.beginPath();
            ctx.moveTo(line.x, line.y)
            ctx.lineTo(line2.x, line2.y)
            ctx.stroke();
        }
    }
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
    let angle = Math.atan2(y1-mouseY, x1-mouseX);
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


let mouseX = 0;
let mouseY = 0;
window.addEventListener('mousemove', mousemoveHandler, false);
function mousemoveHandler(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
}

function getDistance (x1, y1, x2, y2) {
    return Math.sqrt((x2- x1) ** 2 + (y2- y1) ** 2);
}
'use strict';

/* --------------------------
 * GLOBAL VARS
 * -------------------------- */
// The date you want to count down to
var targetDate = new Date("2025/1/1 06:54:00");

// Other date related variables
var days = 0;
var hrs = 0;
var min = 0;
var sec = 0;

const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');
ctx.canvas.width = window.innerWidth - 10;
ctx.canvas.height = window.innerHeight - 10;

class Firework {
    constructor(x, y, targetX, targetY) {
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.distanceToTarget = Math.hypot(targetX - x, targetY - y);
        this.distanceTraveled = 0;
        this.coordinates = [];
        this.coordinateCount = 3;
        while (this.coordinateCount--) {
            this.coordinates.push([this.x, this.y]);
        }
        this.angle = Math.atan2(targetY - y, targetX - x);
        this.speed = 2;
        this.acceleration = 1.05;
        this.brightness = Math.random() * 50 + 50;
        this.targetRadius = 1;
    }
    update(index) {
        this.coordinates.pop();
        this.coordinates.unshift([this.x, this.y]);
        if (this.targetRadius < 8) {
            this.targetRadius += 0.3;
        } else {
            this.targetRadius = 1;
        }
        this.speed *= this.acceleration;
        const vx = Math.cos(this.angle) * this.speed;
        const vy = Math.sin(this.angle) * this.speed;
        this.distanceTraveled = Math.hypot(this.x + vx - this.x, this.y + vy - this.y);
        if (this.distanceTraveled >= this.distanceToTarget) {
            createParticles(this.targetX, this.targetY);
            fireworks.splice(index, 1);
        }
    }
    draw() {
        ctx.beginPath();
        ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = `hsl(${Math.random() * 360}, 100%, ${this.brightness}%)`;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.targetX, this.targetY, this.targetRadius, 0, Math.PI * 2);
        ctx.stroke();
    }
}
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.coordinates = [];
        this.coordinateCount = 5;
        while (this.coordinateCount--) {
            this.coordinates.push([this.x, this.y]);
        }
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 10 + 1;
        this.friction = 0.95;
        this.gravity = 1;
        this.hue = Math.random() * 360;
        this.brightness = Math.random() * 80 + 20;
        this.alpha = 1;
        this.decay = Math.random() * 0.03 + 0.01;
        this.size = 4;
    }
    update(index) {
        this.coordinates.pop();
        this.coordinates.unshift([this.x, this.y]);
        this.speed *= this.friction;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed + this.gravity;
        this.alpha -= this.decay;
        if (this.alpha <= this.decay) {
            particles.splice(index, 1);
        }
    }
    draw() {
        ctx.beginPath();
        ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
        ctx.lineWidth = this.size;
        ctx.stroke();
    }
}
const fireworks = [];
const particles = [];

function createParticles(x, y) {
    let particleCount = 30;
    while (particleCount--) {
        particles.push(new Particle(x, y));
    }
}

function loop() {
    requestAnimationFrame(loop);
    if (days !== 0 || hrs !== 0 || min !== 0 || sec !== 0) return;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'lighter';
    let i = fireworks.length;
    while (i--) {
        fireworks[i].draw();
        fireworks[i].update(i);
    }
    let j = particles.length;
    while (j--) {
        particles[j].draw();
        particles[j].update(j);
    }
    if (Math.random() < 0.05) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height / 2;
        fireworks.push(new Firework(canvas.width / 2, canvas.height, x, y));
    }
}

/* --------------------------
 * ON DOCUMENT LOAD
 * -------------------------- */

// Calculate time until launch date
timeToLaunch();
// Transition the current countdown from 0 
numberTransition('#days .number', days, 1000, 'easeOutQuad');
numberTransition('#hours .number', hrs, 1000, 'easeOutQuad');
numberTransition('#minutes .number', min, 1000, 'easeOutQuad');
numberTransition('#seconds .number', sec, 1000, 'easeOutQuad');
// Begin Countdown
setTimeout(countDownTimer, 1000);

/* --------------------------
 * FIGURE OUT THE AMOUNT OF 
   TIME LEFT BEFORE LAUNCH
 * -------------------------- */
function timeToLaunch() {
    // Get the current date
    var currentDate = new Date();

    // Find the difference between dates
    var diff = (currentDate - targetDate) / 1000;
    if (diff > 1) {
        document.querySelector("#countdown").setAttribute("class", "fade-out");
        document.querySelector(".tet2025txt").removeAttribute("style");
        document.querySelector(".tet2025txt").classList.add("fade-in");
        setTimeout(() => {
            document.querySelector(".chucmungnammoiTxt").removeAttribute("style");
            document.querySelector(".chucmungnammoiTxt").classList.add("fade-in");
        }, 1000);
        return;
    };
    var diff = Math.abs(Math.floor(diff));

    // Check number of days until target
    days = Math.floor(diff / (24 * 60 * 60));
    sec = diff - days * 24 * 60 * 60;

    // Check number of hours until target
    hrs = Math.floor(sec / (60 * 60));
    sec = sec - hrs * 60 * 60;

    // Check number of minutes until target
    min = Math.floor(sec / (60));
    sec = sec - min * 60;
}

/* --------------------------
 * DISPLAY THE CURRENT 
   COUNT TO LAUNCH
 * -------------------------- */
function countDownTimer() {

    // Figure out the time to launch
    timeToLaunch();

    // Write to countdown component
    $("#days .number").text(days <= 9 ? `0${days}` : days);
    $("#hours .number").text(hrs <= 9 ? `0${hrs}` : hrs);
    $("#minutes .number").text(min <= 9 ? `0${min}` : min);
    $("#seconds .number").text(sec <= 9 ? `0${sec}` : sec);

    // Repeat the check every second
    setTimeout(countDownTimer, 1000);
}

/* --------------------------
 * TRANSITION NUMBERS FROM 0
   TO CURRENT TIME UNTIL LAUNCH
 * -------------------------- */
function numberTransition(id, endPoint, transitionDuration, transitionEase) {
    // Transition numbers from 0 to the final number
    $({ numberCount: $(id).text() }).animate({ numberCount: endPoint }, {
        duration: transitionDuration,
        easing: transitionEase,
        step: function () {
            $(id).text(Math.floor(this.numberCount));
        },
        complete: function () {
            $(id).text(this.numberCount);
        }
    });
};

loop();
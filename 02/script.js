var a1;
var a2;
var centerX;
var centerY;
var width = 800;
var height = 800;
var context;
var bigRadius;
var smallRadius;

var pointX;
var pointY;

function createCanvas(w, h) {
  var canvas = document.createElement("canvas");
  context = canvas.getContext("2d");
  canvas.width = w;
  canvas.height = h;
  document.body.appendChild(canvas);
}

function line(x1, y1, x2, y2) {
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.strokeStyle = "black";
  context.stroke();
  context.closePath();
}

function circle(x, y, radius) {
  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI, false);
  context.fillStyle = "black";
  context.fill();
  context.closePath();
}

function setup() {
  console.log("setup");
  createCanvas(width, height);
  a1 = 0;
  a2 = 0;
  bigRadius = 400;
  smallRadius = 100;
  centerX = width / 2;
  centerY = height / 2;
  pointX = centerX;
  pointY = centerY;

  draw();
}

function draw() {
  a1 += 0.9;
  a2 += 0.53;

  pointX = centerX + Math.sin(2 * a1 * (Math.PI / 180)) * 200;
  pointY = centerY + Math.sin(3 * a2 * (Math.PI / 180)) * 200;

  context.fillStyle = "rgb(255, 230, 109,0.1)";
  context.fillRect(0, 0, width, height);

  circle(pointX / 2, pointY / 2, 10);

  context.beginPath();
  context.fillStyle = "rgb(255, 107, 107,0.1)";
  context.fillRect(pointX, pointY, width, height);
  context.closePath();

  context.beginPath();
  context.fillStyle = "rgb(78, 205, 196,01)";

  context.ellipse(
    pointX / 2,
    pointY / 2,
    pointX / 2,
    pointY / 2,
    0,
    0,
    2 * Math.PI,
    false
  );
  context.fill();

  context.closePath();

  requestAnimationFrame(draw);
}

window.onload = function () {
  console.log("Ready");
  setup();
};

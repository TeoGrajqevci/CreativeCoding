export default class Projectile {
  constructor(ctx) {
    this.ctx = ctx;
    this.x = window.innerWidth / 2; // initial x position
    this.y = window.innerHeight / 2; // initial y position
    this.speed = 20; // speed in pixels per frame
    this.radius = 10; // circle radius
    this.color = "red"; // circle color
  }

  move() {
    this.y += this.speed; // move the circle on the y-axis
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
    this.ctx.closePath();
  }
}

export default class Particles {
  constructor(ctx) {
    this.ctx = ctx;

    this.position = {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
    };
    this.velocity = { x: 0, y: 0 };
    this.acceleration = { x: 0, y: 0 };
    this.maxSpeed = 50;
    this.maxForce = 5;
  }

  applyForce(force) {
    this.acceleration.x += force.x;
    this.acceleration.y += force.y;
  }

  draw(finger) {
    const target = {
      x: finger.x * window.innerWidth,
      y: finger.y * window.innerHeight,
    };
    const desired = {
      x: target.x - this.position.x,
      y: target.y - this.position.y,
    };
    const d = Math.sqrt(desired.x * desired.x + desired.y * desired.y);
    desired.x /= d;
    desired.y /= d;

    // Modify the force based on distance
    if (d < 1000) {
      const m = this.map(d, 0, 1000, 0, this.maxSpeed);
      desired.x *= m;
      desired.y *= m;
    } else {
      desired.x *= this.maxSpeed;
      desired.y *= this.maxSpeed;
    }

    // Steering force
    const steer = {
      x: desired.x - this.velocity.x,
      y: desired.y - this.velocity.y,
    };
    const steerMag = Math.sqrt(steer.x * steer.x + steer.y * steer.y);
    steer.x /= steerMag;
    steer.y /= steerMag;
    steer.x *= this.maxForce;
    steer.y *= this.maxForce;
    this.applyForce(steer);

    // Update physics
    this.velocity.x += this.acceleration.x;
    this.velocity.y += this.acceleration.y;
    const velMag = Math.sqrt(
      this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y
    );
    this.velocity.x /= velMag;
    this.velocity.y /= velMag;
    this.velocity.x *= this.maxSpeed;
    this.velocity.y *= this.maxSpeed;
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.acceleration.x = 0;
    this.acceleration.y = 0;

    // Draw the particle
    this.ctx.fillStyle = "rgba(0, 150, 255, 1)";
    this.ctx.beginPath();
    this.ctx.arc(this.position.x, this.position.y, 10, 0, Math.PI * 2);

    this.ctx.fill();

    this.ctx.closePath();

    console.log(finger.x, finger.y);
  }

  map(value, start1, stop1, start2, stop2) {
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
  }
}

import * as Tone from "tone";

export default class Grid {
  constructor(ctx) {
    console.log("Grid.js");

    this.ctx = ctx; // Canvas context
    this.synth = new Tone.Synth().toDestination();
    this.oscillator = new Tone.Oscillator("C4").toDestination();

    this.cursorColor = "rgba(255,0,0,1)";
    this.isTouching = false;
    this.projectiles = []; // Array for projectiles
    this.lastCircleTime = 0; // Time since the last circle was created

    this.boxImage = new Image();
    this.boxImage.src = "./tasks/img1.png";

    // Initialize the boxes
    this.boxes = [];
    const boxSpacing = 160; // 50px box + 20px space
    for (let i = 0; i < 10; i++) {
      this.boxes.push({
        x: i * boxSpacing,
        oscillationOffset: 0,
        hit: false,
        hitTime: 0,
      });
    }
    this.score = 0;
    this.scoreElement = document.getElementById("score");
  }

  updateScore(score) {
    this.scoreElement.textContent = score;
  }

  draw(finger, finger2) {
    let gridSize = 4;
    const largeur = window.innerWidth / gridSize;
    const hauteur = window.innerHeight / gridSize;
    const currentTime = Date.now(); // Get the current time

    const tolerance = 0.05;

    if (
      Math.abs(finger.x - finger2.x) <= tolerance &&
      Math.abs(finger.y - finger2.y) <= tolerance
    ) {
      console.log("touch");
      this.isTouching = true;
    } else {
      this.isTouching = false;
    }

    // Projectile creation logic
    if (this.isTouching === true) {
      if (currentTime - this.lastCircleTime >= 500) {
        this.projectiles.push({
          x: finger.x * window.innerWidth,
          y: window.innerHeight - 100,
        });
        this.lastCircleTime = currentTime;
      }
      this.cursorColor = "rgba(0,255,0,1)";
      this.oscillator.type = "square";
    } else {
      this.cursorColor = "rgba(255,0,0,1)";
      this.oscillator.type = "sawtooth";
    }

    // Collision detection and scoring
    this.projectiles.forEach((projectile, pIndex) => {
      this.boxes.forEach((box, bIndex) => {
        if (!box.hit && this.isColliding(projectile, box)) {
          box.hit = true;
          box.hitTime = Date.now();
          this.score += 1000; // Increase score
          console.log(1000); // Log when a box is hit
          this.updateScore(this.score);
          this.projectiles.splice(pIndex, 1); // Remove the projectile
        }
      });
    });

    this.boxes.forEach((box, index) => {
      if (box.hit && Date.now() - box.hitTime > 3000) {
        box.hit = false;
      }

      if (!box.hit) {
        box.oscillationOffset = 10 * Math.sin(Date.now() / 500 + index);
        this.ctx.fillStyle = "rgba(0, 0, 255, 1)";
        this.ctx.drawImage(
          this.boxImage,
          box.x + box.oscillationOffset + 150,
          100,
          50,
          50
        );
      }
    });

    // Projectile drawing logic
    this.projectiles.forEach((projectile, index) => {
      this.ctx.beginPath();
      this.ctx.fillStyle = this.cursorColor;
      this.ctx.arc(projectile.x, projectile.y, 10, 0, 2 * Math.PI); // Draw circle
      this.ctx.fill();
      this.ctx.closePath();

      projectile.y -= 20; // Move projectile

      // Remove off-screen projectiles
      if (projectile.y < 0) {
        this.projectiles.splice(index, 1);
        index--;
      }
    });

    let indexDoigt = -1;
    if (
      finger.x !== window.innerWidth / 2 &&
      finger.y !== window.innerHeight / 2
    ) {
      const x = Math.floor((finger.x * window.innerWidth) / largeur);
      const y = Math.floor((finger.y * window.innerHeight) / hauteur);
      indexDoigt = y * gridSize + x;
    }

    this.ctx.strokeStyle = "rgba(0, 255, 0, 1)";

    let index = 0;
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        this.ctx.beginPath();
        const xStart = x * largeur;
        const yStart = y * hauteur;
        this.ctx.rect(xStart, yStart, largeur, hauteur);
        this.ctx.stroke();
        this.ctx.closePath();

        if (index === indexDoigt) {
          this.ctx.fillStyle = "rgba(50, 50, 50, 0)";
          this.ctx.fill();

          const notes = [
            "C3",
            "D3",
            "E3",
            "F3",
            "G3",
            "A3",
            "B3",
            "C4",
            "D4",
            "E4",
            "F4",
            "G4",
            "A4",
            "B4",
            "C5",
            "D5",
          ];
          const note = notes[index % notes.length];
          this.oscillator.frequency.value = Tone.Frequency(note).toFrequency();
          this.oscillator.start();
          this.oscillator.stop("+0.1");
        }

        this.ctx.beginPath();
        this.ctx.fillStyle = this.cursorColor;
        const crossSize = 50;
        const crossHalfSize = crossSize / 2;
        const crossX = finger.x * window.innerWidth;
        const crossY = finger.y * window.innerHeight;

        this.ctx.fillRect(crossX - crossHalfSize, crossY, crossSize, 1);
        this.ctx.fillRect(crossX, crossY - crossHalfSize, 1, crossSize);

        this.ctx.closePath();

        this.ctx.beginPath();
        this.ctx.fillStyle = this.cursorColor;
        this.ctx.fillRect(
          finger.x * window.innerWidth,
          window.innerHeight - 30,
          100,
          30
        );
        this.ctx.beginPath();
        this.ctx.fillStyle = this.cursorColor;
        this.ctx.fillRect(
          finger.x * window.innerWidth - 100,
          window.innerHeight - 30,
          100,
          30
        );
        this.ctx.beginPath();
        this.ctx.fillStyle = this.cursorColor;
        this.ctx.fillRect(
          finger.x * window.innerWidth - 20,
          window.innerHeight - 50,
          40,
          40
        );

        this.ctx.beginPath();
        this.ctx.fillStyle = this.cursorColor;
        this.ctx.fillRect(
          finger.x * window.innerWidth - 10,
          window.innerHeight - 90,
          20,
          40
        );

        index++;
      }
    }

    // Update and draw projectiles
    for (let i = 0; i < this.projectiles.length; i++) {
      let projectile = this.projectiles[i];

      // Move projectile up
      projectile.y -= 20;

      // Remove off-screen projectiles
      if (projectile.y < 0) {
        this.projectiles.splice(i, 1);
        i--;
      }
    }
  }

  isColliding(projectile, box) {
    const boxRight = box.x + box.oscillationOffset + 170;
    const boxBottom = 100 + 50;
    return (
      projectile.x >= box.x + box.oscillationOffset &&
      projectile.x <= boxRight &&
      projectile.y >= 100 &&
      projectile.y <= boxBottom
    );
  }
}

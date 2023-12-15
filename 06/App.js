
class App {
  constructor() {
    this.setup();
    this.createBalls(100);
    this.i = 0;

    document.addEventListener('mousemove', (event) => {
      this.mouseX = event.clientX;
      this.mouseY = event.clientY;
    });

    document.addEventListener('mousedown', (event) => {
      this.handleMouseDown(event.clientX, event.clientY);
    });

    document.addEventListener('mouseup', () => {
      this.handleMouseUp();
    });

    document.addEventListener('keydown', (event) => {
      if (event.code === 'Space') {
        this.enlargeRandomBalls();
      }
     
    });

    document.addEventListener('keyup', (event) => {
      if (event.code === 'Space') {
        this.resetAllBallSizes();
      }
    });
  }

  setup() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);

    this.engine = Matter.Engine.create({ gravity: { x: 0, y: 0 } });
    this.world = this.engine.world;

    const wallOptions = { isStatic: true, render: { fillStyle: 'black' } };
    Matter.World.add(this.world, [
      Matter.Bodies.rectangle(this.width / 2, 0, this.width, 1, wallOptions),
      Matter.Bodies.rectangle(this.width / 2, this.height, this.width, 1, wallOptions),
      Matter.Bodies.rectangle(0, this.height / 2, 1, this.height, wallOptions),
      Matter.Bodies.rectangle(this.width, this.height / 2, 1, this.height, wallOptions)
    ]);


    const mouseConstraint = Matter.MouseConstraint.create(this.engine);
    Matter.World.add(this.world, mouseConstraint);

    Matter.Engine.run(this.engine);

    this.audioTool = new AudioTool();

    this.audioTool.play();
    this.audioTool.loop = true;
     
    

    this.draw();
  }

  createBalls(count) {
    const ballOptions = {
      frictionAir: 0,
      restitution: 0,
      render: {
        fillStyle: 'white',
        strokeStyle: 'black',
        lineWidth: 1
      }
    };

    for (let i = 0; i < count; i++) {
      const ball = Matter.Bodies.circle(
        Math.random() * this.width,
        Math.random() * this.height,
        40,
        ballOptions
      );

      Matter.World.add(this.world, ball);
    }
  }

  handleMouseDown(mouseX, mouseY) {
    const bodies = Matter.Composite.allBodies(this.world);

    for (const body of bodies) {
      if (!body.isStatic && Matter.Bounds.contains(body.bounds, { x: mouseX, y: mouseY })) {
        body.render.fillStyle = 'red';
      
      }
    }
  }

  handleMouseUp() {
    const bodies = Matter.Composite.allBodies(this.world);

    for (const body of bodies) {
      if (!body.isStatic) {
        body.render.fillStyle = 'white';
      
       
      }
    }
  }

  applyAttractionForce(body, targetX, targetY, strength) {
    const forceX = targetX - body.position.x;
    const forceY = targetY - body.position.y;
    const distance = Math.sqrt(forceX ** 2 + forceY ** 2);

 
    const normalizedForceX = forceX / distance;
    const normalizedForceY = forceY / distance;


    Matter.Body.applyForce(body, body.position, {
      x: normalizedForceX * strength,
      y: normalizedForceY * strength
    });
  }

  attractBallsToCenter(strength) {
    const bodies = Matter.Composite.allBodies(this.world);

    for (const body of bodies) {
      if (!body.isStatic) { 
        this.applyAttractionForce(body, this.width / 2, this.height / 2, strength);
      }
    }
  }

  enlargeRandomBalls(rnd) {
    const bodies = Matter.Composite.allBodies(this.world);


    const numberOfBallsToEnlarge = Math.floor(Math.random() * rnd) + 1;


    const shuffledBodies = bodies.sort(() => Math.random() - 0.5);

 
    for (let i = 0; i < numberOfBallsToEnlarge; i++) {
      const body = shuffledBodies[i];
      if (body && body.circleRadius !== 80) {
        Matter.Body.scale(body, 2, 2);
        body.circleRadius = 80;
      }
    }
  }

  resetAllBallSizes() {
    const bodies = Matter.Composite.allBodies(this.world);

    for (const body of bodies) {
      if (body.circleRadius !== 40 && !body.isStatic) { 
        Matter.Body.scale(body, 1 / 2, 1 / 2);
        body.circleRadius = 40;
      }
    }
  }

  draw() {
    this.attractBallsToCenter(0.001);

    const bodies = Matter.Composite.allBodies(this.world);

    this.ctx.fillStyle = 'rgba(0,0,0, 0.1)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.audioTool.updateWaveForm();

    const data = this.audioTool.dataWave;

   


    for ( this.i = 0; this.i < 300; this.i++) {
      }
      console.log((data[this.i]/255)*20);

      this.enlargeRandomBalls((data[this.i]/255));

if ((data[this.i]/255)*20 >= 10) {
        this.resetAllBallSizes();
      }

    for (const body of bodies) {
      this.ctx.fillStyle = body.render.fillStyle;

      this.ctx.beginPath();
      this.ctx.arc(body.position.x, body.position.y, body.circleRadius, 0, 2 * Math.PI);
      this.ctx.fill();
    }

    requestAnimationFrame(this.draw.bind(this));
  }
}

window.onload = function () {
  const app = new App();
};



class App {
  constructor(){

    this.setup();
  }

  setup() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);

   

    this.audioTool = new AudioTool();

    document.addEventListener('click', (e) => {
      this.audioTool.play(e);
    });

    document.addEventListener('mousemove', (e) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      console.log('Mouse position X:', mouseX);
      console.log('Mouse position Y:', mouseY);
    });
    this.circle = new Circle(this.mouseX, this.mouseY, 50, 'black', this.ctx);
    this.draw();
  }

  draw() {
    this.ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    this.ctx.fillRect(0, 0, this.width, this.height);



  

    if (this.audioTool.audioContext) {
      for (let i = 0; i < this.audioTool.bufferLength; i++) {
        this.circle.radius = (-this.audioTool.dataWave[i] * 3 + window.innerHeight) / 3;

        // Calculate the frequency value
        const frequency = this.audioTool.dataWave[i];
        

        // Set the color based on the frequency
        if (frequency < 85) {
          
    
          
        } else if (frequency >= 85 && frequency <= 170) {
          // Low frequency, set color to blue
     
        } else {
          // Default color
  
        }
      }
    }

    this.audioTool.updateWaveForm();
    // this.audioTool.updateFrequency();


    requestAnimationFrame(this.draw.bind(this));
  }


}


window.onload = function() {
 const app = new App();
}
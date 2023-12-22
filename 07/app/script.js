







// Example content in canvas.js
const canvasContainer = document.createElement('div');
canvasContainer.id = 'canvas-container';

const canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

canvasContainer.appendChild(canvas);
document.body.appendChild(canvasContainer);
ctx = canvas.getContext('2d');


// let mouseX = canvas.width / 2;
// let mouseY = canvas.height / 2;

// function updateMousePosition(event) {
//     mouseX = event.clientX;
//     mouseY = event.clientY;
// }


// document.addEventListener('mousemove', updateMousePosition);



// let midi = new MidiConnection();

// midi.addEventListener("midi", midi.midiControl);

// function midiControl(infos) {
//  console.log(infos);
//  if (infos[3] === 21) {
//     const val = mapping(infos[4], 0, 127, 0, width);
//    mouseX = val;
   
//  }
// }

// function mapping(val,min, max, newMin, newMax) {
//     return (val - min) * (newMax - newMin) / (max - min) + newMin;
// }



// function draw() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
   
//     // mapImage.src = 'map.png';
//     // ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);
  

    
//     drawCursorLines();
//     drawCursorText();

//     requestAnimationFrame(draw);   
// }
// draw();



function drawCursorLines(){
    ctx.beginPath();
    ctx.strokeStyle = "rgba(0,255,0,1)"; 
    ctx.stroke
    ctx.lineWidth = 3;
    ctx.strokeRect(mouseX-15, mouseY-15, 30, 30);
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(mouseX, 0); // Starting point at the top-left corner
    ctx.lineTo(mouseX, canvas.height); // Ending point at the bottom-left corner
    ctx.strokeStyle = "rgba(0,255,0,1)"; // Line color
    ctx.lineWidth = 3; // Line width
    ctx.stroke();
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(0, mouseY); // Starting point at the left-middle of the screen
    ctx.lineTo(canvas.width, mouseY); // Ending point at the right-middle of the screen
    ctx.strokeStyle = "rgba(0,255,0,1)"; // Line color
    ctx.lineWidth = 3; // Line width
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
}

function drawCursorText(){
    ctx.textAlign = "left";
    ctx.font = "12px Arial";
    ctx.fillStyle = "rgba(0,255,0,1)";
    ctx.fillText("X : "+mouseX, mouseX+20, mouseY-40);
    ctx.fillText("Y : "+mouseY, mouseX+20, mouseY-15);
}





class App {
        constructor() {
             
                // this.grille = [];
 
  
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
                        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                        this.source = this.audioContext.createBufferSource();

                        this.midi = new MidiConnection();
                        this.midi.addEventListener("midi", this.midiControl.bind(this));

                 
                        this.mouseX = 0;
                        this.mouseY = 0;


                      this.isMouseDown = false;
          
                        this.click = false;



        // for (let j = 0; j < this.height; j += 8) {
        //         for (let i = 0; i < this.width; i += 8) {
        //             const circle = new Circle(i, j, 1, this.ctx);

                
        //             // on stock le cercle dans le tableau
        //             this.grille.push(circle);
        //         }
        //     }

            this.audioFile = "knob.mp3";
            this.audio = new Audio(this.audioFile);
            this.audio.volume = 1; // Double the audio volume
            this.audioFile2 = "bip.mp3";
            this.audio2 = new Audio(this.audioFile2);
            this.audio2.volume = 0.5; // Double the audio volume
  
      
     


    //         this.image = new Image();
    // this.image.onload = () => {
    //     this.largeur = this.image.width;
    //     this.hauteur = this.image.height;
    //     this.ctx.drawImage(this.image, 0, 0, this.largeur, this.hauteur, 0, 0, this.width, this.height);
    //     let imageData = this.ctx.getImageData(0, 0, this.width, this.height);
    //    this.data = imageData.data;
    //   
    // };
    // this.image.src = "map.png";

 

    this.draw();
          
    }   

    draw() {

this.ctx.clearRect(0, 0, this.width, this.height);

    

     

        // this.ctx.drawImage(this.image, 0, 0, this.largeur, this.hauteur, 0, 0, this.width, this.height);

        // const pixels = this.detectPixels();
        // this.grille.forEach(circle => {
        //     const x = circle.x;
        //     const y = circle.y;
        //     const color = this.detectPixels(x, y);
        //     if(color[0]>=254 && color[1]>=254 && color[2]>=254){
               
               
        //      circle.draw();
        //     }

         
        // });

     

       addEventListener("mousemove", (e) => {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
       });

     if (this.click === true){
        this.isMouseDown = true;
        } else if (this.click === false){
            this.isMouseDown = false;
        }

         
               
         

    this.ctx.beginPath();

    this.ctx.beginPath();
    this.ctx.moveTo(this.mouseX, 0); // Starting point at the top-left corner
    this.ctx.lineTo(this.mouseX, this.height); // Ending point at the bottom-left corner
    this.ctx.strokeStyle = this.isMouseDown ? "rgba(255,0,0,1)" : "rgba(0,255,0,1)"; // Line color (red if mouse is down, green otherwise)
    this.ctx.lineWidth = 3; // Line width
    this.ctx.stroke();
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.strokeStyle = this.isMouseDown ? "rgba(255,0,0,1)" : "rgba(0,255,0,1)"; // Line color (red if mouse is down, green otherwise)
    this.ctx.lineWidth = 3; // Line width
    this.ctx.moveTo(0, this.mouseY); // Starting point at the left-middle of the screen
    this.ctx.lineTo(this.width, this.mouseY); // Ending point at the right-middle of the screen
    this.ctx.stroke();     

    this.ctx.beginPath();
    this.ctx.strokeStyle = this.isMouseDown ? "rgba(255,0,0,1)" : "rgba(0,255,0,1)"; // Line color (red if mouse is down, green otherwise)
    this.ctx.lineWidth = 3;
    this.ctx.strokeRect(this.mouseX-15, this.mouseY-15, 30, 30);
    this.ctx.closePath();

    const latMin = -90; 
    const latMax = 90; 
    const lngMin = -180; 
    const lngMax = 180; 
    const lat = (this.mouseY / window.innerHeight) * (latMax - latMin) + latMin;
    const lng = (this.mouseX / window.innerWidth) * (lngMax - lngMin) + lngMin;

    this.ctx.textAlign = "left";
    this.ctx.font = "12px Arial";
    this.ctx.fillStyle = this.isMouseDown ? "rgba(255,0,0,1)" : "rgba(0,255,0,1)"; // Text color (red if mouse is down, green otherwise)
    this.ctx.fillText("X : "+lng, this.mouseX+20, this.mouseY-40);
    this.ctx.fillText("Y : "+lat, this.mouseX+20, this.mouseY-15);

               

              
           
           

        requestAnimationFrame(this.draw.bind(this));
    }



    midiControl(infos) {
        console.log(infos);

        if (infos[3] === 40) {
            this.valDown = infos[4]
            if (this.valDown > 0){
                this.click = true;
            } 
        }
    
            if (infos[3] === 36){
                this.valUp = infos[4]
                if (this.valUp > 0){
                    this.click = false;
                }
             
            }

        // if (infos[3] === 23) {
        //     const val = this.map(infos[4], 0, 127, 0, this.width);
        //     this.mouseX = val;
        //     this.audio.play();
        // }

        // if (infos[3] === 24) {
        //     const val = this.map(infos[4], 0, 127, 0, this.height);
        //     this.mouseY = val;
        //     this.audio.play();
        // }

        // if (infos[3] === 23) {  
        //     const val = this.map(infos[4], 0, 127, 1, 3);
        //     this.grille.forEach(circle => {
        //         circle.rayon = val;
        //     })
            
        // }

        // if (infos[3] === 40) {
        //     const val = this.map(infos[4], 0, 127, 5, 1);
        //     const closestCircles = this.grille
        //         .map(circle => ({
        //             circle,
        //             distance: Math.sqrt(
        //                 Math.pow(circle.x - this.mouseX, 2) + Math.pow(circle.y - this.mouseY, 2)
        //             )
        //         }))
        //         .sort((a, b) => a.distance - b.distance)
        //         .slice(0, 1);

        //     closestCircles.forEach(({ circle }) => {
        //         circle.rayon = val;
        //         circle.color = "rgba(0,255,0,1)";
        //         this.audio2.play();
        //     });
        // }
    }


    map(val,min, max, newMin, newMax) {
        return (val - min) * (newMax - newMin) / (max - min) + newMin;
    }


    // detectPixels(x,y) {
    //     const index = (y * this.width + x) * 4;
    //     const r = this.data[index];
    //     const g = this.data[index + 1];
    //     const b = this.data[index + 2];
      

    //     return [r,g,b];

    // }
}

window.onload = function () {
    const app = new App();
  };

//   class Circle {
//       constructor(x, y, r,context) {
//           this.x = x;
//           this.y = y;
//           this.rayon = r;
//           this.context = context;
//           this.color = "rgba(0,255,0,1)";
//   }

//   draw() {
//     this.context.fillStyle = this.color;
//     this.context.beginPath();
//     this.context.arc(this.x,this.y, this.rayon, 0, 2 * Math.PI, true);

//     this.context.fill();
//     this.context.closePath();


//   }
// }

const map = new MapWithCountryInfo(); 


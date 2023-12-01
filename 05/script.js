var width = window.innerWidth;
var height = window.innerHeight;
var context;
var image = null;
var largeur = width;
var hauteur = height;
var grille = [];
var video = null;
var webcam = true;
var pixels = null;

function createCanvas(w, h) {
  var canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  context = canvas.getContext("2d");
  document.body.appendChild(canvas);
}

function setup() {
  console.log("setup");
  createCanvas(width, height);

  for (let j = 0; j < height; j += 25) {
    for (let i = 0; i < width; i += 25) {
      let circle = { x: i, y: j, radius: 8, originalX: i, originalY: j };
      grille.push(circle);
    }
  }


  if (webcam) {
    initialiserCamera();
  } else {
    image = new Image();
    image.onload = () => {
      largeur = image.width;
      hauteur = image.height;
    };
    image.src = "image/andy.jpg";
  }

  
  draw();
}

let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', function (event) {
  mouseX = event.clientX;
  mouseY = event.clientY;
});


function draw() {
  detectPixels();
  context.fillStyle = "rgba(0,0,0,0)";
  context.fillRect(0, 0, width, height);

  redCircles.forEach((circle) => {
    circle.draw(context);
    circle.update();
  });

  grille.forEach((cell) => {
  
    const directionX = mouseX - cell.x;
    const directionY = mouseY - cell.y;

 
    const distance = Math.sqrt(directionX ** 2 + directionY ** 2);

    if (distance <= 60) {
      cell.x += (directionX / distance) * 0.1;
      cell.y += (directionY / distance) * 0.1;

      console.log(cell.x, cell.y)
    } else {
    
      cell.x += (cell.originalX - cell.x) * 0.7;
      cell.y += (cell.originalY - cell.y) * 0.7;
    }

let isAscii = true;   
let isRect = true;


    let intensity = getIntensityFromImage(cell.x, cell.y);
    let asciiChar = getAsciiCharacter(intensity);

    redCircles.forEach((redCircle) => {
      const distance = Math.sqrt((cell.x - redCircle.x) ** 2 + (cell.y - redCircle.y) ** 2);

      if (distance <= redCircle.radius +  Math.floor(Math.random() * (150 - 100 + 1)) + 100) {
  
        isAscii = false;
        
      }

      if (distance <= redCircle.radius +  Math.floor(Math.random() * (100 - 50 + 1)) + 50) {
       
        isRect = false;
      }

      if (distance <= redCircle.radius ) {
      
        isAscii = true;
        isRect = true;
      }
    });
  
    
    





    if (isAscii) {
     
      context.fillStyle = getColorFromImage(cell.x, cell.y);
      context.beginPath();
      // context.arc(cell.x, cell.y, 10, 0, 2 * Math.PI);
      context.fillRect(cell.x-10, cell.y-10, 24, 24);
      context.fill();
    } 

    if (!isAscii) {
  
      context.fillStyle = 'rgb(255,255,255)';
      // context.fillStyle = getColorFromImage(cell.x, cell.y);
      context.font = "22px monospace";
      context.fillText(asciiChar, cell.x, cell.y);
    }
   
if (!isRect) {
      
      context.fillStyle = "white";
      // context.fillStyle = getColorFromImage(cell.x, cell.y);
    
      context.fillRect(cell.x, cell.y, Math.random()*20,  Math.random()*20);
    }
 
  });

  requestAnimationFrame(draw);
}

const asciiChars = [
  "!", "\"", "#", "$", "%", "&", "'", "(", ")", "*", "+", ",", "-", ".", "/",
  "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ":", ";", "<", "=", ">", "?",
  "@", "[", "\\", "]", "^", "_",
  "`", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o",
  "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "{", "|", "}", "~", " ",
  "¡", "¢", "£", "¤", "¥", "¦", "§", "¨", "©", "ª", "«", "¬", "­", "®", "¯", "°",
  "±", "²", "³", "´", "µ", "¶", "·", "¸", "¹", "º", "»", "¼", "½", "¾", "¿", "À",
  "Á", "Â", "Ã", "Ä", "Å", "Æ", "Ç", "È", "É", "Ê", "Ë", "Ì", "Í", "Î", "Ï", "Ð",
  "Ñ", "Ò", "Ó", "Ô", "Õ", "Ö", "×", "Ø", "Ù", "Ú", "Û", "Ü", "Ý", "Þ", "ß", "à",
  "á", "â", "ã", "ä", "å", "æ", "ç", "è", "é", "ê", "ë", "ì", "í", "î", "ï", "ð",
  "ñ", "ò", "ó", "ô", "õ", "ö", "÷", "ø", "ù", "ú", "û", "ü", "ý", "þ", "ÿ"
];

function getAsciiCharacter(intensity) {
  const index = Math.floor((intensity / 255) * asciiChars.length);
  return asciiChars[index];
}




function getIntensityFromImage(x, y) {
  let index = (y * largeur + x) * 4;
  let r = pixels.data[index];
  let g = pixels.data[index + 1];
  let b = pixels.data[index + 2];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function getColorFromImage(x, y) {
  let index = (y * largeur + x) * 4;
  let r = pixels.data[index];
  let g = pixels.data[index + 1];
  let b = pixels.data[index + 2];


  let roundedColor = roundToNearestPrimaryColor(r, g, b);

  // return `rgb(${roundedColor.r}, ${roundedColor.g}, ${roundedColor.b})`;
   return `rgb(${r}, ${g}, ${b})`;
}

function roundToNearestPrimaryColor(r, g, b) {
  const threshold = 120;

  
  const roundedR = r < threshold ? 50 : 255;
  const roundedG = g < threshold ? 50 : 255;
  const roundedB = b < threshold ? 50 : 255;

  return { r: roundedR, g: roundedG, b: roundedB };
}


function initialiserCamera() {
  video = document.createElement("video");
  video.width = width;
  video.height = height;

  

  navigator.getMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

  navigator.getMedia(
    {
      video: { width: width, height: height },
      audio: false,
    },
    (stream) => {
      video.srcObject = stream;
      video.play();
    },
    (error) => {
      console.log(error);
    }
  );
}

function detectPixels() {
  pixels = null;

  if (webcam) {
    context.save(); 
    context.scale(-1, 1); 
    context.drawImage(video, -width, 0, width, height);
    context.restore(); 
  } else {
    context.drawImage(image, 0, 0);
  }

  pixels = context.getImageData(0, 0, width, height);

  grille.forEach((circle, i) => {
    let intensity = getIntensityFromImage(circle.x, circle.y);
    let color = getColorFromImage(circle.x, circle.y);
    circle.radius = intensity / 255 * 8;
    circle.color = color;
  });
}



window.onload = function () {
  console.log("on est prêt");
  setup();
};


class RedCircle {
  constructor(x, y, growthRate) {
    this.x = x;
    this.y = y;
    this.radius = 0;
    this.growthRate = growthRate;
  }

  draw(context) {
    context.strokeStyle = 'rgba(255,0,0,0)';
    context.lineWidth = 5; 
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    context.stroke();
  }

  update() {
    this.radius += (this.growthRate / 60); 
  }

  checkCollisionWithAscii(circle) {
    const distance = Math.sqrt((this.x - circle.x) ** 2 + (this.y - circle.y) ** 2);
    return distance <= this.radius + circle.radius;
  }
}
  


let redCircles = []; 

document.addEventListener('click', function (event) {

  redCircles.push(new RedCircle(event.clientX, event.clientY, 1000)); 
});
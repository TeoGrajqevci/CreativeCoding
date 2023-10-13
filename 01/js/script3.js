let waveAmplitude3 = 30;
let time3 = 0;

function setup() {
  createCanvas(800, 800);
  noiseDetail(1);
}

function draw() {
  background(55, 33, 106);

  time3 += 0.003;
  let amplitudeNoise3 = map(noise(time3), 0, 1, -300, 300);
  noStroke();
  fill(224, 193, 14);

  beginShape();
  for (let x3 = 0; x3 <= 800; x3 += 10) {
    let waveFrequency3 = noise(time3 + x3 * 0.01) * 0.001 + 0.01;
    let y3 = x3;
    y3 += sin(time3 + x3 * waveFrequency3) * (waveAmplitude3 + amplitudeNoise3);
    vertex(x3, y3);
  }
  vertex(800, 800);
  vertex(0, 800);

  endShape(CLOSE);
}

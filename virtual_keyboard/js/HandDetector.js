import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { drawLandmarks } from "@mediapipe/drawing_utils";
import EventEmitter from "@onemorestudio/eventemitterjs";

export default class HandDetector extends EventEmitter {
  constructor(videoElement) {
    super();
    this.videoElement = videoElement;
    console.log("HandDetector.js");
    this.canvas = document.createElement("canvas");
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d", { willReadFrequently: true });
    this.finger = { x: null, y: null };
    this.finger2 = { x: null, y: null };
    this.createHandLandmarker();
    this.ctx.translate(this.canvas.width, 0);
    this.ctx.scale(-1, 1);
  }

  async createHandLandmarker() {
    const vision = await FilesetResolver.forVisionTasks("./tasks/wasm");

    this._handLandmarker = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: `./tasks/hand_landmarker.task`,
        delegate: "GPU",
      },
      runningMode: "VIDEO", // this.runningMode,
      numHands: 2,
    });

    // this.detect();
    this.emit("ready", []);
  }

  detect() {
    let startTimeMs = performance.now();
    const results = this._handLandmarker.detectForVideo(
      this.videoElement,
      startTimeMs
    );

    this.ctx.fillStyle = "rgba(0 ,0 ,0, 1)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (results.landmarks.length > 0) {
      // console.log(results.landmarks);
      // results.landmarks.forEach((pointsDeLaMain) => {
      //   drawLandmarks(this.ctx, pointsDeLaMain, { color: "red", radius: 5 });
      // });

      // this.ctx.beginPath();
      // this.ctx.fillStyle = "rgba(255, 0, 0, 1)";
      // this.ctx.arc(
      //   results.landmarks[0][8].x * window.innerWidth,
      //   results.landmarks[0][8].y * window.innerHeight,
      //   50,
      //   0,
      //   2 * Math.PI
      // );
      // this.ctx.fill();
      // this.ctx.closePath();

      // this.ctx.fillStyle = "rgba(255, 255, 255, 1)";
      // this.ctx.beginPath();
      // this.ctx.lineTo(
      //   results.landmarks[0][0].x * window.innerWidth,
      //   results.landmarks[0][0].y * window.innerHeight
      // );
      // this.ctx.lineTo(
      //   results.landmarks[0][1].x * window.innerWidth,
      //   results.landmarks[0][1].y * window.innerHeight
      // );

      // this.ctx.lineTo(
      //   results.landmarks[0][2].x * window.innerWidth,
      //   results.landmarks[0][2].y * window.innerHeight
      // );

      // this.ctx.lineTo(
      //   results.landmarks[0][3].x * window.innerWidth,
      //   results.landmarks[0][3].y * window.innerHeight
      // );

      // this.ctx.lineTo(
      //   results.landmarks[0][4].x * window.innerWidth,
      //   results.landmarks[0][4].y * window.innerHeight
      // );

      // this.ctx.stroke();
      // this.ctx.closePath();

      // ////////////////////////////////////////////////////////////////

      // this.ctx.beginPath();
      // this.ctx.lineTo(
      //   results.landmarks[0][2].x * window.innerWidth,
      //   results.landmarks[0][2].y * window.innerHeight
      // );

      // this.ctx.lineTo(
      //   results.landmarks[0][5].x * window.innerWidth,
      //   results.landmarks[0][5].y * window.innerHeight
      // );

      // this.ctx.lineTo(
      //   results.landmarks[0][6].x * window.innerWidth,
      //   results.landmarks[0][6].y * window.innerHeight
      // );

      // this.ctx.lineTo(
      //   results.landmarks[0][7].x * window.innerWidth,
      //   results.landmarks[0][7].y * window.innerHeight
      // );

      // this.ctx.lineTo(
      //   results.landmarks[0][8].x * window.innerWidth,
      //   results.landmarks[0][8].y * window.innerHeight
      // );

      // this.ctx.stroke();

      // this.ctx.closePath();

      // ////////////////////////////////////////////////////////////////

      // this.ctx.beginPath();

      // this.ctx.lineTo(
      //   results.landmarks[0][5].x * window.innerWidth,
      //   results.landmarks[0][5].y * window.innerHeight
      // );

      // this.ctx.lineTo(
      //   results.landmarks[0][9].x * window.innerWidth,
      //   results.landmarks[0][9].y * window.innerHeight
      // );

      // this.ctx.lineTo(
      //   results.landmarks[0][10].x * window.innerWidth,
      //   results.landmarks[0][10].y * window.innerHeight
      // );

      // this.ctx.lineTo(
      //   results.landmarks[0][11].x * window.innerWidth,
      //   results.landmarks[0][11].y * window.innerHeight
      // );

      // this.ctx.lineTo(
      //   results.landmarks[0][12].x * window.innerWidth,
      //   results.landmarks[0][12].y * window.innerHeight
      // );

      // this.ctx.stroke();

      // this.ctx.closePath();

      // ////////////////////////////////////////////////////////////////

      // this.ctx.beginPath();

      // this.ctx.lineTo(
      //   results.landmarks[0][9].x * window.innerWidth,
      //   results.landmarks[0][9].y * window.innerHeight
      // );

      // this.ctx.lineTo(
      //   results.landmarks[0][13].x * window.innerWidth,
      //   results.landmarks[0][13].y * window.innerHeight
      // );

      // this.ctx.lineTo(
      //   results.landmarks[0][14].x * window.innerWidth,
      //   results.landmarks[0][14].y * window.innerHeight
      // );

      // this.ctx.lineTo(
      //   results.landmarks[0][15].x * window.innerWidth,
      //   results.landmarks[0][15].y * window.innerHeight
      // );

      // this.ctx.lineTo(
      //   results.landmarks[0][16].x * window.innerWidth,
      //   results.landmarks[0][16].y * window.innerHeight
      // );

      // this.ctx.stroke();

      // this.ctx.closePath();

      // ////////////////////////////////////////////////////////////////

      // this.ctx.beginPath();

      // this.ctx.lineTo(
      //   results.landmarks[0][13].x * window.innerWidth,
      //   results.landmarks[0][13].y * window.innerHeight
      // );

      // this.ctx.lineTo(
      //   results.landmarks[0][17].x * window.innerWidth,
      //   results.landmarks[0][17].y * window.innerHeight
      // );

      // this.ctx.lineTo(
      //   results.landmarks[0][18].x * window.innerWidth,
      //   results.landmarks[0][18].y * window.innerHeight
      // );

      // this.ctx.lineTo(
      //   results.landmarks[0][19].x * window.innerWidth,

      //   results.landmarks[0][19].y * window.innerHeight
      // );

      // this.ctx.lineTo(
      //   results.landmarks[0][20].x * window.innerWidth,

      //   results.landmarks[0][20].y * window.innerHeight
      // );

      // this.ctx.stroke();

      // this.ctx.closePath();

      // ////////////////////////////////////////////////////////////////

      // this.ctx.beginPath();

      // this.ctx.lineTo(
      //   results.landmarks[0][17].x * window.innerWidth,
      //   results.landmarks[0][17].y * window.innerHeight
      // );

      // this.ctx.lineTo(
      //   results.landmarks[0][0].x * window.innerWidth,
      //   results.landmarks[0][0].y * window.innerHeight
      // );

      // this.ctx.stroke();

      // this.ctx.closePath();

      // ////////////////////////////////////////////////////////////////

      // this.ctx.beginPath();

      // this.ctx.fillStyle = "rgba(255, 255, 255, 1)";

      // this.ctx.lineTo(
      //   results.landmarks[0][5].x * window.innerWidth,
      //   results.landmarks[0][5].y * window.innerHeight
      // );

      // this.ctx.lineTo(
      //   results.landmarks[0][9].x * window.innerWidth,
      //   results.landmarks[0][9].y * window.innerHeight
      // );

      // this.ctx.lineTo(
      //   results.landmarks[0][13].x * window.innerWidth,
      //   results.landmarks[0][13].y * window.innerHeight
      // );

      // this.ctx.lineTo(
      //   results.landmarks[0][17].x * window.innerWidth,
      //   results.landmarks[0][17].y * window.innerHeight
      // );

      // this.ctx.lineTo(
      //   results.landmarks[0][0].x * window.innerWidth,
      //   results.landmarks[0][0].y * window.innerHeight
      // );

      // this.ctx.lineTo(
      //   results.landmarks[0][1].x * window.innerWidth,
      //   results.landmarks[0][1].y * window.innerHeight
      // );

      // this.ctx.lineTo(
      //   results.landmarks[0][2].x * window.innerWidth,
      //   results.landmarks[0][2].y * window.innerHeight
      // );

      // this.ctx.fill();

      // this.ctx.closePath();

      // this.ctx.fillStyle = "rgba(0, 255, 0,1)";
      // this.ctx.beginPath();
      // this.ctx.arc(
      //   results.landmarks[0][8].x * window.innerWidth,
      //   results.landmarks[0][8].y * window.innerHeight,
      //   50,
      //   0,
      //   2 * Math.PI
      // );
      // this.ctx.fill();

      // je peux stocker les coordonnées du bout du doigt

      this.finger2 = results.landmarks[0][4];
      this.finger = results.landmarks[0][8];
    } else {
      this.finger = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    }
  }
}

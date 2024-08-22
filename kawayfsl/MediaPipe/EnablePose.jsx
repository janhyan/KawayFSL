import {
  PoseLandmarker,
  FilesetResolver,
  DrawingUtils,
} from "https://cdn.skypack.dev/@mediapipe/tasks-vision@0.10.0";


let runningMode = "IMAGE";
let enableWebcamButton = HTMLButtonElement;
let webcamRunning = false;



// Before we can use PoseLandmarker class we must wait for it to finish
// loading. Machine Learning models can be large and take a moment to

  createPoseLandmarker();
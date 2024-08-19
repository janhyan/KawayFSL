import React from "react";
import { Link } from "react-router-dom";
// import "../App";
import Navbar from "../../Components/Navbar.jsx";
import ModuleHeader from "../../Components/ModuleHeader.jsx";
import Webcam from "react-webcam";

import {
  GestureRecognizer,
  FilesetResolver,
  DrawingUtils,
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";

let gestureRecognizer = GestureRecognizer;
let runningMode = "IMAGE";
let enableWebcamButton = HTMLButtonElement;
let webcamRunning =  false;

// Before we can use HandLandmarker class we must wait for it to finish
// loading. Machine Learning models can be large and take a moment to
// get everything needed to run.
const createGestureRecognizer = async () => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
  );
  gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
      delegate: "GPU",
    },
    runningMode: runningMode,
  });
  demosSection.classList.remove("invisible");
};
createGestureRecognizer();

export default function Practice() {
  return (
    <div id="page-container">
      <Navbar />
      <MainBody />
    </div>
  );
}

function MainBody() {
  return (
    <main id="body-container">
      <ModuleHeader module="1" subtopic="A" />
      <OutputWebcam />
      {EnableFSL()}
    </main>
  );
}

const OutputWebcam = () => {
  const webRef = React.useRef(null);

  return (
    <div className="video-container">
      <Webcam
        ref={webRef}
        disablePictureInPicture={true}
        height={600}
        width={600}
        mirrored={true}
      />
      <canvas className="output_canvas"></canvas>
      <h1 className="gesture_output"></h1>
    </div>
  );
};

function EnableFSL() {

  React.useEffect(() => {
    const video = document.getElementById("webcam");
    const canvasElement = document.getElementById("output_canvas");
    const canvasCtx = canvasElement.getContext("2d");
    const gestureOutput = document.getElementById("gesture_output");
  }, []);


  // Check if webcam access is supported.
  function hasGetUserMedia() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}
}

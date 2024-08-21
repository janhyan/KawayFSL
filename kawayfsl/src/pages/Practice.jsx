import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../Components/Navbar.jsx";
import ModuleHeader from "../../Components/ModuleHeader.jsx";

import {
  FilesetResolver,
  DrawingUtils,
  HandLandmarker
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0";

let handLandmarker = undefined;
let runningMode = "IMAGE";
let enableWebcamButton = HTMLButtonElement;
let webcamRunning = false;

// Before we can use HandLandmarker class we must wait for it to finish loading. 
const createHandLandmarker = async () => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
  );
  handLandmarker = await HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:`https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
      delegate: "GPU",
    },
    runningMode: runningMode,
    numHands: 2
  });
};
createHandLandmarker();


// Main exported page 
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
      <button className="enable_cam">Enable</button>
      <button className="enable_fsl" onClick={EnableFSL}>fsl</button>
      <div className="video-container" style={{position: "relative"}}>
        <video className="video" autoPlay playsInline />
        <canvas className="output_canvas" width="{1280}" height="{720}" style={{position: 'absolute', left: 0, top: 0}}></canvas>
        <h1 className="gesture_output"></h1>
      </div>
    </main>
  );
}


// Function to enable MediaPipe and Enable camera
function EnableFSL() {
  const video = document.querySelector(".video");
  const canvasElement = document.querySelector(".output_canvas");
  const canvasCtx = canvasElement.getContext("2d");
  const gestureOutput = document.querySelector(".gesture_output");
  const videoHeight = "360px";
  const videoWidth = "480px";


  // Check if webcam access is supported.
  function hasGetUserMedia() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }

  if (hasGetUserMedia()) {
    enableWebcamButton = document.querySelector(".enable_cam");
    enableWebcamButton.addEventListener("click", enableCam);
  } else {
    console.warn("getUserMedia() is not supported by your browser");
  }

  // Enable the live webcam view and start detection.
  function enableCam(event) {
    if (!handLandmarker) {
      alert("Please wait for handLandmarker to load");
      return;
    }

    if (webcamRunning === true) {
      webcamRunning = false;
      enableWebcamButton.innerText = "ENABLE PREDICTIONS";
    } else {
      webcamRunning = true;
      enableWebcamButton.innerText = "DISABLE PREDICTIONS";
    }

    // getUsermedia parameters.
    const constraints = {
      video: true
    };

    // Activate the webcam stream.
    navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
      video.srcObject = stream;
      video.addEventListener("loadeddata", predictWebcam);
    });
  }

  let lastVideoTime = -1;
  let results = undefined;
  console.log(video);
  async function predictWebcam() {
    canvasElement.style.width = video.videoWidth;;
    canvasElement.style.height = video.videoHeight;
    canvasElement.width = video.videoWidth;
    canvasElement.height = video.videoHeight;
    
    // Now let's start detecting the stream.
    if (runningMode === "IMAGE") {
      runningMode = "VIDEO";
      await handLandmarker.setOptions({ runningMode: "VIDEO" });
    }
    let startTimeMs = performance.now();
    if (lastVideoTime !== video.currentTime) {
      lastVideoTime = video.currentTime;
      results = handLandmarker.detectForVideo(video, startTimeMs);
    }
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    const drawingUtils = new DrawingUtils(canvasCtx);


    if (results.landmarks) {
      for (const landmarks of results.landmarks) {
        drawingUtils.drawConnectors(
          landmarks,
          HandLandmarker.HAND_CONNECTIONS,
          {
            color: "#00FF00",
            lineWidth: 5
          }
        );
        drawingUtils.drawLandmarks(landmarks, {
          color: "#FF0000",
          lineWidth: 2
        });
      }
    }
    canvasCtx.restore();
  
    // Call this function again to keep predicting when the browser is ready.
    if (webcamRunning === true) {
      window.requestAnimationFrame(predictWebcam);
    }
  }
}
import React from "react";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import {
  POSE_CONNECTIONS,
  FACEMESH_TESSELATION,
  HAND_CONNECTIONS,
  Holistic,
} from "@mediapipe/holistic";
import { Camera } from "@mediapipe/camera_utils";
import nj from "@d4c/numjs/build/module/numjs.min.js";

export default function EnableHolistic(toggleTracking) {
  // Input Frames from DOM
  const videoElement = document.getElementsByTagName("video")[0];
  const canvasElement = document.querySelector(".output_canvas");
  const canvasCtx = canvasElement.getContext("2d");
  let sequence = [];

  function onResults(results) {
    let keypoints = extractKeypoints(results);

    // Group keypoints into 40 frames to send to Lambda
    if (toggleTracking.current) {
      sequence.push(keypoints);
      if (sequence.length === 40) {
        console.log(sequence);
        sequence = [];
      }
    }

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    // Only overwrite existing pixels.
    canvasCtx.globalCompositeOperation = "source-in";
    canvasCtx.fillStyle = "#00FF00";
    canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);

    // Only overwrite missing pixels.
    canvasCtx.globalCompositeOperation = "destination-atop";
    canvasCtx.drawImage(
      results.image,
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );

    canvasCtx.globalCompositeOperation = "source-over";
    drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
      color: "#00FF00",
      lineWidth: 0.5,
    });
    drawLandmarks(canvasCtx, results.poseLandmarks, {
      color: "#FF0000",
      lineWidth: 0.5,
    });
    drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION, {
      color: "#C0C0C070",
      lineWidth: 0.5,
    });
    drawConnectors(canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS, {
      color: "#CC0000",
      lineWidth: 0.5,
    });
    drawLandmarks(canvasCtx, results.leftHandLandmarks, {
      color: "#00FF00",
      lineWidth: 0.5,
    });
    drawConnectors(canvasCtx, results.rightHandLandmarks, HAND_CONNECTIONS, {
      color: "#00CC00",
      lineWidth: 0.5,
    });
    drawLandmarks(canvasCtx, results.rightHandLandmarks, {
      color: "#FF0000",
      lineWidth: 0.5,
    });
    canvasCtx.restore();
  }

  // This function allows extraction of coordinates of each landmark using numjs
  function extractKeypoints(results) {
    let pose = results.poseLandmarks
      ? nj
          .array(
            results.poseLandmarks?.map((res) => [
              res.x,
              res.y,
              res.z,
              res.visibility,
            ])
          )
          .flatten()
      : nj.zeros(33 * 4);
    let face = results.faceLandmarks
      ? nj
          .array(results.faceLandmarks?.map((res) => [res.x, res.y, res.z]))
          .flatten()
      : nj.zeros(468 * 3);
    let lh = results.leftHandLandmarks
      ? nj
          .array(results.leftHandLandmarks?.map((res) => [res.x, res.y, res.z]))
          .flatten()
      : nj.zeros(21 * 3);
    let rh = results.rightHandLandmarks
      ? nj
          .array(
            results.rightHandLandmarks?.map((res) => [res.x, res.y, res.z])
          )
          .flatten()
      : nj.zeros(21 * 3);
      return nj.concatenate([pose, face, lh, rh]);
    }
    
  const holistic = new Holistic({
    locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
    },
  });
  holistic.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    enableSegmentation: false,
    smoothSegmentation: true,
    refineFaceLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });
  holistic.onResults(onResults);

  const camera = new Camera(videoElement, {
    onFrame: async () => {
      await holistic.send({ image: videoElement });
    },
    width: 1280,
    height: 720,
  });
  camera.start();
  
  return { camera, holistic };
}

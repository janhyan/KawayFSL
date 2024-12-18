import { drawLandmarks } from "@mediapipe/drawing_utils";
import {
  FACEMESH_TESSELATION,
  HAND_CONNECTIONS,
  Holistic,
} from "@mediapipe/holistic";
import { Camera } from "@mediapipe/camera_utils";
import axios from "axios";

axios.defaults.withCredentials = true;

export default function EnableStatic(
  toggleTracking,
  setAnswers,
  counter,
  isCounterRef,
  setIsLoading
) {
  const videoElement = document.getElementsByTagName("video")[0];
  const canvasElement = document.querySelector(".output_canvas");
  const canvasCtx = canvasElement.getContext("2d");
  let sequence = [];

  function onResults(results) {
    const keypoints = extractKeypoints(results);

    if (toggleTracking.current) {
      sequence.push(keypoints);
      setIsLoading(true);

      if (counter.current === 0) {
        isCounterRef.current = false;
      }

      if (sequence.length === 30) {
        sendSequenceToAPI(sequence);
        sequence = [];
        toggleTracking.current = false;
      }
    }
    drawResults(results);
  }

  function extractKeypoints(results) {
    const lh = results.leftHandLandmarks;
    const rh = results.rightHandLandmarks;
    return { lh, rh };
  }

  function drawResults(results) {
    if (sequence.length === 0 && !isCounterRef.current) {
      setIsLoading(false);
    }
    
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    const x = canvasElement.width / 2;
    const y = canvasElement.height / 2;

    if (isCounterRef.current && counter.current >= 0) {
      // Draw the counter
      canvasCtx.font = "100px Inter";
      canvasCtx.textBaseline = "middle";
      canvasCtx.textAlign = "center";
      canvasCtx.fillStyle = "#fb8500";
      canvasCtx.fillText(counter.current, x, y);

    }

    canvasCtx.globalCompositeOperation = "source-in";
    canvasCtx.fillStyle = "#00FF00";
    canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);

    canvasCtx.globalCompositeOperation = "destination-atop";
    canvasCtx.drawImage(
      results.image,
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );

    canvasCtx.globalCompositeOperation = "source-over";

    drawLandmarkConnectors(
      results.leftHandLandmarks,
      HAND_CONNECTIONS,
      "#CC0000",
      0.1
    );
    drawLandmarkConnectors(
      results.rightHandLandmarks,
      HAND_CONNECTIONS,
      "#00CC00",
      0.1
    );

    canvasCtx.restore();
  }

  function drawLandmarkConnectors(landmarks, connections, color, lineWidth) {
    if (!landmarks) return;

    if (connections != FACEMESH_TESSELATION) {
      drawLandmarks(canvasCtx, landmarks, { color, radius: 1 });
    }
  }

  function sendSequenceToAPI(sequence) {
    axios
      .post(
        "https://kb02bv2ra8.execute-api.ap-northeast-1.amazonaws.com/stage/static",
        sequence
      )
      .then((response) => {
        setAnswers((prevAnswer) => [...prevAnswer, response.data]);
      })
      .catch((error) => {
        console.error("Error sending sequence to API:", error);
      });
  }

  const holistic = new Holistic({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`,
  });
  holistic.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    enableSegmentation: false,
    smoothSegmentation: true,
    refineFaceLandmarks: false,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });
  holistic.onResults(onResults);

  const camera = new Camera(videoElement, {
    onFrame: async () => {
      await holistic.send({ image: videoElement });
    },
    width: canvasElement.width,
    height: canvasElement.height,
  });
  camera.start();

  return { camera, holistic };
}

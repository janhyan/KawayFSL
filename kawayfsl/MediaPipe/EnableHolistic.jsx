import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import {
  POSE_CONNECTIONS,
  FACEMESH_TESSELATION,
  HAND_CONNECTIONS,
  Holistic,
} from "@mediapipe/holistic";
import { Camera } from "@mediapipe/camera_utils";
import nj from "@d4c/numjs/build/module/numjs.min.js";
import axios from "axios";

axios.defaults.withCredentials = true;

export default function EnableHolistic(
  toggleTracking,
  setAnswers,
  counter,
  isCounterRef,
  assessment_id,
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

      if (sequence.length === 40) {
        console.log(sequence);
        console.log(assessment_id);
        sendSequenceToAPI(sequence, assessment_id);
        sequence = [];
        toggleTracking.current = false;
      }
    }

    drawResults(results);
  }

  function extractKeypoints(results) {
    const pose = results.poseLandmarks
      ? nj
          .array(
            results.poseLandmarks.map((res) => [
              res.x,
              res.y,
              res.z,
              res.visibility,
            ])
          )
          .flatten()
      : nj.zeros(33 * 4);
    const face = results.faceLandmarks
      ? nj
          .array(
            results.faceLandmarks
              .slice(0, 468)
              .map((res) => [res.x, res.y, res.z])
          )
          .flatten()
      : nj.zeros(468 * 3);
    const lh = results.leftHandLandmarks
      ? nj
          .array(results.leftHandLandmarks.map((res) => [res.x, res.y, res.z]))
          .flatten()
      : nj.zeros(21 * 3);
    const rh = results.rightHandLandmarks
      ? nj
          .array(results.rightHandLandmarks.map((res) => [res.x, res.y, res.z]))
          .flatten()
      : nj.zeros(21 * 3);

    return nj.concatenate([pose, face, lh, rh]).tolist();
  }

  function sendSequenceToAPI(sequence, assessment_id) {
    axios
      .post(
        "https://kb02bv2ra8.execute-api.ap-northeast-1.amazonaws.com/stage/",
        { sequence, assessment_id } // Send both sequence and assessment_id in the body
      )
      .then((response) => {
        console.log("Sequence sent to API:", response.data);
        setAnswers((prevAnswer) => [...prevAnswer, response.data]);
      })
      .catch((error) => {
        console.error("Error sending sequence to API:", error);
      });
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
      console.log(isCounterRef.current, counter.current)
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
      results.poseLandmarks,
      POSE_CONNECTIONS,
      "#00FF00",
      0.1
    );
    drawLandmarkConnectors(
      results.faceLandmarks,
      FACEMESH_TESSELATION,
      "#C0C0C070",
      0.1
    );
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
    drawConnectors(canvasCtx, landmarks, connections, { color, lineWidth });
    if (connections != FACEMESH_TESSELATION) {
      drawLandmarks(canvasCtx, landmarks, { color, radius: 1 });
    }
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
    refineFaceLandmarks: true,
    minDetectionConfidence: 0.1,
    minTrackingConfidence: 0.1,
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

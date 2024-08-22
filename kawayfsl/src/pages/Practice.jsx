import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../Components/Navbar.jsx";
import ModuleHeader from "../../Components/ModuleHeader.jsx";

// import EnableFSL from "../../MediaPipe/EnableFSL.jsx";
import { CreateHandLandmarker } from "../../MediaPipe/EnableFSL.jsx";

import EnableFSL from "../../MediaPipe/EnablePose.jsx";
import { createPoseLandmarker } from "../../MediaPipe/EnablePose.jsx";
import EnableHolistic from "../../MediaPipe/EnableHolistic.jsx";

CreateHandLandmarker();
createPoseLandmarker();

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
      <button className="enable_fsl" onClick={EnableHolistic}>fsl</button>
      <div className="video-container" style={{position: "relative"}}>
        <video className="video" autoPlay playsInline />
        <canvas className="output_canvas" width="{1280}" height="{720}" style={{position: 'absolute', left: 0, top: 0}}></canvas>
        <h1 className="gesture_output"></h1>
      </div>
    </main>
  );
}



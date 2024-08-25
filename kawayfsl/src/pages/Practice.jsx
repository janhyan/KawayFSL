import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../Components/Navbar.jsx";
import ModuleHeader from "../../Components/ModuleHeader.jsx";

import EnableHolistic from "../../MediaPipe/EnableHolistic.jsx";

// Main exported page
export default function Practice() {
  const holisticRef = React.useRef(null);
  const toggleTracking = React.useRef(false) // For toggling if tracking starts
  
  React.useEffect(() => {
    return () => {
      if (holisticRef.current) {
        holisticRef.current.camera.stop();
        holisticRef.current.holistic.close();
      }
    };
  }, []);

  // Takes camera and holistic objects from EnableHolistic
  function handleEnableHolistic() {
    holisticRef.current = EnableHolistic(toggleTracking);
  }

  function toggleRecord() {
    toggleTracking.current = !toggleTracking.current;
  }

  return (
    <div id="page-container">
      <Navbar />
      <MainBody enable={handleEnableHolistic} toggle={toggleRecord}/>
    </div>
  );
}

function MainBody(props) {
  return (
    <main id="body-container">
      <ModuleHeader module="1" subtopic="A" />
      <button className="enable_fsl" onClick={props.enable}>
        fsl
      </button>
      <button className="record" onClick={props.toggle}>Record</button>
      <div className="video-container" style={{ position: "relative" }}>
        <video className="video" autoPlay playsInline />
        <canvas
          className="output_canvas"
          width="1280px"
          height="720px"
          style={{ position: "absolute", left: 0, top: 0 }}
        ></canvas>
        <h1 className="gesture_output"></h1>
      </div>
    </main>
  );
}

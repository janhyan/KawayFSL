import React from "react";
import { Link } from "react-router-dom";
// import "../App";
import Navbar from "../../Components/Navbar.jsx";
import ModuleHeader from "../../Components/ModuleHeader.jsx";
import Webcam from "react-webcam";

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
      <CustomWebcam />
    </main>
  );
}


const CustomWebcam = () => {
    const webRef = React.useRef(null);
    return (
      <div className="video-container">
        <Webcam ref={webRef} height={600} width={600} videoConstraints="environment"/>
      </div>
    );
  };
  
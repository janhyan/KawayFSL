import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../Components/Navbar.jsx";
import ModuleHeader from "../../Components/ModuleHeader.jsx";
import EnableHolistic from "../../MediaPipe/EnableHolistic.jsx";
import "./css/Practice.css";

// Main exported page
export default function Practice() {
  const [answer, setAnswers] = React.useState([]);

  const holisticRef = React.useRef(null);
  const toggleTracking = React.useRef(false); // For toggling if tracking starts

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
    holisticRef.current = EnableHolistic(toggleTracking, setAnswers);
  }

  function toggleRecord() {
    toggleTracking.current = !toggleTracking.current;
  }

  return (
    <div id="page-container">
      <Navbar />
      <MainBody
        enable={handleEnableHolistic}
        toggle={toggleRecord}
        answers={answer}
      />
    </div>
  );
}

// Renders right side of the page
function MainBody(props) {
  return (
    <main id="body-container" style={{paddingRight: "0px"}}>
      <ModuleHeader module="1" subtopic="A" />
      <div className="main-container">
        <div className="left-body">
          <div className="video-container">
            <video className="video" autoPlay playsInline />
            <canvas className="output_canvas"></canvas>
            <h1 className="gesture_output"></h1>
          </div>
          <div className="buttons-container">
            <button className="enable_fsl" onClick={props.enable}>
              CAMERA
            </button>
            <button className="record" onClick={props.toggle}>
              START
            </button>
          </div>
        </div>
        <div className="right-body">
          {props.answers.map((answer, index) => (
            <Answers key={index} answer={answer} />
          ))}
        </div>
      </div>
    </main>
  );
}

// Render divs for answers
function Answers(props) {
  return <div className="answer">{props.answer}</div>;
}

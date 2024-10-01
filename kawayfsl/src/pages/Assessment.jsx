import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "semantic-ui-react";
import Navbar from "../../Components/Navbar.jsx";
import ModuleHeader from "../../Components/ModuleHeader.jsx";
import EnableHolistic from "../../MediaPipe/EnableHolistic.jsx";
import EnableStatic from "../../MediaPipe/EnableStatic.jsx";
import "./css/Practice.css";

// Main exported page
export default function Assessment() {
  const location = useLocation();
  const contentData = location.state;

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

  // Takes camera and holistic objects from EnableHolistic or EnableStatic depending on the lesson
  function handleEnableHolistic() {
    holisticRef.current = contentData.assessment_id === 1 ? EnableStatic(toggleTracking, setAnswers) : EnableHolistic(toggleTracking, setAnswers);
    // holisticRef.current = EnableHolistic(toggleTracking, setAnswers);
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
        module={contentData.module_id}
        subtopic={contentData.lesson_title}
      />
    </div>
  );
}

// Renders right side of the page
function MainBody(props) {
  return (
    <main id="body-container" style={{paddingRight: "0px"}}>
      <ModuleHeader module={props.module} subtopic={props.subtopic} />
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

function ResultButton(props) {
  return (
    <div className="button-container">
      <Button className={props.btnName} as={Link} to={props.page} state={props.state} >{props.btnText}</Button>
    </div>
  )
}
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../Components/Navbar.jsx";
import ModuleHeader from "../../Components/ModuleHeader.jsx";
import EnableHolistic from "../../MediaPipe/EnableHolistic.jsx";
import EnableStatic from "../../MediaPipe/EnableStatic.jsx";
import "./css/Practice.css";

// Main exported page
export default function Practice() {
  // Set answer and counter states
  const [answer, setAnswers] = React.useState([]);
  const currentAnswer = React.useRef();
  const [counter, setCounter] = React.useState(3);

  const assessment_id = 2;

  // Set states and ref for triggering certain functions
  const holisticRef = React.useRef(null);
  const toggleTracking = React.useRef(false); // For toggling if tracking starts
  const [isCount, setIsCount] = React.useState(false); // For triggering countdown when tracking starts
  const counterRef = React.useRef(counter);
  const isCounterRef = React.useRef(false);

  // Countdown logic for state updates
  React.useEffect(() => {
    if (isCount && counter > 0) {
      const timer = setTimeout(
        () => setCounter((prevCounter) => prevCounter - 1),
        1000
      );
      counterRef.current = counter;

      // Clean up the timer on component unmount or re-render
      return () => clearTimeout(timer);
    }
  }, [counter, isCount]);

  // Handle toggleTracking when counter reaches 0
  React.useEffect(() => {
    if (counter === 0) {
      toggleTracking.current = !toggleTracking.current;
      setIsCount((prevCount) => !prevCount);
      counterRef.current = counter;
    }
  }, [counter]);

  // Effect for cleanup when component unmounts
  React.useEffect(() => {
    return () => {
      if (holisticRef.current) {
        holisticRef.current.camera.stop();
        holisticRef.current.holistic.close();
        holisticRef.current = null;
      }
    };
  }, []);

  // Takes camera and holistic objects from EnableHolistic
  function handleEnableHolistic() {
    holisticRef.current = EnableHolistic(toggleTracking, setAnswers, counterRef, isCounterRef, assessment_id);
  }

  function toggleRecord() {
    setIsCount((prevCount) => !prevCount);
    isCounterRef.current = true;

    if (counter === 0) {
      setCounter((prevCounter) => prevCounter + 3);
    }
  }

  return (
    <div id="page-container">
      <Navbar />
      <MainBody
        enable={handleEnableHolistic}
        toggle={toggleRecord}
        answers={answer}
        counter={counter}
        currentUserAnswer={currentAnswer.current}
      />
    </div>
  );
}

// Renders right side of the page
function MainBody(props) {
  return (
    <main id="body-container" style={{ paddingRight: "0px" }}>
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
  return (
    <div
      className="answer"
      style={
        checkResult(props.userAnswer, props.dbAnswer)
          ? { backgroundColor: "#00CC00" }
          : { backgroundColor: "#CC0000" }
      }
    >
      {props.answer}
    </div>
  );
}

function checkResult(userAnswer, dbAnswer) {
  if (userAnswer == dbAnswer) {
    return true;
  } else {
    return false;
  }
}
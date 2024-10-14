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
  const [assessmentId, setassessmentId] = React.useState(1);

  // Set states and ref for triggering certain functions
  const holisticRef = React.useRef(null);
  const toggleTracking = React.useRef(false); // For toggling if tracking starts
  const [isCount, setIsCount] = React.useState(false); // For triggering countdown when tracking starts
  const [isLoading, setIsLoading] = React.useState(false);
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

  // Update the model if dropdown selection is changed
  React.useEffect(() => {
    if (holisticRef.current) {
      holisticRef.current.camera.stop();
      holisticRef.current.holistic.close();
      holisticRef.current = null;
      handleEnableHolistic();
    }
  }, [assessmentId]);

  // Takes camera and holistic objects from EnableHolistic or EnableStatic depending on the lesson
  function handleEnableHolistic() {
    console.log(assessmentId)
    setIsLoading(true);
    holisticRef.current =
      assessmentId === 1
        ? EnableStatic(
            toggleTracking,
            setAnswers,
            counterRef,
            isCounterRef,
            setIsLoading
          )
        : EnableHolistic(
            toggleTracking,
            setAnswers,
            counterRef,
            isCounterRef,
            assessmentId,
            setIsLoading
          );
  }

  function toggleRecord() {
    setIsCount((prevCount) => !prevCount);
    isCounterRef.current = true;
    setIsLoading(true);

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
        holisticRef={holisticRef}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        assessmentId={assessmentId}
        setassessmentId={setassessmentId}
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
            <UserButton
              userAnswer={props.currentUserAnswer}
              dbAnswer={props.dbAnswer}
              toggle={props.toggle}
              attempt={props.attempt}
              answer={props.answers}
              module={props.module}
              lesson={props.lesson}
              user={props.user}
              holisticRef={props.holisticRef}
              isLoading={props.isLoading}
              enable={props.enable}
              setIsLoading={props.setIsLoading}
            />
            <AssessmentDropdown assessmentId={props.assessmentId} setassessmentId={props.setassessmentId} />
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
    <div className="answer" style={{ backgroundColor: "#00CC00" }}>
      {props.answer}
    </div>
  );
}

function UserButton(props) {
  console.log("Loading state:", props.isLoading);

  if (!props.holisticRef.current) {
    return (
      <button className="enable_fsl" onClick={props.enable}>
        CAMERA
      </button>
    );
  } else if (props.isLoading) {
    return (
      <div className="assessment-loader">
        <l-quantum size="50" speed="1.75" color="#219ebc"></l-quantum>
      </div>
    );
  } else {
    return (
      <button className="record" onClick={props.toggle}>
        START
      </button>
    );
  }
}

function AssessmentDropdown(props) {
  const handleChange = (event) => {
    props.setassessmentId(parseInt(event.target.value));
  };
  return (
    <select className="select-module" value={props.assessmentId} onChange={handleChange}>
      <option value={1}>Module 1</option>
      <option value={2}>Module 2</option>
      <option value={3}>Module 3</option>
      <option value={4}>Module 4</option>
    </select>
  );
}

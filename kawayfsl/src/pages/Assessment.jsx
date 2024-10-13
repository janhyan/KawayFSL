import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "semantic-ui-react";
import { AuthContext } from "../auth/authContext.jsx";
import { useContext } from "react";
import axios from "axios";
import Navbar from "../../Components/Navbar.jsx";
import ModuleHeader from "../../Components/ModuleHeader.jsx";
import EnableHolistic from "../../MediaPipe/EnableHolistic.jsx";
import EnableStatic from "../../MediaPipe/EnableStatic.jsx";
import "./css/Practice.css";

// Main exported page
export default function Assessment() {
  const { user } = useContext(AuthContext);

  const location = useLocation();
  const contentData = location.state;

  // Set answer and counter states
  const [answer, setAnswers] = React.useState([]);
  const currentAnswer = React.useRef();
  const [counter, setCounter] = React.useState(3);
  const [attempt, setAttempt] = React.useState(1);

  // Set states and ref for triggering certain functions
  const holisticRef = React.useRef(null);
  const toggleTracking = React.useRef(false); // For toggling if tracking starts
  const [isCount, setIsCount] = React.useState(false); // For triggering countdown when tracking starts
  const [isLoading, setIsLoading] = React.useState(false);
  const counterRef = React.useRef(counter);
  const isCounterRef = React.useRef(false);

  answer.map((currentUserAnswer) => {
    currentAnswer.current = currentUserAnswer;
  });

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

  // Inside Assessment component
  React.useEffect(() => {
    const isCorrectAnswer = checkResult(
      currentAnswer.current,
      contentData.answers
    );
    // if (isCorrectAnswer) {
    //   setIsLoading(false); // Update the loading state after rendering
    // }
  }, [currentAnswer.current, contentData.answers]);

  // Takes camera and holistic objects from EnableHolistic or EnableStatic depending on the lesson
  function handleEnableHolistic() {
    setIsLoading(true);
    holisticRef.current =
      contentData.assessment_id === 1
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
            contentData.assessment_id,
            setIsLoading
          );
  }

  function toggleRecord() {
    setIsCount((prevCount) => !prevCount);
    isCounterRef.current = true;
    setIsLoading(true);

    if (counter === 0) {
      setCounter((prevCounter) => prevCounter + 3);
      setAttempt((prevAttempt) => prevAttempt + 1);
    }
  }

  return (
    <div id="page-container">
      <Navbar />
      <MainBody
        user={user?.sub}
        enable={handleEnableHolistic}
        toggle={toggleRecord}
        answers={answer}
        lesson={contentData.lesson_id}
        module={contentData.module_id}
        subtopic={contentData.lesson_title}
        dbAnswer={contentData.answers}
        contentData={contentData}
        counter={counter}
        currentUserAnswer={currentAnswer.current}
        attempt={attempt}
        holisticRef={holisticRef}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    </div>
  );
}

// Renders right side of the page
function MainBody(props) {
  return (
    <main id="body-container" style={{ paddingRight: "0px" }}>
      <ModuleHeader module={props.module} subtopic={props.subtopic} />
      <div className="main-container">
        <div className="left-body">
          <div className="video-container">
            <video className="video" autoPlay playsInline />
            <canvas className="output_canvas"></canvas>
          </div>
          <div className="buttons-container">
            <UserButton
              userAnswer={props.currentUserAnswer}
              dbAnswer={props.dbAnswer}
              toggle={props.toggle}
              contentData={props.contentData}
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
            <h3 className="attempt-counter">Attempt: {props.attempt}</h3>
          </div>
        </div>
        <div className="right-body">
          {props.answers.map((answer, index) => (
            <Answers
              userAnswer={answer}
              dbAnswer={props.dbAnswer}
              key={index}
              answer={answer}
            />
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

// Check if result is correct
function checkResult(userAnswer, dbAnswer) {
  if (userAnswer == dbAnswer) {
    return true;
  } else {
    return false;
  }
}

function UserButton(props) {
  React.useEffect(() => {
    if (checkResult(props.userAnswer, props.dbAnswer)) {
      unlockNextLesson(props.module, props.lesson, props.user); // Trigger API when result is true
    }
  }, [props.userAnswer, props.dbAnswer]); // Re-run when answers change

  const isCorrectAnswer = checkResult(props.userAnswer, props.dbAnswer);
  console.log("Loading state:", props.isLoading);

  if (isCorrectAnswer) {
    return (
      <div className="button-container">
        <Button
          className="next-lesson"
          as={Link}
          to="/lessons"
          state={props.contentData}
        >
          Complete
        </Button>
      </div>
    );
  } else if (props.attempt === 3 && props.answer.length === 3) {
    return (
      <div className="button-container">
        <Button
          className="review-lesson"
          as={Link}
          to="/lesson-content"
          state={props.contentData}
        >
          Review Again
        </Button>
      </div>
    );
  } else if (!props.holisticRef.current) {
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

function unlockNextLesson(module_id, lesson_id, user) {
  axios
    .put(
      `https://server-node-lb-285857511.ap-northeast-1.elb.amazonaws.com/v1/unlock/${module_id}/${lesson_id}?user=${user}`
      // `http://localhost:6868/v1/unlock/${module_id}/${lesson_id}?user=${user}`
    )
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
}

import { useLocation } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import UserHeader from "../../Components/UserHeader";
import { AuthContext } from "../auth/authContext";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./css/Lessons.css";

export default function Lessons() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const moduleData = location.state;

  const [fetchedLessons, setFetchedLessons] = useState([]);

  // Fetch modules on component mount
  useEffect(() => {
    if (user?.sub) { // Wait for user.sub to be initialized
      getLessons(moduleData.module_id);
    }
  }, [user, moduleData.module_id]); // Add user and module_id to dependencies

  const getLessons = (module_id) => {
    axios
      .get(
        `https://server-node-lb-285857511.ap-northeast-1.elb.amazonaws.com/v1/${module_id}/lessons`,
        { params: { user: user?.sub } }
      )
      // .get(`http://localhost:6868/v1/${module_id}/lessons`, { params: { user: user?.sub } })
      .then((response) => {
        setFetchedLessons(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div id="page-container">
      <Navbar />
      <LessonList user={user?.given_name} lessons={fetchedLessons} />
    </div>
  );
}

function LessonList(props) {
  return (
    <div id="body-container">
      <UserHeader
        greetings={"Choose your lesson below."}
        username={props.user}
      />
      <div className="lessons-list">
        <LessonsCard lessons={props.lessons} />
      </div>
    </div>
  );
}

function LessonsCard(props) {
  return (
    <div className="lessons-container">
      {props.lessons.map((lesson) =>
        lesson.status ? (
          <UnlockedLesson lesson={lesson} key={lesson.lesson_id} />
        ) : (
          <LockedLesson lesson={lesson} key={lesson.lesson_id} />
        )
      )}
    </div>
  );
}

function UnlockedLesson(props) {
  return (
    <div className="unlocked-lesson-card">
      <h3>
        <Link
          className="lesson-title"
          to="/lesson-content"
          state={props.lesson}
        >
          {props.lesson.lesson_title}
        </Link>
      </h3>
      <p>{props.lesson.lesson_description}</p>
    </div>
  );
}

function LockedLesson(props) {
  return (
    <div className="locked-lesson-card">
      <h3>
        <Link
          className="disabled-title"
          to="/"
          onClick={(event) => event.preventDefault()}
        >
          {props.lesson.lesson_title}
        </Link>
      </h3>
      <p>{props.lesson.lesson_description}</p>
    </div>
  );
}

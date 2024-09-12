import { useLocation } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import UserHeader from "../../Components/UserHeader";
import { AuthContext } from "../auth/authContext";
import { useContext, useState, useEffect } from "react";
import axios from "axios";

export default function Lessons() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const moduleData = location.state;

  const [fetchedLessons, setFetchedLessons] = useState([]);

  // Fetch modules on component mount
  useEffect(() => {
    getLessons(moduleData.module_id);
  }, []);

  const getLessons = (module_id) => {
    axios
      .get(`http://localhost:8080/v1/${module_id}/lessons`)
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
      <LessonList module={moduleData} user={user?.given_name} lessons={fetchedLessons} />
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
        <LessonsCard lessons={props.lessons}/>
      </div>
    </div>
  );
}

function LessonsCard(props) {
    return (
        <div className="lessons-container">
            {props.lessons.map((lesson) => (
                <div key={lesson.lesson_id} className="lesson-card">
                    <h3>{lesson.lesson_title}</h3>
                    <p>{lesson.lesson_description}</p>
                </div>
            ))}
        </div>
    )
}

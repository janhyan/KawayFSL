import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function LessonCard(props) {
    const [lessonData, setLessonData] = useState(null);
  
    useEffect(() => {
      // Fetch last three lessons available to user
      getLessons(props.user).then((data) => {
        setLessonData(data);
      });
    }, [props.user]);
  
    if (!lessonData) {
      return (
        <div className="home-loader">
          <l-quantum size="50" speed="1.75" color="#219ebc"></l-quantum>
        </div>
      );
    } else {
      // LISTS THE ITEMS INSIDE
      let items = lessonData.map((item) => {
        return (
          <div className="card" key={item.lesson_id}>
            <Link className="card title" to="/lesson-content" state={item} >
              Subtopic {item.lesson_order}: {item.lesson_title}
            </Link>
            <p className="card-description">{item.lesson_content}</p>
          </div>
        );
      });
  
      return (
        <div className="subtopic container card">
          <h2>Your lessons</h2>
          <div className="cards-container">{items}</div>
        </div>
      );
    }
  }
  
  function getLessons(user) {
    return axios
      .get("https://alb.kawayfsl.com/v1/latest-lessons", {
        params: { user: user?.sub },
      })
      .then((response) => {
        return response.data; 
      })
      .catch((error) => {
        console.error(error);
      });
  }
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../App.css";
import Navbar from "../../Components/Navbar.jsx";
import HomeContent from "../../Components/HomeContent.jsx";
import { AuthContext } from "../auth/authContext.jsx";
import { useContext } from "react";
import axios from "axios"

export default function Home() {
  const { user } = useContext(AuthContext);
  
  pingStatic([0,1,2]);
  pingHolistic([0, 1, 2], 1);

  if (!user) {
    return <Navigate to="/signin" />;
  } else {
    return (
      <div id="page-container">
        <Navbar />
        <HomeContent />
      </div>
    );
  }
}

function pingStatic(sequence) {
  axios
    .post(
      "https://kb02bv2ra8.execute-api.ap-northeast-1.amazonaws.com/stage/static",
      sequence
    )
    .then((response) => {
      setAnswers((prevAnswer) => [...prevAnswer, response.data]);
    })
    .catch((error) => {
      console.error("Error sending sequence to API:", error);
    });
}

function pingHolistic(sequence, assessment_id) {
  axios
    .post(
      "https://kb02bv2ra8.execute-api.ap-northeast-1.amazonaws.com/stage/",
      { sequence, assessment_id } // Send both sequence and assessment_id in the body
    )
    .then((response) => {
      setAnswers((prevAnswer) => [...prevAnswer, response.data]);
    })
    .catch((error) => {
      console.error("Error sending sequence to API:", error);
    });
}


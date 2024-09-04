import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../App.css";
import Navbar from "../../Components/Navbar.jsx";
import HomeContent from "../../Components/HomeContent.jsx";
import { AuthContext } from "../auth/authContext.jsx";
import { useContext } from "react";

export default function Home() {
  const { user } = useContext(AuthContext);

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

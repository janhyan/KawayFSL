import React from "react";
import { Link } from "react-router-dom";
import "./css/UserAuth.css";
import SignIn from "../../Components/SignIn";
import SignUp from "../../Components/SignUp";

export default function UserAuth() {
  const [isSignUp, setIsSignUp] = React.useState(true);

  return (
    <main>
      <div className="signin-container">
        <h1 className="kaway-title">
          Kaway<span>.</span>
        </h1>
        <div className="img-container">
          <img
            className="img-login"
            src="/login.gif"
            alt="Gif of students"
          />
        </div>
        {(!isSignUp) ? <SignIn setIsSignUp={setIsSignUp} /> : <SignUp setIsSignUp={setIsSignUp} />}
      </div>
    </main>
  );
}

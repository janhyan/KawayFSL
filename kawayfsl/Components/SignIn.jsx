import { userSignIn } from "../src/auth/userSignIn";
import { useState } from "react";

import Home from "../src/pages/Home";

export default function SignIn(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await userSignIn(email, password);
      setSuccess(true);
    } catch (err) {
      console.log(err);
      setError(err.message);
    }
  };

  if (success) {
    return (
      <Home />
    )
  }

  return (
    <div className="details-container">
      <div className="greetings">
        <h1 className="greetings welcome">Welcome Back!</h1>
        <h2 className="greetings details">Please enter login details below</h2>
      </div>
      <div className="forms-container">
        <fieldset>
          <form onSubmit={onSubmit}>
            <label htmlFor="user-email">E-mail</label>
            <input
              type="email"
              name="e-mail"
              id="user-email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <label htmlFor="user-password">Password</label>
            <input
              type="password"
              name="password"
              id="user-password"
              placeholder="********"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <p id="forgot-password">
              <a href="http://">Forgot password?</a>
            </p>
            <p className="result-message" style={{ color: "red" }}>
              {error}
            </p>
            <button className="submit-button" type="submit">
              Sign in
            </button>
          </form>
        </fieldset>
        <div className="signin-options">
          <p className="sign-up-text">
            Don't have an account?{" "}
            <a
              onClick={() => props.setIsSignUp((prev) => !prev)}
              className="sign-up"
            >
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}



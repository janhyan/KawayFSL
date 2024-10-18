import { useState, useContext } from "react";
import { Navigate, Link } from "react-router-dom";
import { AuthContext } from "../src/auth/authContext";
import { CognitoUser } from "amazon-cognito-identity-js";
import { userPool } from "../src/auth/UserPool";
import ConfirmPassword from "./ConfirmPassword";

export default function SignIn(props) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setLoading] = useState(false);

  // Check if user is logged in, redirect to home page
  const { user } = useContext(AuthContext);
  if (user) {
    return <Navigate to="/" />;
  }

  const onSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();
    setError("");

    try {
      await forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    }
  };

  if (success) {
    return <ConfirmPassword />;
  }

  return (
    <div className="details-container">
      <div className="greetings">
        <h1 className="greetings welcome">Forgot your password?</h1>
        <h2 className="greetings details">
          Please enter your email below to reset your password
        </h2>
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
            <p className="result-message" style={{ color: "red" }}>
              {error}
            </p>
            {!isLoading ? (
              <button className="submit-button" type="submit">
                {" "}
                Sign in{" "}
              </button>
            ) : (
              <div className="auth-loader">
                <l-quantum size="40" speed="1.75" color="azure"></l-quantum>
              </div>
            )}
          </form>
        </fieldset>
        <div className="signin-options">
          <p className="sign-up-text">
            Ready to sign in?{" "}
            <Link to="/signin" className="sign-up">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function forgotPassword(email) {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    cognitoUser.forgotPassword({
      onSuccess: (data) => {
        resolve(data);
      },
      onFailure: (err) => {
        reject(err);
      },
    });
  });
}

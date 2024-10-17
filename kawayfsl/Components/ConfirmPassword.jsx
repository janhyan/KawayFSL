import { useState, useContext } from "react";
import { Navigate, Link } from "react-router-dom";
import { AuthContext } from "../src/auth/authContext";
import { CognitoUser } from "amazon-cognito-identity-js";
import { userPool } from "../src/auth/UserPool";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
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
      await confirmPassword(email, code, newPassword);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    }
  };

  if (success) {
    return (
      <div
        className="signup-container"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <div className="greetings">
          <h1 className="greetings welcome">Password reset!</h1>
          <h2 className="greetings details">
            You can now log in again to your KawayFSL account.
          </h2>
          <p className="sign-up-text">
            Ready to sign in?{" "}
            <Link to="/signin" className="sign-up">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="signup-container" style={{ display: "flex" }}>
      <div className="greetings">
        <h1 className="greetings welcome">Reset your password</h1>
        <h2 className="greetings details">
          Please check your email for the confirmation code.
        </h2>
        <form onSubmit={onSubmit}>
          <label htmlFor="user-email">E-mail</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <label htmlFor="user-code">Confirmation Code</label>
          <input
            type="text"
            name="code"
            value={code}
            onChange={(event) => setCode(event.target.value)}
          />
          <label htmlFor="user-code">New Password</label>
          <input
            type="password"
            name="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
          />
           {!isLoading ? (
              <button className="submit-button" type="submit">
                {" "}
                Sign in{" "}
              </button>
            ) : (
              <div className="auth-loader">
                <l-quantum size="100" speed="1.75" color="#219ebc"></l-quantum>
              </div>
            )}
        </form>
        <p className="result-message" style={{ color: "red" }}>
          {error}
        </p>
        <p className="sign-up-text">
          Ready to sign in?{" "}
          <Link to="/signin" className="sign-up">
              Sign In
            </Link>
        </p>
      </div>
    </div>
  );
}

function confirmPassword(email, code, newPassword) {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    cognitoUser.confirmPassword(code, newPassword, {
      onSuccess: () => {
        resolve();
      },
      onFailure: (err) => {
        reject(err);
      },
    });
  });
}

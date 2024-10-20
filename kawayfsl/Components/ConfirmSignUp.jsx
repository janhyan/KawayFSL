import { useState } from "react";
import { userPool } from "../src/auth/UserPool";
import { CognitoUser } from "amazon-cognito-identity-js";

export default function ConfirmSignUp(props) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();
    setError("");

    try {
      await confirmSignUp(email, code);
      setSuccess(true);
    } catch (err) {
      console.log(err);
      setError(err.message);
    }
  };

  if (success) {
    return (
      <div className="signup-container" style={{ display: "flex", justifyContent: "center" }}>
        <div className="greetings">
          <h1 className="greetings welcome">Account Verified!</h1>
          <h2 className="greetings details">
            You are now an official user of KawayFSL.
          </h2>
          <p className="sign-up-text">
            Ready to sign in?{" "}
            <a
              onClick={() => props.setIsSignUp((prev) => !prev)}
              className="sign-up"
            >
              Sign In
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="signup-container" style={{ display: "flex" }}>
      <div className="greetings">
        <h1 className="greetings welcome">Sign Up successful!</h1>
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
        <p className="result-message" style={{ color: "red" }}>
          {error}
        </p>
        <p className="sign-up-text">
          Account verified?{" "}
          <a
            onClick={() => props.setIsSignUp((prev) => !prev)}
            className="sign-up"
          >
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}

function confirmSignUp(email, code) {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    cognitoUser.confirmRegistration(code, true, function (err, result) {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}

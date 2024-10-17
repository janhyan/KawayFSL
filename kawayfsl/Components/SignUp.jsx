import React from "react";
import userSignUp from "../src/auth/userSignUp";
import ConfirmSignUp from "./ConfirmSignUp";
import "ldrs/quantum";

export default function SignUp(props) {
  const [password, setPassword] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [middleName, setMiddleName] = React.useState("");
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState(false);
  const [isLoading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();
    setError("");

    try {
      await userSignUp(email, password, firstName, middleName, lastName);
      setSuccess(true);
    } catch (err) {
      console.log(err);
      setError(err.message);
    }
  };

  if (success) {
    return (
      <ConfirmSignUp setIsSignUp={props.setIsSignUp} />
    )
  }

  return (
    <div className="signup-container">
      <div className="greetings">
        <h1 className="greetings welcome">Create a KawayFSL account</h1>
        <h2 className="greetings details">Get started on your FSL journey!</h2>
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
            <label htmlFor="user-lastname">Last Name</label>
            <input
              type="text"
              name="last-name"
              id="last-name"
              placeholder="Dela Cruz"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
            />
            <label htmlFor="user-firstname">First Name</label>
            <input
              type="text"
              name="firs-tname"
              id="first-name"
              placeholder="Juan"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
            />
            <label htmlFor="user-middlename">Middle Name</label>
            <input
              type="text"
              name="middle-name"
              id="middle-name"
              placeholder="Gomez"
              value={middleName}
              onChange={(event) => setMiddleName(event.target.value)}
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
            Already have an account?{" "}
            <a
              onClick={() => props.setIsSignUp((prev) => !prev)}
              className="sign-up"
            >
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}


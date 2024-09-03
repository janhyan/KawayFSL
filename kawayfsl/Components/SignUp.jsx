import React from "react";
import { userPool } from "../src/auth/UserPool";

export default function SignUp(props) {
  const [password, setPassword] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [middleName, setMiddleName] = React.useState("");
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState(false);

  const onSubmit = async (event) => {
    console.log("test");
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
    console.log("test2");
    return (
      <div className="signup-container" style={{ display: "flex" }}>
        <div className="greetings">
          <h1 className="greetings welcome">SignUp successful!</h1>
          <h2 className="greetings details">
            Please check your email for the confirmation code.
          </h2>
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
            <button className="submit-button" type="submit">
              Sign Up
            </button>
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

function userSignUp(email, password, firstName, middleName, lastName) {
  return new Promise((resolve, reject) => {
    userPool.signUp(
      email,
      password,
      [
        {
          Name: "family_name",
          Value: lastName,
        },
        {
          Name: "given_name",
          Value: firstName,
        },
        {
          Name: "middle_name",
          Value: middleName,
        },
      ],
      null,
      (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result.user);
      }
    );
  });
}

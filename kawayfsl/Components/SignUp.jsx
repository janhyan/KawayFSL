export default function SignUp(props) {
    return (
        <div className="signup-container">
        <div className="greetings">
          <h1 className="greetings welcome">Create a KawayFSL account</h1>
          <h2 className="greetings details">
            Get started on your FSL journey!
          </h2>
        </div>
        <div className="forms-container">
          <fieldset>
            <form action="PLACEHOLDER.COM/PATH" method="post">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                name="username"
                id="username"
                placeholder="JDCruz"
              />
              <label htmlFor="user-email">E-mail</label>
              <input
                type="email"
                name="e-mail"
                id="user-email"
                placeholder="example@gmail.com"
              />
              <label htmlFor="user-lastname">Last Name</label>
              <input
                type="text"
                name="last-name"
                id="last-name"
                placeholder="Dela Cruz"
              />
              <label htmlFor="user-firstname">First Name</label>
              <input
                type="string"
                name="firs-tname"
                id="first-name"
                placeholder="Juan"
              />
              <label htmlFor="user-middlename">Middle Name</label>
              <input
                type="string"
                name="middle-name"
                id="middle-name"
                placeholder="Gomez"
              />
              <label htmlFor="user-password">Password</label>
              <input
                type="password"
                name="password"
                id="user-password"
                placeholder="********"
              />
              <button className="submit-button" type="submit">Sign Up</button>
            </form>
          </fieldset>
          <div className="signin-options">
            <p className="sign-up-text">
              Already have an account?{" "}
              <a onClick={() => props.setIsSignUp((prev) => !prev)} className="sign-up">
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>
    )
}
export default function SignIn() {
    return (
        <div className="details-container">
        <div className="greetings">
          <h1 className="greetings welcome">Welcome Back!</h1>
          <h2 className="greetings details">
            Please enter login details below
          </h2>
        </div>
        <div className="forms-container">
          <fieldset>
            <form action="PLACEHOLDER.COM/PATH" method="post">
              <label htmlFor="user-email">E-mail</label>
              <input
                type="email"
                name="e-mail"
                id="user-email"
                placeholder="example@gmail.com"
              />
              <label htmlFor="user-password">Password</label>
              <input
                type="password"
                name="password"
                id="user-password"
                placeholder="********"
              />
              <p id="forgot-password">
                <a href="http://">
                  Forgot password?
                </a>
              </p>
              <button type="submit">Sign in</button>
            </form>
          </fieldset>
          <div className="signin-options">
            <p className="sign-up-text">
              Don't have an account?{" "}
              <a href="signup.html" className="sign-up">
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    )
}
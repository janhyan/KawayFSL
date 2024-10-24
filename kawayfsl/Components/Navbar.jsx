import { Button } from "semantic-ui-react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../src/auth/authContext";

export default function Navbar() {
  const { user, signOut } = useContext(AuthContext);

  console.log(user);

  const navigate = useNavigate();
  const goSignOut = () => {
    signOut();
    navigate("/signin");
  };

  return (
    <nav className="side-nav container">
      <div className="side-nav header">
        <h1 id="side-nav-title" href="#HOME">
          Kaway<b className="title-period">.</b>
        </h1>
      </div>
      <div className="side-nav contents">
        <Button className="home buttons" as={Link} to="/">
          Home
        </Button>
        <Button className="lessons buttons " as={Link} to="/modules">
          Lessons
        </Button>
        <Button className="practice buttons" as={Link} to="/practice">
          Practice
        </Button>
        <Button className="settings buttons" as={Link} to="/settings">
          Settings
        </Button>
      </div>
      <div className="side-nav footer">
        <div className="heading">
          <div className="avatar">
            <img className="user-img" src="/intro-img.png" alt="User image" />
          </div>
          <div className="user-details">
            <p className="username">{user?.given_name}</p>
            <p className="role">Admin</p>
          </div>
          <div className="footer-toggle">
            <input
              type="checkbox"
              name="footer-checkbox"
              id="footer-caret"
              onClick={slideFooter}
            />
            <label htmlFor="footer-caret" className="slide-icon" />
          </div>
        </div>
        <div className="footer content">
          <p>
            Name: {user?.given_name} {user?.family_name}
            <br />
            E-mail: {user?.email}
          </p>
          <Button className="signout buttons" onClick={() => goSignOut()}>
            Sign Out
          </Button>
        </div>
      </div>
    </nav>
  );
}

/* Function to slide the side-nav footer */
function slideFooter() {
  const footerToggle = document.getElementById("footer-caret");
  const footer = document.querySelector(".side-nav.footer");

  let id = null;
  let initialUp = -60;
  let initialDown = 0;
  clearInterval(id);

  if (footerToggle.checked == true) {
    id = setInterval(slideUp, 10);
  } else {
    id = setInterval(slideDown, 10);
  }

  function slideUp() {
    if (initialUp == 0) {
      clearInterval(id);
    } else {
      initialUp++;
      footer.style.bottom = initialUp + "%";
    }
  }

  function slideDown() {
    if (initialDown == -60) {
      clearInterval(id);
    } else {
      initialDown--;
      footer.style.bottom = initialDown + "%";
    }
  }
}

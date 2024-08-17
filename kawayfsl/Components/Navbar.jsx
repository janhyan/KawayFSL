export default function Navbar() {
    return (
        <nav className="side-nav container">
          <div className="side-nav header">
            <h1 id="side-nav-title" href="#HOME">
              Kaway<b className="title-period">.</b>
            </h1>
          </div>
          <div className="side-nav contents">
            <button className="home">Home</button>
            <button className="lessons">Lessons</button>
            <button className="practice">Practice</button>
            <button className="settings">Settings</button>
          </div>
          <div className="side-nav footer">
            <div className="heading">
              <div className="avatar">
                <img className="user-img" src="assets/intro-img.png" alt="User image" />
              </div>
              <div className="user-details">
                <p className="username">User</p>
                <p className="role">Admin</p>
              </div>
              <div className="footer-toggle">
                <input type="checkbox" name="footer-checkbox" id="footer-caret" onClick={slideFooter} />
                <label htmlFor="footer-caret" className="slide-icon" />
              </div>
            </div>
            <div className="footer content">
              <p>
                ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          </div>
        </nav>
    )
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

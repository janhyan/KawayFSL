import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';


const root = ReactDOM.createRoot(document.getElementById('root'));

function Navbar() {
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
              <input type="checkbox" name="footer-checkbox" id="footer-caret" onclick="slideFooter()" />
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

root.render(
  <div>
    <Navbar />
  </div>,
)
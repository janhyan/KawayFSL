import { AuthContext } from "../src/auth/authContext";
import { useContext } from "react";
import DisplayNotif from "./DisplayNotif";

export default function UserHeader(props) {
  const { user } = useContext(AuthContext);

  return (
    <header className="title-header">
      <div className="header-text">
        <h2>
          Hi <span className="user">{props.username}</span>,
        </h2>
        <h1>{props.greetings}</h1>
      </div>
      <div className="notif-container">
        <button
          className="notif-button"
          onClick={(e) => {
            e.preventDefault();
            location.href = "#popup-main";
          }}
        />
      </div>

      <div id="popup-main" className="overlay">
        <div className="popup">
          <DisplayNotif user={user} />
        </div>
      </div>
    </header>
  );
}


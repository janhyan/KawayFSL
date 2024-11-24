import { AuthContext } from "../src/auth/authContext";
import { useContext, useState } from "react";
import DisplayNotif from "./DisplayNotif";

export default function UserHeader(props) {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);

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
        {!(notifications.length === 0) ? (
          <div className="notif-marker">{notifications.length}</div>
        ) : null}
      </div>

      <div id="popup-main" className="overlay">
        <div className="popup">
          <DisplayNotif
            user={user}
            notifications={notifications}
            setNotifications={setNotifications}
          />
        </div>
      </div>
    </header>
  );
}

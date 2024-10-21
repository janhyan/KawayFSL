import axios from "axios";
import { AuthContext } from "../src/auth/authContext";
import { useContext, useEffect, useState } from "react";

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

async function getNotif(user) {
  if (user) {
    try {
      const response = await axios.get(
        "http://localhost:6868/v1/notifications",
        {
          params: { user: user.sub },
        }
      );
      return response.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  return [];
}

function DisplayNotif(props) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const notif = await getNotif(props.user);
        console.log("notif", notif);
        setNotifications(notif);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [props.user]);

  if (loading) {
    return <l-quantum size="50" speed="1.75" color="#219ebc"></l-quantum>;
  }

  // Render the notification contents
  if (!loading) {
    console.log(notifications);
    return (
      <div className="notif-menu-container">
        {notifications?.map((notifMsg) => (
          <div className="notif-content" key={notifMsg.notification_id}>
            <p>{notifMsg.notif_message}</p>
            <button
              className="close"
              onClick={(e) => {
                e.preventDefault();
                location.href = "#";
              }}
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    );
  } else {
    return (
      <div className="notif-menu-container">
        <div className="notif-content">
          <p>No notifications available.</p>
          <button
            className="close"
            onClick={(e) => {
              e.preventDefault();
              location.href = "#";
            }}
          >
            &times;
          </button>
        </div>
      </div>
    );
  }
}

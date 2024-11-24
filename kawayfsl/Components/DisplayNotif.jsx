import { useEffect, useState } from "react";
import axios from "axios";

export default function DisplayNotif(props) {
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const notif = await getNotif(props.user);
      props.setNotifications(notif);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [props.user]);

  if (loading) {
    return (
      <div className="notif-menu-container">
        <l-quantum size="50" speed="1.75" color="#219ebc"></l-quantum>
        <button
          id="close-popup"
          onClick={(e) => {
            e.preventDefault();
            location.href = "#";
          }}
        >
          &times;
        </button>
      </div>
    );
  }

  if (!loading) {
    return (
      <div className="notif-menu-container">
        <button
          id="close-popup"
          onClick={(e) => {
            e.preventDefault();
            location.href = "#";
          }}
        >
          &times;
        </button>
        {props.notifications?.map((notifMsg, i, arr) => (
          <div className="notif-content" key={notifMsg.notification_id}>
            <p>{notifMsg.notif_message}</p>
            <button
              className="close"
              onClick={() => {
                updateNotif(
                  props.user,
                  notifMsg.notification_id,
                  fetchNotifications
                );
                setLoading(true);
              }}
            >
              &#10003;
            </button>
            {!(i + 1 === arr.length) ? <hr className="break" /> : null}
          </div>
        ))}
      </div>
    );
  } else {
    return (
      <div className="notif-menu-container">
        <div className="notif-content">
          <p>No notifications available.</p>
        </div>
      </div>
    );
  }
}

async function getNotif(user) {
  if (user) {
    try {
      const response = await axios.get(
        "https://alb.kawayfsl.com/v1/notifications",
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

function updateNotif(user, notification_id, fetchNotifications) {
  if (user.sub) {
    axios
      .patch(`https://alb.kawayfsl.com/v1/notifications/${notification_id}`, {
        user: user.sub,
      })
      .then((response) => {
        console.log(response.data);
        fetchNotifications();
      })
      .catch((error) => {
        console.error(error);
      });
  }
}

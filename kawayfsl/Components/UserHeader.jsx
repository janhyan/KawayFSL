import axios from "axios";

export default function UserHeader(props) {
    return (
      <header className="title-header">
        <div className="header-text">
          <h2>
            Hi <span className="user">{props.username}</span>,
          </h2>
          <h1>{props.greetings}</h1>
        </div>
        <div className="notif-container">
          <button className="notif-button" onClick={} />
        </div>
      </header>
    );
  }


function getNotif(user) {
  if (user) {
    return axios
    // .get("https://alb.kawayfsl.com/v1/notifications", {params: {user: user?.sub}})
    .get("http://localhost:8080/v1/notifications", {params: {user: user?.sub}})
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error(error);
    });
  }
} 
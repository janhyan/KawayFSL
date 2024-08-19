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
          <button className="notif-button" />
        </div>
      </header>
    );
  }
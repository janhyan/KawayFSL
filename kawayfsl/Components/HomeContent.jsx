import user from "../src/data/user";
import moduleOne from "../src/data/moduleOne";
import announcements from "../src/data/announcements";

export default function HomeContent() {
  return (
    <main id="body-container">
      <UserHeader username={user[0].username} />
      <div className="content-container">
        <MainCard
          subtopic={moduleOne[0].subtopic}
          description={moduleOne[0].description}
        />
        <AnnouncementCard />
        <LessonCard />
        <ToDoCard />
      </div>
    </main>
  );
}

function UserHeader(props) {
  return (
    <header className="title-header">
      <div className="header-text">
        <h2>
          Hi <span className="user">{props.username}</span>,
        </h2>
        <h1>What will you learn today?</h1>
      </div>
      <div className="notif-container">
        <button className="notif-button" />
      </div>
    </header>
  );
}

function MainCard(props) {
  return (
    <div className="main container card">
      <div className="main-content">
        <div className="main-content-text">
          <h2>{props.subtopic}</h2>
          <p>{props.description}</p>
          <button className="learn-now">Learn Now</button>
        </div>
        <img src={"../src/assets/home.gif"} alt="GIF on Home Page" />
      </div>
    </div>
  );
}

function AnnouncementCard() {
  // LISTS THE ITEMS INSIDE
  let items = announcements.map((item) => {
    return (
      <li key={item.id}>
        {item.username}: {item.announcement}
      </li>
    );
  });

  return (
    <div className="announcement container card">
      <h2 className="announcement-text">Announcement</h2>
      <div className="announcement-content">
        <ul>{items}</ul>
      </div>
    </div>
  );
}

function LessonCard() {
  // LISTS THE ITEMS INSIDE
  let items = moduleOne.map((item) => {
    return (
      <div className="card" key={item.id}>
        <h3 className="card title">Subtopic {item.id}</h3>
        <p className="card-description">{item.description}</p>
      </div>
    );
  });

  return (
    <div className="subtopic container card">
      <h2>Your lessons</h2>
      <div className="cards-container">{items}</div>
    </div>
  );
}

function ToDoCard() {
  return (
    <div className="todo card">
      <h2 className="todo-title">To-do</h2>
      <ul>
        <li>No items to display</li>
        <li>No items to display</li>
      </ul>
    </div>
  );
}

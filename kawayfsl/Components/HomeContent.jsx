import AnnouncementCard from "./AnnouncementCard";
import ToDoCard from "./ToDoCard";
import UserHeader from "./UserHeader";
import MainCard from "./MainCard";
import LessonCard from "./LessonsCard";
import { useContext } from "react";
import { AuthContext } from "../src/auth/authContext";

export default function HomeContent() {
  const { user } = useContext(AuthContext);

  return (
    <main id="body-container">
      <UserHeader
        username={user.given_name}
        greetings="What will you learn today?"
      />
      <div className="content-container">
        <MainCard user={user} />
        <AnnouncementCard />
        <LessonCard user={user} />
        <ToDoCard user={user} />
      </div>
    </main>
  );
}


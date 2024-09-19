import Navbar from "../../Components/Navbar";
import UserHeader from "../../Components/UserHeader";
import { AuthContext } from "../auth/authContext";
import { useContext } from "react";

export default function Content() {
    const { user } = useContext(AuthContext);
  return (
    <div id="page-container">
      <Navbar />
      <ContentBody user={user} />
    </div>
  );
}

function ContentBody(props) {
  return (
    <main id="body-container">
      <div className="content">
        <UserHeader
          greetings={"Choose your lesson below."}
          username={props.user?.given_name}
        />
      </div>
    </main>
  );
}

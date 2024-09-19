import Navbar from "../../Components/Navbar";
import ModuleHeader from "../../Components/ModuleHeader";
import { AuthContext } from "../auth/authContext";
import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Content() {
    const location = useLocation();
    const contentData = location.state;
    const { user } = useContext(AuthContext);
  return (
    <div id="page-container">
      <Navbar />
      <ContentBody module={contentData.module_id} subtopic={contentData.lesson_title} />
    </div>
  );
}

function ContentBody(props) {
  return (
    <main id="body-container">
      <div className="content">
        <ModuleHeader
            module={props.module} subtopic={props.subtopic}
        />
      </div>
    </main>
  );
}

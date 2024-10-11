import Navbar from "../../Components/Navbar";
import ModuleHeader from "../../Components/ModuleHeader";
import { AuthContext } from "../auth/authContext";
import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import NextPageBtn from "../../Components/NextPageBtn";
import VideoPlayer from "../../Components/VideoPlayer";
import "./css/Content.css"

export default function Content() {
  const location = useLocation();
  const contentData = location.state;
  const { token } = useContext(AuthContext);

  return (
    <div id="page-container">
      <Navbar />
      <ContentBody
        module={contentData.module_id}
        lesson={contentData.answers}
        subtopic={contentData.lesson_title}
        description={contentData.lesson_content}
        state={contentData}
        token={token}
      />
    </div>
  );
}

function ContentBody(props) {
  return (
    <main id="body-container">
      <div className="content">
        <ModuleHeader module={props.module} subtopic={props.subtopic} />
        <VideoPlayer token={props.token} module={props.module} lesson={props.lesson} />
        <TextContent
          description={props.description}
          subtopic={props.subtopic}
        />
        <NextPageBtn page="/assessment" btnText="Practice Now" state={props.state}/>
      </div>
    </main>
  );
}

function TextContent(props) {
  return (
    <div className="lesson-text">
      <h3 className="content-title">{props.subtopic}</h3>
      <p className="content-body">{props.description}</p>
    </div>
  );
}

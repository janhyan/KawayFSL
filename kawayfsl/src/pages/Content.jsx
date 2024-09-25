import Navbar from "../../Components/Navbar";
import ModuleHeader from "../../Components/ModuleHeader";
import { AuthContext } from "../auth/authContext";
import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import NextPageBtn from "../../Components/NextPageBtn";
import "./css/Content.css"

export default function Content() {
  const location = useLocation();
  const contentData = location.state;
  const { user } = useContext(AuthContext);
  return (
    <div id="page-container">
      <Navbar />
      <ContentBody
        module={contentData.module_id}
        subtopic={contentData.lesson_title}
        video={contentData.video_url}
        description={contentData.lesson_content}
        state={contentData}
      />
    </div>
  );
}

function ContentBody(props) {
  return (
    <main id="body-container">
      <div className="content">
        <ModuleHeader module={props.module} subtopic={props.subtopic} />
        <VideoContent video={props.video} />
        <TextContent
          description={props.description}
          subtopic={props.subtopic}
        />
        <NextPageBtn page="/assessment" btnText="Practice Now" state={props.state}/>
      </div>
    </main>
  );
}

function VideoContent(props) {
  return <video src={props.video}></video>;
}

function TextContent(props) {
  return (
    <div className="lesson-text">
      <h3 className="content-title">{props.subtopic}</h3>
      <p className="content-body">{props.description}</p>
    </div>
  );
}
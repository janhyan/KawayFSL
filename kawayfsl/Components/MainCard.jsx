import { Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function MainCard(props) {
  const [moduleData, setModuleData] = useState(null);

  useEffect(() => {
    // Fetch module data asynchronously when the component mounts
    getModule(props.user).then((data) => {
      setModuleData(data);
    });
  }, [props.user]);

  if (!moduleData) {
    return (
      <div className="home-loader">
        <l-quantum size="50" speed="1.75" color="#219ebc"></l-quantum>
      </div>
    );
  }

  return (
    <div className="main container card">
      <div className="main-content">
        <div className="main-content-text">
          <h2>
            Module: {moduleData.module_order} {moduleData.module_title}
          </h2>
          <p>{moduleData.module_description}</p>
          <Button
            className="learn-now"
            as={Link}
            to="/lessons"
            state={moduleData}
          >
            Learn Now
          </Button>
        </div>
        <img src={"/home.gif"} alt="GIF on Home Page" />
      </div>
    </div>
  );
}

function getModule(user) {
  return axios
    .get("https://alb.kawayfsl.com/v1/latest-module", {
      params: { user: user?.sub },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error(error);
    });
}

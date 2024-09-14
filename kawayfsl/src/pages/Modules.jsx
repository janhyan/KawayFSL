import Navbar from "../../Components/Navbar";
import UserHeader from "../../Components/UserHeader";
import { AuthContext } from "../auth/authContext";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./css/Modules.css";

export default function Modules() {
  const { user } = useContext(AuthContext);
  const [fetchedModules, setFetchedModules] = useState([]); // Initialize state to store fetched modules

  // Fetch modules on component mount
  useEffect(() => {
    getModules();
  }, []);

  // Get data from the database
  const getModules = () => {
    axios
      .get("http://localhost:6868/v1/modules")
      .then((response) => {
        console.log(response.data);
        setFetchedModules(response.data); // Update state with fetched modules
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div id="page-container">
      <Navbar />
      <ModuleList user={user?.given_name} fetchedModules={fetchedModules} />
    </div>
  );
}

// Modules container for each module card
function ModuleList(props) {
  return (
    <main id="body-container">
      <UserHeader
        greetings={"What would you like to learn today?"}
        username={props.user}
      />
      <div className="modules">
        <ModulesCard fetchedData={props.fetchedModules} />
      </div>
    </main>
  );
}

// Maps all modules into cards
function ModulesCard(props) {
  if (!props.fetchedData || props.fetchedData.length === 0) {
    return <p>No modules available</p>; // Handle case where data is not available
  }

  // Map the fetched modules into cards
  return props.fetchedData.map((module) =>
    module.status ? (
      <UnlockedModule module={module} key={module.module_id} />
    ) : (
      <LockedModule module={module} key={module.module_id} />
    )
  );
}

function UnlockedModule(props) {
  return (
    <div key={props.module.module_id} className="unlocked-module-card">
      <h3>
        <Link className="module-title" to="/lessons" state={props.module}>
          {props.module.module_title}
        </Link>
      </h3>
      <p>{props.module.module_description}</p>
    </div>
  );
}

function LockedModule(props) {
  return (
    <div key={props.module.module_id} className="locked-module-card">
      <h3>
        <Link
          className="disabled-title"
          to="/lessons"
          onClick={(event) => event.preventDefault()}
        >
          {props.module.module_title}
        </Link>
      </h3>
      <p>{props.module.module_description}</p>
    </div>
  );
}
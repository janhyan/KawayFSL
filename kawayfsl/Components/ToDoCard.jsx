import { useState, useEffect } from "react";
import axios from "axios";

export default function ToDoCard(props) {
  const [tasks, setTasks] = useState([]);

  function getTasks(user) {
    axios
      .get("http://localhost:6868/v1/tasks", {
        params: {
          user: user,
        },
      })
      .then((res) => {
        if (Array.isArray(res.data)) {
          setTasks(res.data);
        } else {
          console.error("API response is not an array:", res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    getTasks(props.user.sub);
  }, [props.user.sub]);

  return (
    <div className="todo card">
      <h2 className="todo-title">To-do</h2>
      {tasks.length > 0 ? (
        <Task tasks={tasks} setTasks={setTasks} />
      ) : (
        <p>Add your tasks for today.</p>
      )}
    </div>
  );
}

function Task(props) {
  console.log(props.tasks);
  const checklist = props.tasks.map((task) => {
    return (
      <label className="task-container" key={task.task_id}>
        {task.task_message}
        <input
          type="checkbox"
          checked={task.status}
          onChange={() =>
            props.setTasks((prevTasks) =>
              prevTasks.map((t) =>
                t.id === task.id ? { ...t, status: !t.status } : t
              )
            )
          }
        />
        <span className="checkmark"></span>
      </label>
    );
  });

  return <div>{checklist}</div>;
}

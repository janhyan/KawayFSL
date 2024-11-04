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
        <Task
          tasks={tasks}
          setTasks={setTasks}
          user={props.user.sub}
          getTasks={getTasks}
        />
      ) : (
        <p>Add your tasks for today.</p>
      )}
    </div>
  );
}

function Task(props) {
  const [newTask, setNewTask] = useState("");

  const checklist = props.tasks.map((task) => {
    return (
      <div className="task-parent" key={task.task_id}>
        <label className="task-container">
          {task.task_message}
          <input
            type="checkbox"
            checked={task.status}
            onChange={() =>
              props.setTasks((prevTasks) =>
                prevTasks.map((t) =>
                  t.task_id === task.task_id ? { ...t, status: !t.status } : t
                )
              )
            }
          />
          <span className="checkmark"></span>
        </label>
        <button className="delete-task">&times;</button>
      </div>
    );
  });

  const addTask = () => {
    if (newTask.trim()) {
      axios
        .post("http://localhost:6868/v1/tasks", {
          user: props.user,
          task: newTask,
        })
        .then((res) => {
          console.log(res.data);
          props.getTasks(props.user);
        })
        .catch((err) => {
          console.log(err);
        });
      setNewTask(""); // Clear the input field
    }
  };

  return (
    <div>
      {checklist}
      <div className="input-task">
        <label htmlFor="new-task" className="input-label">
          New Task:
        </label>
        <input
          type="text"
          id="new-task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={addTask} className="input-task-button">
          Add Task
        </button>
      </div>
    </div>
  );
}

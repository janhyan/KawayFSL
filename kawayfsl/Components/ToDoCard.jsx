import { useState, useEffect } from "react";
import axios from "axios";

export default function ToDoCard(props) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const userId = props.user.sub;

  function getTasks(user) {
    axios
      .get("https://alb.kawayfsl.com/v1/tasks", {
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
    getTasks(userId);
  }, [userId]);

  const addTask = (userId) => {
    if (newTask.trim()) {
      axios
        .post("https://alb.kawayfsl.com/v1/tasks", {
          user: userId,
          task: newTask,
        })
        .then((res) => {
          console.log(res.data);
          getTasks(userId);
        })
        .catch((err) => {
          console.log(err);
        });
      setNewTask(""); // Clear the input field
    }
  };

  return (
    <div className="todo card">
      <h2 className="todo-title">To-do</h2>
      {tasks.length > 0 ? (
        <Task
          tasks={tasks}
          setTasks={setTasks}
          user={userId}
          getTasks={getTasks}
          newTask={newTask}
          setNewTask={setNewTask}
          addTask={addTask}
        />
      ) : (
        <div>
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
            <button onClick={() => addTask(userId)} className="input-task-button">
              Add Task
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Task(props) {
  const checklist = props.tasks.map((task) => {
    return (
      <div className="task-parent" key={task.task_id}>
        <label className="task-container">
          {task.task_message}
          <input
            type="checkbox"
            checked={task.status}
            onChange={() => {
              updateTask(task.task_id, props.user);
              props.setTasks((prevTasks) =>
                prevTasks.map((t) =>
                  t.task_id === task.task_id ? { ...t, status: !t.status } : t
                )
              );
            }}
          />
          <span className="checkmark"></span>
        </label>
        <button
          className="delete-task"
          onClick={() => removeTask(task.task_id)}
        >
          &times;
        </button>
      </div>
    );
  });

  function removeTask(taskId) {
    axios
      .delete(`https://alb.kawayfsl.com/v1/tasks/${taskId}`, {
        params: { user: props.user },
      })
      .then((res) => {
        console.log(res.data);
        props.getTasks(props.user);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function updateTask(taskId, userId) {
    axios
      .put(`https://alb.kawayfsl.com/v1/tasks/${taskId}`, {
        user: userId,
      })
      .then((res) => {
        console.log(res.data);
        // props.getTasks(props.user);
      })
      .catch((err) => {
        console.log(err);
      });
  }

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
          value={props.newTask}
          onChange={(e) => props.setNewTask(e.target.value)}
        />
        <button onClick={() => props.addTask(props.user)} className="input-task-button">
          Add Task
        </button>
      </div>
    </div>
  );
}

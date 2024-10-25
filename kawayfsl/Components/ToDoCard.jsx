import { useState, useEffect } from "react";

export default function ToDoCard() {
  const [tasks, setTasks] = useState([
    {
      id: 0,
      msg: "Test Message",
      status: false,
    },
  ]);

  return (
    <div className="todo card">
      <h2 className="todo-title">To-do</h2>
      <Task tasks={tasks} setTasks={setTasks} />
    </div>
  );
}

function Task(props) {
    const checklist = props.tasks.map((task) => {
      return (
        <label className="container" key={task.id}>
          {task.msg}
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

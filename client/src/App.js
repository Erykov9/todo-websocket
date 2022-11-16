import React from 'react';

import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import shortid from 'shortid';

const App = () => {
  const [socket, setSocket] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');

  useEffect(() =>  {
    const socket = io('http://localhost:8000')
    setSocket(socket);

    socket.on('addTask', (task) => {
      addTask(task);
    });

    socket.on('removeTask', (id) => {
      removeTask(id);
    });

    socket.on('updateData', (tasks) => {
      updateTasks(tasks);;
    });

  }, []);

  const updateTasks = (tasksData) => {
    setTasks(tasksData);
  };

  const removeTask = (id, arg) => {
    setTasks(tasks => tasks.filter(task => task.id !== id));
    if(arg === 'local')  {
      socket.emit('removeTask',  id)
    }
  };

  const submitForm = (e) => {
    e.preventDefault();
    addTask({ id: shortid(),  name: taskName });
    socket.emit('addTask', {id: shortid(), name: taskName })
  };

  const addTask = (task) => {
    setTasks(tasks => [...tasks, task]);
    console.log(task)
  };

  return (
    <div className="App">

    <header>
      <h1>ToDoList.app</h1>
    </header>

    <section className="tasks-section" id="tasks-section">
      <h2>Tasks</h2>

      <ul className="tasks-section__list" id="tasks-list">
        {tasks.map(task => <li className="task" key={task.id}>{task.name} <button className="btn btn--red" onClick={() => removeTask(task.id, 'local')}>Remove</button></li>)}
      </ul>

      <form id="add-task-form" onSubmit={submitForm}>
        <input className="text-input" autoComplete="off" type="text" placeholder="Type your description" id="task-name" value={taskName} onChange={e => setTaskName(e.target.value)}/>
        <button className="btn" type="submit">Add</button>
      </form>

    </section>
  </div>
  );
}

export default App;
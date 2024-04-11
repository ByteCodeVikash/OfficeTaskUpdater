import React from 'react';
import './Tasks.css';

const tasks = [
  { name: 'Marketing strategy', status: 'in-progress', dueDate: '4 d', remaining: '-04:00' },
  { name: 'New contract template', status: 'needs-review', dueDate: 'Tomorrow', remaining: '-03:30' },
  { name: 'New estimation for Fineline Inc. project', status: 'needs-attention', dueDate: 'Sat, 12/12', remaining: '00:00' },
  { name: 'Quarter budget analysis', status: 'needs-input', dueDate: 'Sat, 19/12', remaining: '00:00' },
  { name: 'Launch marketing campaign', status: 'in-progress', dueDate: 'Mon, 11/01/2021', remaining: '00:00' },
  { name: 'Planning and data collection', status: 'planned', dueDate: '3:20', remaining: '+01:10' },
];

const Tasks = () => {
  return (
    <div className="task-container">
      <h1>High Priority</h1>
      <div className="tasks">
        {tasks.map((task, index) => (
          <div key={index} className="task">
            <div className="task-details">
              <input type="checkbox" />
              <span className={`task-status ${task.status}`}>{task.status.replace('-', ' ')}</span>
              <span className="task-name">{task.name}</span>
            </div>
            <span className="task-due-date">{task.dueDate}</span>
            <span className={`task-remaining ${task.remaining.startsWith('-') ? 'overdue' : ''}`}>{task.remaining}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;

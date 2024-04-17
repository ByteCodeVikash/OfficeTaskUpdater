import React from 'react';
import './Dashboard.css';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // this provides default styling
import { Doughnut } from 'react-chartjs-2';

// Mock data for tasks, you would fetch this data from your backend or state management
const tasks = [
  { id: 1, title: 'Marketing strategy', status: 'in progress', dueDate: '4 d', remaining: '-04:00' },
  { id: 2, title: 'New contract template', status: 'needs review', dueDate: 'Tomorrow', remaining: '-03:30' },
  // ... more tasks
];

const Dashboard = () => {
  // The render function for tasks, you'd replace this with a .map call on your actual task array
  const renderTasks = () =>
    tasks.map((task) => (
      <div className="task-item" key={task.id}>
        <input type="checkbox" className="task-checkbox" />
        <span className="task-title">{task.title}</span>
        <span className={`task-status ${task.status.split(' ').join('-')}`}>{task.status}</span>
        <span className="task-due-date">{task.dueDate}</span>
        <span className="task-remaining">{task.remaining}</span>
      </div>
    ));

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>OVERVIEW</h1>
      </header>
      <div className="dashboard-content">
        <section className="priority-tasks">
          <h2>PRIORITY TASKS</h2>
          <div className="tasks-container">{renderTasks()}</div>
        </section>
        <div className="analytics-and-calendar">
          <section className="task-analytics">
            <h2>TASK ANALYTICS</h2>
            <Doughnut data={{
              labels: ['High Priority', 'Medium Priority', 'Low Priority'],
              datasets: [
                {
                  label: 'Task distribution',
                  data: [10, 20, 30], // replace with your data
                  backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe'],
                  hoverBackgroundColor: ['#ff6384', '#36a2eb', '#cc65fe']
                }
              ]
            }} />
          </section>
          <article className="calendar">
            <h2>CALENDAR</h2>
            <ReactCalendar />
          </article>
        </div>
        <footer className="dashboard-footer">
          <button className="reports-btn">View reports here</button>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;

import React from 'react';
import './Dashboard.css'; // Make sure to import the corresponding CSS file

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>OVERVIEW</h1>
      </header>
      <div className="dashboard-content">
        <section className="priority-tasks">
          <h2>PRIORITY TASKS</h2>
          {/* Task list component goes here */}
        </section>
        <section className="analytics-container">
          <article className="task-analytics">
            <h2>TASK ANALYTICS</h2>
            {/* Task analytics chart component goes here */}
          </article>
          <article className="calendar">
            <h2>CALENDAR</h2>
            {/* Calendar component goes here */}
          </article>
        </section>
        <footer className="dashboard-footer">
          <button className="reports-btn">View reports here</button>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;

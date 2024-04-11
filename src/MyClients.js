import React from 'react';
import './MyClients.css';

const meetingsData = [
  { id: 1, name: 'Team Brainstorming Session', date: 'March 26, 2024' },
  // ... more meetings
];

const milestonesData = [
  { id: 1, name: 'Product Launch', date: 'May 10, 2024' },
  // ... more milestones
];

const foldersData = [
  { id: 1, name: 'BRD.docx' },
  // ... more folders
];

const feedbackData = [
  { id: 1, client: 'Client A', comment: 'The revised design exceeded our expectations!' },
  // ... more feedback
];

const Meetings = ({ meetings }) => (
  <div className="card meetings">
    <h2>Meetings</h2>
    <ul>
      {meetings.map(meeting => (
        <li key={meeting.id}>{meeting.name} - {meeting.date}</li>
      ))}
    </ul>
  </div>
);

const Milestones = ({ milestones }) => (
  <div className="card milestones">
    <h2>Milestones</h2>
    <ul>
      {milestones.map(milestone => (
        <li key={milestone.id}>{milestone.name} - {milestone.date}</li>
      ))}
    </ul>
  </div>
);

const Folders = ({ folders }) => (
  <div className="card folders">
    <h2>Folders</h2>
    <ul>
      {folders.map(folder => (
        <li key={folder.id}>{folder.name}</li>
      ))}
    </ul>
  </div>
);

const ClientFeedback = ({ feedback }) => (
  <div className="card feedback">
    <h2>Client Feedback</h2>
    {feedback.map(f => (
      <div key={f.id} className="feedback-item">
        <strong>{f.client}</strong>
        <p>{f.comment}</p>
      </div>
    ))}
  </div>
);

const MyClients = () => {
  return (
    <div className="main-content">
      <div className="dashboard-row">
        <Meetings meetings={meetingsData} />
        <Milestones milestones={milestonesData} />
        <Folders folders={foldersData} />
      </div>
      <ClientFeedback feedback={feedbackData} />
    </div>
  );
};

export default MyClients;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import SignupApp from './login'; // Import SignupApp here
import Tasks from './Tasks';
import Teams from './Teams';
import Myclients from './MyClients';
import Profile from './Profile'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<><SignupApp /></>} />
        <Route path="/dashboard" element={<><Sidebar /><Dashboard /></>} />
        <Route path="/tasks" element={<><Sidebar /><Tasks /></>} />
        <Route path="/teams" element={<><Sidebar /><Teams /></>} />
        <Route path="/MyClients" element={<><Sidebar /><Myclients /></>} />
        <Route path="/Profile" element={<><Sidebar /><Profile /></>} />
      </Routes>
    </Router>
  );
}


export default App;

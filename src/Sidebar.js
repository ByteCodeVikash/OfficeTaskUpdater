// Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faTasks, faUsers, faUserFriends, faQuestionCircle, faBell, faUser } from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css'; // Your CSS file

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Link className="menu-item" to="/dashboard"><FontAwesomeIcon icon={faTachometerAlt} /> My Dashboard</Link>
      <Link className="menu-item" to="/tasks"><FontAwesomeIcon icon={faTasks} /> My Tasks</Link>
      <Link className="menu-item" to="/teams"><FontAwesomeIcon icon={faUsers} /> My Teams</Link>
      <Link className="menu-item" to="/MyClients"><FontAwesomeIcon icon={faUserFriends} /> My Clients</Link>

      {/* Grouping Help, Notifications, and Profile links */}
      <div className="bottom-links">
        <Link className="menu-item" to="/help"><FontAwesomeIcon icon={faQuestionCircle} /> Help</Link>
        <Link className="menu-item" to="/notifications"><FontAwesomeIcon icon={faBell} /> Notifications</Link>
        <Link className="menu-item" to="/profile"><FontAwesomeIcon icon={faUser} /> Profile</Link>
      </div>
    </div>
  );
};

export default Sidebar;

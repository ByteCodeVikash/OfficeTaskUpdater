import React, { useState } from 'react';
import './Profile.css';

const Profile = () => {
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    empId: '',
    email: '',
    phone: '',
    department: '',
    photo: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.substr(0, 5) === "image") {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, photo: reader.result });
      };
      reader.readAsDataURL(file);
    } else {
      setProfile({ ...profile, photo: '' });
    }
  };

  const handleToggleEdit = () => {
    setEditMode(!editMode);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setEditMode(false);
    // Implement save logic
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-photo-container">
          {profile.photo ? (
            <img src={profile.photo} alt="Profile" className="profile-photo" />
          ) : (
            <div className="profile-photo-placeholder">
              {editMode && (
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="photo-upload-input"
                />
              )}
            </div>
          )}
          {editMode && <button className="upload-photo-btn">Upload Photo</button>}
        </div>
        <div className="name-edit-container">
          {editMode ? (
            <input
              type="text"
              value={profile.name}
              name="name"
              onChange={handleInputChange}
              placeholder="Your Name"
            />
          ) : (
            <h1>{profile.name || "Your Name"}</h1>
          )}
          {editMode ? (
            <span className="edit-link" onClick={handleToggleEdit}>Cancel</span>
          ) : (
            <span className="edit-link" onClick={handleToggleEdit}>Edit</span>
          )}
        </div>
        <div className="status-section">
          <span className="status-indicator"></span>
          Active
          <span className="local-time">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
      {editMode ? (
        <div className="profile-info">
          <input
            type="text"
            value={profile.empId}
            name="empId"
            onChange={handleInputChange}
            placeholder="Employee ID"
          />
          <input
            type="email"
            value={profile.email}
            name="email"
            onChange={handleInputChange}
            placeholder="Email"
          />
          <input
            type="tel"
            value={profile.phone}
            name="phone"
            onChange={handleInputChange}
            placeholder="Phone"
          />
          <input
            type="text"
            value={profile.department}
            name="department"
            onChange={handleInputChange}
            placeholder="Department"
          />
        </div>
      ) : (
        <div className="profile-info">
          <p>Employee ID: {profile.empId}</p>
          <p>Email: {profile.email}</p>
          <p>Phone: {profile.phone}</p>
          <p>Department: {profile.department}</p>
        </div>
      )}
      {editMode && (
        <button className="save-btn" onClick={handleSave}>Save</button>
      )}
    </div>
  );
};

export default Profile;

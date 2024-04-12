import React, { useState, useEffect } from 'react';
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

  const fetchProfile = () => {
    const empId = 'your_employee_id';  // This should be dynamically determined based on user authentication
    fetch(`http://localhost:3001/getProfile?userId=${empId}`)
      .then(response => response.json())
      .then(data => {
        setProfile(data);
        localStorage.setItem('profile', JSON.stringify(data));
      })
      .catch(error => {
        console.error('Error fetching profile:', error);
      });
  };

  useEffect(() => {
    const savedProfile = localStorage.getItem('profile');
    
    // Function to check profile existence in database and fetch it
    const checkAndFetchProfile = (empId) => {
      fetch(`http://localhost:3001/getProfile?userId=${empId}`)
        .then(response => response.json())
        .then(data => {
          if (data) {
            setProfile(data); // Set profile if found
          } else {
            localStorage.removeItem('profile'); // Remove from local storage if not found
            // Optionally, fetch a new profile or handle the "not found" case
          }
        })
        .catch(error => {
          console.error('Error fetching profile:', error);
        });
    };
    
    if (savedProfile) {
      const profileData = JSON.parse(savedProfile);
      checkAndFetchProfile(profileData.empId); // Check and fetch profile using the saved empId
    } else {
      // If no profile is saved, either prompt for login or handle accordingly
    }
  }, []);
    
  
  

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
    fetch('http://localhost:3001/saveProfile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Profile saved:', data);
      localStorage.setItem('profile', JSON.stringify(profile));
      fetchProfile();  // Re-fetch the profile to ensure UI is updated
    })
    .catch(error => {
      console.error('Error saving profile:', error);
    });
    setEditMode(false);
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

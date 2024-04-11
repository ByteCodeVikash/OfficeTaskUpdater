import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

const SignupApp = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true); // State to toggle between login and signup
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // For signup confirmation password
  const [status, setStatus] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isLogin && password !== confirmPassword) {
      setStatus('Passwords do not match.');
      return;
    }

    const endpoint = isLogin ? 'login' : 'signup';
    const url = `http://localhost:3001/${endpoint}`;
    
    try {
      const body = JSON.stringify(isLogin ? { username, password } : { username, password, confirmPassword });
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body,
      });

      if (!response.ok) {
        throw new Error(`${endpoint} failed: ${response.statusText}`);
      }

      if (isLogin) {
        setStatus('Login successful!');
        navigate('/dashboard'); // Redirect to dashboard after login
      } else {
        setStatus('Signup successful! Please log in.');
        setIsLogin(true); // Switch to login form after successful signup
      }
    } catch (error) {
      setStatus(error.message);
    }
  };

  return (
    <div className="app">
      <div className="illustration" />
      <div className="form-container">
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">USERNAME</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">PASSWORD</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          {!isLogin && (
            <div className="input-group">
              <label htmlFor="confirmPassword">CONFIRM PASSWORD</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}
          <button type="submit">{isLogin ? 'LOG IN' : 'SIGN UP'}</button>
          <button 
            type="button" 
            className="toggle-btn" 
            onClick={() => {
              setIsLogin(!isLogin);
              setUsername(''); // Clear username
              setPassword(''); // Clear password
              setConfirmPassword(''); // Clear confirmPassword
              setStatus(''); // Clear status message
            }}
          >
            {isLogin ? 'Create a new account' : 'Already have an account? Log in'}
          </button>
        </form>
        {status && <p className="status-message">{status}</p>}
      </div>
    </div>
  );
};

export default SignupApp;

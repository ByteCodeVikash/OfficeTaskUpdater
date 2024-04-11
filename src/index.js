// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Make sure this is 'App'
// ... other imports

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// ... other code

//reportWebVitals();

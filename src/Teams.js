import React, { useState, useEffect } from 'react';
import './Teams.css';

const Teams = () => {
  const [messages, setMessages] = useState([]);
  const [files, setFiles] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Fetch messages from server
  const fetchMessages = () => {
    fetch('http://localhost:3001/getMessages')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((fetchedMessages) => {
        setMessages(fetchedMessages);
      })
      .catch((error) => {
        console.error('Error fetching messages:', error);
      });
  };

  // Call fetchMessages when component mounts
  useEffect(() => {
    fetchMessages();
  }, []);

  // Send new message to server
  const handleSend = () => {
    if (!newMessage.trim() && files.length === 0) {
      return;
    }

    const messageData = {
      author: 'You',
      content: newMessage,
      files: files.map((file) => ({
        name: file.name,
        size: file.size,
        url: file.url,
      })),
      type: 'sent',
    };

    fetch('http://localhost:3001/storeMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageData),
    })
    .then((response) => response.json())
    .then((data) => {
      console.log('Success:', data);
      fetchMessages();
    })
    .catch((error) => {
      console.error('Error:', error);
    });

    setNewMessage('');
    setFiles([]);
  };

  // Handle file selection
  const handleFileUpload = (event) => {
    const uploadedFiles = event.target.files;
    const newFiles = Array.from(uploadedFiles).map((file) => ({
      name: file.name,
      size: file.size,
      url: URL.createObjectURL(file),
    }));

    setFiles(newFiles);
  };

  // JSX for component
  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={`${message.id}-${index}`} className={`message ${message.type}`}>
            <div className="initials">
              {message.author.split(' ').map((name) => name[0]).join('')}
            </div>
            <div className="text">
              {typeof message.content === 'string' ? message.content : 'Invalid message content'}
              {message.files && (
                <div className="files-list">
                  {message.files.map((file, fileIndex) => (
                    <div key={file.name} className="file-item">
                      {file.name} - {Math.round(file.size / 1024)} KB
                      <a href={file.url} target="_blank" rel="noopener noreferrer" download>
                        Open
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Updated chat input section */}
      <div className="chat-input-container">
        <button 
          className="file-upload-btn" 
          onClick={() => document.getElementById('fileUpload').click()}
        >
          +
        </button>
        <input
          type="text"
          className="message-input"
          placeholder="Type something..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button 
          className="send-btn" 
          onClick={handleSend}
        >
          Send
        </button>
      </div>
      
      {/* Hidden file input for file upload */}
      <input
        id="fileUpload"
        type="file"
        multiple
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default Teams;
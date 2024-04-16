import React, { useState, useEffect, useRef } from 'react';
import './Teams.css';

const Teams = () => {
  const [messages, setMessages] = useState([]);
  const [files, setFiles] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState('');
  const messagesEndRef = useRef(null); // Ref to track the messages container

  // Fetch messages from server
  const fetchMessages = () => {
    fetch('http://localhost:3001/getMessages')
      .then((response) => response.json())
      .then((fetchedMessages) => {
        setMessages(fetchedMessages);
      })
      .catch((error) => console.error('Error fetching messages:', error));
  };

  // Call fetchMessages when component mounts
  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    // Scroll to the bottom of the message list on update
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messageData),
    })
      .then((response) => response.json())
      .then(() => {
        fetchMessages(); // Re-fetch messages to include the new one
        setNewMessage('');
        setFiles([]);
      })
      .catch((error) => console.error('Error:', error));
  };

  const handleFileUpload = (event) => {
    const uploadedFiles = event.target.files;
    if (uploadedFiles.length === 0) {
      return; // Agar koi file select nahi ki gayi hai toh return kar do
    }

    const newFiles = Array.from(uploadedFiles).map((file) => ({
      name: file.name,
      size: file.size,
      url: URL.createObjectURL(file),
    }));

    setFiles((prevFiles) => [...prevFiles, ...newFiles]); // Purani files ke sath nayi files ko add kar do
  };

  const startEdit = (index) => {
    setEditingIndex(index);
    setEditText(messages[index].content);
  };

  const handleEditChange = (e) => {
    setEditText(e.target.value);
  };

  const saveEdit = () => {
    const updatedMessages = [...messages];
    updatedMessages[editingIndex].content = editText;
    setMessages(updatedMessages);
    setEditingIndex(null);
    setEditText('');
    // Yahan aapko server ko bhi update bhejna hoga
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((message, index) => {
          console.log(typeof message.content); // Check the type of message.content
          return (
            <div key={`${message.id}-${index}`} className={`message ${message.type}`}>
              <div className="initials">{message.author.split(' ').map((name) => name[0]).join('')}</div>
              {editingIndex === index ? (
                <input type="text" value={editText} onChange={handleEditChange} />
              ) : (
                <div className="text">
                  {typeof message.content === 'string' ? message.content : 'The message content is not a string.'}
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
              )}
              <button onClick={() => startEdit(index)} className="edit-btn">
                ✏️
              </button>
              {editingIndex === index && (
                <button onClick={saveEdit} className="save-btn">
                  Save
                </button>
              )}
            </div>
          );
        })}
        {/* Add ref to an empty div at the end of the messages list */}
        <div ref={messagesEndRef} />
      </div>
      {/* Input and button components below... */}
      <div className="chat-input-container">
        <button className="file-upload-btn" onClick={() => document.getElementById('fileUpload').click()}>
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
        <button className="send-btn" onClick={handleSend}>
          Send
        </button>
      </div>
      <input id="fileUpload" type="file" multiple onChange={handleFileUpload} style={{ display: 'none' }} />
    </div>
  );
};

export default Teams;
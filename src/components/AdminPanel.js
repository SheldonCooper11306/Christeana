import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs, orderBy, query, deleteDoc, doc } from 'firebase/firestore';
import './AdminPanel.css';

const AdminPanel = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const messagesRef = collection(db, 'birthday-messages');
      const q = query(messagesRef, orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const messagesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setMessages(messagesData);
    } catch (error) {
      console.error('Error loading messages:', error);
      setError('Failed to load messages. Please check your Firebase configuration.');
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await deleteDoc(doc(db, 'birthday-messages', messageId));
        setMessages(prev => prev.filter(msg => msg.id !== messageId));
      } catch (error) {
        console.error('Error deleting message:', error);
        alert('Failed to delete message.');
      }
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Unknown time';
    
    let date;
    if (timestamp.toDate) {
      // Firebase timestamp
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      // JavaScript Date
      date = timestamp;
    } else {
      // ISO string
      date = new Date(timestamp);
    }
    
    return date.toLocaleString();
  };

  const exportMessages = () => {
    const messagesText = messages.map(msg => 
      `[${formatTime(msg.timestamp)}] ${msg.username}: ${msg.text}`
    ).join('\n');
    
    const blob = new Blob([messagesText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `birthday-messages-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="admin-panel">
        <div className="admin-header">
          <h2>Admin Panel - Birthday Messages</h2>
          <p>Loading messages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-panel">
        <div className="admin-header">
          <h2>Admin Panel - Birthday Messages</h2>
          <div className="error-message">{error}</div>
          <button onClick={loadMessages} className="retry-button">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>Admin Panel - Birthday Messages</h2>
        <div className="admin-stats">
          <span>Total Messages: {messages.length}</span>
          <button onClick={exportMessages} className="export-button">Export Messages</button>
          <button onClick={loadMessages} className="refresh-button">Refresh</button>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="no-messages">
          <p>No messages yet. When she starts using the website, her messages will appear here.</p>
        </div>
      ) : (
        <div className="messages-container">
          {messages.map((message) => (
            <div key={message.id} className="admin-message">
              <div className="message-header">
                <div className="message-info">
                  <span className="username">{message.username}</span>
                  <span className="timestamp">{formatTime(message.timestamp)}</span>
                  <span className="message-id">ID: {message.id}</span>
                </div>
                <button 
                  onClick={() => deleteMessage(message.id)}
                  className="delete-button"
                  title="Delete message"
                >
                  🗑️
                </button>
              </div>
              <div className="message-content">{message.text}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;

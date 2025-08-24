import React, { useState, useEffect } from 'react';
import databaseService from '../services/databaseService';
import './AdminPanel.css';

const AdminPanel = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Set up real-time listener for birthday messages
    const unsubscribe = databaseService.listenToBirthdayMessages((messagesData) => {
      setMessages(messagesData);
      setLoading(false);
      setError(null);
    });

    // Also try to load from localStorage as fallback
    const loadFallbackMessages = () => {
      try {
        const savedMessages = localStorage.getItem('birthday-messages');
        if (savedMessages) {
          const localMessages = JSON.parse(savedMessages);
          // Only use local messages if we don't have any from Firebase
          if (messages.length === 0) {
            setMessages(localMessages);
          }
        }
      } catch (localError) {
        console.error('Error loading from localStorage:', localError);
      }
    };

    // Load fallback messages after a delay to give Firebase time
    setTimeout(loadFallbackMessages, 2000);

    // Cleanup function
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [messages.length]);

  const deleteMessage = async (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        // Try to delete from Firebase first
        const result = await databaseService.deleteBirthdayMessage(messageId);
        
        if (result.success) {
          // Firebase deletion successful, message will be removed via real-time listener
          console.log('Message deleted successfully');
        } else {
          throw new Error(result.error || 'Failed to delete from Firebase');
        }
        
      } catch (error) {
        console.error('Error deleting message from Firebase:', error);
        
        // Fallback: delete from localStorage
        try {
          const updatedMessages = messages.filter(msg => msg.id !== messageId);
          setMessages(updatedMessages);
          localStorage.setItem('birthday-messages', JSON.stringify(updatedMessages));
          console.log('Message deleted from localStorage as fallback');
        } catch (fallbackError) {
          console.error('Error deleting from localStorage:', fallbackError);
          alert('Failed to delete message.');
        }
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
      `[${formatTime(msg.timestamp)}] ${msg.username}: ${msg.text}\n` +
      `Device: ${msg.userAgent || 'Unknown'}\n` +
      `Screen: ${msg.screenResolution || 'Unknown'}\n` +
      `Timezone: ${msg.timezone || 'Unknown'}\n` +
      `URL: ${msg.pageUrl || 'Unknown'}\n` +
      `Referrer: ${msg.referrer || 'Direct'}\n` +
      `---`
    ).join('\n\n');
    
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

  const getDeviceInfo = (userAgent) => {
    if (!userAgent) return 'Unknown';
    
    if (userAgent.includes('Mobile')) return '📱 Mobile';
    if (userAgent.includes('Tablet')) return '📱 Tablet';
    if (userAgent.includes('Windows')) return '💻 Windows';
    if (userAgent.includes('Mac')) return '🍎 Mac';
    if (userAgent.includes('Linux')) return '🐧 Linux';
    return '💻 Desktop';
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
              
              {/* Device and interaction details */}
              <div className="message-details">
                <div className="detail-item">
                  <strong>Device:</strong> {getDeviceInfo(message.userAgent)}
                </div>
                {message.screenResolution && (
                  <div className="detail-item">
                    <strong>Screen:</strong> {message.screenResolution}
                  </div>
                )}
                {message.timezone && (
                  <div className="detail-item">
                    <strong>Timezone:</strong> {message.timezone}
                  </div>
                )}
                {message.pageUrl && (
                  <div className="detail-item">
                    <strong>Page:</strong> {message.pageUrl}
                  </div>
                )}
                {message.referrer && (
                  <div className="detail-item">
                    <strong>Referrer:</strong> {message.referrer}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;

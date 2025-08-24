import React, { useState, useEffect } from 'react';
import databaseService from '../services/databaseService';
import './InteractivePost.css';

const InteractivePost = ({ postId, onMessageSubmitted }) => {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Stop loading immediately and show empty state
    setLoading(false);
    
    // Load messages from localStorage first (immediate)
    try {
      const savedMessages = localStorage.getItem('birthday-messages');
      if (savedMessages) {
        const localMessages = JSON.parse(savedMessages);
        setMessages(localMessages);
      }
    } catch (error) {
      console.log('Error loading local messages:', error);
    }

    // Set up Firebase listener in background
    const unsubscribe = databaseService.listenToBirthdayMessages((messagesData) => {
      if (messagesData && messagesData.length > 0) {
        setMessages(messagesData);
      }
    });

    // Cleanup function
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);

    try {
      const messageData = {
        text: message,
        username: 'eana' // Default username, could be dynamic based on current user
      };

      const result = await databaseService.saveBirthdayMessage(messageData);
      
      if (result.success) {
        setMessage('');
        setSubmitted(true);
        
        if (onMessageSubmitted) {
          onMessageSubmitted({
            id: result.messageId,
            ...messageData,
            timestamp: new Date().toISOString()
          });
        }
        
        // Reset submitted state after 3 seconds
        setTimeout(() => setSubmitted(false), 3000);
      } else {
        throw new Error(result.error || 'Failed to save message');
      }
      
    } catch (error) {
      console.error('Error submitting message:', error);
      alert('Failed to save message. Please try again.');
      
      // Fallback to localStorage if Firebase fails
      try {
        const fallbackMessage = {
          id: Date.now(),
          text: message,
          username: 'eana',
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          pageUrl: window.location.href,
          referrer: document.referrer,
          screenResolution: `${screen.width}x${screen.height}`,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };

        const savedMessages = localStorage.getItem('birthday-messages');
        const existingMessages = savedMessages ? JSON.parse(savedMessages) : [];
        const updatedMessages = [fallbackMessage, ...existingMessages];
        localStorage.setItem('birthday-messages', JSON.stringify(updatedMessages));
        
        setMessage('');
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
      } catch (fallbackError) {
        console.error('Fallback save also failed:', fallbackError);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    
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

  return (
    <div className="interactive-post">
      <div className="interactive-header">
        <h3>Share Your Thoughts</h3>
        <p>Write a message, birthday wish, or anything you'd like to say...</p>
      </div>

      {submitted && (
        <div className="success-message">
          Message submitted successfully! 💝
        </div>
      )}

      <form onSubmit={handleSubmit} className="interactive-form">
        <textarea
          className="interactive-textarea"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your message here..."
          rows="4"
          required
        />
        <button
          type="submit"
          className="submit-button"
          disabled={isSubmitting || !message.trim()}
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>

      <div className="messages-section">
        <h4>Messages ({messages.length})</h4>
        {loading ? (
          <div className="loading-messages">Loading messages...</div>
        ) : messages.length > 0 ? (
          <div className="messages-list">
            {messages.map((msg) => (
              <div key={msg.id} className="message-item">
                <div className="message-header">
                  <span className="message-username">{msg.username}</span>
                  <span className="message-time">{formatTime(msg.timestamp)}</span>
                </div>
                <div className="message-text">{msg.text}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-messages">No messages yet. Be the first to share!</div>
        )}
      </div>
    </div>
  );
};

export default InteractivePost;

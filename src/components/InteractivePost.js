import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, getDocs, orderBy, query, serverTimestamp } from 'firebase/firestore';
import './InteractivePost.css';

const InteractivePost = ({ postId, onMessageSubmitted }) => {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
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
      // Fallback to localStorage if Firebase fails
      try {
        const savedMessages = localStorage.getItem('birthday-messages');
        if (savedMessages) {
          setMessages(JSON.parse(savedMessages));
        }
      } catch (localError) {
        console.error('Error loading from localStorage:', localError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    try {
      const newMessage = {
        text: message,
        username: 'eana',
        timestamp: serverTimestamp(),
        createdAt: new Date().toISOString()
      };

      // Save to Firebase
      const messagesRef = collection(db, 'birthday-messages');
      const docRef = await addDoc(messagesRef, newMessage);
      
      // Add the new message to local state
      const messageWithId = {
        id: docRef.id,
        ...newMessage,
        timestamp: new Date() // Use local timestamp for immediate display
      };
      
      const updatedMessages = [messageWithId, ...messages];
      setMessages(updatedMessages);
      
      // Also save to localStorage as backup
      localStorage.setItem('birthday-messages', JSON.stringify(updatedMessages));
      
      setMessage('');
      setSubmitted(true);
      if (onMessageSubmitted) {
        onMessageSubmitted(messageWithId);
      }
      
      // Reset submitted state after 3 seconds
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      console.error('Error submitting message:', error);
      
      // Fallback to localStorage if Firebase fails
      try {
        const newMessage = {
          id: Date.now(),
          text: message,
          username: 'eana',
          timestamp: new Date().toISOString()
        };

        const updatedMessages = [newMessage, ...messages];
        setMessages(updatedMessages);
        localStorage.setItem('birthday-messages', JSON.stringify(updatedMessages));
        
        setMessage('');
        setSubmitted(true);
        if (onMessageSubmitted) {
          onMessageSubmitted(newMessage);
        }
        
        setTimeout(() => setSubmitted(false), 3000);
      } catch (localError) {
        console.error('Error saving to localStorage:', localError);
        alert('Failed to save message. Please try again.');
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

import React, { useState } from 'react';
import { auth } from '../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import './Login.css';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both username and password');
      return;
    }

    setIsLoading(true);
    setError('');

    // Check if it's one of the predefined accounts
    const validAccounts = {
      'jom': 'jom123',
      'eana': 'eana123',
      'xandy': 'xandy123',
      'guest': 'guest123'
    };

    if (validAccounts[email] && validAccounts[email] === password) {
      const userData = {
        email: email,
        displayName: email,
        uid: `user_${email}`,
        isAdmin: email === 'jom'
      };
      
      onLogin(userData);
    } else {
      setError('Invalid username or password. Please try again.');
    }

    setIsLoading(false);
  };



  return (
    <div className="login-container">
      <div className="login-card">
        <div className="instagram-logo">
          <img 
            src="https://www.instagram.com/static/images/web/logged_out_wordmark.png/7a252de00b20.png" 
            alt="Instagram" 
            className="logo-image"
          />
        </div>

        <form onSubmit={handleEmailLogin} className="login-form">
                  <div className="form-group">
          <input
            type="text"
            className="form-input"
            placeholder="Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
        </div>
          <div className="form-group">
            <input
              type="password"
              className="form-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

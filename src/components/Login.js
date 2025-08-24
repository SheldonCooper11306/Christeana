import React, { useState } from 'react';
import { auth } from '../firebase/config';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const userData = {
        email: user.email,
        displayName: user.displayName || user.email,
        uid: user.uid,
        isAdmin: email === 'jombenitez96@gmail.com'
      };
      
      onLogin(userData);
    } catch (error) {
      console.error('Login error:', error);
      if (error.code === 'auth/user-not-found') {
        setError('User not found. Please check your email or create an account.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Invalid email address.');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    console.log('Starting Google login...');

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      console.log('Provider created, attempting sign in...');
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      console.log('Google login successful:', user);
      
      const userData = {
        email: user.email,
        displayName: user.displayName || user.email,
        uid: user.uid,
        isAdmin: user.email === 'jombenitez96@gmail.com'
      };
      
      onLogin(userData);
    } catch (error) {
      console.error('Google login error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        setError('Login was cancelled. Please try again.');
      } else if (error.code === 'auth/popup-blocked') {
        setError('Popup was blocked. Please allow popups for this site.');
      } else if (error.code === 'auth/unauthorized-domain') {
        setError('This domain is not authorized for Google sign-in. Please contact support.');
      } else if (error.code === 'auth/operation-not-allowed') {
        setError('Google sign-in is not enabled. Please contact support.');
      } else {
        setError(`Google login failed: ${error.message}. Please try again.`);
      }
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

        <div className="divider">
          <span>OR</span>
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
      </div>
    </div>
  );
};

export default Login;

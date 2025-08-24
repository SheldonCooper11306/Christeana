import React, { useState } from 'react';
import { auth } from '../firebase/config';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
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
        isAdmin: email === 'jom@gmail.com'
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

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log('Account created successfully:', user);
      
      const userData = {
        email: user.email,
        displayName: user.email,
        uid: user.uid,
        isAdmin: user.email === 'jom@gmail.com'
      };
      
      onLogin(userData);
    } catch (error) {
      console.error('Account creation error:', error);
      if (error.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists. Please log in instead.');
      } else if (error.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters long.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Invalid email address.');
      } else {
        setError(`Account creation failed: ${error.message}. Please try again.`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="birthday-logo">
          <h1 className="birthday-title">🎉 Happy Birthday 🎉</h1>
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
          <div className="button-group">
            <button
              type="submit"
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>
            <button
              type="button"
              onClick={handleCreateAccount}
              className="create-account-button"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

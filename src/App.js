import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Feed from './components/Feed';
import TestFeed from './components/TestFeed';
import AdminPanel from './components/AdminPanel';
import DebugInfo from './components/DebugInfo';
import authService from './services/authService';
import databaseService from './services/databaseService';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  // Check if current user is an admin
  const isAdmin = user && user.isAdmin;

  useEffect(() => {
    // Stop loading immediately, don't wait for Firebase
    setLoading(false);
    
    // Initialize Firebase accounts in background (non-blocking)
    authService.initializePredefinedAccounts().catch(error => {
      console.log('Firebase initialization running in background:', error);
    });
    
    // Set up auth state listener
    const unsubscribe = authService.onAuthStateChange((userData) => {
      if (userData) {
        setUser(userData);
        setIsLoggedIn(true);
        
        // Track page view in background
        databaseService.trackPageView(userData.uid, window.location.href).catch(err => {
          console.log('Page tracking running in background:', err);
        });
      } else {
        setUser(null);
        setIsLoggedIn(false);
        setShowAdmin(false);
      }
    });
    
    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    console.log('User logged in:', userData);
  };

  const handleLogout = async () => {
    try {
      const result = await authService.logout();
      if (result.success) {
        setUser(null);
        setIsLoggedIn(false);
        setShowAdmin(false);
      } else {
        console.error('Logout failed:', result.error);
        // Still clear state even if Firebase logout fails
        setUser(null);
        setIsLoggedIn(false);
        setShowAdmin(false);
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Clear state anyway
      setUser(null);
      setIsLoggedIn(false);
      setShowAdmin(false);
    }
  };

  const toggleAdmin = () => {
    setShowAdmin(!showAdmin);
  };

  if (loading) {
    return (
      <div className="App">
        <div className="app-loading">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (showAdmin) {
    return (
      <div className="App">
        <div className="app-header">
          <div className="header-content">
            <div className="header-left">
                             <h1 className="instagram-text">Admin Panel</h1>
            </div>
            <div className="header-right">
              <span className="welcome-text">Welcome, {user?.displayName || user?.email || 'User'}!</span>
              <button onClick={toggleAdmin} className="admin-toggle-button">
                Back to Website
              </button>
              <button onClick={handleLogout} className="logout-button">
                Log Out
              </button>
            </div>
          </div>
        </div>
        <AdminPanel />
      </div>
    );
  }

  return (
    <div className="App">
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <>
          <div className="app-header">
            <div className="header-content">
                          <div className="header-left">
                             <h1 className="instagram-text">Instagram</h1>
            </div>
              <div className="header-right">
                <span className="welcome-text">Welcome, {user?.displayName || user?.email || 'User'}!</span>
                {/* Only show Admin Panel button for admin users */}
                {isAdmin && (
                  <button onClick={toggleAdmin} className="admin-toggle-button">
                    Admin Panel
                  </button>
                )}
                <button onClick={handleLogout} className="logout-button">
                  Log Out
                </button>
              </div>
            </div>
          </div>
          <Feed currentUser={user} onPostsLoaded={setPosts} />
        </>
      )}
    </div>
  );
}

export default App;


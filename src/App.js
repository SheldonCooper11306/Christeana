import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Feed from './components/Feed';
import AdminPanel from './components/AdminPanel';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if current user is an admin
  const isAdmin = user && user.isAdmin;

  useEffect(() => {
    // Since we're not using Firebase Auth anymore, we'll handle login state differently
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    console.log('User logged in:', userData);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setShowAdmin(false);
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
          <Feed currentUser={user} />
        </>
      )}
    </div>
  );
}

export default App;


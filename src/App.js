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

  // List of admin users who can access the Admin Panel
  const ADMIN_USERS = [
    'jombenitez96@gmail.com',  // Your admin email
    'jombenitez96 (Google)'    // Google login user
  ];

  // Check if current user is an admin
  const isAdmin = user && (ADMIN_USERS.includes(user.email) || ADMIN_USERS.includes(user.displayName));

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem('birthday-user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('birthday-user');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    setShowAdmin(false);
    // Save user to localStorage
    localStorage.setItem('birthday-user', JSON.stringify(userData));
  };

  const handleLogout = async () => {
    try {
      setUser(null);
      setIsLoggedIn(false);
      setShowAdmin(false);
      // Remove user from localStorage
      localStorage.removeItem('birthday-user');
    } catch (error) {
      console.error('Logout error:', error);
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
          <Feed currentUser={user} />
        </>
      )}
    </div>
  );
}

export default App;


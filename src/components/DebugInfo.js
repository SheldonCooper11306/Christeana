import React from 'react';

const DebugInfo = ({ posts, currentUser, isLoggedIn }) => {
  const debugStyle = {
    position: 'fixed',
    top: '10px',
    right: '10px',
    background: 'rgba(0,0,0,0.8)',
    color: 'white',
    padding: '10px',
    borderRadius: '5px',
    fontSize: '12px',
    maxWidth: '300px',
    zIndex: 9999
  };

  return (
    <div style={debugStyle}>
      <h4>Debug Info</h4>
      <p><strong>Logged In:</strong> {isLoggedIn ? 'Yes' : 'No'}</p>
      <p><strong>Current User:</strong> {currentUser?.username || 'None'}</p>
      <p><strong>Posts Count:</strong> {posts?.length || 0}</p>
      {posts && posts.length > 0 && (
        <div>
          <p><strong>Posts:</strong></p>
          {posts.map(post => (
            <div key={post.id} style={{marginBottom: '5px', fontSize: '10px'}}>
              - Post {post.id}: {post.type} ({post.comments?.length || 0} comments)
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DebugInfo;

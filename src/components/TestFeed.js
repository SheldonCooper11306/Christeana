import React from 'react';

const TestFeed = ({ currentUser }) => {
  const testPosts = [
    {
      id: 1,
      type: 'photo',
      imageUrl: '/BirthdayGirl.jpg',
      caption: 'Test Post 1 - Birthday Girl',
      username: 'jooooommm',
      profileImage: '/jomm.jpg',
      likes: 100,
      comments: [
        { username: 'test1', text: 'Test comment 1', timestamp: new Date() },
        { username: 'test2', text: 'Test comment 2', timestamp: new Date() }
      ]
    },
    {
      id: 2,
      type: 'interactive',
      caption: 'Test Interactive Post',
      username: 'jooooommm',
      profileImage: '/jomm.jpg',
      likes: 50,
      comments: []
    }
  ];

  const testStyle = {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#000',
    color: '#fff',
    minHeight: '100vh'
  };

  const postStyle = {
    backgroundColor: '#121212',
    border: '1px solid #262626',
    borderRadius: '8px',
    marginBottom: '20px',
    padding: '20px'
  };

  return (
    <div style={testStyle}>
      <h2>Test Feed - Debug Mode</h2>
      <p>Current User: {currentUser?.username || 'None'}</p>
      <p>Posts Count: {testPosts.length}</p>
      
      {testPosts.map(post => (
        <div key={post.id} style={postStyle}>
          <h3>Post {post.id} - {post.type}</h3>
          <p><strong>Caption:</strong> {post.caption}</p>
          <p><strong>Username:</strong> {post.username}</p>
          <p><strong>Likes:</strong> {post.likes}</p>
          
          {post.imageUrl && (
            <div>
              <p><strong>Image:</strong></p>
              <img 
                src={post.imageUrl} 
                alt="Post" 
                style={{maxWidth: '100%', height: 'auto'}}
                onError={(e) => {
                  console.log('Image failed to load:', post.imageUrl);
                  e.target.style.display = 'none';
                }}
                onLoad={() => console.log('Image loaded:', post.imageUrl)}
              />
            </div>
          )}
          
          <div>
            <p><strong>Comments ({post.comments.length}):</strong></p>
            {post.comments.map((comment, idx) => (
              <div key={idx} style={{marginLeft: '20px', marginBottom: '5px'}}>
                <strong>{comment.username}:</strong> {comment.text}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TestFeed;

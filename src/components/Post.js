import React, { useState } from 'react';
import './Post.css';

const Post = ({ post, currentUser, onLike, onComment }) => {
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);

  const isLiked = post.likes?.includes(currentUser.uid);
  const likeCount = post.likes?.length || 0;
  const commentCount = post.comments?.length || 0;

  const handleLike = () => {
    onLike(post.id, isLiked);
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      onComment(post.id, commentText.trim());
      setCommentText('');
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Just now';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div className="post">
      <div className="post-header">
        <div className="post-user-info">
          <div className="profile-pic">
            {post.authorProfilePic ? (
              <img src={post.authorProfilePic} alt="Profile" />
            ) : (
              <div className="profile-placeholder">
                {post.authorName?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
          </div>
          <div className="user-details">
            <span className="username">{post.authorName}</span>
            <span className="timestamp">{formatTimestamp(post.timestamp)}</span>
          </div>
        </div>
      </div>

      <div className="post-image">
        <img src={post.imageUrl} alt="Post" />
      </div>

      <div className="post-actions">
        <button 
          className={`like-btn ${isLiked ? 'liked' : ''}`}
          onClick={handleLike}
        >
          {isLiked ? '❤️' : '🤍'} {likeCount}
        </button>
        
        <button 
          className="comment-btn"
          onClick={() => setShowComments(!showComments)}
        >
          💬 {commentCount}
        </button>
      </div>

      <div className="post-caption">
        <span className="username">{post.authorName}</span>
        <span className="caption-text">{post.caption}</span>
      </div>

      {showComments && (
        <div className="comments-section">
          <div className="comments-list">
            {post.comments?.map((comment, index) => (
              <div key={comment.id || index} className="comment">
                <span className="username">{comment.authorName}</span>
                <span className="comment-text">{comment.text}</span>
              </div>
            ))}
          </div>
          
          <form onSubmit={handleComment} className="comment-form">
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button type="submit" disabled={!commentText.trim()}>
              Post
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Post;

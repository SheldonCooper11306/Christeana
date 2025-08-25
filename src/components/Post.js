import React, { useState, useRef, useEffect } from 'react';
import InteractivePost from './InteractivePost';
import './Post.css';

const Post = ({ 
  id, 
  type, 
  imageUrl, 
  images, 
  caption, 
  username, 
  profileImage,
  currentUser,
  likes, 
  comments = [], 
  hasMusic,
  musicTrack,
  musicArtist,
  musicUrl,
  onLike, 
  onComment,
  onAudioPlay,
  onAudioStop,
  currentlyPlayingAudio
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Sync local playing state with global audio management
  useEffect(() => {
    if (currentlyPlayingAudio && audioRef.current && currentlyPlayingAudio !== audioRef.current) {
      // Another audio is playing, stop this one
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [currentlyPlayingAudio, isPlaying]);

  const handleLike = () => {
    if (!isLiked) {
      setIsLiked(true);
      onLike();
    }
  };



  const handleAudioPlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        if (onAudioStop) {
          onAudioStop(audioRef.current);
        }
      } else {
        // Call global audio management before playing
        if (onAudioPlay) {
          onAudioPlay(audioRef.current, id);
        }
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    if (onAudioStop) {
      onAudioStop(audioRef.current);
    }
  };

  const formatLikes = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const renderContent = () => {
    switch (type) {
      case 'photo':
        return (
          <div className="post-image-container">
            <img src={imageUrl} alt="Post" className="post-image" />
            {hasMusic && (
              <>
                <audio
                  ref={audioRef}
                  onEnded={handleAudioEnded}
                  preload="metadata"
                  loop
                >
                  <source src={musicUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
                <div className="music-overlay">
                  <div className="music-info">
                    <svg className="music-note-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                    </svg>
                    <div className="music-details">
                      <span className="music-text">{musicTrack}</span>
                      <span className="music-artist">{musicArtist}</span>
                    </div>
                    <button 
                      className="play-button"
                      onClick={handleAudioPlay}
                      title={isPlaying ? "Pause" : "Play"}
                    >
                      <svg className="play-icon" viewBox="0 0 24 24" fill="currentColor">
                        {isPlaying ? (
                          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                        ) : (
                          <path d="M8 5v14l11-7z"/>
                        )}
                      </svg>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        );
      
      case 'group-photos':
        return (
          <div className="group-photos">
            {images.map((image, index) => (
              <img 
                key={index} 
                src={image} 
                alt={`Photo ${index + 1}`} 
                className="group-photo"
              />
            ))}
          </div>
        );
      
      case 'interactive':
        return <InteractivePost postId={id} onMessageSubmitted={onComment} />;
      
      default:
        return null;
    }
  };

  if (type === 'interactive') {
    return (
      <div className="post">
        <div className="post-header">
          <div className="user-info">
            <div className="user-avatar">
              <img src={profileImage || "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face"} alt="User" />
            </div>
            <span className="username">{username}</span>
          </div>
        </div>
        
        <div className="post-content">
          <div className="post-caption">
            <p>{caption}</p>
          </div>
          {renderContent()}
        </div>
      </div>
    );
  }

  return (
    <div className="post">
      <div className="post-header">
        <div className="user-info">
          <div className="user-avatar">
            <img src={profileImage || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face"} alt="User" />
          </div>
          <span className="username">{username}</span>
        </div>
        <div className="post-options">
          <span>•••</span>
        </div>
      </div>

      <div className="post-content">
        {renderContent()}
        
        <div className="post-actions">
          <button 
            className={`action-button ${isLiked ? 'liked' : ''}`}
            onClick={handleLike}
            title={isLiked ? "Unlike" : "Like"}
          >
            <svg className="action-icon" viewBox="0 0 24 24" fill="currentColor">
              {isLiked ? (
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              ) : (
                <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3z"/>
              )}
            </svg>
          </button>

          <button className="action-button" title="Share">
            <svg className="action-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
            </svg>
          </button>
          <button className="save-button" title="Save">
            <svg className="action-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
            </svg>
          </button>
        </div>

        <div className="post-stats">
          <div className="likes-count">
            {formatLikes(likes)} likes
          </div>
          
          <div className="post-caption">
            <span className="username">{username}</span> {caption}
          </div>

          {comments && comments.length > 0 && (
            <div className="comments-section">
              {comments.slice(0, 2).map((comment, index) => (
                <div key={index} className="comment">
                  <span className="username">{comment.username}</span> {comment.text}
                </div>
              ))}
              {comments.length > 2 && (
                <div className="view-more-comments">
                  View all {comments.length} comments
                </div>
              )}
            </div>
          )}
        </div>




      </div>
    </div>
  );
};

export default Post;

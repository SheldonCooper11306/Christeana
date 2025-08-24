import React, { useState, useEffect } from 'react';
import Post from './Post';
import { database } from '../firebase/config';
import { ref, onValue, set, push, child } from 'firebase/database';
import './Feed.css';

const Feed = ({ currentUser }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set the 3 specific posts exactly as they were
    const specificPosts = [
      {
        id: 1,
        type: 'photo',
        imageUrl: '/BirthdayGirl.jpg',
        caption: 'Happy Birthday Eana! 🎉 May your day be filled with joy and love. You deserve all the happiness in the world! ',
        username: 'jooooommm',
        profileImage: '/jomm.jpg',
        likes: 1247,
        comments: [],
        hasMusic: true,
        musicTrack: 'Happy Birthday - Music Box Version',
        musicArtist: 'Instrumental City',
        musicUrl: '/Happy Birthday to YouBirthday Song [Music Box].mp3'
      },
      {
        id: 2,
        type: 'photo',
        imageUrl: '/Eana.jpg',
        caption: 'I want to be completely honest with you... I\'m courting you.  Every moment we\'ve spent together made me realize how special you are. You\'re not just someone I care about,you\'re someone I want to build a future with. Will you let me show you how much you mean to me? ❤️',
        username: 'jooooommm',
        profileImage: '/jomm.jpg',
        likes: 2156,
        comments: [],
        hasMusic: true,
        musicTrack: 'We Could Happen',
        musicArtist: 'AJ Rafael',
        musicUrl: '/Aj Rafael - We Could Happen (Lyrics).mp3'
      },
      {
        id: 3,
        type: 'interactive',
        caption: 'Now it\'s your turn... Share your thoughts, feelings, or message. I want to hear what\'s in your heart. ',
        username: 'jooooommm',
        profileImage: '/jomm.jpg',
        likes: 0,
        comments: []
      }
    ];

    // Show posts immediately - no database loading needed
    setPosts(specificPosts);
    setLoading(false);

    // Load user interactions (likes, comments) from database
    const loadUserInteractions = async () => {
      try {
        // Load likes for each post
        for (let i = 0; i < specificPosts.length; i++) {
          const postId = i + 1;
          
          // Load likes count
          const likesRef = ref(database, `posts/${postId}/likes`);
          onValue(likesRef, (snapshot) => {
            const likesCount = snapshot.val() || 0;
            if (likesCount > 0) {
              setPosts(prevPosts => 
                prevPosts.map(post => 
                  post.id === postId ? { ...post, likes: likesCount } : post
                )
              );
            }
          });

          // Load comments
          const commentsRef = ref(database, `posts/${postId}/comments`);
          onValue(commentsRef, (snapshot) => {
            const comments = snapshot.val() || [];
            if (comments.length > 0) {
              setPosts(prevPosts => 
                prevPosts.map(post => 
                  post.id === postId ? { ...post, comments: comments } : post
                )
              );
            }
          });
        }
      } catch (error) {
        console.log('Loading user interactions:', error);
      }
    };

    // Load interactions in background
    loadUserInteractions();

    return () => {
      // Cleanup listeners
      const postsRef = ref(database, 'posts');
      onValue(postsRef, () => {});
    };
  }, []);

  const handleLike = (postId) => {
    const currentPost = posts.find(p => p.id === postId);
    const newLikesCount = currentPost.likes + 1;
    
    // Update local state immediately for better UX
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, likes: newLikesCount }
          : post
      )
    );
    
    // Save to database in background
    const postRef = ref(database, `posts/${postId}/likes`);
    set(postRef, newLikesCount);
    
    // Track user interaction in database
    if (currentUser) {
      const userActivityRef = ref(database, `userActivity/${currentUser.uid}/likes`);
      push(userActivityRef, {
        postId: postId,
        timestamp: Date.now(),
        action: 'like'
      });
    }
  };

  const handleComment = (postId, comment) => {
    const newComment = {
      ...comment,
      timestamp: Date.now()
    };
    
    // Update local state immediately for better UX
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, comments: [...post.comments, newComment] }
          : post
      )
    );
    
    // Save to database in background
    const commentsRef = ref(database, `posts/${postId}/comments`);
    const newCommentRef = push(commentsRef);
    set(newCommentRef, newComment);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="feed-container">
      <div className="feed-posts">
        {posts.map(post => (
          <Post
            key={post.id}
            {...post}
            currentUser={currentUser}
            onLike={() => handleLike(post.id)}
            onComment={handleComment}
          />
        ))}
      </div>
    </div>
  );
};

export default Feed;

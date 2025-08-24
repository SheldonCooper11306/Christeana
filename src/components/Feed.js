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

    // Show posts immediately for better UX
    setPosts(specificPosts);
    setLoading(false);

    // Set a safety timeout to ensure loading doesn't get stuck
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 3000); // 3 seconds timeout

    // Initialize posts in database in the background
    const postsRef = ref(database, 'posts');
    onValue(postsRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        // Initialize posts in database
        set(postsRef, specificPosts);
      } else {
        // Update posts with database data if different
        const dbPosts = Object.values(data);
        if (JSON.stringify(dbPosts) !== JSON.stringify(specificPosts)) {
          setPosts(dbPosts);
        }
      }
    });

    return () => {
      // Cleanup listener and timeout
      clearTimeout(timeoutId);
      const postsRef = ref(database, 'posts');
      onValue(postsRef, () => {});
    };
  }, []);

  const handleLike = (postId) => {
    const postRef = ref(database, `posts/${postId - 1}/likes`);
    set(postRef, posts.find(p => p.id === postId).likes + 1);
    
    // Track user interaction in database
    if (currentUser) {
      const userActivityRef = ref(database, `userActivity/${currentUser.uid}/likes`);
      push(userActivityRef, {
        postId: postId,
        timestamp: Date.now(),
        action: 'like'
      });
    }
    
    // Also update local state
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, likes: post.likes + 1 }
          : post
      )
    );
  };

  const handleComment = (postId, comment) => {
    const commentsRef = ref(database, `posts/${postId - 1}/comments`);
    const newCommentRef = push(commentsRef);
    set(newCommentRef, {
      ...comment,
      timestamp: Date.now()
    });
    
    // Also update local state
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, comments: [...post.comments, comment] }
          : post
      )
    );
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

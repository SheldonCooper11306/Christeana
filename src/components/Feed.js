import React, { useState, useEffect } from 'react';
import Post from './Post';
import databaseService from '../services/databaseService';
import './Feed.css';

const Feed = ({ currentUser }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribePosts = null;
    let unsubscribeComments = {};

    const initializeFeed = async () => {
      try {
        setLoading(true);
        
        // Initialize default posts in database if they don't exist
        await databaseService.initializeDefaultPosts();
        
        // Set up real-time listener for posts
        unsubscribePosts = databaseService.listenToPosts((postsData) => {
          // Convert to array format with proper IDs
          const postsArray = [];
          
          // Ensure we have the 3 default posts in the right order
          for (let i = 1; i <= 3; i++) {
            const postData = postsData.find(p => p.id === i.toString()) || postsData.find(p => p.id === i);
            if (postData) {
              postsArray.push({
                ...postData,
                id: i,
                comments: [] // Initialize comments array
              });
            }
          }
          
          // If no posts from database, use fallback
          if (postsArray.length === 0) {
            const fallbackPosts = [
              {
                id: 1,
                type: 'photo',
                imageUrl: '/BirthdayGirl.jpg',
                caption: 'Happy Birthday Eana! 🎉 May your day be filled with joy and love. You deserve all the happiness in the world!',
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
                caption: 'I want to be completely honest with you... I\'m courting you. Every moment we\'ve spent together made me realize how special you are. You\'re not just someone I care about, you\'re someone I want to build a future with. Will you let me show you how much you mean to me? ❤️',
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
                caption: 'Now it\'s your turn... Share your thoughts, feelings, or message. I want to hear what\'s in your heart.',
                username: 'jooooommm',
                profileImage: '/jomm.jpg',
                likes: 0,
                comments: []
              }
            ];
            postsArray.push(...fallbackPosts);
          }
          
          setPosts(postsArray);
          setLoading(false);
        });

        // Set up listeners for comments on each post
        for (let i = 1; i <= 3; i++) {
          unsubscribeComments[i] = databaseService.listenToComments(i, (comments) => {
            setPosts(prevPosts =>
              prevPosts.map(post =>
                post.id === i ? { ...post, comments: comments } : post
              )
            );
          });
        }

      } catch (error) {
        console.error('Error initializing feed:', error);
        setLoading(false);
      }
    };

    initializeFeed();

    // Cleanup function
    return () => {
      if (unsubscribePosts) {
        unsubscribePosts();
      }
      Object.values(unsubscribeComments).forEach(unsubscribe => {
        if (unsubscribe) unsubscribe();
      });
    };
  }, []);

  const handleLike = async (postId) => {
    if (!currentUser) {
      alert('Please log in to like posts');
      return;
    }

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
    
    // Save to database
    try {
      await databaseService.likePost(postId, currentUser.uid);
    } catch (error) {
      console.error('Error liking post:', error);
      // Revert optimistic update on error
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? { ...post, likes: currentPost.likes }
            : post
        )
      );
    }
  };

  const handleComment = async (postId, comment) => {
    if (!currentUser) {
      alert('Please log in to comment');
      return;
    }

    const newComment = {
      ...comment,
      username: currentUser.displayName || currentUser.username,
      userId: currentUser.uid
    };
    
    // Save to database
    try {
      const result = await databaseService.addComment(postId, currentUser.uid, newComment);
      if (!result.success) {
        console.error('Error adding comment:', result.error);
        alert('Failed to add comment. Please try again.');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment. Please try again.');
    }
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

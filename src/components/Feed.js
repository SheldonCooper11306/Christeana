import React, { useState, useEffect } from 'react';
import { db, auth, storage } from '../firebase/config';
import { collection, addDoc, getDocs, orderBy, query, serverTimestamp, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Post from './Post';
import CreatePost from './CreatePost';
import ProfileModal from './ProfileModal';
import './Feed.css';

const Feed = ({ currentUser }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      const postsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // If no posts exist, create some sample posts
      if (postsData.length === 0) {
        await createSamplePosts();
        // Fetch again after creating sample posts
        const newQuerySnapshot = await getDocs(q);
        const newPostsData = newQuerySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPosts(newPostsData);
      } else {
        setPosts(postsData);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      // If there's an error, create sample posts locally
      createLocalSamplePosts();
    } finally {
      setLoading(false);
    }
  };

  const createSamplePosts = async () => {
    try {
      const samplePosts = [
        {
          imageUrl: '/BirthdayGirl.jpg',
          caption: 'Happy Birthday Eana! 🎉 May your day be filled with joy and love. You deserve all the happiness in the world!',
          authorName: 'jom',
          authorEmail: 'jom@gmail.com',
          timestamp: serverTimestamp(),
          likes: [],
          comments: []
        },
        {
          imageUrl: '/Eana.jpg',
          caption: 'I want to be completely honest with you... I\'m courting you. Every moment we\'ve spent together made me realize how special you are. You\'re not just someone I care about, you\'re someone I want to build a future with. Will you let me show you how much you mean to me? ❤️',
          authorName: 'jom',
          authorEmail: 'jom@gmail.com',
          timestamp: serverTimestamp(),
          likes: [],
          comments: []
        }
      ];

      for (const post of samplePosts) {
        await addDoc(collection(db, 'posts'), post);
      }
    } catch (error) {
      console.error('Error creating sample posts:', error);
    }
  };

  const createLocalSamplePosts = () => {
    const samplePosts = [
      {
        id: '1',
        imageUrl: '/BirthdayGirl.jpg',
        caption: 'Happy Birthday Eana! 🎉 May your day be filled with joy and love. You deserve all the happiness in the world!',
        authorName: 'jom',
        authorEmail: 'jom@gmail.com',
        timestamp: new Date(),
        likes: [],
        comments: []
      },
      {
        id: '2',
        imageUrl: '/Eana.jpg',
        caption: 'I want to be completely honest with you... I\'m courting you. Every moment we\'ve spent together made me realize how special you are. You\'re not just someone I care about, you\'re someone I want to build a future with. Will you let me show you how much you mean to me? ❤️',
        authorName: 'jom',
        authorEmail: 'jom@gmail.com',
        timestamp: new Date(),
        likes: [],
        comments: []
      }
    ];
    setPosts(samplePosts);
  };

  const handleCreatePost = async (postData) => {
    try {
      const newPost = {
        ...postData,
        authorId: currentUser.uid,
        authorName: currentUser.displayName,
        authorEmail: currentUser.email,
        timestamp: serverTimestamp(),
        likes: [],
        comments: []
      };

      const docRef = await addDoc(collection(db, 'posts'), newPost);
      const postWithId = { ...newPost, id: docRef.id };
      
      setPosts(prevPosts => [postWithId, ...prevPosts]);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleLike = async (postId, isLiked) => {
    try {
      const postRef = doc(db, 'posts', postId);
      if (isLiked) {
        await updateDoc(postRef, {
          likes: arrayRemove(currentUser.uid)
        });
      } else {
        await updateDoc(postRef, {
          likes: arrayUnion(currentUser.uid)
        });
      }
      
      // Update local state
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                likes: isLiked 
                  ? post.likes.filter(id => id !== currentUser.uid)
                  : [...post.likes, currentUser.uid]
              }
            : post
        )
      );
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  const handleComment = async (postId, commentText) => {
    try {
      const comment = {
        id: Date.now().toString(),
        text: commentText,
        authorId: currentUser.uid,
        authorName: currentUser.displayName,
        timestamp: serverTimestamp()
      };

      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        comments: arrayUnion(comment)
      });

      // Update local state
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { ...post, comments: [...post.comments, comment] }
            : post
        )
      );
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  if (loading) {
    return (
      <div className="feed-loading">
        <div className="loading-spinner"></div>
        <p>Loading posts...</p>
      </div>
    );
  }

  return (
    <div className="feed-container">
      <div className="feed-header">
        <div className="user-profile" onClick={() => setShowProfileModal(true)}>
          <div className="profile-pic">
            {currentUser.profilePic ? (
              <img src={currentUser.profilePic} alt="Profile" />
            ) : (
              <div className="profile-placeholder">
                {currentUser.displayName?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
          </div>
          <div className="user-info">
            <h3>{currentUser.displayName}</h3>
            <p>{currentUser.email}</p>
          </div>
        </div>
      </div>

      <CreatePost onCreatePost={handleCreatePost} currentUser={currentUser} />

      <div className="posts-container">
        {posts.length === 0 ? (
          <div className="no-posts">
            <p>No posts yet. Be the first to share something!</p>
          </div>
        ) : (
          posts.map(post => (
            <Post
              key={post.id}
              post={post}
              currentUser={currentUser}
              onLike={handleLike}
              onComment={handleComment}
            />
          ))
        )}
      </div>

      {showProfileModal && (
        <ProfileModal
          currentUser={currentUser}
          onClose={() => setShowProfileModal(false)}
          onUpdateProfile={(updatedUser) => {
            // Update local state
            setShowProfileModal(false);
          }}
        />
      )}
    </div>
  );
};

export default Feed;

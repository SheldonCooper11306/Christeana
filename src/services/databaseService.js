import { database } from '../firebase/config';
import { 
  ref, 
  set, 
  get, 
  push, 
  update, 
  remove, 
  onValue, 
  off,
  serverTimestamp,
  increment
} from 'firebase/database';
import { 
  validateUser, 
  validateComment, 
  validateBirthdayMessage, 
  sanitizeText 
} from '../utils/validation';

// Database service for handling all Firebase operations
class DatabaseService {
  
  // ============= USER OPERATIONS =============
  
  /**
   * Create or update user profile
   */
  async createUserProfile(uid, userData) {
    try {
      // Validate user data
      const validation = validateUser(userData);
      if (!validation.isValid) {
        return { success: false, error: validation.errors.join(', ') };
      }

      // Sanitize text fields
      const sanitizedData = {
        ...userData,
        username: sanitizeText(userData.username),
        displayName: sanitizeText(userData.displayName),
        email: sanitizeText(userData.email)
      };

      const userRef = ref(database, `users/${uid}`);
      await set(userRef, {
        ...sanitizedData,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error creating user profile:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get user profile
   */
  async getUserProfile(uid) {
    try {
      const userRef = ref(database, `users/${uid}`);
      const snapshot = await get(userRef);
      return snapshot.exists() ? snapshot.val() : null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  /**
   * Update user last login
   */
  async updateUserLastLogin(uid) {
    try {
      const userRef = ref(database, `users/${uid}`);
      await update(userRef, {
        lastLogin: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating last login:', error);
    }
  }

  // ============= POSTS OPERATIONS =============

  /**
   * Get all posts with real-time updates
   */
  listenToPosts(callback) {
    const postsRef = ref(database, 'posts');
    const unsubscribe = onValue(postsRef, (snapshot) => {
      const posts = [];
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          posts.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
          });
        });
      }
      callback(posts);
    });
    
    return unsubscribe;
  }

  /**
   * Initialize default posts if they don't exist
   */
  async initializeDefaultPosts() {
    try {
      const postsRef = ref(database, 'posts');
      const snapshot = await get(postsRef);
      
      if (!snapshot.exists()) {
        const defaultPosts = {
          '1': {
            type: 'photo',
            imageUrl: '/BirthdayGirl.jpg',
            caption: 'Happy Birthday Eana! 🎉 May your day be filled with joy and love. You deserve all the happiness in the world!',
            username: 'jooooommm',
            profileImage: '/jomm.jpg',
            likes: 1247,
            hasMusic: true,
            musicTrack: 'Happy Birthday - Music Box Version',
            musicArtist: 'Instrumental City',
            musicUrl: '/Happy Birthday to YouBirthday Song [Music Box].mp3',
            createdAt: serverTimestamp()
          },
          '2': {
            type: 'photo',
            imageUrl: '/Eana.jpg',
            caption: 'I want to be completely honest with you... I\'m courting you. Every moment we\'ve spent together made me realize how special you are. You\'re not just someone I care about, you\'re someone I want to build a future with. Will you let me show you how much you mean to me? ❤️',
            username: 'jooooommm',
            profileImage: '/jomm.jpg',
            likes: 2156,
            hasMusic: true,
            musicTrack: 'We Could Happen',
            musicArtist: 'AJ Rafael',
            musicUrl: '/Aj Rafael - We Could Happen (Lyrics).mp3',
            createdAt: serverTimestamp()
          },
          '3': {
            type: 'interactive',
            caption: 'Now it\'s your turn... Share your thoughts, feelings, or message. I want to hear what\'s in your heart.',
            username: 'jooooommm',
            profileImage: '/jomm.jpg',
            likes: 0,
            createdAt: serverTimestamp()
          }
        };

        await set(postsRef, defaultPosts);
        console.log('Default posts initialized');
      }
    } catch (error) {
      console.error('Error initializing default posts:', error);
    }
  }

  /**
   * Like a post
   */
  async likePost(postId, userId) {
    try {
      const likesRef = ref(database, `posts/${postId}/likes`);
      const userLikeRef = ref(database, `posts/${postId}/likedBy/${userId}`);
      const userActivityRef = ref(database, `userActivity/${userId}/likes`);

      // Increment likes count and record user like
      await Promise.all([
        update(likesRef, increment(1)),
        set(userLikeRef, {
          timestamp: serverTimestamp(),
          userId: userId
        }),
        push(userActivityRef, {
          postId: postId,
          timestamp: serverTimestamp(),
          action: 'like'
        })
      ]);

      return { success: true };
    } catch (error) {
      console.error('Error liking post:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Check if user has liked a post
   */
  async hasUserLikedPost(postId, userId) {
    try {
      const userLikeRef = ref(database, `posts/${postId}/likedBy/${userId}`);
      const snapshot = await get(userLikeRef);
      return snapshot.exists();
    } catch (error) {
      console.error('Error checking user like:', error);
      return false;
    }
  }

  // ============= COMMENTS OPERATIONS =============

  /**
   * Add comment to post
   */
  async addComment(postId, userId, comment) {
    try {
      // Validate comment data
      const validation = validateComment(comment);
      if (!validation.isValid) {
        return { success: false, error: validation.errors.join(', ') };
      }

      // Sanitize comment text
      const sanitizedComment = {
        ...comment,
        text: sanitizeText(comment.text),
        username: sanitizeText(comment.username)
      };

      const commentsRef = ref(database, `posts/${postId}/comments`);
      const newCommentRef = push(commentsRef);
      
      const commentData = {
        userId: userId,
        username: sanitizedComment.username,
        text: sanitizedComment.text,
        timestamp: serverTimestamp(),
        id: newCommentRef.key
      };

      await set(newCommentRef, commentData);

      // Track user activity
      const userActivityRef = ref(database, `userActivity/${userId}/comments`);
      await push(userActivityRef, {
        postId: postId,
        commentId: newCommentRef.key,
        timestamp: serverTimestamp(),
        action: 'comment'
      });

      return { success: true, commentId: newCommentRef.key };
    } catch (error) {
      console.error('Error adding comment:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get comments for a post with real-time updates
   */
  listenToComments(postId, callback) {
    const commentsRef = ref(database, `posts/${postId}/comments`);
    const unsubscribe = onValue(commentsRef, (snapshot) => {
      const comments = [];
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          comments.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
          });
        });
      }
      callback(comments);
    });
    
    return unsubscribe;
  }

  // ============= MESSAGES OPERATIONS =============

  /**
   * Save a birthday message
   */
  async saveBirthdayMessage(messageData) {
    try {
      // Validate message data
      const validation = validateBirthdayMessage(messageData);
      if (!validation.isValid) {
        return { success: false, error: validation.errors.join(', ') };
      }

      // Sanitize message text
      const sanitizedMessage = {
        ...messageData,
        text: sanitizeText(messageData.text),
        username: sanitizeText(messageData.username)
      };

      const messagesRef = ref(database, 'birthdayMessages');
      const newMessageRef = push(messagesRef);
      
      const fullMessageData = {
        ...sanitizedMessage,
        id: newMessageRef.key,
        timestamp: serverTimestamp(),
        createdAt: new Date().toISOString(),
        userAgent: navigator.userAgent,
        pageUrl: window.location.href,
        referrer: document.referrer,
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };

      await set(newMessageRef, fullMessageData);
      return { success: true, messageId: newMessageRef.key };
    } catch (error) {
      console.error('Error saving birthday message:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get all birthday messages with real-time updates
   */
  listenToBirthdayMessages(callback) {
    const messagesRef = ref(database, 'birthdayMessages');
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const messages = [];
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          messages.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
          });
        });
        // Sort by timestamp (newest first)
        messages.sort((a, b) => {
          const timeA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.createdAt);
          const timeB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.createdAt);
          return timeB - timeA;
        });
      }
      callback(messages);
    });
    
    return unsubscribe;
  }

  /**
   * Delete a birthday message (admin only)
   */
  async deleteBirthdayMessage(messageId) {
    try {
      const messageRef = ref(database, `birthdayMessages/${messageId}`);
      await remove(messageRef);
      return { success: true };
    } catch (error) {
      console.error('Error deleting birthday message:', error);
      return { success: false, error: error.message };
    }
  }

  // ============= ANALYTICS OPERATIONS =============

  /**
   * Track page view
   */
  async trackPageView(userId, pageUrl) {
    try {
      const pageViewRef = ref(database, `analytics/pageViews`);
      await push(pageViewRef, {
        userId: userId,
        pageUrl: pageUrl,
        timestamp: serverTimestamp(),
        userAgent: navigator.userAgent,
        referrer: document.referrer
      });
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  }

  /**
   * Get analytics data (admin only)
   */
  async getAnalytics() {
    try {
      const analyticsRef = ref(database, 'analytics');
      const snapshot = await get(analyticsRef);
      return snapshot.exists() ? snapshot.val() : {};
    } catch (error) {
      console.error('Error getting analytics:', error);
      return {};
    }
  }

  // ============= UTILITY METHODS =============

  /**
   * Clean up listeners
   */
  cleanup(ref, callback) {
    off(ref, callback);
  }

  /**
   * Export data for backup (admin only)
   */
  async exportAllData() {
    try {
      const rootRef = ref(database);
      const snapshot = await get(rootRef);
      return snapshot.exists() ? snapshot.val() : {};
    } catch (error) {
      console.error('Error exporting data:', error);
      return {};
    }
  }
}

// Create and export a singleton instance
const databaseService = new DatabaseService();
export default databaseService;

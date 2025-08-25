// Data validation utilities for the birthday app

/**
 * Validate user data
 */
export const validateUser = (userData) => {
  const errors = [];
  
  if (!userData.username || typeof userData.username !== 'string' || userData.username.trim().length === 0) {
    errors.push('Username is required');
  }
  
  if (!userData.email || typeof userData.email !== 'string' || !isValidEmail(userData.email)) {
    errors.push('Valid email is required');
  }
  
  if (!userData.displayName || typeof userData.displayName !== 'string' || userData.displayName.trim().length === 0) {
    errors.push('Display name is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate comment data
 */
export const validateComment = (commentData) => {
  const errors = [];
  
  if (!commentData.text || typeof commentData.text !== 'string' || commentData.text.trim().length === 0) {
    errors.push('Comment text is required');
  }
  
  if (commentData.text && commentData.text.length > 500) {
    errors.push('Comment text must be less than 500 characters');
  }
  
  if (!commentData.username || typeof commentData.username !== 'string' || commentData.username.trim().length === 0) {
    errors.push('Username is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate birthday message data
 */
export const validateBirthdayMessage = (messageData) => {
  const errors = [];
  
  if (!messageData.text || typeof messageData.text !== 'string' || messageData.text.trim().length === 0) {
    errors.push('Message text is required');
  }
  
  if (messageData.text && messageData.text.length > 1000) {
    errors.push('Message text must be less than 1000 characters');
  }
  
  if (!messageData.username || typeof messageData.username !== 'string' || messageData.username.trim().length === 0) {
    errors.push('Username is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate post data
 */
export const validatePost = (postData) => {
  const errors = [];
  
  if (!postData.caption || typeof postData.caption !== 'string' || postData.caption.trim().length === 0) {
    errors.push('Caption is required');
  }
  
  if (!postData.username || typeof postData.username !== 'string' || postData.username.trim().length === 0) {
    errors.push('Username is required');
  }
  
  if (!postData.type || !['photo', 'interactive'].includes(postData.type)) {
    errors.push('Valid post type is required');
  }
  
  if (postData.type === 'photo' && (!postData.imageUrl || typeof postData.imageUrl !== 'string')) {
    errors.push('Image URL is required for photo posts');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Sanitize text input to prevent XSS
 */
export const sanitizeText = (text) => {
  if (typeof text !== 'string') return '';
  
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
};

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};



/**
 * Format timestamp for display
 */
export const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'Unknown time';
  
  let date;
  if (timestamp.toDate) {
    // Firebase timestamp
    date = timestamp.toDate();
  } else if (timestamp instanceof Date) {
    // JavaScript Date
    date = timestamp;
  } else {
    // ISO string or number
    date = new Date(timestamp);
  }
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }
  
  return date.toLocaleString();
};

/**
 * Generate unique ID
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Deep clone object
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const copy = {};
    Object.keys(obj).forEach(key => {
      copy[key] = deepClone(obj[key]);
    });
    return copy;
  }
};

/**
 * Debounce function for limiting API calls
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Check if value is empty
 */
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

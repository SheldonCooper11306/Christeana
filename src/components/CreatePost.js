import React, { useState } from 'react';
import { storage } from '../firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './CreatePost.css';

const CreatePost = ({ onCreatePost, currentUser }) => {
  const [caption, setCaption] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile || !caption.trim()) {
      alert('Please select an image and write a caption');
      return;
    }

    setIsLoading(true);
    try {
      // Upload image to Firebase Storage
      const imageRef = ref(storage, `posts/${currentUser.uid}/${Date.now()}_${imageFile.name}`);
      const snapshot = await uploadBytes(imageRef, imageFile);
      const imageUrl = await getDownloadURL(snapshot.ref);

      // Create post data
      const postData = {
        imageUrl,
        caption: caption.trim(),
        timestamp: new Date()
      };

      onCreatePost(postData);

      // Reset form
      setCaption('');
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  return (
    <div className="create-post">
      <div className="create-post-header">
        <div className="user-info">
          <div className="profile-pic">
            {currentUser.profilePic ? (
              <img src={currentUser.profilePic} alt="Profile" />
            ) : (
              <div className="profile-placeholder">
                {currentUser.displayName?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
          </div>
          <span>{currentUser.displayName}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="create-post-form">
        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Preview" />
            <button type="button" onClick={removeImage} className="remove-image">
              ✕
            </button>
          </div>
        )}

        <div className="form-group">
          <textarea
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            disabled={isLoading}
            rows="3"
          />
        </div>

        <div className="form-actions">
          <label className="image-upload-btn">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              disabled={isLoading}
            />
            📷 Add Photo
          </label>
          
          <button
            type="submit"
            className="post-btn"
            disabled={isLoading || !imageFile || !caption.trim()}
          >
            {isLoading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;

import React, { useState } from 'react';
import { auth, storage } from '../firebase/config';
import { updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './ProfileModal.css';

const ProfileModal = ({ currentUser, onClose, onUpdateProfile }) => {
  const [displayName, setDisplayName] = useState(currentUser.displayName || '');
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(currentUser.profilePic);
  const [isLoading, setIsLoading] = useState(false);

  const handleProfilePicSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setProfilePicPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let newProfilePicUrl = currentUser.profilePic;

      // Upload new profile picture if selected
      if (profilePicFile) {
        const profilePicRef = ref(storage, `profiles/${currentUser.uid}/profile.jpg`);
        const snapshot = await uploadBytes(profilePicRef, profilePicFile);
        newProfilePicUrl = await getDownloadURL(snapshot.ref);
      }

      // Update profile
      await updateProfile(auth.currentUser, {
        displayName: displayName.trim(),
        photoURL: newProfilePicUrl
      });

      // Call parent callback with updated user data
      onUpdateProfile({
        ...currentUser,
        displayName: displayName.trim(),
        profilePic: newProfilePicUrl
      });

      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const removeProfilePic = () => {
    setProfilePicFile(null);
    setProfilePicPreview(null);
  };

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Profile</h2>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="profile-pic-section">
            <div className="current-profile-pic">
              {profilePicPreview ? (
                <img src={profilePicPreview} alt="Profile" />
              ) : (
                <div className="profile-placeholder">
                  {displayName.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
            </div>
            
            <div className="profile-pic-actions">
              <label className="upload-btn">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePicSelect}
                  disabled={isLoading}
                />
                📷 Change Photo
              </label>
              {profilePicPreview && (
                <button
                  type="button"
                  onClick={removeProfilePic}
                  className="remove-btn"
                  disabled={isLoading}
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter display name"
              disabled={isLoading}
              maxLength="30"
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="cancel-btn"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="save-btn"
              disabled={isLoading || !displayName.trim()}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;

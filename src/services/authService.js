import { auth, database } from '../firebase/config';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { ref, set, get, update } from 'firebase/database';
import databaseService from './databaseService';

// Authentication service for handling user auth and profiles
class AuthService {
  
  /**
   * Predefined user accounts for the birthday app
   */
  static PREDEFINED_ACCOUNTS = {
    'jom': {
      password: 'jom123',
      displayName: 'Jom',
      isAdmin: true,
      email: 'jom@birthday.app'
    },
    'eana': {
      password: 'eana123',
      displayName: 'Eana',
      isAdmin: false,
      email: 'eana@birthday.app'
    },
    'xandy': {
      password: 'xandy123',
      displayName: 'Xandy',
      isAdmin: false,
      email: 'xandy@birthday.app'
    },
    'guest': {
      password: 'guest123',
      displayName: 'Guest',
      isAdmin: false,
      email: 'guest@birthday.app'
    }
  };

  /**
   * Initialize predefined accounts in Firebase Auth
   */
  async initializePredefinedAccounts() {
    try {
      for (const [username, userData] of Object.entries(AuthService.PREDEFINED_ACCOUNTS)) {
        try {
          // Try to create the user account
          const userCredential = await createUserWithEmailAndPassword(
            auth, 
            userData.email, 
            userData.password
          );
          
          // Update the user profile
          await updateProfile(userCredential.user, {
            displayName: userData.displayName
          });

          // Create user profile in database
          await databaseService.createUserProfile(userCredential.user.uid, {
            username: username,
            displayName: userData.displayName,
            email: userData.email,
            isAdmin: userData.isAdmin,
            profileImage: username === 'jom' ? '/jomm.jpg' : null
          });

          console.log(`Created account for ${username}`);
        } catch (error) {
          if (error.code === 'auth/email-already-in-use') {
            // Account already exists, that's fine
            console.log(`Account for ${username} already exists`);
          } else {
            console.error(`Error creating account for ${username}:`, error);
          }
        }
      }
    } catch (error) {
      console.error('Error initializing predefined accounts:', error);
    }
  }

  /**
   * Login with username/password (custom logic for predefined accounts)
   */
  async loginWithCredentials(username, password) {
    try {
      // Check if it's a predefined account
      const accountData = AuthService.PREDEFINED_ACCOUNTS[username.toLowerCase()];
      
      if (!accountData) {
        throw new Error('Invalid username or password');
      }

      if (accountData.password !== password) {
        throw new Error('Invalid username or password');
      }

      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(
        auth,
        accountData.email,
        password
      );

      // Update last login
      await databaseService.updateUserLastLogin(userCredential.user.uid);

      // Get user profile from database
      const userProfile = await databaseService.getUserProfile(userCredential.user.uid);

      return {
        success: true,
        user: {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: userProfile?.displayName || accountData.displayName,
          username: userProfile?.username || username,
          isAdmin: userProfile?.isAdmin || accountData.isAdmin,
          profileImage: userProfile?.profileImage
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.message || 'Login failed'
      };
    }
  }

  /**
   * Fallback login (without Firebase Auth for offline use)
   */
  loginFallback(username, password) {
    try {
      const accountData = AuthService.PREDEFINED_ACCOUNTS[username.toLowerCase()];
      
      if (!accountData || accountData.password !== password) {
        return {
          success: false,
          error: 'Invalid username or password'
        };
      }

      return {
        success: true,
        user: {
          uid: `offline_${username}`,
          email: accountData.email,
          displayName: accountData.displayName,
          username: username,
          isAdmin: accountData.isAdmin,
          profileImage: username === 'jom' ? '/jomm.jpg' : null
        }
      };
    } catch (error) {
      return {
        success: false,
        error: 'Login failed'
      };
    }
  }

  /**
   * Logout user
   */
  async logout() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Listen to authentication state changes
   */
  onAuthStateChange(callback) {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, get their profile
        const userProfile = await databaseService.getUserProfile(user.uid);
        callback({
          uid: user.uid,
          email: user.email,
          displayName: userProfile?.displayName || user.displayName,
          username: userProfile?.username,
          isAdmin: userProfile?.isAdmin || false,
          profileImage: userProfile?.profileImage
        });
      } else {
        // User is signed out
        callback(null);
      }
    });
  }

  /**
   * Get current user
   */
  getCurrentUser() {
    return auth.currentUser;
  }

  /**
   * Update user profile
   */
  async updateUserProfile(uid, profileData) {
    try {
      // Update in Firebase Auth if display name changed
      if (profileData.displayName && auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: profileData.displayName
        });
      }

      // Update in database
      const userRef = ref(database, `users/${uid}`);
      await update(userRef, {
        ...profileData,
        updatedAt: new Date().toISOString()
      });

      return { success: true };
    } catch (error) {
      console.error('Error updating user profile:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Check if user is admin
   */
  async isUserAdmin(uid) {
    try {
      const userProfile = await databaseService.getUserProfile(uid);
      return userProfile?.isAdmin || false;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }
}

// Create and export a singleton instance
const authService = new AuthService();
export default authService;

// Firebase configuration - simplified for local development
// Since we're now using username-only login, we can create a minimal Firebase setup

// Mock Firebase objects for development
const mockAuth = {
  currentUser: null,
  signInWithEmailAndPassword: () => Promise.resolve({ user: { uid: 'mock-uid', email: 'mock@email.com' } }),
  createUserWithEmailAndPassword: () => Promise.resolve({ user: { uid: 'mock-uid', email: 'mock@email.com' } }),
  signOut: () => Promise.resolve(),
  onAuthStateChanged: (callback) => {
    // Return unsubscribe function
    return () => {};
  },
  updateProfile: () => Promise.resolve()
};

const mockDatabase = {
  ref: () => ({
    set: () => Promise.resolve(),
    get: () => Promise.resolve({ exists: () => false, val: () => null }),
    update: () => Promise.resolve(),
    on: () => {},
    off: () => {},
    remove: () => Promise.resolve()
  })
};

// Export mock objects for development
export const auth = mockAuth;
export const database = mockDatabase;

// Mock Firebase functions
export const ref = (db, path) => ({
  set: () => Promise.resolve(),
  get: () => Promise.resolve({ exists: () => false, val: () => null }),
  update: () => Promise.resolve(),
  on: () => {},
  off: () => {},
  remove: () => Promise.resolve()
});

export const set = () => Promise.resolve();
export const get = () => Promise.resolve({ exists: () => false, val: () => null });
export const update = () => Promise.resolve();
export const remove = () => Promise.resolve();
export const serverTimestamp = () => new Date().toISOString();
export const onAuthStateChanged = (auth, callback) => () => {};
export const signInWithEmailAndPassword = () => Promise.resolve({ user: { uid: 'mock-uid', email: 'mock@email.com' } });
export const createUserWithEmailAndPassword = () => Promise.resolve({ user: { uid: 'mock-uid', email: 'mock@email.com' } });
export const signOut = () => Promise.resolve();
export const updateProfile = () => Promise.resolve();

// src/utils/authApi.js
// Persistent authentication utilities backed by localStorage

const STORAGE_KEY = 'trendify_users';
const DEFAULT_USERS = [{ username: 'admin', password: 'admin123', role: 'admin' }];

const cloneUsers = (users) => users.map((user) => ({ ...user }));

const safeParse = (value) => {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : cloneUsers(DEFAULT_USERS);
  } catch (error) {
    return cloneUsers(DEFAULT_USERS);
  }
};

const readUsersFromStorage = () => {
  if (typeof window === 'undefined') {
    return cloneUsers(DEFAULT_USERS);
  }
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
    return cloneUsers(DEFAULT_USERS);
  }
  return safeParse(stored);
};

let cachedUsers = null;

const getUsers = () => {
  if (!cachedUsers) {
    cachedUsers = readUsersFromStorage();
  }
  return cloneUsers(cachedUsers);
};

const persistUsers = (users) => {
  cachedUsers = cloneUsers(users);
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cachedUsers));
  }
};

const toPublicUser = (user) => ({
  name: user.username,
  email: `${user.username}@example.com`,
  role: user.role,
});

export const loginUser = async (username, password, role) => {
  const users = getUsers();
  const user = users.find(
    (u) => u.username.toLowerCase() === username.toLowerCase() && u.role === role
  );
  if (!user || user.password !== password) {
    throw new Error('Invalid credentials');
  }
  return toPublicUser(user);
};

export const registerUser = async ({ username, password, role }) => {
  const users = getUsers();
  const exists = users.find(
    (u) => u.username.toLowerCase() === username.toLowerCase()
  );
  if (exists) {
    throw new Error('User already exists');
  }
  const newUser = { username, password, role };
  const updatedUsers = [...users, newUser];
  persistUsers(updatedUsers);
  return toPublicUser(newUser);
};

export const changePassword = async (username, role, oldPass, newPass) => {
  const users = getUsers();
  const userIndex = users.findIndex(
    (u) => u.username.toLowerCase() === username.toLowerCase() && u.role === role
  );
  if (userIndex === -1) {
    throw new Error('User not found');
  }
  if (users[userIndex].password !== oldPass) {
    throw new Error('Current password incorrect');
  }
  users[userIndex].password = newPass;
  persistUsers(users);
  return true;
};

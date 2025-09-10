// src/utils/authApi.js
// Simple in-memory placeholder API for authentication

const users = [{ username: 'admin', password: 'admin123', role: 'admin' }];

export const loginUser = async (username, password, role) => {
  const user = users.find(
    (u) => u.username.toLowerCase() === username.toLowerCase() && u.role === role
  );
  if (!user || user.password !== password) {
    throw new Error('Invalid credentials');
  }
  return { name: user.username, email: `${user.username}@example.com`, role: user.role };
};

export const registerUser = async ({ username, password, role }) => {
  const exists = users.find(
    (u) => u.username.toLowerCase() === username.toLowerCase()
  );
  if (exists) {
    throw new Error('User already exists');
  }
  const newUser = { username, password, role };
  users.push(newUser);
  return { name: newUser.username, email: `${newUser.username}@example.com`, role: newUser.role };
};

export const changePassword = async (username, role, oldPass, newPass) => {
  const user = users.find(
    (u) => u.username.toLowerCase() === username.toLowerCase() && u.role === role
  );
  if (!user) {
    throw new Error('User not found');
  }
  if (user.password !== oldPass) {
    throw new Error('Current password incorrect');
  }
  user.password = newPass;
  return true;
};

// This is a simple in-memory storage for users. In a real application, you'd use a database.
export type User = {
  id: string;
  username: string;
  password: string; // In a real app, this should be hashed
  isAdmin: boolean;
};

let users: User[] = [
  { id: '1', username: 'admin', password: 'admin123', isAdmin: true },
  { id: '2', username: 'user', password: 'user123', isAdmin: false },
];

export const getUsers = () => users;

export const getUserByUsername = (username: string) => 
  users.find(user => user.username === username);

export const addUser = (user: Omit<User, 'id'>) => {
  const newUser = { ...user, id: Date.now().toString() };
  users.push(newUser);
  return newUser;
};

export const deleteUser = (id: string) => {
  users = users.filter(user => user.id !== id);
};

export const updateUser = (id: string, updates: Partial<User>) => {
  const index = users.findIndex(user => user.id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    return users[index];
  }
  return null;
};
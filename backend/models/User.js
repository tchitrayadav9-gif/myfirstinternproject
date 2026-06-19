const bcrypt = require('bcryptjs');
const createModel = require('./modelHelper');

const UserSchema = {
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional for Google OAuth users
  role: { type: String, enum: ['Admin', 'Employee'], default: 'Employee' },
  department: { type: String },
  avatarUrl: { type: String },
  googleId: { type: String } // Stored for users authenticating via Google
};

// Seed data
const defaultUsers = [
  {
    _id: "seed-user-admin",
    name: "System Administrator",
    email: "admin@avon.co.in",
    password: "admin123", // Will be hashed dynamically below
    role: "Admin",
    department: "Operations & IT",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256&h=256"
  },
  {
    _id: "seed-user-employee",
    name: "T. Chitra Yadav",
    email: "employee@avon.co.in",
    password: "employee123", // Will be hashed dynamically below
    role: "Employee",
    department: "CSE - AIML",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256&h=256"
  }
];

// Hash passwords in seed data if they aren't already hashed
const hashedUsers = defaultUsers.map(user => {
  if (user.password && !user.password.startsWith('$2a$')) {
    const salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(user.password, salt);
  }
  return user;
});

module.exports = createModel('User', UserSchema, hashedUsers);

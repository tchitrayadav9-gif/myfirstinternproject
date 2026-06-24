const bcrypt = require('bcryptjs');
const createModel = require('./modelHelper');

const UserSchema = {
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional for Google OAuth users
  role: { type: String, enum: ['Admin', 'Employee'], default: 'Employee' },
  department: { type: String },
  avatarUrl: { type: String },
  employeeId: { type: String },
  createdDate: { type: Date, default: Date.now },
  lastLogin: { type: Date },
  googleLogin: { type: Boolean, default: false },
  googleId: { type: String }
};

// Seed data
const defaultUsers = [];

// Hash passwords in seed data if they aren't already hashed
const hashedUsers = defaultUsers.map(user => {
  if (user.password && !user.password.startsWith('$2a$')) {
    const salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(user.password, salt);
  }
  return user;
});

module.exports = createModel('User', UserSchema, hashedUsers);

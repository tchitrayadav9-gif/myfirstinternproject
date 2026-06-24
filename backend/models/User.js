const bcrypt = require('bcryptjs');
const createModel = require('./modelHelper');

const UserSchema = {
  name: { type: String, required: true },
  fullName: { type: String }, // User spec
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional for Google OAuth users
  role: { type: String, enum: ['admin', 'employee'], default: 'employee' },
  department: { type: String },
  avatarUrl: { type: String },
  profileImage: { type: String }, // User spec
  employeeId: { type: String },
  createdDate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }, // User spec
  lastLogin: { type: Date },
  googleLogin: { type: Boolean, default: false },
  googleId: { type: String },
  uid: { type: String }, // User spec
  provider: { type: String, default: 'Credentials' } // User spec
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

const createModel = require('./modelHelper');

const ContactMessageSchema = {
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['Unread', 'Read', 'Resolved'], default: 'Unread' }
};

module.exports = createModel('ContactMessage', ContactMessageSchema);

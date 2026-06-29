const createModel = require('./modelHelper');

const NotificationSchema = {
  recipient: { type: String, required: true }, // employee email or "all"
  title: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
};

module.exports = createModel('Notification', NotificationSchema);

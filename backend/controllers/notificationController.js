const Notification = require('../models/Notification');

// @desc    Get user-specific notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
  try {
    let notifications;
    if (req.user.role === 'Admin') {
      // Admins see all notifications
      notifications = await Notification.find({}).sort({ createdAt: -1 });
    } else {
      // Employees see their own notifications or global announcements
      notifications = await Notification.find({
        $or: [
          { recipient: req.user.email.toLowerCase() },
          { recipient: 'all' }
        ]
      }).sort({ createdAt: -1 });
    }
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Server error retrieving notifications.' });
  }
};

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found.' });
    }

    // Verify recipient matches logged-in user or it is a public announcement
    if (req.user.role !== 'Admin' && notification.recipient !== 'all' && notification.recipient !== req.user.email.toLowerCase()) {
      return res.status(403).json({ message: 'Forbidden: You cannot modify this notification.' });
    }

    const updated = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    console.error('Error marking notification read:', error);
    res.status(500).json({ message: 'Server error marking notification as read.' });
  }
};

module.exports = {
  getNotifications,
  markAsRead
};

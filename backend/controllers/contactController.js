const ContactMessage = require('../models/ContactMessage');

// @desc    Submit a new contact message (Public)
// @route   POST /api/contact
// @access  Public
const submitContactMessage = async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Please provide all required fields: name, email, subject, and message.' });
    }

    const newMessage = await ContactMessage.create({
      name,
      email,
      subject,
      message,
      status: 'Unread'
    });

    res.status(201).json({
      status: 'success',
      message: 'Your message has been submitted successfully.',
      data: newMessage
    });
  } catch (error) {
    console.error('Error submitting contact message:', error);
    res.status(500).json({ message: 'Server error processing contact message submission.' });
  }
};

// @desc    Get all contact messages (Admin only)
// @route   GET /api/contact
// @access  Private/Admin
const getContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find({});
    // Mongoose find doesn't sort by default unless we handle it, but wait!
    // Since modelHelper.js wraps find, let's look at how find is implemented.
    // In modelHelper.js, find returns find(query) directly from mongoose.
    // Let's sort it manually in code or use mongoose sort if possible. But wait, modelHelper returns raw find(query) which evaluates to an array if JSON DB or a Mongoose Query.
    // Wait, let's just sort the array in JavaScript to be 100% database-agnostic since we might run with JsonCollection or Mongoose:
    const sortedMessages = [...messages].sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(sortedMessages);
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({ message: 'Server error retrieving contact messages.' });
  }
};

// @desc    Mark contact message as read (Admin only)
// @route   PUT /api/contact/:id/read
// @access  Private/Admin
const markMessageRead = async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found.' });
    }

    const updated = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { status: 'Read' },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    console.error('Error marking message read:', error);
    res.status(500).json({ message: 'Server error marking message as read.' });
  }
};

// @desc    Delete contact message (Admin only)
// @route   DELETE /api/contact/:id
// @access  Private/Admin
const deleteMessage = async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found.' });
    }

    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message deleted successfully.' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ message: 'Server error deleting message.' });
  }
};

module.exports = {
  submitContactMessage,
  getContactMessages,
  markMessageRead,
  deleteMessage
};

const express = require('express');
const {
  submitContactMessage,
  getContactMessages,
  markMessageRead,
  deleteMessage
} = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .post(submitContactMessage) // Public endpoint to submit from landing page
  .get(protect, authorize('Admin'), getContactMessages); // Admin only

router.route('/:id/read')
  .put(protect, authorize('Admin'), markMessageRead); // Admin only

router.route('/:id')
  .delete(protect, authorize('Admin'), deleteMessage); // Admin only

module.exports = router;

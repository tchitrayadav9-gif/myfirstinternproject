const express = require('express');
const {
  getTickets,
  createTicket,
  resolveTicket,
  replyTicket
} = require('../controllers/ticketController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, getTickets)
  .post(protect, createTicket);

router.put('/:id/resolve', protect, resolveTicket);
router.post('/:id/reply', protect, replyTicket);

module.exports = router;

const Ticket = require('../models/Ticket');

// @desc    Get all tickets
// @route   GET /api/tickets
// @access  Private
const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({});
    res.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ message: 'Server error retrieving support tickets.' });
  }
};

// @desc    Create new support ticket
// @route   POST /api/tickets
// @access  Private
const createTicket = async (req, res) => {
  const { client, poc, subject, priority, text } = req.body;

  try {
    if (!client || !poc || !subject || !text) {
      return res.status(400).json({ message: 'Missing required support ticket details.' });
    }

    // Generate unique ID in the format AVON-XXXX
    const count = (await Ticket.find({})).length;
    const ticketId = `AVON-${2000 + count + 1}`;

    const ticket = await Ticket.create({
      id: ticketId,
      client,
      poc,
      subject,
      priority: priority || 'Medium',
      date: new Date().toISOString().split('T')[0],
      status: 'Open',
      text,
      replies: []
    });

    res.status(201).json(ticket);
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ message: 'Server error opening support ticket.' });
  }
};

// @desc    Resolve support ticket
// @route   PUT /api/tickets/:id/resolve
// @access  Private
const resolveTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Support ticket not found.' });
    }

    const updated = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status: 'Resolved' },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    console.error('Error resolving ticket:', error);
    res.status(500).json({ message: 'Server error resolving ticket.' });
  }
};

// @desc    Reply to support ticket
// @route   POST /api/tickets/:id/reply
// @access  Private
const replyTicket = async (req, res) => {
  const { message } = req.body;

  try {
    if (!message) {
      return res.status(400).json({ message: 'Reply content cannot be empty.' });
    }

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Support ticket not found.' });
    }

    const newReply = {
      sender: req.user.name,
      senderRole: req.user.role === 'Admin' ? 'Lead Administrator' : req.user.department + ' Specialist',
      message,
      timestamp: new Date()
    };

    const replies = [...(ticket.replies || []), newReply];
    
    // Auto shift status to "In Progress" when a reply is sent by staff on an "Open" ticket
    const status = ticket.status === 'Open' ? 'In Progress' : ticket.status;

    const updated = await Ticket.findByIdAndUpdate(
      req.params.id,
      { replies, status },
      { new: true }
    );

    res.status(201).json(updated);
  } catch (error) {
    console.error('Error replying to ticket:', error);
    res.status(500).json({ message: 'Server error processing ticket reply.' });
  }
};

module.exports = {
  getTickets,
  createTicket,
  resolveTicket,
  replyTicket
};

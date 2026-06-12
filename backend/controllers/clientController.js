const Client = require('../models/Client');

// @desc    Get all clients
// @route   GET /api/clients
// @access  Private
const getClients = async (req, res) => {
  try {
    const clients = await Client.find({});
    res.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ message: 'Server error retrieving clients.' });
  }
};

// @desc    Create new client
// @route   POST /api/clients
// @access  Private/Admin
const createClient = async (req, res) => {
  const { company, contact, email, phone, location, status, projects } = req.body;

  try {
    if (!company || !contact || !email || !phone || !location) {
      return res.status(400).json({ message: 'Missing required client fields.' });
    }

    const client = await Client.create({
      company,
      contact,
      email,
      phone,
      location,
      projects: Number(projects) || 0,
      status: status || 'Active'
    });

    res.status(201).json(client);
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ message: 'Server error creating client.' });
  }
};

// @desc    Update client
// @route   PUT /api/clients/:id
// @access  Private/Admin
const updateClient = async (req, res) => {
  const { company, contact, email, phone, location, status, projects } = req.body;

  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client record not found.' });
    }

    const updated = await Client.findByIdAndUpdate(
      req.params.id,
      {
        company: company || client.company,
        contact: contact || client.contact,
        email: email || client.email,
        phone: phone || client.phone,
        location: location || client.location,
        status: status || client.status,
        projects: projects !== undefined ? Number(projects) : client.projects
      },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ message: 'Server error updating client details.' });
  }
};

// @desc    Delete client
// @route   DELETE /api/clients/:id
// @access  Private/Admin
const deleteClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client record not found.' });
    }

    await Client.findByIdAndDelete(req.params.id);
    res.json({ message: 'Client account unregistered successfully.' });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ message: 'Server error deleting client.' });
  }
};

module.exports = {
  getClients,
  createClient,
  updateClient,
  deleteClient
};

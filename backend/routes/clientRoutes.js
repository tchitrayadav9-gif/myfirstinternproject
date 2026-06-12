const express = require('express');
const {
  getClients,
  createClient,
  updateClient,
  deleteClient
} = require('../controllers/clientController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, getClients)
  .post(protect, authorize('Admin'), createClient);

router.route('/:id')
  .put(protect, authorize('Admin'), updateClient)
  .delete(protect, authorize('Admin'), deleteClient);

module.exports = router;

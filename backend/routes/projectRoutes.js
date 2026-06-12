const express = require('express');
const {
  getProjects,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, getProjects)
  .post(protect, authorize('Admin'), createProject);

router.route('/:id')
  .put(protect, updateProject)
  .delete(protect, authorize('Admin'), deleteProject);

module.exports = router;

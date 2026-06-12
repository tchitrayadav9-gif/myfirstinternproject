const Project = require('../models/Project');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({});
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Server error retrieving project list.' });
  }
};

// @desc    Create new project card
// @route   POST /api/projects
// @access  Private/Admin
const createProject = async (req, res) => {
  const { name, client, progress, status, priority, due } = req.body;

  try {
    if (!name || !client || !due) {
      return res.status(400).json({ message: 'Please provide project name, client, and due date.' });
    }

    const project = await Project.create({
      name,
      client,
      progress: Number(progress) || 0,
      status: status || 'Backlog',
      priority: priority || 'Medium',
      due
    });

    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Server error creating project.' });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res) => {
  const { name, client, progress, status, priority, due } = req.body;

  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project card not found.' });
    }

    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      {
        name: name || project.name,
        client: client || project.client,
        progress: progress !== undefined ? Number(progress) : project.progress,
        status: status || project.status,
        priority: priority || project.priority,
        due: due || project.due
      },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Server error updating project card.' });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project card not found.' });
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project pipeline card deleted successfully.' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Server error deleting project.' });
  }
};

module.exports = {
  getProjects,
  createProject,
  updateProject,
  deleteProject
};

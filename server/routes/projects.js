const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Get all projects (Admin sees all, Member sees assigned)
router.get('/', verifyToken, async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'Admin') {
      projects = await Project.find().populate('teamMembers', 'name email').populate('createdBy', 'name');
    } else {
      projects = await Project.find({ teamMembers: req.user.id }).populate('teamMembers', 'name email').populate('createdBy', 'name');
    }
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create project (Admin only)
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, description, teamMembers } = req.body;
    const project = new Project({
      name,
      description,
      createdBy: req.user.id,
      teamMembers
    });
    const savedProject = await project.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add member to project (Admin only)
router.put('/:id/members', verifyToken, isAdmin, async (req, res) => {
  try {
    const { memberId } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    if (!project.teamMembers.includes(memberId)) {
      project.teamMembers.push(memberId);
      await project.save();
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete project (Admin only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    // Also delete associated tasks
    const Task = require('../models/Task');
    await Task.deleteMany({ project: req.params.id });
    
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

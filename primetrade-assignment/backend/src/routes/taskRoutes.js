const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

// Get all tasks for the logged-in user
router.get('/', protect, async (req, res) => {
  const tasks = await Task.find({ user: req.user._id });
  res.json(tasks);
});

// Admin only: Get all tasks in the system
router.get('/all', protect, authorizeRoles('ADMIN'), async (req, res) => {
  const tasks = await Task.find().populate('user', 'name email');
  res.json(tasks);
});

// Create a task
router.post('/', protect, async (req, res) => {
  const task = await Task.create({ ...req.body, user: req.user._id });
  res.status(201).json(task);
});

// Update a task
router.put('/:id', protect, async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task || task.user.toString() !== req.user._id.toString()) {
    return res.status(404).json({ message: 'Task not found or unauthorized' });
  }
  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedTask);
});

module.exports = router;
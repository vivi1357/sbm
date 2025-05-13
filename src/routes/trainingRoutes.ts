import express from 'express';
import Training from '../models/Training';

const router = express.Router();

// Get all trainings
router.get('/', async (req, res) => {
  try {
    const trainings = await Training.find();
    res.json(trainings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching trainings', error });
  }
});

// Get a single training
router.get('/:id', async (req, res) => {
  try {
    const training = await Training.findById(req.params.id);
    if (!training) {
      return res.status(404).json({ message: 'Training not found' });
    }
    res.json(training);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching training', error });
  }
});

// Create a new training
router.post('/', async (req, res) => {
  try {
    const training = new Training(req.body);
    const savedTraining = await training.save();
    res.status(201).json(savedTraining);
  } catch (error) {
    res.status(400).json({ message: 'Error creating training', error });
  }
});

// Update a training
router.put('/:id', async (req, res) => {
  try {
    const training = await Training.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!training) {
      return res.status(404).json({ message: 'Training not found' });
    }
    res.json(training);
  } catch (error) {
    res.status(400).json({ message: 'Error updating training', error });
  }
});

// Delete a training
router.delete('/:id', async (req, res) => {
  try {
    const training = await Training.findByIdAndDelete(req.params.id);
    if (!training) {
      return res.status(404).json({ message: 'Training not found' });
    }
    res.json({ message: 'Training deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting training', error });
  }
});

export default router; 
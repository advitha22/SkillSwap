import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  resetToSample
} from '../dataStore.js';

const router = express.Router();

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json({ success: true, count: users.length, users });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to retrieve users', message: err.message });
  }
});

// GET single user
router.get('/:id', async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to retrieve user', message: err.message });
  }
});

// POST create new profile
router.post('/', async (req, res) => {
  try {
    const { name, college, bio, canTeach, wantsToLearn, contactEmail } = req.body;

    if (!name || !college) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: 'Name and College are required fields.'
      });
    }

    if (!Array.isArray(canTeach) || canTeach.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: 'Please provide at least one skill you can teach.'
      });
    }

    if (!Array.isArray(wantsToLearn) || wantsToLearn.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: 'Please provide at least one skill you want to learn.'
      });
    }

    const newUser = await createUser(req.body);
    res.status(201).json({ success: true, user: newUser });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to create user', message: err.message });
  }
});

// PUT update existing profile
router.put('/:id', async (req, res) => {
  try {
    const updated = await updateUser(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, user: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update user', message: err.message });
  }
});

// POST reset to sample data
router.post('/reset', async (req, res) => {
  try {
    const sampleUsers = await resetToSample();
    res.json({
      success: true,
      message: 'Successfully reset database to 10 sample student profiles',
      count: sampleUsers.length,
      users: sampleUsers
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to reset sample data', message: err.message });
  }
});

export default router;

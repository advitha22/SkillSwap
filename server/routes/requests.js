import express from 'express';
import {
  getRequestsForUser,
  createRequest,
  updateRequestStatus
} from '../dataStore.js';

const router = express.Router();

// GET all requests for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const data = await getRequestsForUser(userId);
    res.json({
      success: true,
      incoming: data.incoming,
      outgoing: data.outgoing,
      pendingCount: data.incoming.filter(r => r.status === 'pending').length
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch requests', message: err.message });
  }
});

// POST create request
router.post('/', async (req, res) => {
  try {
    const { fromUserId, toUserId, message, suggestedExchange, compatibility } = req.body;

    if (!fromUserId || !toUserId) {
      return res.status(400).json({
        success: false,
        error: 'Bad request',
        message: 'fromUserId and toUserId are required.'
      });
    }

    if (fromUserId === toUserId) {
      return res.status(400).json({
        success: false,
        error: 'Bad request',
        message: 'Cannot send an exchange request to yourself.'
      });
    }

    const newReq = await createRequest({
      fromUserId,
      toUserId,
      message,
      suggestedExchange,
      compatibility
    });

    res.status(201).json({ success: true, request: newReq });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to create request', message: err.message });
  }
});

// PUT update request status
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['accepted', 'declined', 'pending'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status',
        message: 'Status must be accepted, declined, or pending.'
      });
    }

    const updated = await updateRequestStatus(id, status);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Request not found' });
    }

    res.json({ success: true, request: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update request', message: err.message });
  }
});

export default router;

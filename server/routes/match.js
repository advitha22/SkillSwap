import express from 'express';
import { getAllUsers, getUserById } from '../dataStore.js';
import { matchSkillsWithGemini } from '../services/geminiService.js';

const router = express.Router();

// Match by userId or with ad-hoc profile object
router.post('/', async (req, res) => {
  try {
    const { userId, profile } = req.body;

    let targetUser = null;
    const allUsers = await getAllUsers();

    if (userId) {
      targetUser = allUsers.find(u => u.id === userId);
      if (!targetUser) {
        return res.status(404).json({ success: false, error: `User with id "${userId}" not found` });
      }
    } else if (profile) {
      // Validate ad-hoc profile
      if (!profile.canTeach || !profile.wantsToLearn) {
        return res.status(400).json({
          success: false,
          error: 'Missing skills',
          message: 'Profile must include both canTeach and wantsToLearn arrays.'
        });
      }
      targetUser = {
        id: 'adhoc-preview',
        name: profile.name || 'You',
        college: profile.college || 'My University',
        bio: profile.bio || '',
        canTeach: profile.canTeach,
        wantsToLearn: profile.wantsToLearn
      };
    } else {
      return res.status(400).json({
        success: false,
        error: 'Bad request',
        message: 'Please provide either a userId or a profile object.'
      });
    }

    console.log(`🔍 Running AI Matching for: ${targetUser.name} (${targetUser.id})`);
    const matchResult = await matchSkillsWithGemini(targetUser, allUsers);

    res.json({
      success: true,
      targetUser: {
        id: targetUser.id,
        name: targetUser.name,
        college: targetUser.college,
        canTeach: targetUser.canTeach,
        wantsToLearn: targetUser.wantsToLearn
      },
      engine: matchResult.source,
      warning: matchResult.warning || null,
      matchesCount: matchResult.matches.length,
      matches: matchResult.matches
    });
  } catch (err) {
    console.error('Matching route error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to process skill matching',
      message: err.message
    });
  }
});

// GET match by userId
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const allUsers = await getAllUsers();
    const targetUser = allUsers.find(u => u.id === userId);

    if (!targetUser) {
      return res.status(404).json({ success: false, error: `User with id "${userId}" not found` });
    }

    const matchResult = await matchSkillsWithGemini(targetUser, allUsers);

    res.json({
      success: true,
      targetUser: {
        id: targetUser.id,
        name: targetUser.name,
        college: targetUser.college,
        canTeach: targetUser.canTeach,
        wantsToLearn: targetUser.wantsToLearn
      },
      engine: matchResult.source,
      warning: matchResult.warning || null,
      matchesCount: matchResult.matches.length,
      matches: matchResult.matches
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Failed to process skill matching',
      message: err.message
    });
  }
});

export default router;

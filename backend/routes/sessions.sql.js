const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getPublicSessions,
  getMySessions,
  getMySession,
  saveDraft,
  publishSession,
  updateSession,
  deleteSession
} = require('../controllers/sessionController.sql');

// @route   GET /api/sessions
// @desc    Get all published sessions
// @access  Public
router.get('/sessions', getPublicSessions);

// @route   GET /api/my-sessions
// @desc    Get user's sessions
// @access  Private
router.get('/my-sessions', auth, getMySessions);

// @route   GET /api/my-sessions/:id
// @desc    Get single user session
// @access  Private
router.get('/my-sessions/:id', auth, getMySession);

// @route   POST /api/my-sessions/save-draft
// @desc    Save/update draft session
// @access  Private
router.post('/my-sessions/save-draft', auth, saveDraft);

// @route   POST /api/my-sessions/publish
// @desc    Publish session
// @access  Private
router.post('/my-sessions/publish', auth, publishSession);

// @route   PUT /api/my-sessions/:id
// @desc    Update session
// @access  Private
router.put('/my-sessions/:id', auth, updateSession);

// @route   DELETE /api/my-sessions/:id
// @desc    Delete session
// @access  Private
router.delete('/my-sessions/:id', auth, deleteSession);

module.exports = router;

const { validationResult, body } = require('express-validator');
const Session = require('../models/Session');

// Validation rules
const sessionValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('json_file_url')
    .trim()
    .notEmpty()
    .withMessage('JSON file URL is required'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage('Each tag must be max 30 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be max 500 characters')
];

// Get all published sessions (public)
const getPublicSessions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const sessions = await Session.find({ status: 'published' })
      .populate('user_id', 'email')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Session.countDocuments({ status: 'published' });

    res.json({
      success: true,
      data: {
        sessions,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get public sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching sessions'
    });
  }
};

// Get user's own sessions
const getMySessions = async (req, res) => {
  try {
    const sessions = await Session.find({ user_id: req.user.id })
      .sort({ updated_at: -1 });

    res.json({
      success: true,
      data: {
        sessions
      }
    });
  } catch (error) {
    console.error('Get my sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching your sessions'
    });
  }
};

// Get single user session
const getMySession = async (req, res) => {
  try {
    const session = await Session.findOne({
      _id: req.params.id,
      user_id: req.user.id
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    res.json({
      success: true,
      data: {
        session
      }
    });
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching session'
    });
  }
};

// Save/update draft session
const saveDraft = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { title, tags = [], json_file_url, description } = req.body;
    const sessionId = req.body.id;

    let session;

    if (sessionId) {
      // Update existing session
      session = await Session.findOneAndUpdate(
        { _id: sessionId, user_id: req.user.id },
        {
          title,
          tags: Array.isArray(tags) ? tags.filter(tag => tag.trim()) : [],
          json_file_url,
          description,
          status: 'draft'
        },
        { new: true, runValidators: true }
      );

      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Session not found'
        });
      }
    } else {
      // Create new session
      session = new Session({
        user_id: req.user.id,
        title,
        tags: Array.isArray(tags) ? tags.filter(tag => tag.trim()) : [],
        json_file_url,
        description,
        status: 'draft'
      });

      await session.save();
    }

    res.json({
      success: true,
      message: sessionId ? 'Draft updated successfully' : 'Draft saved successfully',
      data: {
        session
      }
    });
  } catch (error) {
    console.error('Save draft error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while saving draft'
    });
  }
};

// Publish session
const publishSession = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { title, tags = [], json_file_url, description } = req.body;
    const sessionId = req.body.id;

    let session;

    if (sessionId) {
      // Update and publish existing session
      session = await Session.findOneAndUpdate(
        { _id: sessionId, user_id: req.user.id },
        {
          title,
          tags: Array.isArray(tags) ? tags.filter(tag => tag.trim()) : [],
          json_file_url,
          description,
          status: 'published'
        },
        { new: true, runValidators: true }
      );

      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Session not found'
        });
      }
    } else {
      // Create and publish new session
      session = new Session({
        user_id: req.user.id,
        title,
        tags: Array.isArray(tags) ? tags.filter(tag => tag.trim()) : [],
        json_file_url,
        description,
        status: 'published'
      });

      await session.save();
    }

    res.json({
      success: true,
      message: 'Session published successfully',
      data: {
        session
      }
    });
  } catch (error) {
    console.error('Publish session error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while publishing session'
    });
  }
};

// Update session
const updateSession = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { title, tags = [], json_file_url, description, status } = req.body;

    const session = await Session.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user.id },
      {
        title,
        tags: Array.isArray(tags) ? tags.filter(tag => tag.trim()) : [],
        json_file_url,
        description,
        ...(status && { status })
      },
      { new: true, runValidators: true }
    );

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    res.json({
      success: true,
      message: 'Session updated successfully',
      data: {
        session
      }
    });
  } catch (error) {
    console.error('Update session error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating session'
    });
  }
};

// Delete session
const deleteSession = async (req, res) => {
  try {
    const session = await Session.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user.id
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    res.json({
      success: true,
      message: 'Session deleted successfully'
    });
  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting session'
    });
  }
};

module.exports = {
  getPublicSessions,
  getMySessions,
  getMySession,
  saveDraft: [sessionValidation, saveDraft],
  publishSession: [sessionValidation, publishSession],
  updateSession: [sessionValidation, updateSession],
  deleteSession
};

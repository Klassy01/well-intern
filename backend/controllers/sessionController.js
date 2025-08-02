const { validationResult, body } = require('express-validator');
const Session = require('../models/Session');
const User = require('../models/User');
const { Op } = require('sequelize');

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
    const offset = (page - 1) * limit;

    const { count, rows: sessions } = await Session.findAndCountAll({
      where: {
        status: 'published',
        is_public: true
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email']
        }
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      success: true,
      data: {
        sessions,
        pagination: {
          currentPage: page,
          totalPages,
          totalSessions: count,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get public sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching sessions'
    });
  }
};

// Get user's sessions (private)
const getMySessions = async (req, res) => {
  try {
    const sessions = await Session.findAll({
      where: { user_id: req.user.id },
      order: [['updated_at', 'DESC']]
    });

    res.json({
      success: true,
      data: { sessions }
    });

  } catch (error) {
    console.error('Get my sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching your sessions'
    });
  }
};

// Get single user session (private)
const getMySession = async (req, res) => {
  try {
    const session = await Session.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    res.json({
      success: true,
      data: { session }
    });

  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching session'
    });
  }
};

// Save draft session
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

    const { title, description, tags, json_file_url } = req.body;

    const session = await Session.create({
      user_id: req.user.id,
      title,
      description,
      tags: tags || [],
      json_file_url,
      status: 'draft',
      is_public: false
    });

    res.status(201).json({
      success: true,
      message: 'Draft saved successfully',
      data: { session }
    });

  } catch (error) {
    console.error('Save draft error:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving draft'
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

    const { title, description, tags, json_file_url } = req.body;

    const session = await Session.create({
      user_id: req.user.id,
      title,
      description,
      tags: tags || [],
      json_file_url,
      status: 'published',
      is_public: true
    });

    res.status(201).json({
      success: true,
      message: 'Session published successfully',
      data: { session }
    });

  } catch (error) {
    console.error('Publish session error:', error);
    res.status(500).json({
      success: false,
      message: 'Error publishing session'
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

    const session = await Session.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    const { title, description, tags, json_file_url, status, is_public } = req.body;

    await session.update({
      title: title || session.title,
      description: description !== undefined ? description : session.description,
      tags: tags || session.tags,
      json_file_url: json_file_url || session.json_file_url,
      status: status || session.status,
      is_public: is_public !== undefined ? is_public : session.is_public
    });

    res.json({
      success: true,
      message: 'Session updated successfully',
      data: { session }
    });

  } catch (error) {
    console.error('Update session error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating session'
    });
  }
};

// Delete session
const deleteSession = async (req, res) => {
  try {
    const session = await Session.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    await session.destroy();

    res.json({
      success: true,
      message: 'Session deleted successfully'
    });

  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting session'
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

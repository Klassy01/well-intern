const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Each tag cannot exceed 30 characters']
  }],
  json_file_url: {
    type: String,
    required: [true, 'JSON file URL is required'],
    trim: true,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v) || v.startsWith('/') || v.includes('.');
      },
      message: 'Please enter a valid URL or file path'
    }
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    trim: true
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

// Index for better query performance
sessionSchema.index({ user_id: 1, status: 1 });
sessionSchema.index({ status: 1, created_at: -1 });

module.exports = mongoose.model('Session', sessionSchema);

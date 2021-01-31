const mongoose = require('mongoose')

const ActivityLogSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      'login',
      'block',
      'unblock',
      'send',
      'receive'
    ],
    required: true
  },

  status: {
    type: String,
    enum: [
      'successful',
      'failed'
    ],
    required: true
  },

  details: {
    type: String
  },

  relatedUser: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('ActivityLog', ActivityLogSchema)

const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Message content is required'],
    minlength: 1,
    maxlength: 4096
  },

  sentFrom: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },

  sentTo: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Message', MessageSchema)

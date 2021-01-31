const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { jwtSecret, jwtExpire } = require('../config/env')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    unique: true,
    maxlength: 30
  },

  password: {
    type: String,
    required: [true, 'Password is required'],
    select: false,
    minlength: 8
  },

  blockedUsers: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }]
})

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }

  this.password = await bcrypt.hash(this.password, 8)
})

UserSchema.methods.getSignedJwt = function () {
  return jwt.sign({ id: this._id }, jwtSecret, { expiresIn: jwtExpire })
}

UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

UserSchema.methods.hasBlockFor = function ({ _id }) {
  return this.blockedUsers.some(user => user._id.equals(_id))
}

module.exports = mongoose.model('User', UserSchema)

const jwt = require('jsonwebtoken')
const User = require('../models/User')
const ErrorResponse = require('../utils/error-response')
const asyncHandler = require('../utils/async-handler')
const { jwtSecret } = require('../config/env')

const authorize = asyncHandler(async (req, res, next) => {
  let token

  const authHeader = req.headers.authorization

  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1]
  }

  if (!token) {
    return next(new ErrorResponse(401, 'You\'re sailing close to the wind'))
  }

  try {
    const decodedToken = jwt.verify(token, jwtSecret)

    req.user = await User.findById(decodedToken.id).populate('blockedUsers', 'name')
  } catch (error) {
    return next(new ErrorResponse(401, 'You\'re sailing close to the wind'))
  }

  next()
})

module.exports = authorize

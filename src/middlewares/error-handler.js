const ErrorResponse = require('../utils/error-response')
const logger = require('../utils/logger')

const errorHandler = (err, req, res, next) => {
  let error = {}

  error.message = err.message
  error.statusCode = err.statusCode

  // Log all the errors
  logger.error(`${err.statusCode || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`)

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(v => v.message)
    error = new ErrorResponse(400, message)
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found'
    error = new ErrorResponse(404, message)
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered'
    error = new ErrorResponse(400, message)
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.statusCode ? error.message : 'An error from darkness'
  })
}

module.exports = errorHandler

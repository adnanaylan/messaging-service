const asyncHandler = require('../utils/async-handler')
const userService = require('../services/user')
const activityLogService = require('../services/activity-log')

/**
 * @desc      Registers user
 * @route     POST /api/auth/register
 * @access    Public
 */
exports.register = asyncHandler(async (req, res, next) => {
  const user = await userService.createUser(req.body)

  const token = userService.getSignedJwt(user)

  res.status(201).json({ success: true, token })
})

/**
 * @desc      Login user
 * @route     POST /api/auth/login
 * @access    Public
 */
exports.login = asyncHandler(async (req, res, next) => {
  const user = await userService.getUserWithPassword(req.body)

  try {
    await userService.validateUserCredentials({ user, password: req.body.password })

    await activityLogService.createActivityLog({
      type: 'login',
      status: 'successful',
      relatedUser: user._id
    })
  } catch (error) {
    await activityLogService.createActivityLog({
      type: 'login',
      status: 'failed',
      relatedUser: user._id,
      details: error.message
    })

    throw error
  }

  const token = userService.getSignedJwt(user)

  res.status(200).json({ success: true, token })
})

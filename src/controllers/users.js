const asyncHandler = require('../utils/async-handler')
const userService = require('../services/user')
const activityLogService = require('../services/activity-log')

/**
 * @desc      Blocks an user
 * @route     PUT /api/users/block
 * @access    Private
 */
exports.blockUser = asyncHandler(async (req, res, next) => {
  let user

  try {
    const userToBeBlocked = await userService.getUser(req.query)

    userService.validateBlockingAction(req.user, userToBeBlocked)

    user = await userService.addToBlockedUsers(req.user, userToBeBlocked)

    await activityLogService.createActivityLog({
      type: 'block',
      status: 'successful',
      relatedUser: req.user._id,
      details: `Blocked user: ${userToBeBlocked}`
    })
  } catch (error) {
    await activityLogService.createActivityLog({
      type: 'block',
      status: 'failed',
      relatedUser: req.user._id,
      details: error.message
    })

    throw error
  }

  res.status(200).json({ success: true, data: user })
})

/**
 * @desc      Unblocks an user
 * @route     PUT /api/users/unblock
 * @access    Private
 */
exports.unblockUser = asyncHandler(async (req, res, next) => {
  let user

  try {
    const userToBeUnblocked = await userService.getUser(req.query)

    user = await userService.removeFromBlockedUsers(req.user, userToBeUnblocked)

    await activityLogService.createActivityLog({
      type: 'unblock',
      status: 'successful',
      relatedUser: req.user._id,
      details: `Unblocked user: ${userToBeUnblocked}`
    })
  } catch (error) {
    await activityLogService.createActivityLog({
      type: 'unblock',
      status: 'failed',
      relatedUser: req.user._id,
      details: error.message
    })

    throw error
  }

  res.status(200).json({ success: true, data: user })
})

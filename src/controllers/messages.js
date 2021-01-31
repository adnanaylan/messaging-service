const asyncHandler = require('../utils/async-handler')
const userService = require('../services/user')
const messageService = require('../services/message')
const activityLogService = require('../services/activity-log')

/**
 * @desc      Creates a message
 * @route     POST /api/messages
 * @access    Private
 */
exports.createMessage = asyncHandler(async (req, res, next) => {
  const { content, receiver } = req.body

  let message

  try {
    const sentTo = await userService.getUser({ name: receiver })

    messageService.isAllowedToSendMessage(sentTo, req.user)

    message = await messageService.createMessage({
      content,
      sentTo: sentTo._id,
      sentFrom: req.user._id
    })

    await activityLogService.createActivityLog({
      type: 'send',
      status: 'successful',
      relatedUser: req.user._id,
      details: `Sent to: ${sentTo}`
    })
  } catch (error) {
    await activityLogService.createActivityLog({
      type: 'send',
      status: 'failed',
      relatedUser: req.user._id,
      details: error.message
    })

    throw error
  }

  res.status(201).json({ success: true, data: message })
})

/**
 * @desc      Retrieves all messages for logged in user
 * @route     GET /api/messages
 * @access    Private
 */
exports.retrieveMessages = asyncHandler(async (req, res, next) => {
  let messages

  try {
    messages = await messageService.getMessages(req.user)

    await activityLogService.createActivityLog({
      type: 'receive',
      status: 'successful',
      relatedUser: req.user._id
    })
  } catch (error) {
    await activityLogService.createActivityLog({
      type: 'receive',
      status: 'failed',
      relatedUser: req.user._id,
      details: error.message
    })

    throw error
  }

  res.status(200).json({ success: true, data: messages })
})

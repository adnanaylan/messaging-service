const Message = require('../models/Message')
const ErrorResponse = require('../utils/error-response')

exports.createMessage = async ({ content, sentTo, sentFrom }) => {
  return await Message.create({ content, sentTo, sentFrom })
}

exports.getMessages = async ({ _id }) => {
  const query = { $or: [{ sentTo: _id }, { sentFrom: _id }] }

  const messages = await Message.find(query).populate('sentFrom', 'name').populate('sentTo', 'name')

  return messages
}

exports.isAllowedToSendMessage = (sentTo, sentFrom) => {
  if (sentTo._id.equals(sentFrom._id)) {
    throw new ErrorResponse(400, 'You can\'t send message to yourself')
  }

  const isBlockedByReceiver = sentTo.hasBlockFor(sentFrom)

  if (isBlockedByReceiver) {
    throw new ErrorResponse(400, `Couldn't sent message, you are blocked by ${sentTo.name}`)
  }

  const hasBlockToReceiver = sentFrom.hasBlockFor(sentTo)

  if (hasBlockToReceiver) {
    throw new ErrorResponse(400, `Couldn't sent message, you blocked ${sentTo.name}`)
  }
}

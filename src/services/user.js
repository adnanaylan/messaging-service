const User = require('../models/User')
const ErrorResponse = require('../utils/error-response')

exports.createUser = async ({ name, password }) => {
  return await User.create({ name, password })
}

exports.getUser = async ({ name }) => {
  const user = await User.findOne({ name })

  if (!user) {
    throw new ErrorResponse(404, `User with name ${name} couldn't be found`)
  }

  return user
}

exports.getUserWithPassword = async ({ name }) => {
  const user = await User.findOne({ name }).select('+password')

  if (!user) {
    throw new ErrorResponse(404, `User with name ${name} couldn't be found`)
  }

  return user
}

exports.validateUserCredentials = async ({ user, password }) => {
  const isPasswordMatched = await user.comparePassword(password)

  if (!isPasswordMatched) {
    throw new ErrorResponse(401, 'Password incorrect')
  }

  return user
}

exports.getSignedJwt = (user) => {
  return user.getSignedJwt()
}

exports.validateBlockingAction = (userTheBlocker, userToBeBlocked) => {
  if (userTheBlocker._id.equals(userToBeBlocked._id)) {
    throw new ErrorResponse(400, 'You can\'t block yourself')
  }
}

exports.addToBlockedUsers = async (userTheBlocker, userToBeBlocked) => {
  const query = { $addToSet: { blockedUsers: userToBeBlocked._id } }

  const user = await User.findByIdAndUpdate(userTheBlocker._id, query, { new: true }).populate('blockedUsers', 'name')

  return user
}

exports.removeFromBlockedUsers = async (userTheUnblocker, userToBeUnblocked) => {
  const query = { $pull: { blockedUsers: userToBeUnblocked._id } }

  const user = await User.findByIdAndUpdate(userTheUnblocker._id, query, { new: true }).populate('blockedUsers', 'name')

  return user
}

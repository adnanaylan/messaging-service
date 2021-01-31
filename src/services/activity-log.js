const ActivityLog = require('../models/ActivityLog')
const logger = require('../utils/logger')

exports.createActivityLog = async ({ type, status, relatedUser, details }) => {
  try {
    await ActivityLog.create({
      type,
      status,
      relatedUser,
      details
    })

    logger.info(`[ACTIVITY LOG] type: ${type} - status: ${status} - relatedUser: ${relatedUser} - details: ${details}`)
  } catch (error) {
    logger.error(error)
  }
}

const express = require('express')
const { blockUser, unblockUser } = require('../controllers/users')
const authorize = require('../middlewares/auth')

const router = express.Router()

router.use(authorize)

router.put('/block', blockUser)
router.put('/unblock', unblockUser)

module.exports = router

const express = require('express')
const { createMessage, retrieveMessages } = require('../controllers/messages')
const authorize = require('../middlewares/auth')

const router = express.Router()

router.use(authorize)

router.post('/', createMessage)
router.get('/', retrieveMessages)

module.exports = router

const express = require('express')
const {
  register,
  login,
  getCurrentUser,
  refreshToken,
} = require('../controllers/authController')
const { authenticate } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/refresh-token', refreshToken)
router.get('/me', authenticate, getCurrentUser)

module.exports = router

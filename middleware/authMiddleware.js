const jwt = require('jsonwebtoken')
const { User } = require('../models')

exports.authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'No token provided' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findByPk(decoded.id)
    next()
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' })
  }
}

exports.organizerGuard = async (req, res, next) => {
  try {
    req.user.role == 'organizer'
      ? next()
      : res.status(403).json({ message: 'Forbidden' })
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' })
  }
}

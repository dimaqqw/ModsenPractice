require('dotenv').config()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { User } = require('../models')

const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' })
}

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  })
}

const isValidPassword = async (password) => {
  return await bcrypt.compare(password, user.password)
}

const checkAuth = async (user, password) => {
  if (!user || !isValidPassword(password)) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }
}

exports.register = async (req, res) => {
  const { username, password, role } = req.body

  const existingUser = await User.findOne({ where: { username } })
  if (existingUser) {
    return res.status(409).json({ message: 'Username already exists' })
  }

  const hashedPassword = await bcrypt.hash(password, process.env.PASS_SALT)
  const user = await User.create({
    username,
    password: hashedPassword,
    role: role,
  })

  const token = generateAccessToken(user)
  const refreshToken = generateRefreshToken(user)
  await user.update({ refreshToken })

  res.cookie('accessToken', token, {
    httpOnly: true,
    maxAge: 60 * 60 * 1000,
    sameSite: 'Strict',
  })

  res.status(201).json({ token, refreshToken })
}

exports.login = async (req, res) => {
  const { username, password } = req.body
  const user = await User.findOne({ where: { username } })

  checkAuth(user, password)
  const token = generateAccessToken(user)
  const refreshToken = generateRefreshToken(user)

  await user.update({ refreshToken })

  res.cookie('accessToken', token, {
    httpOnly: true,
    maxAge: 60 * 60 * 1000,
    sameSite: 'Strict',
  })

  res.json({ token, refreshToken })
}

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body
  if (!refreshToken) {
    return res.status(401).json({ message: 'No refresh token provided' })
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
    const user = await User.findByPk(decoded.id)

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: 'Invalid refresh token' })
    }

    const newToken = generateAccessToken(user)
    const newRefreshToken = generateRefreshToken(user)
    await user.update({ refreshToken: newRefreshToken })

    res.cookie('accessToken', newToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
      sameSite: 'Strict',
    })

    res.json({ token: newToken, refreshToken: newRefreshToken })
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' })
  }
}

exports.getCurrentUser = async (req, res) => {
  const user = await User.findByPk(req.user.id)
  res.json(user)
}

require('dotenv').config()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { User } = require('../models')

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, login: user.login, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  )
}

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, login: user.login, email: user.email },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: '7d',
    }
  )
}

const isValidPassword = async (password, user) => {
  return await bcrypt.compare(password, user.password)
}

const checkAuth = async (user, password) => {
  if (!user || !isValidPassword(password, user)) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }
}

exports.register = async (req, res) => {
  const { login, email, password, role } = req.body

  const existingUser = await User.findOne({ where: { login } })
  if (existingUser) {
    return res.status(409).json({ message: 'Login already exists' })
  }

  const hashedPassword = await bcrypt.hash(
    password,
    parseInt(process.env.PASS_SALT, 10)
  )
  const user = await User.create({
    login,
    email,
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
  const { login, password } = req.body
  const user = await User.findOne({ where: { login } })

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
  const userWithoutPassword = user.toJSON()
  delete userWithoutPassword.password
  res.json(user)
}

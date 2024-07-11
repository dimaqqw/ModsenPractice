require('dotenv').config()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const userRepository = require('../repositories/userRepository')

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
    { expiresIn: '7d' }
  )
}

const isValidPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword)
}

const registerUser = async (userData) => {
  const { login, password, email } = userData
  const existingUser = await userRepository.findUserByLogin(login)
  const existingUserEmail = await userRepository.findUserByEmail(email)

  if (existingUser || existingUserEmail) {
    throw new Error('Login or email already exists')
  }

  const hashedPassword = await bcrypt.hash(
    password,
    parseInt(process.env.PASS_SALT, 10)
  )
  const user = await userRepository.createUser({
    ...userData,
    password: hashedPassword,
  })

  const token = generateAccessToken(user)
  const refreshToken = generateRefreshToken(user)
  await userRepository.updateUser(user, { refreshToken })

  return { token, refreshToken }
}

const loginUser = async (login, password) => {
  const user = await userRepository.findUserByLogin(login)
  if (!user || !(await isValidPassword(password, user.password))) {
    throw new Error('Invalid credentials')
  }

  const token = generateAccessToken(user)
  const refreshToken = generateRefreshToken(user)
  await userRepository.updateUser(user, { refreshToken })

  return { token, refreshToken }
}

const refreshToken = async (refreshToken) => {
  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
  const user = await userRepository.findUserById(decoded.id)

  if (!user || user.refreshToken !== refreshToken) {
    throw new Error('Invalid refresh token')
  }

  const newToken = generateAccessToken(user)
  const newRefreshToken = generateRefreshToken(user)
  await userRepository.updateUser(user, { refreshToken: newRefreshToken })

  return { token: newToken, refreshToken: newRefreshToken }
}

const getCurrentUser = async (userId) => {
  const user = await userRepository.findUserById(userId)
  const userWithoutPassword = user.toJSON()
  delete userWithoutPassword.password
  return userWithoutPassword
}

module.exports = {
  registerUser,
  loginUser,
  refreshToken,
  getCurrentUser,
}

const { User } = require('../models')

const findUserByLogin = async (login) => {
  return await User.findOne({ where: { login } })
}

const findUserByEmail = async (email) => {
  return await User.findOne({ where: { email } })
}

const findUserById = async (id) => {
  return await User.findByPk(id)
}

const createUser = async (userData) => {
  return await User.create(userData)
}

const updateUser = async (user, updateData) => {
  return await user.update(updateData)
}

module.exports = {
  findUserByLogin,
  findUserByEmail,
  findUserById,
  createUser,
  updateUser,
}

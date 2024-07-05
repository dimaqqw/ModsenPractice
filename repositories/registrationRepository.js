const { Registration } = require('../models')

const findRegistration = async (userId, meetupId) => {
  return await Registration.findOne({ where: { userId, meetupId } })
}

const createRegistration = async (registrationData) => {
  return await Registration.create(registrationData)
}

module.exports = {
  findRegistration,
  createRegistration,
}

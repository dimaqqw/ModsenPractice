const { Meetup } = require('../models')
const { Op } = require('sequelize')

const findAllMeetups = async (filter, order, limit, offset) => {
  return await Meetup.findAll({ where: filter, order, limit, offset })
}

const countMeetups = async (filter) => {
  return await Meetup.count({ where: filter })
}

const findMeetupById = async (id) => {
  return await Meetup.findByPk(id)
}

const createMeetup = async (meetupData) => {
  return await Meetup.create(meetupData)
}

const updateMeetup = async (id, updateData) => {
  const meetup = await Meetup.findByPk(id)
  if (meetup) {
    await meetup.update(updateData)
  }
  return meetup
}

const deleteMeetup = async (id) => {
  const meetup = await Meetup.findByPk(id)
  if (meetup) {
    await meetup.destroy()
  }
  return meetup
}

module.exports = {
  findAllMeetups,
  countMeetups,
  findMeetupById,
  createMeetup,
  updateMeetup,
  deleteMeetup,
}

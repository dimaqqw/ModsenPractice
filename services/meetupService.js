const meetupRepository = require('../repositories/meetupRepository')
const registrationRepository = require('../repositories/registrationRepository')
const { meetupSchema } = require('../validators/meetupValidator')

const getAllMeetups = async (query) => {
  const { search, tags, sortByName, sortByDate, page = 1, size = 5 } = query

  const filter = {}
  if (search) {
    filter.title = { [Op.iLike]: `%${search}%` }
  }
  if (tags) {
    filter.tags = { [Op.contains]: tags.split(',') }
  }

  const order = []
  if (sortByName) {
    order.push(['title', sortByName])
  }
  if (sortByDate) {
    order.push(['date', sortByDate])
  }

  const limit = parseInt(size, 10)
  const offset = (parseInt(page, 10) - 1) * limit

  const meetups = await meetupRepository.findAllMeetups(
    filter,
    order,
    limit,
    offset
  )
  const totalMeetups = await meetupRepository.countMeetups(filter)
  const totalPages = Math.ceil(totalMeetups / limit)

  return {
    data: meetups,
    meta: { totalMeetups, totalPages, currentPage: parseInt(page, 10) },
  }
}

const getMeetupById = async (id) => {
  return await meetupRepository.findMeetupById(id)
}

const createMeetup = async (meetupData) => {
  const { error } = meetupSchema.validate(meetupData)
  if (error) {
    throw new Error(error.details[0].message)
  }
  return await meetupRepository.createMeetup(meetupData)
}

const updateMeetup = async (id, updateData, userId) => {
  const { error } = meetupSchema.validate(updateData)
  if (error) {
    throw new Error(error.details[0].message)
  }

  const meetup = await meetupRepository.findMeetupById(id)
  if (!meetup) {
    throw new Error('Meetup not found')
  }

  if (meetup.organizerId !== userId) {
    throw new Error('Forbidden')
  }

  return await meetupRepository.updateMeetup(id, updateData)
}

const deleteMeetup = async (id, userId) => {
  const meetup = await meetupRepository.findMeetupById(id)
  if (!meetup) {
    throw new Error('Meetup not found')
  }

  if (meetup.organizerId !== userId) {
    throw new Error('Forbidden')
  }

  return await meetupRepository.deleteMeetup(id)
}

const signUpForMeetup = async (meetupId, userId) => {
  const existingSignup = await registrationRepository.findRegistration(
    userId,
    meetupId
  )
  if (existingSignup) {
    throw new Error('User is already signed up for this meetup')
  }

  return await registrationRepository.createRegistration({ userId, meetupId })
}

module.exports = {
  getAllMeetups,
  getMeetupById,
  createMeetup,
  updateMeetup,
  deleteMeetup,
  signUpForMeetup,
}

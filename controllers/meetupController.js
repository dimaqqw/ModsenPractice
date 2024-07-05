const meetupService = require('../services/meetupService')

exports.getAllMeetups = async (req, res) => {
  try {
    const result = await meetupService.getAllMeetups(req.query)
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.getMeetupById = async (req, res) => {
  try {
    const meetup = await meetupService.getMeetupById(req.params.id)
    if (!meetup) {
      return res.status(404).json({ message: 'Meetup not found' })
    }
    res.json(meetup)
  } catch (error) {
    res
      .status(500)
      .json({ error: 'An error occurred while fetching the meetup.' })
  }
}

exports.createMeetup = async (req, res) => {
  try {
    const meetup = await meetupService.createMeetup({
      ...req.body,
      organizerId: req.user.id,
    })
    res.status(201).json(meetup)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

exports.updateMeetup = async (req, res) => {
  try {
    const meetup = await meetupService.updateMeetup(
      req.params.id,
      req.body,
      req.user.id
    )
    res.json(meetup)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

exports.deleteMeetup = async (req, res) => {
  try {
    await meetupService.deleteMeetup(req.params.id, req.user.id)
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.signUpForMeetup = async (req, res) => {
  try {
    const registration = await meetupService.signUpForMeetup(
      req.body.meetupId,
      req.user.id
    )
    res.status(201).json({
      message: 'User successfully signed up for the meetup.',
      registration,
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

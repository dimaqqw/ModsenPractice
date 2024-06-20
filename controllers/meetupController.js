const { Meetup } = require('../models')
const { meetupSchema } = require('../validators/meetupValidator')

exports.getAllMeetups = async (req, res) => {
  // ... (фильтрация, сортировка, пагинация)
}

exports.getMeetupById = async (req, res) => {
  const { id } = req.params
  const meetup = await Meetup.findByPk(id)
  if (!meetup) return res.status(404).json({ message: 'Meetup not found' })
  res.json(meetup)
}

exports.createMeetup = async (req, res) => {
  const { error } = meetupSchema.validate(req.body)
  if (error) return res.status(400).json({ error: error.details[0].message })

  const meetup = await Meetup.create({ ...req.body, organizerId: req.user.id })
  res.status(201).json(meetup)
}

exports.updateMeetup = async (req, res) => {
  const { id } = req.params
  const { error } = meetupSchema.validate(req.body)
  if (error) return res.status(400).json({ error: error.details[0].message })

  const meetup = await Meetup.findByPk(id)
  if (!meetup) return res.status(404).json({ message: 'Meetup not found' })

  if (meetup.organizerId !== req.user.id)
    return res.status(403).json({ message: 'Forbidden' })

  await meetup.update(req.body)
  res.json(meetup)
}

exports.deleteMeetup = async (req, res) => {
  const { id } = req.params
  const meetup = await Meetup.findByPk(id)
  if (!meetup) return res.status(404).json({ message: 'Meetup not found' })

  if (meetup.organizerId !== req.user.id)
    return res.status(403).json({ message: 'Forbidden' })

  await meetup.destroy()
  res.status(204).send()
}

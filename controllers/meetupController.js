const { Meetup } = require('../models')
const { Op } = require('sequelize')
const { meetupSchema } = require('../validators/meetupValidator')

exports.getAllMeetups = async (req, res) => {
  try {
    const {
      search,
      tags,
      sortByName,
      sortByDate,
      page = 1,
      size = 5,
    } = req.query

    // Фильтрация
    const filter = {}
    if (search) {
      filter.title = { [Op.iLike]: `%${search}%` }
    }
    if (tags) {
      filter.tags = { [Op.contains]: tags.split(',') }
    }

    // Сортировка
    const order = []
    if (sortByName) {
      order.push(['title', sortByName])
    }
    if (sortByDate) {
      order.push(['date', sortByDate])
    }

    // Пагинация
    const limit = parseInt(size, 10)
    const offset = (parseInt(page, 10) - 1) * limit

    const meetups = await Meetup.findAll({
      where: filter,
      order,
      limit,
      offset,
    })

    const totalMeetups = await Meetup.count({ where: filter })
    const totalPages = Math.ceil(totalMeetups / limit)

    res.status(200).json({
      data: meetups,
      meta: {
        totalMeetups,
        totalPages,
        currentPage: parseInt(page, 10),
      },
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
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

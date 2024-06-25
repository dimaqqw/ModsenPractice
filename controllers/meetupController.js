const { Meetup } = require('../models')
const { Registration } = require('../models')
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

  try {
    const meetup = await Meetup.findByPk(id)
    if (!meetup) {
      return res.status(404).json({ message: 'Meetup not found' })
    }
    res.json(meetup)
  } catch (error) {
    console.error('Error fetching meetup by ID:', error)
    res
      .status(500)
      .json({ error: 'An error occurred while fetching the meetup.' })
  }
}

exports.createMeetup = async (req, res) => {
  try {
    const { error } = meetupSchema.validate(req.body)
    if (error) {
      return res.status(400).json({ error: error.details[0].message })
    }

    const meetup = await Meetup.create({
      ...req.body,
      organizerId: req.user.id,
    })
    res.status(201).json(meetup)
  } catch (error) {
    console.error('Error creating meetup:', error)
    res
      .status(500)
      .json({ error: 'An error occurred while creating the meetup.' })
  }
}

exports.updateMeetup = async (req, res) => {
  const { id } = req.params

  try {
    const { error } = meetupSchema.validate(req.body)
    if (error) {
      return res.status(400).json({ error: error.details[0].message })
    }

    const meetup = await Meetup.findByPk(id)
    if (!meetup) {
      return res.status(404).json({ message: 'Meetup not found' })
    }

    if (meetup.organizerId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' })
    }

    await meetup.update(req.body)
    res.json(meetup)
  } catch (error) {
    console.error('Error updating meetup:', error)
    res
      .status(500)
      .json({ error: 'An error occurred while updating the meetup.' })
  }
}

exports.deleteMeetup = async (req, res) => {
  const { id } = req.params

  try {
    const meetup = await Meetup.findByPk(id)
    if (!meetup) {
      return res.status(404).json({ message: 'Meetup not found' })
    }

    if (meetup.organizerId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' })
    }

    await meetup.destroy()
    res.status(204).send()
  } catch (error) {
    console.error('Error deleting meetup:', error)
    res
      .status(500)
      .json({ error: 'An error occurred while deleting the meetup.' })
  }
}

exports.signUpForMeetup = async (req, res) => {
  const { meetupId } = req.body
  const userId = req.user.id

  try {
    const existingSignup = await Registration.findOne({
      where: {
        userId: userId,
        meetupId: meetupId,
      },
    })

    if (existingSignup) {
      return res
        .status(400)
        .json({ message: 'User is already signed up for this meetup.' })
    }

    const registration = await Registration.create({
      userId: userId,
      meetupId: meetupId,
    })

    res.status(201).json({
      message: 'User successfully signed up for the meetup.',
      registration,
    })
  } catch (error) {
    console.error('Error signing up for meetup:', error)
    res.status(500).json({ error: 'Could not sign up for the meetup.' })
  }
}

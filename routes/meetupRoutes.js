const express = require('express')
const {
  getAllMeetups,
  getMeetupById,
  createMeetup,
  updateMeetup,
  deleteMeetup,
} = require('../controllers/meetupController')
const { authenticate } = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/meetups', getAllMeetups)
router.get('/meetups/:id', getMeetupById)
router.post('/meetups', authenticate, createMeetup)
router.patch('/meetups/:id', authenticate, updateMeetup)
router.delete('/meetups/:id', authenticate, deleteMeetup)

module.exports = router

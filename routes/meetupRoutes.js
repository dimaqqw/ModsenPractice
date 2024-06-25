const express = require('express')
const {
  getAllMeetups,
  getMeetupById,
  createMeetup,
  updateMeetup,
  deleteMeetup,
  signUpForMeetup,
} = require('../controllers/meetupController')
const { authenticate, organizerGuard } = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/meetups', getAllMeetups)
router.get('/meetups/:id', getMeetupById)
router.post('/meetups', authenticate, organizerGuard, createMeetup)
router.patch('/meetups/:id', authenticate, organizerGuard, updateMeetup)
router.delete('/meetups/:id', authenticate, organizerGuard, deleteMeetup)
router.post('/signup', authenticate, signUpForMeetup)

module.exports = router

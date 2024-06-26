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

/**
 * @swagger
 * tags:
 *   name: Meetups
 *   description: API endpoints for managing meetups
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Meetup:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the meetup
 *         title:
 *           type: string
 *           description: The title of the meetup
 *         description:
 *           type: string
 *           description: The description of the meetup
 *         date:
 *           type: string
 *           format: date-time
 *           description: The date and time of the meetup
 *         location:
 *           type: string
 *           description: The location of the meetup
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: A list of tags associated with the meetup
 *         organizerId:
 *           type: string
 *           description: The ID of the user who is organizing the meetup
 *       required:
 *         - title
 *         - date
 *         - location
 *         - organizerId
 */

/**
 * @swagger
 * /api/meetups:
 *   get:
 *     summary: Get all meetups
 *     description: Retrieve a list of all meetups with optional filters, sorting, and pagination.
 *     tags: [Meetups]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for filtering meetups by title.
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         description: Comma-separated list of tags for filtering meetups.
 *       - in: query
 *         name: sortByName
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order for meetup titles.
 *       - in: query
 *         name: sortByDate
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order for meetup dates.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination.
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Number of items per page.
 *     responses:
 *       '200':
 *         description: List of meetups
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Meetup'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     totalMeetups:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     currentPage:
 *                       type: integer
 *       '500':
 *         description: Internal server error
 */
router.get('/meetups', getAllMeetups)
/**
 * @swagger
 * /api/meetups/{id}:
 *   get:
 *     summary: Get a meetup by ID
 *     description: Retrieve details of a specific meetup by its ID.
 *     tags: [Meetups]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the meetup
 *     responses:
 *       '200':
 *         description: Meetup details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Meetup'
 *       '404':
 *         description: Meetup not found
 *       '500':
 *         description: Internal server error
 */
router.get('/meetups/:id', getMeetupById)
/**
 * @swagger
 * /api/meetups:
 *   post:
 *     summary: Create a new meetup
 *     description: Create a new meetup. Only organizers can create meetups.
 *     tags: [Meetups]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Meetup'
 *     responses:
 *       '201':
 *         description: Meetup created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Meetup'
 *       '400':
 *         description: Invalid input data
 *       '500':
 *         description: Internal server error
 */
router.post('/meetups', authenticate, organizerGuard, createMeetup)
/**
 * @swagger
 * /api/meetups/{id}:
 *   patch:
 *     summary: Update a meetup
 *     description: Update details of an existing meetup. Only the organizer can update the meetup.
 *     tags: [Meetups]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the meetup to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Meetup'
 *     responses:
 *       '200':
 *         description: Meetup updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Meetup'
 *       '400':
 *         description: Invalid input data
 *       '403':
 *         description: Forbidden
 *       '404':
 *         description: Meetup not found
 *       '500':
 *         description: Internal server error
 */
router.patch('/meetups/:id', authenticate, organizerGuard, updateMeetup)
/**
 * @swagger
 * /api/meetups/{id}:
 *   delete:
 *     summary: Delete a meetup
 *     description: Delete an existing meetup. Only the organizer can delete the meetup.
 *     tags: [Meetups]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the meetup to delete
 *     responses:
 *       '204':
 *         description: Meetup deleted successfully
 *       '403':
 *         description: Forbidden
 *       '404':
 *         description: Meetup not found
 *       '500':
 *         description: Internal server error
 */
router.delete('/meetups/:id', authenticate, organizerGuard, deleteMeetup)
/**
 * @swagger
 * /api/signup:
 *   post:
 *     summary: Sign up for a meetup
 *     description: Register the authenticated user for a specific meetup.
 *     tags: [Meetups]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               meetupId:
 *                 type: integer
 *             example:
 *               meetupId: 1
 *     responses:
 *       '201':
 *         description: User signed up for the meetup successfully
 *       '400':
 *         description: User already signed up for the meetup
 *       '500':
 *         description: Internal server error
 */
router.post('/signup', authenticate, signUpForMeetup)

module.exports = router

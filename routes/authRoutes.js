const express = require('express')
const {
  register,
  login,
  getCurrentUser,
  refreshToken,
} = require('../controllers/authController')
const { authenticate } = require('../middleware/authMiddleware')

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API endpoints for user authentication
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user account with username and password.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *             example:
 *               username: johndoe
 *               password: password123
 *               role: user
 *     responses:
 *       '201':
 *         description: User registered successfully.
 *       '400':
 *         description: Bad request. Invalid input data.
 *       '500':
 *         description: Internal server error.
 */
router.post('/register', register)
/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login user
 *     description: Authenticate user with username and password.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               username: user1
 *               password: user1
 *     responses:
 *       '200':
 *         description: User logged in successfully.
 *       '400':
 *         description: Bad request. Invalid credentials.
 *       '500':
 *         description: Internal server error.
 */
router.post('/login', login)
/**
 * @swagger
 * /api/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     description: Refresh the user's access token using a refresh token.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *             example:
 *               refreshToken: <refresh_token>
 *     responses:
 *       '200':
 *         description: Access token refreshed successfully.
 *       '400':
 *         description: Bad request. Invalid refresh token.
 *       '401':
 *         description: Unauthorized. Invalid or expired refresh token.
 *       '500':
 *         description: Internal server error.
 */
router.post('/refresh-token', refreshToken)
/**
 * @swagger
 * /api/me:
 *   get:
 *     summary: Get current user
 *     description: Retrieve the current authenticated user's details.
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully retrieved user data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 username:
 *                   type: string
 *                 role:
 *                   type: string
 *       '401':
 *         description: Unauthorized. Invalid or missing token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No token provided"
 *       '500':
 *         description: Internal server error.
 */
router.get('/me', authenticate, getCurrentUser)

module.exports = router

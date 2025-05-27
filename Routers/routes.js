const express = require('express');
const { handleGetLogin, handleGetSignUp, handlePostLogin, handlePostSignUp, getUserDetails} = require('../Controller/user.controller');
const router = express.Router()

/**
 * @swagger
 * /:
 *   get:
 *     summary: Render login or user profile page based on login status
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Renders the login page or user profile
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 */
router.get('/', handleGetLogin);

/**
 * @swagger
 * /:
 *   post:
 *     summary: Logs a user in
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Successful login, renders user profile
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       400:
 *         description: Missing email or password
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Internal server error
 */

router.post('/', handlePostLogin)

/**
 * @swagger
 * /signup:
 *   get:
 *     summary: Render signup page or user profile if already logged in
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Renders signup or user profile page
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 */

router.get('/signup', handleGetSignUp)

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - fullname
 *               - email
 *               - password
 *             properties:
 *               fullname:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       200:
 *         description: User registered successfully (renders signup confirmation or login page)
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       400:
 *         description: Validation failed (missing fields or email already exists)
 *       500:
 *         description: Server error during registration
 */

router.post('/signup', handlePostSignUp)

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get user profile page if authenticated
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Renders the user profile page
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       500:
 *         description: Token verification failed or user not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token verification faild login again
 *                 status:
 *                   type: string
 *                   example: Failed
 */

router.get('/userprofile', getUserDetails)

router.use((req, res, next) => {
    res.status(404).render('404', { title: '404' })
})

module.exports = router
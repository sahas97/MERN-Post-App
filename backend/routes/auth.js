const express = require('express');
const { body } = require('express-validator');

const User = require('../models/user');
const authController = require('../controllers/auth');
const isAuth = require('../middleware/auth');

const router = express.Router();

router.put('/signup', [
    body('email')
        .isEmail()
        .withMessage('Please add valid email.')
        .custom(async (value, { req }) => {
            const userDoc = await User.findOne({ email: value });
            if (userDoc) {
                return Promise.reject('E-Mail address alredy exists');
            }
        })
        .normalizeEmail(),
    body('password')
        .trim()
        .isLength({ min: 5 }),
    body('name')
        .trim()
        .not()
        .isEmpty()

], authController.signup);

router.post('/login', authController.login);

router.get('/status', isAuth, authController.getUserStatus);

router.patch('/status', isAuth, [
    body('status')
        .trim()
        .not()
        .isEmpty()
], authController.updateUserStatus);

module.exports = router;
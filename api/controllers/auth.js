const Users = require('../models/Users');

const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const signToken = (_id) => {
    return jwt.sign({ _id }, 'mi-secreto', { expiresIn: 60 * 60 * 24 * 365 }) // 1 año
}

// @desc   Register User
// @route  POST /api/v1/auth/register
// @access Public
exports.registerUser = async (req, res, next) => {

    const { email, password } = req.body

    if (!email || !password) {
        return res.status(404).json({
            success: false,
            error: 'Missing email / password'
        });
    }

    const salt = crypto.randomBytes(16);
    const newSalt = salt.toString('base64');

    const key = crypto.pbkdf2Sync(password, newSalt, 10000, 64, 'sha1');
    const encryptedPassword = key.toString('base64')

    try {
        const userExist = await Users.findOne({ email });

        if (userExist) {
            return res.status(404).json({
                success: false,
                error: 'User already exist'
            });
        }

        const user = await Users.create({
            email,
            password: encryptedPassword,
            salt: newSalt,
        });

        return res.status(201).json({
            success: true,
            data: user
        });

    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                error: messages
            });
        } else {
            return res.status(500).json({
                success: false,
                error: err
                // error: 'Server Error'
            });
        }
    }

}

// @desc   Login User
// @route  POST /api/v1/auth/login
// @access Public
exports.loginUser = async (req, res, next) => {
    const { email, password } = req.body

    try {
        const user = await Users.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'Authentication Error'
            });
        }

        const key = crypto.pbkdf2Sync(password, newSalt, 10000, 64, 'sha1');
        const encryptedPassword = key.toString('base64')

        if (encryptedPassword === user.password) {
            const token = signToken(user._id)
            return res.status(201).json({
                success: true,
                token: token
            });
        } else {
            return res.status(404).json({
                success: false,
                error: 'Authentication Error'
            });
        }
    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                error: messages
            });
        } else {
            return res.status(500).json({
                success: false,
                error: err
                // error: 'Server Error'
            });
        }
    }
}

// @desc    Decrypt current Authentication Header
// @route   POST /api/v1/auth/me
// @access Public
exports.meUser = async (req, res, next) => {
    res.send(req.user)
}


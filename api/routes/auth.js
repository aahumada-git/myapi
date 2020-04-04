const express = require('express');
const router = express.Router();

const { isAuthenticated } = require('../auth')

const { registerUser, loginUser, meUser } = require('../controllers/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/me', isAuthenticated, meUser);

module.exports = router;

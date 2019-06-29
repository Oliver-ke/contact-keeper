const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator/check');
const User = require('../models/User');
const auth = require('../middlewares/auth');
// @route  GET api/auth
// @desc   Get loged in user
// @access Private
router.get('/', auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select('-password');
		return res.status(200).json({ status: 200, data: user });
	} catch (err) {
		return res.status(500).json({ status: 500, error: 'Internal server error' });
	}
});

// @route  POST api/auth
// @desc   Auth user and get token
// @access Public
router.post(
	'/',
	[ check('email', 'Please include a valid email').isEmail(), check('password', 'password is required').exists() ],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ status: 400, errors: errors.array() });
		}

		const { email, password } = req.body;
		try {
			let user = await User.findOne({ email });
			if (!user) {
				return res.status(400).json({ status: 400, error: 'invalid credentials' });
			}
			const isMatch = await bcrypt.compare(password, user.password);
			if (!isMatch) {
				return res.status(400).json({ status: 400, error: 'Invalid credentials' });
			}
			const payload = { user: { id: user._id } };
			jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000 }, (err, token) => {
				if (err) throw err;
				return res.status(200).json({ status: 200, data: token });
			});
		} catch (err) {
			return res.status(500).json({ status: 500, error: 'Internal server error' });
		}
	}
);

module.exports = router;

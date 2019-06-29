const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const router = require('express').Router();
const { check, validationResult } = require('express-validator/check');
const User = require('../models/User');

// @route  POST api/users
// @desc   Register a user
// @access Pulic
router.post(
	'/',
	[
		check('name', 'Please add a name').not().isEmpty(),
		check('email', 'Please include a valid emil').isEmail(),
		check('password', 'please enter a password with six or more character').isLength({ min: 6 })
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ status: 400, error: errors.array() });
		}
		const { name, email, password } = req.body;
		try {
			let user = await User.findOne({ email });
			if (user) {
				return res.status(400).json({ status: 400, error: 'users already exist' });
			}
			user = new User({
				name,
				email,
				password
			});
			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(user.password, salt);
			await user.save();
			const payload = { user: { id: user._id } };
			jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000 }, (err, token) => {
				if (err) throw err;
				return res.status(201).json({ status: 201, data: token });
			});
		} catch (err) {
			console.error(err.message);
			return res.status(500).json({ status: 500, error: 'Server Error' });
		}
	}
);

module.exports = router;

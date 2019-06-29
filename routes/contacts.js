const router = require('express').Router();
const { check, validationResult } = require('express-validator/check');
const auth = require('../middlewares/auth');
const User = require('../models/User');
const Contact = require('../models/Contact');
// @route  GET api/contact
// @desc   Get all users contacts
// @access Private
router.get('/', auth, async (req, res) => {
	try {
		const contact = await Contact.find({ user: req.user.id }).sort({ date: -1 });
		return res.status(200).json({ status: 200, data: contact });
	} catch (error) {
		console.error(error.message);
		return res.status(500).json({ status: 500, error: 'Internal server error' });
	}
});

// @route  POST api/contact
// @desc   Add new contacts
// @access Private
router.post('/', [ auth, [ check('name', 'Name filed is required').not().isEmpty() ] ], async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ status: 400, errors: errors.array() });
	}
	const { name, email, phone, type } = req.body;

	try {
		const newContact = new Contact({
			name,
			email,
			phone,
			type,
			user: req.user.id
		});
		const savedContact = await newContact.save();
		return res.status(201).json({ status: 201, data: savedContact });
	} catch (error) {
		console.error(error.message);
		return res.status(500).json({ status: 500, error: 'Internal server error' });
	}
});

// @route  PUT api/contact/:id
// @desc   Update contact
// @access Private
router.put('/:id', auth, async (req, res) => {
	const { name, email, phone, type } = req.body;
	// build a contact file
	const contactFiled = {};
	name ? (contactFiled.name = name) : null;
	email ? (contactFiled.email = email) : null;
	phone ? (contactFiled.phone = phone) : null;
	type ? (contactFiled.type = type) : null;
	try {
		let contact = await Contact.findById(req.params.id);
		if (!contact) {
			return res.status(404).json({ status: 404, error: 'contact not found' });
		}
		// make sure user owns contact
		if (contact.user.toString() !== req.user.id) {
			return res.status(401).json({ status: 401, error: 'Not Authorized' });
		}
		contact = await Contact.findByIdAndUpdate(
			req.params.id,
			{
				$set: contactFiled
			},
			{ new: true }
		);
		return res.status(200).json({ status: 200, data: contact });
	} catch (error) {
		console.error(error.message);
		return res.status(500).json({ status: 500, error: 'Internal server error' });
	}
});

// @route  DELETE api/contact/:id
// @desc   Delete contact
// @access Private
router.delete('/:id', auth, async (req, res) => {
	try {
		let contact = await Contact.findById(req.params.id);
		if (!contact) {
			return res.status(404).json({ status: 404, error: 'contact not found' });
		}
		// make sure user owns contact
		if (contact.user.toString() !== req.user.id) {
			return res.status(401).json({ status: 401, error: 'Not Authorized' });
		}
		await Contact.findByIdAndRemove(req.params.id);
		return res.status(200).json({ status: 200, data: 'Contact removed' });
	} catch (error) {
		console.error(error.message);
		return res.status(500).json({ status: 500, error: 'Internal server error' });
	}
});

module.exports = router;

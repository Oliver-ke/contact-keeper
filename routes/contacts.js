const router = require('express').Router();

// @route  GET api/contact
// @desc   Get all users contacts
// @access Private
router.get('/', (req, res) => {});

// @route  POST api/contact
// @desc   Add new contacts
// @access Private
router.post('/', (req, res) => {});

// @route  PUT api/contact/:id
// @desc   Update contact
// @access Private
router.put('/:id', (req, res) => {});

// @route  DELETE api/contact/:id
// @desc   Delete contact
// @access Private
router.delete('/:id', (req, res) => {});

module.exports = router;

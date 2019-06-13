const router = require('express').Router();

// @route  GET api/auth
// @desc   Get loged in user
// @access Private
router.get('/', (req, res) => {});

// @route  POST api/auth
// @desc   Auth user and get token
// @access Public
router.post('/', (req, res) => {});

module.exports = router;

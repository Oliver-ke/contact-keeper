const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
	// Get the auth token
	const token = req.header('x-auth-token');
	//check if no token
	if (!token) {
		return res.status(401).json({ status: 401, error: 'Authorization denied' });
	}
	try {
		const decoded = jwt.verify(token, config.get('jwtSecret'));
		req.user = decoded.user;
		next();
	} catch (err) {
		res.status(401).json({ status: 401, error: 'Token is not valid' });
	}
};

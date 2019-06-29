const express = require('express');
const path = require('path');

// Routes import

const users = require('./routes/users');
const auth = require('./routes/auth');
const contacts = require('./routes/contacts');
const connectDb = require('./config/db');

const app = express();

// Database connection
connectDb();

// init express body-perser middleware
app.use(express.json({ extended: false }));

// define our routes
app.use('/api/contacts', contacts);
app.use('/api/users', users);
app.use('/api/auth', auth);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
	// set static folder
	app.use(express.static('client/build'));
	app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')));
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

const express = require('express');

// Routes import

const users = require('./routes/users');
const users = require('./routes/users');
const contacts = require('./routes/contacts');

const app = express();

// define our routes
app.use('/api/contacts', contacts);
app.use('/api/users', users);
app.use('/api/auth', auth);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	`Server running on port ${PORT}`;
});

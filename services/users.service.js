const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const { ensureAuthenticated } = require('./authentication.service');

// Use MySQL database
const db = require('../../services/database.service');

// Endpoint to get user profile (any authenticated user)
router.get('/profile', ensureAuthenticated, async (req, res) => {
    try {
        const email = req.user.id; // Assuming req.user is set by authentication middleware
        const [rows] = await db.query('SELECT email, first_name, last_name, phone, role, last_login, active FROM users WHERE id = ?', [userId]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Update user profile (any authenticated user)
router.put('/profile', ensureAuthenticated, async (req, res) => {
    const { first_name, last_name, phone } = req.body;
    try {
        const email = req.user.id; // Assuming req.user is set by authentication middleware
        await db.query('UPDATE users SET first_name = ?, last_name = ?, phone = ? WHERE id = ?', [first_name, last_name, phone, userId]);
        res.json({ message: 'Profile updated successfully.' });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error.' });
    }
});

module.exports = router;

// Note: Ensure that only authenticated users can access these routes.
// This can be done by adding middleware to check for a valid JWT token before allowing access.
// You can create a middleware function to verify the token and use it in the routes above.


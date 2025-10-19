// Authentication Service module for handling user authentication
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// Use MySQL database
const db = require('./database.service');

// Refactored login function
async function authenticateUser(email, password) {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
        return { error: 'Incorrect email or password.' };
    }
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return { error: 'Incorrect email or password.' };
    }
    return { user };
}

// Register endpoint
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if user exists
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length > 0) {
            return res.status(409).send('email already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const { role } = req.body;
        const allowedRoles = ["Administrator", "Principal", "Staff-Admin", "Staff", "Students", "Parents"];
        if (!allowedRoles.includes(role)) {
            return res.status(400).send('Invalid role');
        }
        // Code as proceeded:
        console.log("Role during registration:", role);
        await db.query('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', [email, hashedPassword, role]);
        res.status(201).send('User registered');
    } catch (err) {
        res.status(500).send(`Error registering user: ${err.message}`);
    }
});

// Login endpoint
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }
    try {
        const result = await authenticateUser(email, password);
        if (result.error) {
            return res.status(401).json({ error: result.error });
        }
        const user = result.user;
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role
        };
        const token = jwt.sign(payload, process.env.SESSION_SECRET || 'default_secret', { expiresIn: '1h' });
        res.json({ access_token: token, role: user.role, expiresIn: '1h' });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Logout endpoint
router.post('/logout', (req, res) => {
    req.logout(err => {
        if (err) { return next(err); }
        res.send('Logged out');
    });
});

// Middleware to protect routes
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).send('Unauthorized');
}

db.testDbConnection();

module.exports = { router, ensureAuthenticated };
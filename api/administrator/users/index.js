// Create user management api endpoints for administrators to manage users with various roles
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {canAssignRole} = require('../../../services/roles.service');
const bcrypt = require('bcrypt'); 

// Use MySQL database
const db = require('../../../services/database.service');

// Middleware to check for Administrator role from bearer token
function isAdmin(req, res, next) {

    console.log("Checking admin role middleware");
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'No token provided.' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Malformed token.' });
    }
    console.log("Token received:", token);
    try {
        const decoded = jwt.verify(token, process.env.SESSION_SECRET || 'default_secret');
        console.log("Token decoded successfully");
        console.log("Decoded token:", decoded.role);
        if (decoded.role !== 'Administrator') {
            return res.status(403).json({ error: 'Access denied. Administrator role required.' });
        }
        req.user = decoded; // Attach user info to request object
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token.' });
    }
}

// Example endpoint to get all users (Administrator only)
router.get('/users', isAdmin, async (req, res) => {
    // In a real application, you would check if the requester has admin privileges
    try {
        const [rows] = await db.query('SELECT email, first_name, last_name, phone, role, last_login, active FROM users');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Endpoint to create a new user (Administrator only)
router.post('/users', isAdmin, async (req, res) => {
    const { email, first_name, last_name, phone, role, password } = req.body;
    try {
        // Check if user already exists
        const [existingUser] = await db.query('SELECT email FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(409).json({ error: 'User with this email already exists.' });
        }
        // Check if the roles can be assigned by admin
        if (!canAssignRole(req.user.role, role)) {
            return res.status(403).json({ error: 'You do not have permission to assign this role.' });
        }
        
        // Hash the password before storing (you would need to import bcrypt)
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query(
            'INSERT INTO users (email, first_name, last_name, phone, role, password, active, one_time_password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [email, first_name, last_name, phone, role, hashedPassword, 0, '']
        );
        res.status(201).json({ message: 'User created successfully.' });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error.', details: err.message });
    }
});

// Update user details (Administrator only)
router.put('/users/:email', isAdmin, async (req, res) => {
    const { email } = req.params;
    const { first_name, last_name, phone, role, active } = req.body;
    try {
        // Check for the valid ROLE
        const allowedRoles = ["Administrator", "Principal", "Staff-Admin", "Staff", "Students", "Parents"];
        if (role && !allowedRoles.includes(role)) {
            return res.status(400).json({ error: 'Invalid role specified.' });
        }
        await db.query(
            'UPDATE users SET first_name = ?, last_name = ?, phone = ?, role = ?, active = ? WHERE email = ?',
            [first_name, last_name, phone, role, active, email]
        );
        res.json({ message: 'User updated successfully.' });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Delete a user (Administrator only)
router.delete('/users/:email', isAdmin, async (req, res) => {
    const { email } = req.params;
    try {
        await db.query('DELETE FROM users WHERE email = ?', [email]);
        res.json({ message: 'User deleted successfully.' });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Export 
module.exports = router;

// Create Administrative Role API endpoints
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Use MySQL database
const db = require('../../services/database.service');

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

// Additional admin routes can be added here

// IIMTT specific admin routes can be added here
const iimttAdminRoutes = require('./iimtt/students.routes');
router.use('/iimtt', isAdmin, iimttAdminRoutes);


module.exports = router;

// Note: Ensure that only users with the "Administrator" role can access these routes.
// This can be done by adding middleware to check the user's role before allowing access.
// You can create a middleware function to check for the "Administrator" role and use it in the routes above.

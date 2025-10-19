// API Router and endpoints module for the application
const express = require('express');
const router = express.Router();

// Import authentication router only
const { router: authRouter } = require('../services/authentication.service');

// Mount authentication routes at /auth
router.use('/auth', authRouter);

// Import administrator routes
const adminRoutes = require('./administrator/index');

// Mount administrator routes at /administrator
router.use('/admin', adminRoutes);

// You can add more role-based routes here similarly
// e.g., const principalRoutes = require('./principal/index');
// router.use('/principal', principalRoutes);

// Default route for API root
router.get('/', (req, res) => {
    res.send('Welcome to the API');
});

// Export the router
module.exports = router;
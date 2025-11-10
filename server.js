require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const session = require('express-session');
const RedisStore = require('connect-redis').RedisStore;
const redis = require('redis');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 8080;

// For parsing application/json
app.use(express.json());

// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));


// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Enable CORS for all routes
app.use(cors());

const redisClient = redis.createClient();

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Public route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React app in production
  app.use(express.static(path.join(__dirname, 'public')));

  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
}

if (process.env.NODE_ENV !== 'production') {
  // In non-production environments, serve test files from /tests at /tests route
  app.use('/test-apis', (req, res) => { res.sendFile(path.join(__dirname, 'public', 'test-sql.html')) });
}

// Import API routes
const apiRoutes = require('./api');

// Mount API routes at /api
app.use('/api', apiRoutes);


// Disallow any other routes
app.use((req, res, next) => {
  res.status(404).send('Not Found');
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

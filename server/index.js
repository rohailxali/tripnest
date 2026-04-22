require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const tripsRoutes = require('./routes/trips');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/trips', tripsRoutes);

// Mock implementation for user profile to prevent 404s
app.get('/api/user/profile', (req, res) => {
  res.json({ success: true, data: {
    id: 'u_default', name: 'Zohair', email: 'zohair@example.com',
    avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=David',
    bio: '', location: '', tripsCount: 0, joinedAt: new Date().toISOString(),
    preferences: { currency: 'USD', language: 'en', emailNotifications: true, travelStyle: [], darkMode: false }
  }});
});
app.put('/api/user/profile', (req, res) => res.json({ success: true, data: req.body }));

// Mock implementation for user password
const db = require('./db');
app.put('/api/user/password', (req, res) => {
  const { password } = req.body;
  // This is a naive MVP update using the default user
  db.run(`UPDATE users SET password = ? WHERE email = ?`, [password, 'zohair@example.com'], function(err) {
    if (err) return res.status(500).json({ success: false, message: 'Database error' });
    res.json({ success: true, message: 'Password updated' });
  });
});


// Mock implementation for places to prevent 404s
app.get('/api/places/search', (req, res) => {
  res.json({ success: true, data: [] });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'TripNest API is running' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

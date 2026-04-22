const express = require('express');
const router = express.Router();
const db = require('../db');

// Mock data integration helper
const getMockUserTemplate = () => ({
  avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=David',
  bio: 'Adventure seeker | New traveler',
  location: 'Earth',
  tripsCount: 0,
  joinedAt: new Date().toISOString().split('T')[0],
  preferences: {
    currency: 'USD',
    language: 'en',
    emailNotifications: true,
    travelStyle: [],
    darkMode: false,
  },
});

router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const id = 'u_' + Date.now();
  db.run(`INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)`, 
    [id, name, email, password], // In a real app, hash password here
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ message: 'Email already exists' });
        }
        return res.status(500).json({ message: 'Database error' });
      }
      
      const user = { id, name, email, ...getMockUserTemplate() };
      res.json({ success: true, data: { user, token: 'fake_jwt_token_' + id } });
    }
  );
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.get(`SELECT * FROM users WHERE email = ? AND password = ?`, [email, password], (err, row) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (!row) return res.status(401).json({ message: 'Invalid credentials' });

    const user = { id: row.id, name: row.name, email: row.email, ...getMockUserTemplate() };
    res.json({ success: true, data: { user, token: 'fake_jwt_token_' + row.id } });
  });
});

module.exports = router;

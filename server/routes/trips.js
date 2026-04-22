const express = require('express');
const router = express.Router();
const db = require('../db');

// Ensure tables exist properly
router.get('/', (req, res) => {
  db.all(`SELECT * FROM trips ORDER BY created_at DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    const trips = rows.map(r => JSON.parse(r.data));
    res.json({ success: true, data: trips });
  });
});

router.get('/:id', (req, res) => {
  db.get(`SELECT * FROM trips WHERE id = ?`, [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (!row) return res.status(404).json({ message: 'Trip not found' });
    res.json({ success: true, data: JSON.parse(row.data) });
  });
});

router.post('/', (req, res) => {
  const tripData = {
    id: 't_' + Date.now(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'planning',
    travelers: 1,
    budget: { total: 0, currency: 'USD', spent: 0, categories: [], alerts: [] },
    itinerary: [],
    places: [],
    sharedAccess: [],
    comments: [],
    activityLog: [],
    tags: [],
    isPublic: false,
    ...req.body
  };

  db.run(`INSERT INTO trips (id, ownerId, data) VALUES (?, ?, ?)`,
    [tripData.id, tripData.ownerId || 'u1', JSON.stringify(tripData)],
    function(err) {
      if (err) return res.status(500).json({ message: 'Database error' });
      res.json({ success: true, data: tripData });
    }
  );
});

router.put('/:id', (req, res) => {
  db.get(`SELECT data FROM trips WHERE id = ?`, [req.params.id], (err, row) => {
    if (err || !row) return res.status(404).json({ message: 'Trip not found' });
    
    // Merge existing with new data
    const existing = JSON.parse(row.data);
    const updatedTrip = { ...existing, ...req.body, updatedAt: new Date().toISOString() };
    
    db.run(`UPDATE trips SET data = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [JSON.stringify(updatedTrip), req.params.id],
      function(err) {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json({ success: true, data: updatedTrip });
      }
    );
  });
});

router.delete('/:id', (req, res) => {
  db.run(`DELETE FROM trips WHERE id = ?`, [req.params.id], function(err) {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json({ success: true, data: null });
  });
});

// Mock AI Plan generation endpoint
router.post('/:id/generate-plan', (req, res) => {
  db.get(`SELECT data FROM trips WHERE id = ?`, [req.params.id], (err, row) => {
    if (err || !row) return res.status(404).json({ message: 'Trip not found' });
    
    const trip = JSON.parse(row.data);
    // Add mock itinerary for demo purpose
    trip.itinerary = [
      {
        id: 'id1',
        tripId: trip.id,
        day: 1,
        date: trip.startDate || new Date().toISOString(),
        title: 'Arrival & Setup',
        morning: [], afternoon: [], evening: []
      }
    ];

    db.run(`UPDATE trips SET data = ? WHERE id = ?`, [JSON.stringify(trip), trip.id], err => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json({ success: true, data: trip });
    });
  });
});

module.exports = router;

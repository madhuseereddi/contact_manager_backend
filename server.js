const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const db = new sqlite3.Database('./contacts.db');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Create table if not exists
db.run(
  `CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL
  )`
);

// Get all contacts
app.get('/contacts', (req, res) => {
  db.all('SELECT * FROM contacts', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Add a new contact
app.post('/contacts', (req, res) => {
  const { name, email, phone } = req.body;
  const sql = 'INSERT INTO contacts (name, email, phone) VALUES (?, ?, ?)';
  db.run(sql, [name, email, phone], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({ id: this.lastID });
  });
});

// Update a contact
app.put('/contacts/:id', (req, res) => {
  const { name, email, phone } = req.body;
  const sql = 'UPDATE contacts SET name = ?, email = ?, phone = ? WHERE id = ?';
  db.run(sql, [name, email, phone, req.params.id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(200).json({ updated: this.changes });
  });
});

// Delete a contact
app.delete('/contacts/:id', (req, res) => {
  const sql = 'DELETE FROM contacts WHERE id = ?';
  db.run(sql, [req.params.id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(200).json({ deleted: this.changes });
  });
});

// Start the server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});

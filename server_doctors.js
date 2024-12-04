const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
require('dotenv').config();
const path = require('path');
require('dotenv').config();

const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Abdullah3434',
    database: process.env.DB_NAME || 'registered_doctors',
});

db.connect((err) => {
    if (err) {
        console.error('Database connection error:', err);
        process.exit(1);
    }
    console.log('Connected to the MySQL database');
});

// Login API endpoint
app.post('/api/login', (req, res) => {
    const { patientName, medicalID, patientPassword } = req.body;

    const query = `
        SELECT * FROM table_of_doctors 
        WHERE name = ? AND medical_ID = ?`;

    db.query(query, [patientName, medicalID], (err, results) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        if (results.length > 0) {
            bcrypt.compare(patientPassword, results[0].password, (err, match) => {
                if (err) {
                    console.error('Error comparing password:', err);
                    return res.status(500).json({ message: 'Internal Server Error' });
                }
                if (match) {
                    res.json({ message: 'Login successful' });
                } else {
                    res.status(401).json({ message: 'Invalid password' });
                }
            });
        } else {
            res.status(401).json({ message: 'Please register yourself' });
        }
    });
});

// Enable CORS with your GitHub Pages domain
app.use(cors({
    origin: 'https://github.com/MMemon2003/Health-Project24.github.io', // Replace with your actual GitHub Pages URL
    methods: ['GET', 'POST'],
    credentials: true
  }));
// Start the server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
  });

  app.get('/api/test', (req, res) => {
    res.send('Doctor server is running and database is connected!');
  });
  

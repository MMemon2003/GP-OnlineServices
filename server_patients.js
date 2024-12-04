const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
require('dotenv').config();
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine to EJS
app.set('view engine', 'ejs');

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Abdullah3434',
  database: process.env.DB_NAME || 'registerredd_patients',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL');
});

// Route for home page (rendering static form)
app.get('/', (req, res) => {
  res.render('index'); // Render the index.ejs file
});

// Route for login form submission
app.post('/login', (req, res) => {
  const { patientName, medicalID, patientPassword } = req.body;

  const query = `
    SELECT * FROM table_of_patients 
    WHERE name = ? AND medical_ID = ?`;

  db.query(query, [patientName, medicalID], (err, results) => {
    if (err) {
      console.error('Error querying the database:', err);
      return res.status(500).send('Internal Server Error');
    }

    if (results.length > 0) {
      bcrypt.compare(patientPassword, results[0].password, (err, match) => {
        if (err) {
          console.error('Error comparing password:', err);
          return res.status(500).send('Internal Server Error');
        }

        if (match) {
          res.render('result', { message: 'Login successful', data: results[0] });
        } else {
          res.render('result', { message: 'Invalid password', data: null });
        }
      });
    } else {
      res.render('result', { message: 'Please register yourself', data: null });
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
  res.send('Server is running and database is connected!');
});


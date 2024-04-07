const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

const db = new sqlite3.Database('./db.sqlite');

app.use(express.static('public'));
// Serve static files from the 'src' directory (for JavaScript file)
app.use(express.static('src'));
app.use(express.json());

app.get('/tasks', (req, res) => {
    db.all('SELECT * FROM tasks', (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
        }
        res.json(rows);
    });
});

app.post('/tasks', (req, res) => {
    const title = req.body.title;
    db.run('INSERT INTO tasks (title, completed) VALUES (?, ?)', [title, 0], function(err) {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
        }
        res.send('Task added successfully');
    });
});

// Hardcoded user credentials (for demonstration only)
const users = [
    { id: 1, username: 'admin', password: 'admin', role: 'admin' },
    { id: 2, username: 'user', password: 'user', role: 'user' }
];

// Middleware to authenticate user
function authenticateUser(req, res, next) {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
        return res.status(401).send('Invalid username or password');
    }
    req.user = user; // Attach user object to request
    next();
}

// Middleware to authorize admin
function authorizeAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).send('Forbidden');
    }
}

// Authentication route
app.post('/login', authenticateUser, (req, res) => {
    res.json({ message: 'Login successful', user: req.user });
});

// Route accessible only to authenticated users
app.get('/tasks', authenticateUser, (req, res) => {
    // Get tasks logic here
});

// Route accessible only to admin users
app.delete('/tasks/:id', authenticateUser, authorizeAdmin, (req, res) => {
    // Delete task logic here
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});



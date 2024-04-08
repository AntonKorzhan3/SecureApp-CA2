const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

const db = new sqlite3.Database('./db.sqlite');

app.use(express.static('public'));
app.use(express.static('src'));
app.use(express.json());
app.use(bodyParser.json());

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get('SELECT * FROM users WHERE username=? AND password=?', [username, password], (err, user) => {
        if (err || !user) {
            return res.status(401).send('Invalid username or password');
        }
        res.json({ message: 'Login successful', user });
    });
});

// Secure version: Displaying only usernames
app.get('/users', (req, res) => {
    db.all('SELECT username FROM users', (err, users) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Internal Server Error');
        }
        res.json(users);
    });
});


// Route to fetch tasks (no authentication required)
app.get('/tasks', (req, res) => {
    db.all('SELECT * FROM tasks', (err, tasks) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Internal Server Error');
        }
        res.json(tasks);
    });
});

app.post('/tasks', (req, res) => {
    const { title } = req.body;
    db.run('INSERT INTO tasks (title) VALUES (?)', [title], (err) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Internal Server Error');
        }
        res.status(201).send('Task added successfully');
    });
});

// Route to delete a task (requires admin authentication)
app.delete('/tasks/:taskId', verifyAdmin, (req, res) => {
    const taskId = req.params.taskId;
    db.run('DELETE FROM tasks WHERE id = ?', [taskId], (err) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Internal Server Error');
        }
        res.status(200).send('Task deleted successfully');
    });
});

// Middleware to verify admin authentication
function verifyAdmin(req, res, next) {
    const { username, password } = req.body;
    db.get('SELECT * FROM users WHERE username=? AND password=? AND role="admin"', [username, password], (err, user) => {
        if (err || !user) {
            return res.status(401).send('Unauthorized');
        }
        next();
    });
}

app.listen(port, () => {
    console.log(`Secure server is listening at http://localhost:${port}`);
});

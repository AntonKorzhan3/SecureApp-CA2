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

// Authentication route (insecure, for demonstration purposes only)
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = `SELECT * FROM users WHERE username='${username}' AND password='${password}'`;
    db.get(query, (err, user) => {
        if (err || !user) {
            return res.status(401).send('Invalid username or password');
        }
        res.json({ message: 'Login successful', user });
    });
});

app.get('/users', (req, res) => {
    db.all('SELECT * FROM users', (err, users) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Internal Server Error');
        }
        res.json(users);
    });
});


// Route accessible only to authenticated users (insecure, for demonstration purposes only)
app.get('/tasks', (req, res) => {
    db.all('SELECT * FROM tasks', (err, tasks) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Internal Server Error');
        }
        res.json(tasks);
    });
});

// Route to add a new task (insecure, for demonstration purposes only)
app.post('/tasks', (req, res) => {
    const { title } = req.body;
    db.run(`INSERT INTO tasks (title) VALUES ('${title}')`, (err) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Internal Server Error');
        }
        res.status(201).send('Task added successfully');
    });
});

app.delete('/tasks/:taskId', (req, res) => {
    const { username, password } = req.body;
    db.get('SELECT * FROM users WHERE username=? AND password=?', [username, password], (err, user) => {
        if (err || !user) {
            return res.status(401).send('Unauthorized');
        }
        const taskId = req.params.taskId;
        if (user.username === 'admin') {
        // Assuming you have a 'tasks' table with a column named 'id' as the primary key
            db.run('DELETE FROM tasks WHERE id = ?', [taskId], (err) => {
                if (err) {
                    console.error(err.message);
                    return res.status(500).send('Internal Server Error');
                }
                res.status(200).send('Task deleted successfully');
            });
        }else {
                return res.status(403).send('Forbidden');
            }
    });
});

app.listen(port, () => {
    console.log(`Insecure server is listening at http://localhost:${port}`);
});

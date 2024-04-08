document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const authMessage = document.getElementById('authMessage');
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');

    async function fetchTasks() {
        const response = await fetch('/tasks');
        const tasks = await response.json();
        taskList.innerHTML = ''; // Clear existing tasks
        tasks.forEach(task => renderTask(task));
    }

    async function login(username, password) {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        if (response.ok) {
            const data = await response.json();
            authMessage.textContent = data.message;
            fetchTasks();
        } else {
            authMessage.textContent = 'Authentication failed';
        }
    }

    async function addTask(title) {
        const response = await fetch('/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title })
        });
        if (response.ok) {
            await fetchTasks(); // Fetch tasks after adding a new task
        } else {
            console.error('Error adding task:', response.status);
        }
    }

    async function deleteTask(taskId) {
        try {
            const response = await fetch(`/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                await fetchTasks(); // Fetch tasks after deleting a task
            } else {
                console.error('Error deleting task:', response.status);
            }
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    }

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        if (username && password) {
            await login(username, password);
            usernameInput.value = '';
            passwordInput.value = '';
        }
    });

    taskForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const title = taskInput.value.trim();
        if (title) {
            await addTask(title);
            taskInput.value = '';
        }
    });

    taskList.addEventListener('click', async (event) => {
        if (event.target.tagName === 'LI') {
            const taskId = event.target.dataset.taskId;
            await deleteTask(taskId);
        }
    });

const displayUsersButton = document.getElementById('displayUsersButton');
const usersList = document.getElementById('usersList');

async function fetchUsers() {
    const response = await fetch('/users');
        const users = await response.json();
        usersList.innerHTML = ''; // Clear existing tasks
        users.forEach(user => renderUser(user));
    }
    function renderUser(user) {
        const li = document.createElement('li');
        li.textContent = user.username; // Render task title without sanitization
        li.dataset.userId = user.id; // Store task ID as a data attribute
        usersList.appendChild(li);
    }

    displayUsersButton.addEventListener('click', async (event) => {
        try {
            const response = await fetch('/users');
            const users = await response.json();
            usersList.innerHTML = ''; // Clear existing list
            users.forEach(user => {
                const li = document.createElement('li');
                li.textContent = user.username;
                usersList.appendChild(li);
            });
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    });

    function renderTask(task) {
        const li = document.createElement('li');
        li.textContent = task.title;
        li.dataset.taskId = task.id; // Store task ID as a data attribute
        taskList.appendChild(li);
    }

    fetchUsers();
    fetchTasks();
});

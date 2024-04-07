document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const authMessage = document.getElementById('authMessage');
    const userRole = document.getElementById('userRole');

    // Fetch tasks from the server and render them
    async function fetchTasks() {
        const response = await fetch('/tasks');
        const tasks = await response.json();
        tasks.forEach(task => renderTask(task));
    }

    // Add a new task
    async function addTask(title) {
        const response = await fetch('/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title })
        });
        if (response.ok) {
            const newTask = await response.text();
            renderTask({ id: Date.now(), title, completed: 0 });
        }
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
            userRole.textContent = `Role: ${data.user.role}`;
            fetchTasks(); // Fetch tasks after successful login
        } else {
            authMessage.textContent = 'Authentication failed';
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

    // Render a task item
    function renderTask(task) {
        const li = document.createElement('li');
        li.textContent = task.title;
        if (!task.completed) {
            const completeLink = document.createElement('a');
            completeLink.href = '#';
            completeLink.textContent = 'Mark as Complete';
            completeLink.addEventListener('click', () => completeTask(task.id));
            li.appendChild(completeLink);
        }
        taskList.appendChild(li);
    }

    // Mark a task as completed
    async function completeTask(taskId) {
        // Implement the logic to update task status
    }

    taskForm.addEventListener('submit', event => {
        event.preventDefault();
        const title = taskInput.value.trim();
        if (title) {
            addTask(title);
            taskInput.value = '';
        }
    });

    fetchTasks();
});

// backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// In-memory storage for tasks
let tasks = [];

// Root route
app.get('/', (req, res) => {
    res.send('Task Management API is running');
});

// Get all tasks
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

// Create a new task
app.post('/tasks', (req, res) => {
    const { title, description, dueDate } = req.body;
    const newTask = {
        id: tasks.length + 1,
        title,
        description,
        dueDate
    };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

// Get a task by ID
app.get('/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
});

// Update a task
app.put('/tasks/:id', (req, res) => {
    const { title, description, dueDate } = req.body;
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }
    task.title = title;
    task.description = description;
    task.dueDate = dueDate;
    res.json(task);
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
    const taskIndex = tasks.findIndex(t => t.id === parseInt(req.params.id));
    if (taskIndex === -1) {
        return res.status(404).json({ message: 'Task not found' });
    }
    tasks.splice(taskIndex, 1);
    res.status(204).send();
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

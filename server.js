const express = require('express');
const path = require('path');
const crypto = require('crypto');

const app = express();
const port = process.env.PORT || 3000;

// let the app read json data
app.use(express.json());
// serve our frontend files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// this array will hold all our tasks for now
let tasks = [];

function sendError(res, status, msg) {
    return res.status(status).json({ error: msg });
}

// send all tasks to the frontend
app.get('/tasks', (req, res) => {
    // put the unfinished tasks at the top
    const sorted = [...tasks].sort((a, b) => {
        if (a.completed === b.completed) {
            return b.createdAt - a.createdAt;
        }
        return a.completed ? 1 : -1;
    });
    res.json(sorted);
});

// add a new task
app.post('/tasks', (req, res) => {
    const title = req.body.title;

    if (!title || title.trim() === '') {
        return sendError(res, 400, 'Task title is required');
    }

    // create the task object
    const newTask = {
        id: crypto.randomUUID(),
        title: title.trim(),
        completed: false,
        createdAt: Date.now()
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
});

// update if the task is done
app.patch('/tasks/:id', (req, res) => {
    const id = req.params.id;
    const completed = req.body.completed;

    const index = tasks.findIndex(t => t.id === id);

    if (index === -1) {
        return sendError(res, 404, 'Task not found');
    }

    if (completed !== undefined && typeof completed !== 'boolean') {
        return sendError(res, 400, 'Completed must be a boolean');
    }

    if (completed !== undefined) {
        tasks[index].completed = completed;
    }

    res.json(tasks[index]);
});

// completely delete a task
app.delete('/tasks/:id', (req, res) => {
    const id = req.params.id;
    const startLength = tasks.length;

    // save all tasks except the one with this id
    tasks = tasks.filter(t => t.id !== id);

    if (tasks.length === startLength) {
         return sendError(res, 404, 'Task not found');
    }

    res.status(200).json({ message: 'Deleted' });
});

// start the app
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

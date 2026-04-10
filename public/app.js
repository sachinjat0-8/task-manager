const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');
const count = document.getElementById('task-count');
const loading = document.getElementById('loading');
const noTasks = document.getElementById('empty-state');
const errorBox = document.getElementById('error-message');
const errorMsg = document.getElementById('error-text');
const toastBox = document.getElementById('toast');
const toastMsg = document.getElementById('toast-message');

// save tasks from the server here
let currentTasks = [];

// show a little message at the bottom
function showToast(msg) {
    toastMsg.textContent = msg;
    toastBox.classList.add('show');
    setTimeout(() => {
        toastBox.classList.remove('show');
    }, 3000);
}

// show an error message near the input
function showError(msg) {
    errorMsg.textContent = msg;
    errorBox.classList.remove('hidden');
    setTimeout(() => {
        errorBox.classList.add('hidden');
    }, 4000);
}

// update the screen to show tasks
function updateView() {
    const remaining = currentTasks.filter(t => !t.completed).length;
    count.textContent = `${remaining} tasks remaining`;

    if (currentTasks.length === 0) {
        list.innerHTML = '';
        noTasks.classList.remove('hidden');
    } else {
        noTasks.classList.add('hidden');
        renderList();
    }
}

// get all tasks from the backend api
async function getTasks() {
    loading.classList.remove('hidden');
    noTasks.classList.add('hidden');
    list.innerHTML = '';

    try {
        const res = await fetch('/tasks');
        if (!res.ok) throw new Error('Could not get tasks');
        currentTasks = await res.json();
        updateView();
    } catch (err) {
        showError('Error loading tasks');
    } finally {
        loading.classList.add('hidden');
    }
}

// draw the tasks on the page
function renderList() {
    list.innerHTML = '';
    
    currentTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        // stop people from putting bad code in titles
        const safeTitle = document.createElement('div');
        safeTitle.innerText = task.title;

        li.innerHTML = `
            <div class="task-content">
                <button class="checkbox" onclick="toggleTask('${task.id}', ${!task.completed})">
                    <i class="fa-solid fa-check"></i>
                </button>
                <span class="task-text">${safeTitle.innerHTML}</span>
            </div>
            <button class="delete-btn" onclick="removeTask('${task.id}')">
                <i class="fa-regular fa-trash-can"></i>
            </button>
        `;

        list.appendChild(li);
    });
}

// send a new task to the server
async function addTask(title) {
    try {
        const res = await fetch('/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title })
        });

        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || 'Failed to add');
        }

        const newTask = await res.json();
        
        const done = currentTasks.filter(t => t.completed);
        const notDone = currentTasks.filter(t => !t.completed);
        
        currentTasks = [newTask, ...notDone, ...done];
        
        updateView();
        showToast('Added task');
        input.value = '';
    } catch (err) {
        showError(err.message);
    }
}

// check or uncheck a task
async function toggleTask(id, completed) {
    try {
        const index = currentTasks.findIndex(t => t.id === id);
        if (index === -1) return;
        
        currentTasks[index].completed = completed;
        
        currentTasks.sort((a, b) => {
            if (a.completed === b.completed) return b.createdAt - a.createdAt;
            return a.completed ? 1 : -1;
        });
        
        updateView();

        const res = await fetch(`/tasks/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed })
        });

        if (!res.ok) throw new Error('Failed to update');
    } catch (err) {
        showError('Error updating task');
        getTasks(); // reload from server if it failed
    }
}

// delete a task
async function removeTask(id) {
    try {
        currentTasks = currentTasks.filter(t => t.id !== id);
        updateView();

        const res = await fetch(`/tasks/${id}`, {
            method: 'DELETE'
        });

        if (!res.ok) throw new Error('Failed to delete');
        showToast('Deleted task');
    } catch (err) {
        showError('Error deleting task');
        getTasks(); 
    }
}

// listen when someone clicks the add button
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = input.value.trim();
    if (val) {
        addTask(val);
    }
});

// load tasks when the page starts
document.addEventListener('DOMContentLoaded', getTasks);

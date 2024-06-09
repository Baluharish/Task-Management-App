// frontend/scripts.js
document.addEventListener("DOMContentLoaded", () => {
    const taskList = document.getElementById("taskList");
    const taskFormElement = document.getElementById("taskFormElement");
    const taskFormModal = document.getElementById("taskForm");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const closeBtn = document.getElementsByClassName("close")[0];
    const formTitle = document.getElementById("formTitle");
    let editMode = false;
    let editTaskId = null;

    // Fetch tasks from the API and render them
    async function fetchTasks() {
        const response = await fetch('http://localhost:3000/tasks');
        const tasks = await response.json();
        renderTasks(tasks);
    }

    // Render tasks to the UI
    function renderTasks(tasks) {
        taskList.innerHTML = "";
        tasks.forEach(task => {
            const li = document.createElement("li");
            li.innerHTML = `
                <div>
                    <strong>${task.title}</strong>
                    <p>${task.description}</p>
                    <small>Due: ${task.dueDate}</small>
                </div>
                <div class="task-buttons">
                    <button class="edit-btn" data-id="${task.id}">Edit</button>
                    <button class="delete-btn" data-id="${task.id}">Delete</button>
                </div>
            `;
            taskList.appendChild(li);
        });

        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', handleEdit);
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', handleDelete);
        });
    }

    addTaskBtn.addEventListener("click", () => {
        taskFormElement.reset();
        formTitle.textContent = "Add New Task";
        editMode = false;
        taskFormModal.style.display = "block";
    });

    closeBtn.addEventListener("click", () => {
        taskFormModal.style.display = "none";
    });

    window.onclick = function(event) {
        if (event.target == taskFormModal) {
            taskFormModal.style.display = "none";
        }
    }

    taskFormElement.addEventListener("submit", async (event) => {
        event.preventDefault();
        const title = document.getElementById("taskTitle").value;
        const description = document.getElementById("taskDescription").value;
        const dueDate = document.getElementById("taskDueDate").value;

        const taskData = { title, description, dueDate };

        if (editMode) {
            await fetch(`http://localhost:3000/tasks/${editTaskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskData),
            });
        } else {
            await fetch('http://localhost:3000/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskData),
            });
        }

        taskFormModal.style.display = "none";
        fetchTasks();
    });

    async function handleEdit(event) {
        const id = event.target.getAttribute('data-id');
        const response = await fetch(`http://localhost:3000/tasks/${id}`);
        const task = await response.json();

        document.getElementById("taskTitle").value = task.title;
        document.getElementById("taskDescription").value = task.description;
        document.getElementById("taskDueDate").value = task.dueDate;

        formTitle.textContent = "Edit Task";
        editMode = true;
        editTaskId = id;
        taskFormModal.style.display = "block";
    }

    async function handleDelete(event) {
        const id = event.target.getAttribute('data-id');
        await fetch(`http://localhost:3000/tasks/${id}`, {
            method: 'DELETE',
        });
        fetchTasks();
    }

    fetchTasks();
});

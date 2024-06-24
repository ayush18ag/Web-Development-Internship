document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('new-task-input');
    const dueDateInput = document.getElementById('due-date-input');
    const priorityInput = document.getElementById('priority-input');
    const addTaskButton = document.getElementById('add-task-button');
    const taskList = document.getElementById('task-list');
    const filterButtons = document.querySelectorAll('.filter-button');
    const sortButtons = document.querySelectorAll('.sort-button');
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    addTaskButton.addEventListener('click', function() {
        const taskText = taskInput.value.trim();
        const dueDate = dueDateInput.value;
        const priority = priorityInput.value;
        if (taskText !== "") {
            addTask(taskText, dueDate, priority);
            taskInput.value = "";
            dueDateInput.value = "";
            priorityInput.value = "low";
        }
    });

    taskList.addEventListener('click', function(event) {
        const target = event.target;
        const li = target.closest('li');
        const taskId = li.getAttribute('data-id');

        if (target.classList.contains('delete-button')) {
            deleteTask(taskId);
        } else if (target.classList.contains('edit-button')) {
            editTask(taskId, li);
        } else if (target.classList.contains('complete-button')) {
            toggleCompleteTask(taskId);
        }
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterTasks(this.dataset.filter);
        });
    });

    sortButtons.forEach(button => {
        button.addEventListener('click', function() {
            sortTasks(this.dataset.sort);
        });
    });

    function addTask(taskText, dueDate, priority) {
        const task = {
            id: Date.now().toString(),
            text: taskText,
            dueDate: dueDate,
            priority: priority,
            completed: false
        };
        tasks.push(task);
        saveTasks();
        renderTasks();
    }

    function deleteTask(taskId) {
        tasks = tasks.filter(task => task.id !== taskId);
        saveTasks();
        renderTasks();
    }

    function editTask(taskId, li) {
        const task = tasks.find(task => task.id === taskId);
        taskInput.value = task.text;
        dueDateInput.value = task.dueDate;
        priorityInput.value = task.priority;
        deleteTask(taskId);
    }

    function toggleCompleteTask(taskId) {
        const task = tasks.find(task => task.id === taskId);
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }

    function filterTasks(filter) {
        let filteredTasks = tasks;
        if (filter === 'active') {
            filteredTasks = tasks.filter(task => !task.completed);
        } else if (filter === 'completed') {
            filteredTasks = tasks.filter(task => task.completed);
        }
        renderTasks(filteredTasks);
    }

    function sortTasks(criteria) {
        if (criteria === 'priority') {
            tasks.sort((a, b) => {
                const priorities = { 'low': 1, 'medium': 2, 'high': 3 };
                return priorities[b.priority] - priorities[a.priority];
            });
        } else if (criteria === 'due-date') {
            tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        } else if (criteria === 'status') {
            tasks.sort((a, b) => b.completed - a.completed);
        }
        renderTasks();
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks(tasksToRender = tasks) {
        taskList.innerHTML = '';
        tasksToRender.forEach(task => {
            const li = document.createElement('li');
            li.setAttribute('data-id', task.id);
            li.className = task.completed ? 'completed' : '';
            li.innerHTML = `
                <div class="task-details">
                    <span>${task.text}</span>
                    <span>${task.dueDate}</span>
                    <span>${task.priority}</span>
                </div>
                <div class="task-buttons">
                    <button class="edit-button">Edit</button>
                    <button class="complete-button">${task.completed ? 'Uncomplete' : 'Complete'}</button>
                    <button class="delete-button">Delete</button>
                </div>
            `;
            taskList.appendChild(li);
        });
    }

    renderTasks();
});
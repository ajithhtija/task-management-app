document.addEventListener("DOMContentLoaded", () => {
    const taskForm = document.getElementById('taskForm');
    const taskTitle = document.getElementById('taskTitle');
    const taskDescription = document.getElementById('taskDescription');
    const taskDueDate = document.getElementById('taskDueDate');
    const taskPriority = document.getElementById('taskPriority');
    const upcomingTaskList = document.getElementById('upcomingTaskList');
    const overdueTaskList = document.getElementById('overdueTaskList');
    const completedTaskList = document.getElementById('completedTaskList');
    const searchInput = document.getElementById('searchInput');
    const priorityFilter = document.getElementById('priorityFilter');
    const clearFiltersButton = document.getElementById('clearFilters');

    var tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    function renderTasks() {
        upcomingTaskList.innerHTML = '';
        overdueTaskList.innerHTML = '';
        completedTaskList.innerHTML = '';

        const today = new Date().toISOString().split('T')[0];

        tasks.forEach(task => {
            const taskElement = document.createElement('li');
            taskElement.classList.add(task.priority.toLowerCase());
            taskElement.innerHTML = `
                <h4>${task.title}</h4>
                <p>${task.description}</p>
                <p>Due: ${task.dueDate}</p>
                <p>Priority: ${task.priority}</p>
                <button onclick="markAsComplete('${task.id}')">Complete</button>
                <button onclick="deleteTask('${task.id}')">Delete</button>
            `;
            if (task.completed) {
                completedTaskList.appendChild(taskElement);
            } else if (task.dueDate < today) {
                overdueTaskList.appendChild(taskElement);
            } else {
                upcomingTaskList.appendChild(taskElement);
            }
        });
    }

    function addTask(task) {
        tasks.push(task);
        saveTasks();
        renderTasks();
    }

    window.deleteTask = function(taskId) {
        tasks = tasks.filter(task => task.id !== taskId);
        saveTasks();
        renderTasks();
    }

    window.markAsComplete = function (taskId) {
        const task = tasks.find(task => task.id === taskId);
        task.completed = true;
        saveTasks();
        renderTasks();
    }

    function handleSubmit(event) {
        event.preventDefault();

        const task = {
            id: Date.now().toString(),
            title: taskTitle.value,
            description: taskDescription.value,
            dueDate: taskDueDate.value,
            priority: taskPriority.value,
            completed: false,
        };

        addTask(task);

        taskForm.reset();
    }

    function filterTasks() {
        const searchQuery = searchInput.value.toLowerCase();
        const selectedPriority = priorityFilter.value;

        const filteredTasks = tasks.filter(task => {
            const matchesSearch = task.title.toLowerCase().includes(searchQuery) || task.description.toLowerCase().includes(searchQuery);
            const matchesPriority = selectedPriority ? task.priority === selectedPriority : true;
            return matchesSearch && matchesPriority;
        });

        tasks = filteredTasks;
        renderTasks();
    }
    taskForm.addEventListener('submit', handleSubmit);
    searchInput.addEventListener('input', filterTasks);
    priorityFilter.addEventListener('change', filterTasks);
    clearFiltersButton.addEventListener('click', () => {
        searchInput.value = '';
        priorityFilter.value = '';
        renderTasks();
    });

    renderTasks();
});

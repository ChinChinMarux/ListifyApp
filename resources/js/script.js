document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const taskInput = document.getElementById("task-input");
    const categorySelect = document.getElementById("category-select");
    const prioritySelect = document.getElementById("priority-select");
    const dueDateInput = document.getElementById("due-date");
    const addTaskBtn = document.getElementById("add-task-btn");
    const tasksContainer = document.getElementById("tasks-container");
    const categoriesList = document.getElementById("categories-list");
    const filterBtns = document.querySelectorAll(".filter-btn");
    const sortSelect = document.getElementById("sort-select");
    const clearCompletedBtn = document.getElementById("clear-completed-btn");
    const taskModal = document.getElementById("task-modal");
    const modalOverlay = document.getElementById("modal-overlay");
    const cancelEditBtn = document.getElementById("cancel-edit-btn");
    const saveEditBtn = document.getElementById("save-edit-btn");
    const editTaskId = document.getElementById("edit-task-id");
    const editTaskTitle = document.getElementById("edit-task-title");
    const editTaskDescription = document.getElementById(
        "edit-task-description"
    );
    const editTaskCategory = document.getElementById("edit-task-category");
    const editTaskPriority = document.getElementById("edit-task-priority");
    const editTaskDueDate = document.getElementById("edit-task-due-date");
    const colorPickerItems = document.querySelectorAll(".color-picker span");
    const themeToggle = document.getElementById("theme-toggle");
    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toast-message");
    const progressCircle = document.getElementById("progress-circle");
    const progressPercentage = document.getElementById("progress-percentage");
    const completedCount = document.getElementById("completed-count");
    const pendingCount = document.getElementById("pending-count");
    const allCount = document.getElementById("all-count");
    const workCount = document.getElementById("work-count");
    const personalCount = document.getElementById("personal-count");
    const shoppingCount = document.getElementById("shopping-count");
    const healthCount = document.getElementById("health-count");
    const currentDateEl = document.getElementById("current-date");

    // State
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let currentFilter = "all";
    let currentCategory = "all";
    let currentSort = "created";
    let selectedColor = "gray";
    let isDarkMode = localStorage.getItem("darkMode") === "true";

    // Set current date
    currentDateEl.textContent = moment().format("MMM D, YYYY");

    // Set today's date as default due date
    dueDateInput.valueAsDate = new Date();

    // Apply dark mode if previously set
    if (isDarkMode) {
        document.documentElement.classList.add("dark");
        document.body.classList.add("bg-gray-900");
        document.body.classList.remove("bg-gray-50");
    }

    // Generate task template
    const taskTemplate = (task) => {
        const isOverdue =
            task.dueDate &&
            new Date(task.dueDate) < new Date() &&
            !task.completed;
        const priorityColors = {
            low: "bg-blue-100 text-blue-800",
            medium: "bg-yellow-100 text-yellow-800",
            high: "bg-red-100 text-red-800",
        };
        const categoryIcons = {
            work: '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>',
            personal:
                '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>',
            shopping:
                '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>',
            health: '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>',
        };

        return `

            <div class="task-item bg-white rounded-lg shadow-sm p-4 border-l-4 border-${
                task.color
            }-500 ${task.completed ? "opacity-70" : ""}" data-id="${task.id}">
                <div class="flex items-start">
                    <div class="flex-shrink-0 pt-1">
                        <input type="checkbox" class="task-checkbox w-5 h-5 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500" ${
                            task.completed ? "checked" : ""
                        }>
                    </div>
                    <div class="flex-grow ml-3">
                        <div class="flex flex-wrap items-center mb-1">
                            <h3 class="task-title text-lg font-medium text-gray-900 mr-2 ${
                                task.completed
                                    ? "line-through text-gray-500"
                                    : ""
                            }">${task.title}</h3>
                            <div class="flex space-x-1">
                                <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                    priorityColors[task.priority]
                                }">
                                    ${
                                        task.priority.charAt(0).toUpperCase() +
                                        task.priority.slice(1)
                                    }
                                </span>
                                <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                    ${
                                        categoryIcons[task.category]
                                    } <span class="ml-1">${
            task.category.charAt(0).toUpperCase() + task.category.slice(1)
        }</span>
                                </span>
                            </div>
                        </div>
                        ${
                            task.description
                                ? `<p class="task-description text-gray-500 mb-2">${task.description}</p>`
                                : ""
                        }
                        <div class="flex items-center text-sm text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span class="${
                                isOverdue ? "text-red-600 font-medium" : ""
                            }">
                                ${
                                    task.dueDate
                                        ? (isOverdue ? "Overdue: " : "Due: ") +
                                          moment(task.dueDate).format(
                                              "MMM D, YYYY"
                                          )
                                        : "No due date"
                                }
                            </span>
                            <span class="mx-2">•</span>
                            <span>Created ${moment(
                                task.createdAt
                            ).fromNow()}</span>
                        </div>
                    </div>
                    <div class="flex-shrink-0 flex space-x-1">
                        <button class="edit-task-btn p-1 rounded-full text-gray-400 hover:text-yellow-600 hover:bg-gray-100 focus:outline-none" aria-label="Edit task">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                        <button class="delete-task-btn p-1 rounded-full text-gray-400 hover:text-red-600 hover:bg-gray-100 focus:outline-none" aria-label="Delete task">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            `;
    };

    // Add a new task
    const addTask = () => {
        const title = taskInput.value.trim();
        if (!title) return;

        const newTask = {
            id: uuid.v4(),
            title,
            description: "",
            category: categorySelect.value,
            priority: prioritySelect.value,
            dueDate: dueDateInput.value,
            color: "gray",
            completed: false,
            createdAt: new Date().toISOString(),
        };

        tasks.push(newTask);
        saveTasks();
        renderTasks();
        taskInput.value = "";
        showToast("Task added successfully!");

        // Animate the new task
        anime({
            targets: ".task-item:last-child",
            translateY: [20, 0],
            opacity: [0, 1],
            easing: "easeOutExpo",
            duration: 500,
        });
    };

    // Delete a task
    const deleteTask = (id) => {
        const taskElement = document.querySelector(
            `.task-item[data-id="${id}"]`
        );

        // Animate the deletion
        anime({
            targets: taskElement,
            translateX: [0, 20],
            opacity: [1, 0],
            easing: "easeOutExpo",
            duration: 500,
            complete: function () {
                tasks = tasks.filter((task) => task.id !== id);
                saveTasks();
                renderTasks();
                showToast("Task deleted successfully!");
            },
        });
    };

    // Toggle task completion
    const toggleTaskCompletion = (id) => {
        const task = tasks.find((task) => task.id === id);
        if (task) {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
            showToast(
                task.completed ? "Task completed!" : "Task marked as active!"
            );
        }
    };

    // Edit a task
    const editTask = (id) => {
        const task = tasks.find((task) => task.id === id);
        if (task) {
            editTaskId.value = task.id;
            editTaskTitle.value = task.title;
            editTaskDescription.value = task.description || "";
            editTaskCategory.value = task.category;
            editTaskPriority.value = task.priority;
            editTaskDueDate.value = task.dueDate;
            selectedColor = task.color;

            // Highlight the selected color
            colorPickerItems.forEach((item) => {
                if (item.dataset.color === task.color) {
                    item.classList.add(
                        "ring-2",
                        "ring-offset-2",
                        "ring-yellow-500"
                    );
                } else {
                    item.classList.remove(
                        "ring-2",
                        "ring-offset-2",
                        "ring-yellow-500"
                    );
                }
            });

            // Show modal
            taskModal.classList.remove("hidden");
            setTimeout(() => {
                taskModal
                    .querySelector(".bg-white")
                    .classList.remove("scale-95", "opacity-0");
            }, 50);
        }
    };

    // Save edited task
    const saveEditedTask = () => {
        const id = editTaskId.value;
        const task = tasks.find((task) => task.id === id);

        if (task) {
            task.title = editTaskTitle.value.trim();
            task.description = editTaskDescription.value.trim();
            task.category = editTaskCategory.value;
            task.priority = editTaskPriority.value;
            task.dueDate = editTaskDueDate.value;
            task.color = selectedColor;

            saveTasks();
            closeModal();
            renderTasks();
            showToast("Task updated successfully!");
        }
    };

    // Close the edit modal
    const closeModal = () => {
        const modalContent = taskModal.querySelector(".bg-white");
        modalContent.classList.add("scale-95", "opacity-0");
        setTimeout(() => {
            taskModal.classList.add("hidden");
        }, 300);
    };

    // Filter tasks
    const filterTasks = () => {
        let filteredTasks = [...tasks];

        // Apply category filter
        if (currentCategory !== "all") {
            filteredTasks = filteredTasks.filter(
                (task) => task.category === currentCategory
            );
        }

        // Apply completed/active filter
        if (currentFilter === "active") {
            filteredTasks = filteredTasks.filter((task) => !task.completed);
        } else if (currentFilter === "completed") {
            filteredTasks = filteredTasks.filter((task) => task.completed);
        }

        // Apply sorting
        filteredTasks.sort((a, b) => {
            if (currentSort === "created") {
                return new Date(b.createdAt) - new Date(a.createdAt);
            } else if (currentSort === "due") {
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return new Date(a.dueDate) - new Date(b.dueDate);
            } else if (currentSort === "priority") {
                const priorityOrder = { high: 0, medium: 1, low: 2 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            } else if (currentSort === "alphabetical") {
                return a.title.localeCompare(b.title);
            }
            return 0;
        });

        return filteredTasks;
    };

    // Render tasks
    const renderTasks = () => {
        const filteredTasks = filterTasks();

        if (filteredTasks.length === 0) {
            tasksContainer.innerHTML = `
                <div class="empty-state text-center py-12">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3 class="text-lg font-medium text-gray-500">No tasks found</h3>
                    <p class="text-gray-400 mt-2">Try changing your filters or add a new task</p>
                </div>
                `;
        } else {
            tasksContainer.innerHTML = filteredTasks
                .map((task) => taskTemplate(task))
                .join("");
        }

        // Update task counts
        const completedTasksCount = tasks.filter(
            (task) => task.completed
        ).length;
        const pendingTasksCount = tasks.length - completedTasksCount;

        // Update category counts
        allCount.textContent = tasks.length;
        workCount.textContent = tasks.filter(
            (task) => task.category === "work"
        ).length;
        personalCount.textContent = tasks.filter(
            (task) => task.category === "personal"
        ).length;
        shoppingCount.textContent = tasks.filter(
            (task) => task.category === "shopping"
        ).length;
        healthCount.textContent = tasks.filter(
            (task) => task.category === "health"
        ).length;

        // Update progress stats
        completedCount.textContent = completedTasksCount;
        pendingCount.textContent = pendingTasksCount;

        const progressValue =
            tasks.length > 0
                ? Math.round((completedTasksCount / tasks.length) * 100)
                : 0;
        progressPercentage.textContent = `${progressValue}%`;

        // Update progress circle
        const circumference = 2 * Math.PI * 50;
        const offset = circumference - (progressValue / 100) * circumference;
        progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        progressCircle.style.strokeDashoffset = offset;

        // Add event listeners for task interactions
        document.querySelectorAll(".task-checkbox").forEach((checkbox) => {
            checkbox.addEventListener("change", (e) => {
                const taskId = e.target.closest(".task-item").dataset.id;
                toggleTaskCompletion(taskId);
            });
        });

        document.querySelectorAll(".edit-task-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const taskId = e.target.closest(".task-item").dataset.id;
                editTask(taskId);
            });
        });

        document.querySelectorAll(".delete-task-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const taskId = e.target.closest(".task-item").dataset.id;
                deleteTask(taskId);
            });
        });
    };

    // Save tasks to localStorage
    const saveTasks = () => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    };

    // Show toast notification
    const showToast = (message) => {
        toastMessage.textContent = message;
        toast.classList.remove("translate-y-10", "opacity-0");

        setTimeout(() => {
            toast.classList.add("translate-y-10", "opacity-0");
        }, 3000);
    };

    // Ripple effect for buttons
    const addRippleEffect = (e) => {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement("span");
        ripple.classList.add("ripple");
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        button.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    };

    // Toggle dark mode
    const toggleDarkMode = () => {
        isDarkMode = !isDarkMode;
        localStorage.setItem("darkMode", isDarkMode);

        if (isDarkMode) {
            document.documentElement.classList.add("dark");
            document.body.classList.add("bg-gray-900");
            document.body.classList.remove("bg-gray-50");
        } else {
            document.documentElement.classList.remove("dark");
            document.body.classList.remove("bg-gray-900");
            document.body.classList.add("bg-gray-50");
        }
    };

    // Clear completed tasks
    const clearCompletedTasks = () => {
        const completedTasks = tasks.filter((task) => task.completed);
        if (completedTasks.length === 0) return;

        tasks = tasks.filter((task) => !task.completed);
        saveTasks();
        renderTasks();
        showToast("Completed tasks cleared!");
    };

    // Event Listeners
    addTaskBtn.addEventListener("click", addTask);
    taskInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") addTask();
    });

    categoriesList.addEventListener("click", (e) => {
        const categoryItem = e.target.closest(".category-item");
        if (categoryItem) {
            document.querySelectorAll(".category-item").forEach((item) => {
                item.classList.remove("bg-yellow-50", "text-yellow-700");
                item.classList.add("hover:bg-gray-100");
            });

            categoryItem.classList.add("bg-yellow-50", "text-yellow-700");
            categoryItem.classList.remove("hover:bg-gray-100");

            currentCategory = categoryItem.dataset.category;
            renderTasks();
        }
    });

    filterBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            filterBtns.forEach((b) => {
                b.classList.remove("bg-yellow-100", "text-yellow-800");
                b.classList.add("bg-gray-100", "text-gray-800");
            });

            btn.classList.add("bg-yellow-100", "text-yellow-800");
            btn.classList.remove("bg-gray-100", "text-gray-800");

            currentFilter = btn.dataset.filter;
            renderTasks();
        });
    });

    sortSelect.addEventListener("change", () => {
        currentSort = sortSelect.value;
        renderTasks();
    });

    clearCompletedBtn.addEventListener("click", clearCompletedTasks);

    cancelEditBtn.addEventListener("click", closeModal);
    modalOverlay.addEventListener("click", closeModal);

    saveEditBtn.addEventListener("click", saveEditedTask);

    colorPickerItems.forEach((item) => {
        item.addEventListener("click", () => {
            colorPickerItems.forEach((i) => {
                i.classList.remove(
                    "ring-2",
                    "ring-offset-2",
                    "ring-yellow-500"
                );
            });

            item.classList.add("ring-2", "ring-offset-2", "ring-yellow-500");
            selectedColor = item.dataset.color;
        });
    });

    themeToggle.addEventListener("click", toggleDarkMode);

    document.querySelectorAll(".ripple-button").forEach((button) => {
        button.addEventListener("click", addRippleEffect);
    });

    // Initial render
    renderTasks();
});

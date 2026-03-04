let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all";
const title = document.getElementById("title");
const description = document.getElementById("description");
const titleError = document.getElementById("error-title");
const descriptionError = document.getElementById("error-description");
title.addEventListener('input', () => {
    titleError.classList.add('hidden');
});

description.addEventListener('input', () => {
    descriptionError.classList.add('hidden');
});
renderTasks();
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
    const titleInput = title.value.trim();
    const descriptionInput = description.value.trim();
    if (!validation(titleInput, descriptionInput)) return;

    tasks.push({
        id: Date.now(),
        title: titleInput,
        description: descriptionInput,
        completed: false,
        date: new Date().toLocaleString()
    });
    title.value = "";
    description.value = "";
    saveTasks();
    renderTasks();
}



function validation(title, description) {
let valid = true;

if (!title) {
    titleError.classList.remove("hidden");
    valid = false;
}

if (!description) {
    descriptionError.classList.remove("hidden");
    valid = false;
}
    return valid;
}

function toggleTask(id) {
tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
);
saveTasks();
renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if(!task) return;
        title.value = task.title;
        description.value = task.description;

    saveTasks();
    renderTasks();
}

function setFilter(value) {
    filter = value;

    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.classList.remove("bg-blue-600", "text-white");
        btn.classList.add("bg-gray-200");
    });

    const activeBtn = [...document.querySelectorAll(".filter-btn")]
        .find(btn => btn.textContent.toLowerCase() === value);

    activeBtn.classList.add("bg-blue-600", "text-white");
    activeBtn.classList.remove("bg-gray-200");

    renderTasks();
}

function renderTasks() {
const list = document.getElementById("taskList");
list.innerHTML = "";

const filteredTasks = tasks.filter(task => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
});

filteredTasks.forEach(task => {
    list.innerHTML += `
    <div class="bg-white p-4 rounded-xl shadow flex justify-between items-center">
        <div class="flex items-start gap-3">
        <input type="checkbox" ${task.completed ? "checked" : ""}
            onclick="toggleTask(${task.id})" class="mt-1">
        <div>
            <p class="${task.completed ? "line-through text-gray-400" : "font-semibold text-blue-500"}">
            ${task.title}
            </p>
            <p class="${task.completed ? "line-through text-gray-400" : ""}">
            ${task.description}
            </p>
            <p class="text-sm text-gray-500">Added: ${task.date}</p>
        </div>
        </div>

        <div class="flex gap-3">
        <button onclick="editTask(${task.id})" class="bg-blue-600 px-3 py-1 rounded-lg cursor-pointer">
            <i class="ri-edit-2-fill"></i>
        </button>
        <button onclick="deleteTask(${task.id})" class="bg-red-600 px-3 py-1 rounded-lg cursor-pointer">
            <i class="ri-delete-bin-line"></i>
        </button>
        </div>
    </div>
    `;
});

updateCounts();
}
const totalCount = document.getElementById("totalCount");
const activeCount = document.getElementById("activeCount");
const completedCount = document.getElementById("completedCount");
function updateCounts() {
    totalCount.textContent = tasks.length;
    activeCount.textContent = tasks.filter(t => !t.completed).length;
    completedCount.textContent = tasks.filter(t => t.completed).length;
}
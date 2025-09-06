let tasks = [];
let currentFilter = "all";

// Simpan ke localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load dari localStorage
function loadTasks() {
  const stored = localStorage.getItem("tasks");
  if (stored) {
    tasks = JSON.parse(stored);
  }
}

// Tambah task baru
function addTask(text, date) {
  tasks.push({
    text: text,
    date: date,
    completed: false
  });
  saveTasks();
  renderTasks();
}

// Render task ke tampilan
function renderTasks(filter = currentFilter) {
  const list = document.getElementById("todo-list");
  list.innerHTML = "";

  let filtered = tasks;
  if (filter === "completed") {
    filtered = tasks.filter(t => t.completed);
  } else if (filter === "incomplete") {
    filtered = tasks.filter(t => !t.completed);
  }

  if (filtered.length === 0) {
    list.innerHTML = "<p>No tasks available</p>";
    return;
  }

  filtered.forEach((task, index) => {
    const div = document.createElement("div");
    div.className = "task" + (task.completed ? " completed" : "");

    const span = document.createElement("span");
    span.textContent = task.text + (task.date ? ` - ${task.date}` : "");

    const btnContainer = document.createElement("div");

    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = "✔";
    toggleBtn.addEventListener("click", () => toggleTask(index));

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑";
    deleteBtn.addEventListener("click", () => deleteTask(index));

    btnContainer.appendChild(toggleBtn);
    btnContainer.appendChild(deleteBtn);

    div.appendChild(span);
    div.appendChild(btnContainer);

    list.appendChild(div);
  });
}

// Toggle status completed
function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

// Hapus task tertentu
function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

// Hapus semua task
function removeAllTask() {
  tasks = [];
  saveTasks();
  renderTasks();
}

// Event listener utama
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("todo-form");
  const input = document.getElementById("todo-input");
  const dateInput = document.getElementById("date-input");
  const deleteAllBtn = document.querySelector(".button-delete-all");
  const filterBtns = document.querySelectorAll(".filters button");

  // Load data dari localStorage
  loadTasks();

  // Submit form → add task
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    const date = dateInput.value;
    if (text !== "") {
      addTask(text, date);
      input.value = "";
      dateInput.value = "";
    }
  });

  // Delete all
  deleteAllBtn.addEventListener("click", removeAllTask);

  // Filter buttons
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      currentFilter = btn.getAttribute("data-filter");
      renderTasks();
    });
  });

  // Pertama kali load
  renderTasks();
});

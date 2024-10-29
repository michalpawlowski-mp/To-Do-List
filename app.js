const taskInput = document.querySelector("#taskInput");
const addTaskBtn = document.querySelector("#addTaskBtn");
const taskList = document.querySelector("#taskList");

const loadTasks = () => {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((taskText) => addTask(taskText));
};

const saveTask = () => {
  const task = Array.from(taskList.querySelectorAll(".taskText")).map((task) => task.textContent);
  localStorage.setItem("tasks", JSON.stringify(task));
};

const addTask = (taskText = taskInput.value.trim()) => {
  if (taskText === "") return;

  const taskItem = document.createElement("li");

  const taskTextSpan = document.createElement("span");
  taskTextSpan.textContent = taskText;
  taskTextSpan.classList.add("taskText");

  const buttonGroup = document.createElement("div");
  buttonGroup.classList.add("buttonGroup");

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edytuj";
  editBtn.addEventListener("click", () => enableEditing(taskTextSpan, editBtn));

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Usuń";
  deleteBtn.addEventListener("click", () => {
    taskItem.remove();
    saveTasks();
  });

  buttonGroup.append(editBtn, deleteBtn);

  taskItem.append(taskTextSpan, buttonGroup);
  taskList.appendChild(taskItem);
  taskInput.value = "";

  saveTasks();
};

const enableEditing = (taskTextSpan, editBtn) => {
  const originalText = taskTextSpan.textContent;
  const inputField = document.createElement("input");
  inputField.type = "text";
  inputField.value = originalText;

  const saveBtn = document.createElement("button");
  saveBtn.textContent = "Zapisz";

  saveBtn.addEventListener("click", () => {
    taskTextSpan.textContent = inputField.value.trim() || originalText;
    taskTextSpan.style.display = "inline";
    editBtn.style.display = "inline";
    inputField.remove();
    saveBtn.remove();
    saveTask();
  });

  taskTextSpan.style.display = "none";
  editBtn.style.display = "none";
  taskTextSpan.parentNode.insertBefore(inputField, taskTextSpan);
  taskTextSpan.parentNode.insertBefore(saveBtn, inputField.nextSibling);
};

addTaskBtn.addEventListener("click", () => addTask());
loadTasks();

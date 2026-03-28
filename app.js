const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

const createElement = (tag, className, textContent = "") => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (textContent) element.textContent = textContent;
  return element;
};

const createTaskItem = (taskText, completed = false) => {
  const taskItem = createElement("li", "task");
  const checkbox = createElement("input", "task-checkbox");
  checkbox.type = "checkbox";
  checkbox.checked = completed;
  if (completed) taskItem.classList.add("completed");
  checkbox.addEventListener("change", () => {
    taskItem.classList.toggle("completed");
    saveTasks();
  });

  const taskContent = createElement("span", "task-content", taskText);

  const editBtn = createElement("button", "task-edit-btn", "Edytuj");
  editBtn.addEventListener("click", () => handleEdit(taskItem, taskContent));

  const deleteBtn = createElement("button", "task-delete-btn", "Usuń");
  deleteBtn.addEventListener("click", () => {
    taskList.removeChild(taskItem);
    saveTasks();
  });

  taskItem.appendChild(checkbox);
  taskItem.appendChild(taskContent);
  taskItem.appendChild(editBtn);
  taskItem.appendChild(deleteBtn);

  return taskItem;
};

taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTaskBtn.click();
});

const handleEdit = (taskItem, taskContent) => {
  const input = createElement("input", "task-edit-input");
  input.type = "text";
  input.value = taskContent.textContent;
  taskItem.replaceChild(input, taskContent);
  input.focus();
  input.select();

  const deleteBtn = taskItem.querySelector(".task-delete-btn");
  const editBtn = taskItem.querySelector(".task-edit-btn");
  editBtn.style.display = "none";

  const saveBtn = createElement("button", "task-save-btn", "Zapisz");

  const save = () => {
    taskContent.textContent = input.value.trim() || taskContent.textContent;
    taskItem.replaceChild(taskContent, input);
    taskItem.removeChild(saveBtn);
    editBtn.style.display = "";
    saveTasks();
  };

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") save();
    if (e.key === "Escape") {
      taskItem.replaceChild(taskContent, input);
      taskItem.removeChild(saveBtn);
      editBtn.style.display = "";
    }
  });

  saveBtn.addEventListener("click", save);

  taskItem.appendChild(saveBtn);
  taskItem.appendChild(deleteBtn);
};

const saveTasks = () => {
  const tasks = Array.from(taskList.children).map((taskItem) => {
    return {
      text: taskItem.querySelector(".task-content").textContent,
      completed: taskItem.querySelector(".task-checkbox").checked,
    };
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const loadTasks = () => {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => {
    const taskItem = createTaskItem(task.text, task.completed);
    taskList.appendChild(taskItem);
  });
};

addTaskBtn.addEventListener("click", () => {
  const taskText = taskInput.value.trim();
  if (taskText === "") return;
  const taskItem = createTaskItem(taskText);
  taskList.appendChild(taskItem);
  taskInput.value = "";
  saveTasks();
});

loadTasks();

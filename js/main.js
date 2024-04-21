// Находим элементы на странице

const formElement = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

const storageTasks = localStorage.getItem('tasks');
let tasks = storageTasks ? JSON.parse(storageTasks) : [];
console.log(tasks);

tasks.forEach(renderTask);
checkEmptyList();

formElement.addEventListener('submit', addTask);

tasksList.addEventListener('click', deleteTask);

tasksList.addEventListener('click', doneTask);

// Функции

function addTask(event) {
  event.preventDefault();

  const taskText = taskInput.value;


  // Описываем задачу в виде объекта

  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false
  };

  // Добавляем задачу в массив с задачами

  tasks.push(newTask);

  // Добавляем задачу в хранилище браузера LocalStorage
  saveToLocalStorage();

  const cssClass = newTask.done ? 'task-title task-title--done' : 'task-title';
  
  renderTask(newTask);

  // Очищаем поле ввода
  taskInput.value = '';
  taskInput.focus();

  checkEmptyList();
}

function deleteTask(event) {
  const { target } = event;
  if (target.dataset.action !== 'delete') {
    return;
  }
  const parentNode = target.closest('.list-group-item');
  const id = Number(parentNode.id);
  tasks = tasks.filter((task) => task.id !== id);

  // Добавляем задачу в хранилище браузера LocalStorage
  saveToLocalStorage();

  parentNode.remove();

  checkEmptyList();
}

function doneTask(event) {
  const { target } = event;
  if (target.dataset.action !== 'done') {
    return;
  }
  const parentNode = target.closest('.list-group-item');
  const id = Number(parentNode.id);
  tasks.forEach((task) => {
    if (task.id === id) {
      task.done = !task.done;

        // Добавляем задачу в хранилище браузера LocalStorage
        saveToLocalStorage();

    }
  })
  const taskTitle = parentNode.querySelector('.task-title');
  taskTitle.classList.toggle('task-title--done');
}

function checkEmptyList() {
  if (tasks.length === 0) {
    const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
      <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
      <div class="empty-list__title">Список дел пуст</div>
    </li>`;
    tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
  }

  if (tasks.length > 0) {
    const emptyListEl = document.querySelector('#emptyList');
    emptyListEl ? emptyListEl.remove() : null;
  }
}

function saveToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(task) {
  // Формируем CSS класс
  const cssClass = task.done ? 'task-title task-title--done' : 'task-title';

  // Формируем HTML задачи
  const taskHTML = `
    <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
      <span class="${cssClass}">${task.text}</span>
      <div class="task-item__buttons">
        <button type="button" data-action="done" class="btn-action">
          <img src="./img/tick.svg" alt="Done" width="18" height="18">
        </button>
        <button type="button" data-action="delete" class="btn-action">
          <img src="./img/cross.svg" alt="Done" width="18" height="18">
        </button>
      </div>
    </li>`;

  tasksList.insertAdjacentHTML('beforeend', taskHTML);
}

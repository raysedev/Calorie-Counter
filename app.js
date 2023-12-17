import { getAllTasks, createTask, updateTaskById, deleteTaskById } from './src/data.js';

window.addEventListener('load', solve);

const listElement = document.getElementById('list');
const editMealBtn = document.getElementById('edit-meal')
const addMealBtn = document.getElementById('add-meal')
let currentId = '';

async function solve() {
    await loadList();
    document.getElementById('load-meals').addEventListener('click', loadEvent);
    document.getElementById('add-meal').addEventListener('click', addEvent);
    listElement.addEventListener('click', listEvent);
}

async function loadEvent(e) {
    e.preventDefault();
    

    await loadList();
}

async function loadList() {
    const tasks = await getAllTasks();
    for (let i = 0; i <= listElement.childNodes.length; i++) {
        while (listElement.firstChild) {
            listElement.removeChild(listElement.lastChild);
        }
    }

    for (const [id, task] of Object.entries(tasks)) {
        const listEl = loadTasks(task.food, task.time, task.calories, id);
        listElement.appendChild(listEl);
    }
}

function loadTasks(food, time, calories, id) {
    const divElement = document.createElement('div');
    divElement.classList.add('meal');
    divElement.setAttribute('id', id);

    const foodElement = document.createElement('h2');
    foodElement.innerHTML = food;

    const timeElement = document.createElement('h3');
    timeElement.innerHTML = time;

    const caloriesElement = document.createElement('h3');
    caloriesElement.innerHTML = calories;

    const divButtonsElement = document.createElement('div');
    divButtonsElement.classList.add('meal-buttons');

    const changeBtn = document.createElement('button');
    changeBtn.innerHTML = 'Change';
    changeBtn.classList.add('change-meal');
    changeBtn.setAttribute('id', id);

    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = 'Delete';
    deleteBtn.classList.add('delete-meal');
    deleteBtn.setAttribute('id', id);

    divElement.appendChild(foodElement);
    divElement.appendChild(timeElement);
    divElement.appendChild(caloriesElement);
    divButtonsElement.appendChild(changeBtn);
    divButtonsElement.appendChild(deleteBtn);
    divElement.appendChild(divButtonsElement);

    return divElement;
}

async function addEvent(e) {
    e.preventDefault();
    // document.getElementById('num-days').setAttribute('name', 'days');
    // document.getElementById('from-date').setAttribute('name', 'date');
    const formData = new FormData(e.target.parentNode.parentNode.querySelector("form"));
    
    const data = Object.fromEntries(formData);

    if (
      !data.food ||
      !data.time ||
      !data.calories
    ) {
      return;
    }

    try {
      await createTask(data);
      clearForm();
      loadEvent(e);
    } catch (err) {
      
    }
}

function clearForm() {
    document.getElementById('food').value = '';
    document.getElementById('time').value = '';
    document.getElementById('calories').value = '';
}

async function listEvent(e) {
    e.preventDefault();

    //Change Btn
    if (e.target.innerHTML == 'Change') {
        editMealBtn.removeAttribute('disabled');
        addMealBtn.setAttribute('disabled', true);
        const parentDiv = e.target.parentNode.parentNode;
        const mealParent = editMealBtn.parentNode.parentElement;

        mealParent.querySelector('form > input#food').value = parentDiv.querySelector('h2').innerHTML;
        mealParent.querySelector('form > input#time').value = parentDiv.querySelectorAll('h3')[0].innerHTML;
        mealParent.querySelector('form > input#calories').value = parentDiv.querySelectorAll('h3')[1].innerHTML;

        listElement.removeChild(e.target.parentNode.parentNode);
        currentId = e.target.id;
        editMealBtn.addEventListener('click', editEvent);
        await loadList();
    } else if (e.target.innerHTML == 'Delete') {
        try {
            await deleteTaskById(e.target.id);
            loadEvent(e);
            listElement.removeChild(e.target.parentNode.parentNode);
        } catch (err) {
            
        }
    }
    
}

async function editEvent(e) {
    e.preventDefault();
    console.log(e.target);
    const formData = new FormData(e.target.parentNode.parentNode.querySelector("form"));

    const data = Object.fromEntries(formData);

    if (
        !data.food ||
        !data.time ||
        !data.calories
    ) {
        return;
    }

    try {
        await updateTaskById(currentId, data);
        clearForm();
        loadEvent(e);
        e.target.setAttribute('disabled', true);
        addMealBtn.removeAttribute('disabled');
    } catch (err) {
        
    }
}
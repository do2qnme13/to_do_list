const listContainer = document.querySelector('[data-lists]');
const newListForm = document.querySelector('[data-new-list-form]');
const newListInput = document.querySelector('[data-new-list-input]');
const deleteListButton = document.querySelector('[data-delete-list-button]');
const listDisplayContainer = document.querySelector('[data-list-display-container');
const listTitleElement = document.querySelector('[data-list-title]');
const listCountELement = document.querySelector('[data-list-count]');
const taskContainer = document.querySelector('[data-tasks]');
const taskTemplate = document.querySelector('#task-template');
const newTaskForm = document.querySelector('[data-new-task-form]');
const newTaskInput = document.querySelector('[data-new-task-input]');
const clearCompleteTaskButton = document.querySelector('[data-clear-complete-task-button]');



const LOCAL_STORAGE_LIST_KEY = 'task.list';
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId'
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);


listContainer.addEventListener('click',e => {
  if(e.target.tagName.toLowerCase() === 'li') {
    selectedListId = e.target.dataset.listId;
    saveAndRender()
  }
})
taskContainer.addEventListener('click', e => {
  if(e.target.tagName.toLowerCase() === 'input') {
    const selectedList = lists.find(list => list.id === selectedListId);
    const selectedTask = selectedList.tasks.find(task => task.id === e.target.id);
    selectedTask.complete = e.target.checked;
    save()
    renderTaskCount(selectedList)
  }
})

clearCompleteTaskButton.addEventListener('click', e => {
  const selectedList = lists.find(list => list.id === selectedListId);
  selectedList.tasks = selectedList.tasks.filter(task => task.complete !== true);
  saveAndRender()
})

deleteListButton.addEventListener ('click', e => {
  lists = lists.filter(list => list.id !== selectedListId) // filter list that does not have the same id as selectedId
  selectedListId = null;
  saveAndRender();
})

newListForm.addEventListener('submit', e => {
  e.preventDefault(); 
  const listName = newListInput.value;
  if(listName == null || listName === "") return;
  const list = createList(listName);
  newListInput.value = null
  lists.push(list)
  saveAndRender();
})

newTaskForm.addEventListener('submit', e => {
  e.preventDefault(); 
  const taskName = newTaskInput.value;
  if(taskName == null || taskName === "") return;
  const task = createTask(taskName);
  newTaskInput.value = null
  const selectedList = lists.find(list => list.id === selectedListId);
  console.log(selectedList)
  selectedList.tasks.push(task);
  saveAndRender();
})


function saveAndRender () {
  save();
  render();
}

function save () {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
}

function createTask(name) {
 return {
  id: Date.now().toString(),
  name:name,
  complete:false
 }
}

function createList(name) {
  return {
    id: Date.now().toString(),  //use Date.now() to generate unique Id
    name:name, 
    tasks:[] //will use objects of array
  }
}

function render () {
  clearElement(listContainer)
  renderLists();
  const selectedList = lists.find(list => list.id === selectedListId);
  //console.log('Selected list is ',selectedList)
  if(selectedListId === null) {
    listDisplayContainer.style.display = 'none';

  }else {
    listDisplayContainer.style.display = '';
    listTitleElement.textContent = selectedList.name;
    renderTaskCount(selectedList);
    clearElement(taskContainer);
    renderTask(selectedList);
  }
}

function renderTaskCount (selectedList) {
  const incompleteTasksCount = selectedList.tasks.filter(task => !task.complete).length
  const taskString = incompleteTasksCount === 1 ? "task":"tasks";
  listCountELement.innerText = `${incompleteTasksCount} ${taskString} remaining`

}

function renderLists () {
  lists.forEach(list => {
    const listElement = document.createElement('li');
    listElement.dataset.listId = list.id;
    listElement.classList.add('list-name');
    listElement.textContent = list.name;
    if(list.id === selectedListId) {
      listElement.classList.add('active-list')
    }
    listContainer.appendChild(listElement)
  })
}

function renderTask(selectedList) {
  selectedList.tasks.forEach(task => {
    const taskElement = document.importNode(taskTemplate.content, true) // import Node
    const checkBox = taskElement.querySelector('input');
    checkBox.id = task.id;
    checkBox.checked = task.complete;
    const label = taskElement.querySelector('label');
    label.htmlFor = task.id; // what is this
    label.append(task.name);
    taskContainer.appendChild(taskElement)
  })
}


function clearElement (element) {
  while(element.firstChild) {
    element.removeChild(element.firstChild)
  }
}
render()

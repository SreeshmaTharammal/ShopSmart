//Global scope vars to keep the state between functions

//Sets an empty shoppingList that can be overriden on load by the localstorage
let shoppingLists = {};


const mainContainer = document.getElementById('main-container');
const listNamesSection = document.getElementById('list-names-section');
const itemsListSection = document.getElementById('items-list-section');
const newListSection = document.getElementById('add-new-list-section');
// Get the reference to 'ul' element in the home screen 
const listNamesContainer = document.getElementById('list-names-container');
// Get the reference to 'ul' element in the items list screen 
const itemsListContainer = document.getElementById('items-list-container');

showList();

/**
 * Add shopping list name, called when '+' on home(list names) screen clicked.
 * Hide the home screen and display the add list name screen.
 */
function addListName() {
    // Hide list names screen 
    listNamesSection.style.display = 'none';

    // Display add new list screen
    let newList = document.getElementById('add-new-list-section');
    newList.style.display = 'block';

    // Change background to white  
    mainContainer.style.backgroundColor = 'white';  

    // Set focus
    let textField = document.getElementById('list-name-text-field');
    textField.focus();
}

/**
 * Save shopping list name, called when click save button on add new list screen.
 * 
 * @returns 
 */
function saveListName() {
    // Get the list name entered
    const listName = document.getElementById('list-name-text-field').value;
    let newList = document.getElementById('add-new-list-section');

    if (listName === '') {        
        let messageContainer = document.querySelector('.message-container');
        const messageDiv = document.createElement("div");
        messageContainer.style.display = 'block';  
        messageDiv.innerText = 'Enter a list name';
        messageContainer.appendChild(messageDiv);

         // Remove the alert after 2 seconds
        setTimeout(() => {
            messageContainer.removeChild(messageDiv);
            messageContainer.style.display = 'none';
      }, 2000);  
        
        return;
    }


    // Update items list screen heading text
    document.getElementById('items-list-heading-text').textContent = listName;

    // Display items list screen    
    itemsListSection.style.display = 'flex';

    // Hide add new list screen     
    newList.style.display = 'none';

    // Change background back to antiquewhite    
    mainContainer.style.backgroundColor = 'antiquewhite';

    // Create list
    let newListName = document.createElement('li');
    newListName.innerHTML = listName;
    // Add list name to list Names Container in home screen
    listNamesContainer.appendChild(newListName);

    // Clear list name screen text field
    newList.children[1].children[1].value = '';

    saveData();
}

/**
 * GO back to home screen when click on back arrow on items list screen
 */
function backToHome() {
    // Display home(list names) screen    
    listNamesSection.style.display = 'flex';

    // Hide items list screen    
    itemsListSection.style.display = 'none';

    const items = [];
    const itemsListContainer = document.getElementById('items-list-container');
    const itemsList = itemsListContainer.getElementsByTagName('li');

    // iterate items list and add to the array
     for (const item of itemsList) {
         items.push(item.textContent);
     }     

    const currentListName = document.getElementById('items-list-heading-text').textContent;

    // Add the items array to curresponding list name 
    shoppingLists[currentListName] = items;

    itemsListContainer.innerHTML = '';
}

/**
 * Shows add item text field, called when click on add item secton om items list screen
 */
function enterItem() {
    // Hide add item section
    const addItemTabContent = document.getElementById('add-item-tab-content');
    addItemTabContent.style.display = 'none';

    // Display text field  and add button below items list screen heading
    const addItemNameDiv = document.querySelector('.add-item-name-container');
    addItemNameDiv.style.display = 'flex';

    // Set focus
    let textField = document.querySelector('.item-text-field');
    textField.focus();
}

/**
 * Call 'addItemFn' function, called when click on add button on items list screen
 */
function addItemOnClick() {
    const itemName = document.querySelector('.item-text-field').value;
    document.querySelector('.item-text-field').value = '';
    document.querySelector('.item-text-field').focus();

    addItemFn(itemName);
}

/**
 * Add items to the items list screen.
 * @param {*} itemName 
 */
function addItemFn(itemName) {
    // creating checkbox element
    let checkbox = document.createElement('input');

    // Assigning the attributes to created checkbox
    checkbox.type = "checkbox";
    checkbox.name = "name";
    checkbox.value = "value";
    // checkbox.id = "checkbox";
    checkbox.setAttribute('class', 'checkbox');
    checkbox.setAttribute('id', `checkbox-${itemName}`);

    // creating label for checkbox
    let label = document.createElement('label');

    // assigning attributes for the created label tag 
    label.htmlFor = `checkbox-${itemName}`;

    // appending the created text to the created label tag     
    label.appendChild(document.createTextNode(itemName));

    let newItem = document.createElement('li');
    newItem.setAttribute('class', 'items-list')

    let deleteItemBtn = document.createElement('button');
    deleteItemBtn.setAttribute('id', 'delete-item-btn'); 
    deleteItemBtn.textContent = 'X';
       
    let itemsNameContainer = document.getElementById('items-list-container');
    // Add list name to list Names Container in home screen
    itemsNameContainer.appendChild(newItem);
    newItem.appendChild(checkbox);
    newItem.appendChild(label);
    newItem.appendChild(deleteItemBtn);
}

/**
 * Go to items list screen when click on list name on home screen.
 * Update curresponding items from shoppingLists dictionary.
 * @param {*} event 
 * @returns 
 */
function showListItems(event) {
    // Hide home(list names) screen    
    listNamesSection.style.display = 'none';

    // Display items list screen    
    itemsListSection.style.display = 'flex';

    const currentListName = event.target.textContent;

    // Update items list screen heading text
    document.getElementById('items-list-heading-text').textContent = currentListName;
    if (!shoppingLists.hasOwnProperty(currentListName)) {
        return;
    }

    for (const itemName of shoppingLists[currentListName]) {
        addItemFn(itemName);
    }
}

function saveData() {
    localStorage.setItem('data', listNamesContainer.innerHTML);
}

function showList() {
    listNamesContainer.innerHTML = localStorage.getItem('data');
}

let addListButton = document.getElementById('list-add-btn');
addListButton.addEventListener('click', addListName);

let save = document.getElementById('new-list-save');
save.addEventListener('click', saveListName);

let backHome = document.querySelector('.back-arrow');
backHome.addEventListener('click', backToHome);

let addItemcontent = document.getElementById('add-item-tab-content');
addItemcontent.addEventListener('click', enterItem);

let addItem = document.querySelector('.enter-item-btn');
addItem.addEventListener('click', addItemOnClick);

let shoppingList = document.getElementById('list-names-container');
shoppingList.addEventListener('click', showListItems);

let newListClose = document.querySelector('.new-list-xmark');
newListClose.addEventListener('click', function() {
    newListSection.style.display = 'none';
    listNamesSection.style.display = 'flex';
    mainContainer.style.backgroundColor = 'antiquewhite';   
})








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
const addItemTabContent = document.getElementById('add-item-tab-content');

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

function showMessage(message) {
    let messageContainer = document.querySelector('.message-container');
    const messageDiv = document.createElement("div");
    messageContainer.style.display = 'block';
    messageDiv.innerText = message;
    messageContainer.appendChild(messageDiv);

    // Remove the alert after 2 seconds
    setTimeout(() => {
        messageContainer.removeChild(messageDiv);
        messageContainer.style.display = 'none';
    }, 2000);
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
        showMessage('Enter a list name');
        return;
    }

    if (shoppingLists.hasOwnProperty(listName)) {
        showMessage('List name already exist!');
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
   // newListName.innerHTML = listName;
    newListName.setAttribute('id', 'list-name');

    console.log("listName: " + listName);
    // Create a text node
    let listNameNode = document.createTextNode(listName);
    
    newListName.addEventListener("click", function (event) {
        if(event.target === newListName) {
        // Prevents the event from bubbling up the DOM tree
            event.stopPropagation();
            console.log("Text clicked: " + this.textContent);
            showListItems(event);
        }
    });

    // Append the text node to the list item
    newListName.appendChild(listNameNode);

    // Add list name to list Names Container in home screen
    listNamesContainer.appendChild(newListName);

    let deleteListBtn = document.createElement('button');
    deleteListBtn.setAttribute('id', 'delete-list-btn');
    deleteListBtn.textContent = 'X';

    // Add a click event to the button
    deleteListBtn.addEventListener("click", function (event) {
        // Prevents the event from bubbling up the DOM tree
        event.stopPropagation();         
        listNamesContainer.removeChild(newListName); 
        shoppingLists = Array.from(shoppingLists);
        shoppingLists.pop(listNameNode);
    });
    
    newListName.appendChild(deleteListBtn);

    // Clear new list name screen text field
    newList.children[1].children[1].value = '';
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
    const currentListName = document.getElementById('items-list-heading-text').textContent;
    const itemsListContainer = document.getElementById('items-list-container');
    if (!itemsListContainer) {
        shoppingLists[currentListName] = '';
        return;
    }
    const itemsList = itemsListContainer.getElementsByTagName('li');

    if (!itemsList) {
        shoppingLists[currentListName] = '';
        return;
    }

    // iterate items list and add to the array
    for (let item of itemsList) {
        item = item.textContent.slice(0, -1);
        items.push(item);
    }

    // Add the items array to curresponding list name 
    shoppingLists[currentListName] = items;

    saveToLocal();

    // Clear items list screen
    itemsListContainer.innerHTML = '';
}

/**
 * Shows add item text field, called when click on add item secton om items list screen
 */
function enterItem() {
    // Hide add item section    
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
    addItemTabContent.style.display = 'flex';
    const addItemNameContainer = document.querySelector('.add-item-name-container');
    addItemNameContainer.style.display = 'none';
    const itemName = document.querySelector('.item-text-field').value;
    if (!itemName) {
        return;
    }
    document.querySelector('.item-text-field').value = '';
    document.querySelector('.item-text-field').focus();

    addItemFn(itemName);
}

/**
 * Add items to the items list screen.
 * @param {*} itemName 
 */
function addItemFn(itemName) {
    const itemsNameContainer = document.getElementById('items-list-container');
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
    deleteItemBtn.addEventListener('click', function () {
        itemsNameContainer.removeChild(newItem);
    });


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

    let currentListName = event.target.textContent; 
    currentListName = currentListName.slice(0, -1);

    // Update items list screen heading text
    document.getElementById('items-list-heading-text').textContent = currentListName;
    if (!shoppingLists.hasOwnProperty(currentListName)) {
        return;
    }

    for (const itemName of shoppingLists[currentListName]) {
        addItemFn(itemName);
    }
}

function saveToLocal() {
    localStorage.setItem('data', JSON.stringify(shoppingLists));
    return 1;
};

window.onload = function() {
    shoppingLists = JSON.parse(localStorage.getItem('data'));   
    if (Object.keys(shoppingLists).length === 0) {        
        return;
    }

    for (const list in shoppingLists) {
        const listNameElement = document.createElement('li');
        listNameElement.textContent = list;        
        listNamesContainer.appendChild(listNameElement);

        listNameElement.addEventListener("click", function (event) {
            if(event.target === listNameElement) {
            // Prevents the event from bubbling up the DOM tree
                event.stopPropagation();
                console.log("Text clicked: " + this.textContent);
                showListItems(event);
            }
        });

        let deleteListBtn = document.createElement('button');
        deleteListBtn.setAttribute('id', 'delete-list-btn');
        deleteListBtn.textContent = 'X';
        listNameElement.appendChild(deleteListBtn);

         // Add a click event to the button
        deleteListBtn.addEventListener("click", function (event) {
        // Prevents the event from bubbling up the DOM tree
        event.stopPropagation();         
        listNamesContainer.removeChild(listNameElement); 
        shoppingLists = Array.from(shoppingLists);
        shoppingLists.pop(listNameElement.textContent);
    });

    }
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

let newListClose = document.querySelector('.new-list-xmark');
newListClose.addEventListener('click', function () {
    newListSection.style.display = 'none';
    listNamesSection.style.display = 'flex';
    mainContainer.style.backgroundColor = 'antiquewhite';
    let newList = document.getElementById('add-new-list-section');
    // Clear list name screen text field
    newList.children[1].children[1].value = '';
});

const itemsListContainerDiv = document.querySelector('.items-list-container-div');
const deleteAllItems = document.querySelector('.delete-all-btn');
deleteAllItems.addEventListener('onmouseover', function () {
    deleteAllItems.title = 'Delete all items';
});
deleteAllItems.addEventListener('click', function () {
    itemsListContainer.innerHTML = '';
});










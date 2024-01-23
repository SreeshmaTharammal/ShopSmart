//Global scope vars to keep the state between functions

//Sets an empty shoppingList that can be overriden on load by the localstorage
let shoppingLists = {};

const mainContainer = document.getElementById('main-container');
const listNamesSection = document.getElementById('list-names-section');
const itemsListSection = document.getElementById('items-list-section');
const newListSection = document.getElementById('add-new-list-section');
const listNamesContainer = document.getElementById('list-names-container');
const itemsListContainer = document.getElementById('items-list-container');
const addItemTabContent = document.getElementById('add-item-tab-content');

/**
 * Add shopping list name, called when '+' on home(list names) screen clicked.
 * Hide the home screen and display the add list name screen.
 */
function addListName(list, listName) {
    // Clear list name screen text field
    newListSection.children[1].children[1].value = '';
    // Hide list names screen 
    listNamesSection.style.display = 'none';

    // Display add new list screen
    let newList = document.getElementById('add-new-list-section');
    newList.style.display = 'block';

    const editBtn = document.getElementById('new-list-save');

    if(list === 'Edit List'){
        const listNameElement = document.querySelector('list-name');
        let texfield = document.getElementById('list-name-text-field');
        texfield.value = listName.slice(0, -1);   
    }          
    
    var newListHeader = document.querySelector('.add-new-list-heading-text');
    newListHeader.textContent = list;

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
    const newListHeader = document.querySelector('.add-new-list-heading-text');
    // Get the list name entered
    const newListText = document.getElementById('list-name-text-field').value;    

    if (newListText === '') {
        showMessage('Enter a list name');
        return;
    }

    if ((shoppingLists != null) && shoppingLists.hasOwnProperty(newListText)) {
        if(newListHeader.textContent === 'Edit List')
        {
            newListSection.style.display = 'none';
            itemsListSection.style.display = 'none';
            listNamesSection.style.display = 'flex';
            return;
        }else{
            showMessage('List name already exist!');
            return;
        }        
    }

    if(shoppingLists == null) {
        shoppingLists = Object.create(null);
    }    
    
    if(newListHeader.textContent === 'Edit List') {

        let oldListName = localStorage.getItem('currentListName');

        const shoppingListsBackup = JSON.parse(JSON.stringify(shoppingLists));

        shoppingLists = {};

        for(let listName in shoppingListsBackup) {            
            if(listName === oldListName) {
                shoppingLists[newListText] = shoppingListsBackup[oldListName];
            }else {
                shoppingLists[listName] = shoppingListsBackup[listName];
            }
        }
        
        updateShoppingListDisplay();        
       
        newListSection.style.display = 'none';
          
        listNamesSection.style.display = 'flex';
        return;
    }
    // Update items list screen heading text
    document.getElementById('items-list-heading-text').textContent = newListText;

    // Display items list screen    
    itemsListSection.style.display = 'flex';

    // Hide add new list screen     
    newListSection.style.display = 'none';

    // Change background back to antiquewhite    
    mainContainer.style.backgroundColor = 'antiquewhite';

    updateShoppingListDisplay();
}

function updateShoppingListDisplay() {
    listNamesContainer.innerHTML = '';

    for (const list in shoppingLists) {
        const listNameElement = document.createElement('li');
        listNameElement.setAttribute('class', 'list-name');
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
        
        let editListBtn = document.createElement('i');
        editListBtn.classList.add('fa', 'fa-edit');
        editListBtn.setAttribute('id', 'edit-list-btn');
        listNameElement.appendChild(editListBtn);

        editListBtn.addEventListener('click', function() {
            console.log("Edit btn");
            editListName(listNameElement.textContent);
        });

        let deleteListBtn = document.createElement('button');
        deleteListBtn.setAttribute('id', 'delete-list-btn');
        deleteListBtn.textContent = 'X';
        listNameElement.appendChild(deleteListBtn);

         // Add a click event to the button
        deleteListBtn.addEventListener("click", function (event) {       
            listNamesContainer.removeChild(listNameElement); 
            shoppingLists = Array.from(shoppingLists);
            shoppingLists.pop(listNameElement.textContent);
            saveToLocal();
        });
    }

    saveToLocal();
}
/**
 * GO back to home screen when click on back arrow on items list screen
 */
function backToHome() {
    // Display home(list names) screen    
    listNamesSection.style.display = 'flex';

    // Hide items list screen    
    itemsListSection.style.display = 'none';

    let items = [];
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

    updateShoppingListDisplay();

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
 * 
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
    localStorage.setItem('SHOPPINGLIST', JSON.stringify(shoppingLists));
};

window.onload = function() {
   
    const listFromLocal  = JSON.parse(localStorage.getItem('SHOPPINGLIST'));  
     
    if ((listFromLocal == null) || (Object.keys(listFromLocal).length === 0)) {        
        return;
    }

    shoppingLists = listFromLocal;
    updateShoppingListDisplay();   
}

/**
 * 
 * @param {*} listName 
 */
function editListName(listName) {
    // Hide home(list names) screen    
    listNamesSection.style.display = 'none';
    
    newListSection.style.display = 'block';

    const editListHeader = document.querySelector('.add-new-list-heading-text');
    editListHeader.textContent = 'Edit List';        
    
    let texfield = document.getElementById('list-name-text-field');
    texfield.value = listName.slice(0, -1);  

    localStorage.setItem('currentListName', listName.slice(0, -1));

}

let addListButton = document.getElementById('list-add-btn');
addListButton.addEventListener('click', function() {
    addListName('New List');
  });

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
    // Clear list name screen text field
    newListSection.children[1].children[1].value = '';
});
const deleteAllItems = document.querySelector('.delete-all-btn');
deleteAllItems.addEventListener('click', function () {
    itemsListContainer.innerHTML = '';
});










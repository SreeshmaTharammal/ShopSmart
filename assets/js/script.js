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
function addListName() {
    // Clear list name screen text field
    newListSection.children[1].children[1].value = '';
    
    listNamesSection.style.display = 'none';
    
    const newList = document.getElementById('add-new-list-section');
    newList.style.display = 'block';
    
    const newListHeader = document.querySelector('.add-new-list-heading-text');
    newListHeader.textContent = 'New List';

    // Set focus
    let textField = document.getElementById('list-name-text-field');
    textField.focus();
}

/**
 * Go to items list screen when click on list name on home screen.
 * Update curresponding items from shoppingLists dictionary.
 * 
 * @param {*} event 
 * @returns 
 */
function showListItems(event) {      
    listNamesSection.style.display = 'none';      
    itemsListSection.style.display = 'flex';

    let currentListName = event.target.textContent; 
    currentListName = currentListName.slice(0, -1);

    // Update items list screen heading text
    document.getElementById('items-list-heading-text').textContent = currentListName;
    if (!shoppingLists.hasOwnProperty(currentListName)) {
        return;
    }

    for (const itemNameStatusStr of shoppingLists[currentListName]) {
        // Value for each list contains item name and status which is saved as JSON string. Parse the
        // string to get item name and status
        const itemNameStatus = JSON.parse(itemNameStatusStr);
        addItemToList(itemNameStatus[0], itemNameStatus[1]);
    }
}

/**
 * 
 * @param {*} listName 
 */
function editListName(listName) {        
    listNamesSection.style.display = 'none';    
    newListSection.style.display = 'block';

    const editListHeader = document.querySelector('.add-new-list-heading-text');
    editListHeader.textContent = 'Edit List';        
    
    let texfield = document.getElementById('list-name-text-field');
    texfield.value = listName.slice(0, -1);  

    // Save the current list name to retrive in the edit view.
    localStorage.setItem('currentListName', listName.slice(0, -1));
}

/**
 * Search input handler
 */
function filterLists() {
    const searchTerm = document.getElementById('search-btn').value;
    if(searchTerm == "") {
        displayShoppingList(shoppingLists, false);
        return;
    }

    const searchResult = searchShoppingList(searchTerm);

    displayShoppingList(searchResult, false);
}

/**
 * Search for the user input value inside list and return reduced shopping list object 
 * @param {*} searchTerm - Value to be searched
 * @returns Returns the reduced object from shopping list which includes the search term
 */
function searchShoppingList(searchTerm) {
    // Inspired from Microsoft copiot response
    const filteredKeys = Object.keys(shoppingLists).filter(key => {
      return key.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return filterShoppingList(filteredKeys);
}

/**
 * Returns reduced shopping list object for the array of keys provided 
 * @param {*} keys - Array of keys
 * @returns Returns the reduced object from shopping list for the all keys
 */
function filterShoppingList(keys) {
    return keys.reduce((result, key) => {
      if (shoppingLists.hasOwnProperty(key)) {
        result[key] = shoppingLists[key];
      }
      return result;
    }, {});
  }

/**
 * Save shopping list name, called when click save button on add new list screen or from edit existing list.
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
        
        displayAllShoppingList();        
       
        newListSection.style.display = 'none';
          
        listNamesSection.style.display = 'flex';
        return;
    }
    // Update items list screen heading text
    document.getElementById('items-list-heading-text').textContent = newListText;
      
    itemsListSection.style.display = 'flex';
    newListSection.style.display = 'none';

    displayAllShoppingList();
}

/**
 * Updates shopping list with values saved in the global shopping list object and saves value to local storage
 */
function displayAllShoppingList() {
    displayShoppingList(shoppingLists, true)
}

/**
 * Updates shopping list disaply using the object provides. Optionally value can be to local storage.
 * @param {*} shoppingListsToDisplay - Dictionary object which is should be used to update the shopping list disaply
 * @param {*} isRequiredToSave - If true, tgis value will be saved to local storage as well.
 */
function displayShoppingList(shoppingListsToDisplay, isRequiredToSave) {
    listNamesContainer.innerHTML = '';

    for (let list in shoppingListsToDisplay) {
        
        const deleteTooltip = createTooltip();
        const editTooltip = createTooltip();
        const listNameElement = document.createElement('li');       
        listNameElement.classList.add('list-name', 'cursor-point');
        listNameElement.textContent = list;        
        listNamesContainer.appendChild(listNameElement);

        listNameElement.addEventListener("click", function (event) {
            if(event.target === listNameElement) {
                console.log("Text clicked: " + this.textContent);
                showListItems(event);
            }
        });
        
        let editListBtn = document.createElement('i');
        editListBtn.classList.add('fa', 'fa-edit');
        editListBtn.setAttribute('id', 'edit-list-btn');
        listNameElement.appendChild(editListBtn);

        editListBtn.addEventListener('click', function() {
            editListName(listNameElement.textContent);
        });

        editListBtn.addEventListener('mouseover', function(event) {
            showTooltip(editTooltip, event, 'Edit list name');
        });

        editListBtn.addEventListener('mouseout', function() {
            editTooltip.style.visibility = 'hidden';    
            editTooltip.innerHTML = '';       
        });

        let deleteListBtn = document.createElement('button');
        deleteListBtn.setAttribute('id', 'delete-list-btn');
        deleteListBtn.setAttribute('class', 'cursor-point');        
        deleteListBtn.textContent = 'X';
        listNameElement.appendChild(deleteListBtn);

         // Add a click event to the button
        deleteListBtn.addEventListener("click", function (event) {  
            createDialogBox(`Do you want to delete ${list}?`,
                function() {
                    delete shoppingLists[list];
                    displayAllShoppingList();
                });  
        });

        deleteListBtn.addEventListener('mouseover', function(event) {
            showTooltip(deleteTooltip, event, 'Delete list');
        });

        deleteListBtn.addEventListener('mouseout', function() {
            deleteTooltip.style.visibility = 'hidden';  
            deleteTooltip.innerHTML = '';         
        });

        editListBtn.appendChild(editTooltip);
        deleteListBtn.appendChild(deleteTooltip);
    }

    if(isRequiredToSave) {
        saveToLocal(shoppingListsToDisplay);
    }
}

/**
 * Save to local storage
 */
function saveToLocal(shoppingListsToSave) {
    localStorage.setItem('SHOPPINGLIST', JSON.stringify(shoppingListsToSave));
};

/**
 * Shows message to user
 * @param {*} message - Message to be disaplyed
 */
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
 * Event handler for all item button
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

    addItemToList(itemName);
}

/**
 * Add items to the items list screen.
 * @param {*} itemName - Name of the item
 * @param {*} itemStatus - Status of the item is it checked or not
 */
function addItemToList(itemName, itemStatus = false) {
    const itemsNameContainer = document.getElementById('items-list-container');
    // creating checkbox element
    let checkbox = document.createElement('input');

    const deleteTooltip = createTooltip();

    // Assigning the attributes to create checkbox
    checkbox.type = "checkbox";
    checkbox.name = "name";
    checkbox.value = "value";
    checkbox.checked = itemStatus;
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

    deleteItemBtn.addEventListener('mouseover', function(event) {
        showTooltip(deleteTooltip, event, 'Delete item');
    });

    deleteItemBtn.addEventListener('mouseout', function() {
        deleteTooltip.visibility = 'hidden';
        deleteTooltip.innerHTML = '';
    });

    deleteItemBtn.appendChild(deleteTooltip);

    // Add list name to list Names Container in home screen
    itemsNameContainer.appendChild(newItem);
    newItem.appendChild(checkbox);
    newItem.appendChild(label);
    newItem.appendChild(deleteItemBtn);
}

/**
 * Event handler for back button in the item screen
 */
function backHomeScreen() {      
    listNamesSection.style.display = 'flex';     
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
        const checkbox = document.getElementById(`checkbox-${item}`);
        let status = checkbox.checked;
        console.log(`status: ${status}`);
        
        // Add item name and check status staus to dictionary
        items.push(JSON.stringify([item, status]));
    }

    // Add the items array to curresponding list name 
    shoppingLists[currentListName] = items;

    displayAllShoppingList();

    // Clear items list screen
    itemsListContainer.innerHTML = '';
}

/**
 * Event handler for add item button
 */
function enterItem() {      
    addItemTabContent.style.display = 'none';

    // Display text field  and add button below items list screen heading
    const addItemNameDiv = document.querySelector('.add-item-name-container');
    addItemNameDiv.style.display = 'flex';

    // Set focus
    let textField = document.querySelector('.item-text-field');
    textField.focus();
}

/**
 * Window On load handler which loads the current shopping list from local storage and updates list view. 
 */
window.onload = function() {
   
    const listFromLocal  = JSON.parse(localStorage.getItem('SHOPPINGLIST'));  
     
    if ((listFromLocal == null) || (Object.keys(listFromLocal).length === 0)) {        
        return;
    }

    shoppingLists = listFromLocal;
    displayAllShoppingList();   
}

/**
 * Disables all parents clicks
 */
function disableParentClicks() {
    document.body.style.pointerEvents = "none";
}
  
/**
 * Enables all parent clicks
 */
function enableParentClicks() {
    document.body.style.pointerEvents = "auto";
}

/**
 * Custom OK and Cancel button. This is implemented using suggestion from Microsoft Copiot response  
 * @param {*} message - Message to be disaplyed
 * @param {*} okCallback - Callback for Ok button handler.
 */
function createDialogBox(message, okCallback) {
    const dialogBox = document.createElement("div");
    dialogBox.style.position = "fixed";
    dialogBox.style.top = "30%";
    dialogBox.style.left = "50%";
    dialogBox.style.transform = "translate(-50%, -50%)";
    dialogBox.style.backgroundColor = "white";
    dialogBox.style.padding = "20px";
    dialogBox.style.borderRadius = "10px";
    dialogBox.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
    dialogBox.style.zIndex = "9999";
    dialogBox.style.backgroundColor = "#a4c2a8";
  
    const messageElement = document.createElement("p");
    messageElement.textContent = message;
    dialogBox.appendChild(messageElement);
  
    const okButton = document.createElement("button");
    okButton.textContent = "OK";
    okButton.style.backgroundColor = "red";
    okButton.style.marginRight = "10px";
    okButton.addEventListener("click", () => {
      okCallback();
      document.body.removeChild(dialogBox);
      enableParentClicks();
    });
    dialogBox.appendChild(okButton);
  
    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.style.backgroundColor = "green";
    cancelButton.addEventListener("click", () => {
      document.body.removeChild(dialogBox);
      enableParentClicks();
    });
    dialogBox.appendChild(cancelButton);
  
    document.body.appendChild(dialogBox);
    disableParentClicks();

    // Above disable parents clicks function will disable OK and cancel buttoin clicks as well.
    // Hence enable clicks for OK and Cancel button only here. 
    okButton.style.pointerEvents = 'auto';
    cancelButton.style.pointerEvents = 'auto';
}

/**
 * Create a tooltip container 
 */
function createTooltip() {
    const tooltipContainer = document.createElement('div');

    tooltipContainer.style.visibility = 'hidden';
    tooltipContainer.style.position = 'relative';
    tooltipContainer.style.width = '20px';
    tooltipContainer.style.fontSize = '8px'
    tooltipContainer.style.textTransform = 'none';

    return tooltipContainer;
}

/**
 * shows tooltip relative to event position 
 */
function showTooltip(tooltip, e, message) {
    let posX = e.clientX;
    let posY = e.clientY;

    tooltip.innerHTML = message;
    tooltip.style.top = (posY);
    tooltip.style.left = (posX);
    tooltip.style.visibility = 'visible';
    tooltip.style.marginLeft = '-20px';
}

/**
 * Add event handler for all list button
 */
const addListButton = document.getElementById('list-add-btn');
addListButton.addEventListener('click', function() {
    addListName();
  });

/**
 * Add event handler for list save button
 */  
const saveButton = document.getElementById('new-list-save');
saveButton.addEventListener('click', saveListName);

/**
 * Add event handler for back arrow in the item screen
 */
const backHome = document.querySelector('.back-arrow');
backHome.addEventListener('click', backHomeScreen);

/**
 * Add event handler for add item button
 */
const addItemcontent = document.getElementById('add-item-tab-content');
addItemcontent.addEventListener('click', enterItem);

/**
 * Add event handler for Add button in the new item screen
 */
const addItem = document.querySelector('.enter-item-btn');
addItem.addEventListener('click', addItemOnClick);

/**
 * Add event handler for close button in the new list screen
 */
const newListClose = document.querySelector('.new-list-xmark');
newListClose.addEventListener('click', function () {
    newListSection.style.display = 'none';
    listNamesSection.style.display = 'flex';     
    // Clear list name screen text field
    newListSection.children[1].children[1].value = '';
});

/**
 * Add event handler for delete all button
 */
const deleteAllItemsButton = document.querySelector('.delete-all-btn');
deleteAllItemsButton.addEventListener('click', function () {       
    createDialogBox(
        "Do you want to delete all items from list?",
        function () {
          itemsListContainer.innerHTML = '';
        }
      );
});

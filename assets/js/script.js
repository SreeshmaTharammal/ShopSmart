//Global scope vars to keep the state between functions

//Sets an empty shoppingList that can be overriden on load by the localstorage
let shoppingList = {
    Name: "",
    Items: []
};


const mainContainer = document.getElementById('main-container');
const listNamesSection = document.getElementById('list-names-section');
const itemsListSection = document.getElementById('items-list-section');
 // Get the reference to 'ul' element in the home screen 
const listNamesContainer = document.getElementById('list-names-container'); 

/**
 * Add shopping list name, called when '+' on home(list names) screen clicked.
 * Hide the home screen and display the add list name screen.
 */
function addListName(){
    confirm('addListName function');
    console.log('addListName function');
    
    // Hide list names screen 
    listNamesSection.style.display='none';

    // Display add new list screen
    let newList = document.getElementById('add-new-list-section');
    newList.style.display='block'; 
    
    // Change background to white  
    mainContainer.style.backgroundColor='white';

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
       

    if(listName === '') {
        alert('Enter a list name');
        return;
    }
    // Update Shopping list dictionary
    shoppingList.Name = listName;
    console.log(`Shopping List: ${shoppingList.Name} - ${shoppingList.Items}`)

    // Update items list screen heading text
    document.getElementById('items-list-heading-text').textContent = listName;

    // Display items list screen    
    itemsListSection.style.display='flex';

     // Hide add new list screen
     let newList = document.getElementById('add-new-list-section');
     newList.style.display='none'; 

      // Change background back to antiquewhite    
     mainContainer.style.backgroundColor='antiquewhite';           
  
     // Create list
     let newListName = document.createElement('li');
     newListName.innerHTML = listName;     
     // Add list name to list Names Container in home screen
     listNamesContainer.appendChild(newListName);     

    // Clear list name screen text field
     newList.children[1].children[1].value = '';        

     saveData();
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

showList();




// Storage Controller
const StorageCtrl = (function(){
	// public methods
	return {
		storeItem: function(item){
			let items;
			// check if any items in ls
			if(localStorage.getItem('items') === null){
				items = [];
				// push new item
				items.push(item);
				// set ls
				localStorage.setItem('items', JSON.stringify(items));
			} else {
				// get what is already in ls
				items = JSON.parse(localStorage.getItem('items'));
				// push new item
				items.push(item);
				// reset ls
				localStorage.setItem('items', JSON.stringify(items));
			}
		},
		getItemsFromStorage: function(){
			let items;
			if(localStorage.getItem('items') === null){
				items = [];
			} else {
				items = JSON.parse(localStorage.getItem('items'));
			}
			return items;
		},
		deleteItem: function(item) {
			// coming soon, not working
			let items;
			if(localStorage.getItem('items') === null){
				items = [];
			} else {
				items.forEach(function(itemsElement, itemsIndex){
					if(itemsElement){
						items.splice(itemsIndex, 1);
					}
				});
				this.storeItem(items);
			}
			
		},
		deleteAll: function() {
			localStorage.clear();
		}
	}
})();
// create later

// Item Controller
const ItemCtrl = (function(){
	// Item Constructor
	const Item = function(id, name, calories){
		this.id = id
		this.name = name
		this.calories = calories
	}

	// Data Structure
	const data = {
		items: [
			//{id: 0, name: 'Steak Dinner', calories: 1200},
			//{id: 1, name: 'Cookie', calories: 400},
			//{id: 2, name: 'Eggs', calories: 300}
		],
		total: 0
	}

	return {
		getItems: function(){
			return data.items
		},
		addItem: function(name, calories){
			let ID;
			// Create ID
			if(data.items.lenght > 0){
				ID = data.items[data.items.lenght - 1].id + 1
			} else {
				ID = 0
			}
			// calories to number
			calories = parseInt(calories);
			// create new item
			newItem = new Item(ID, name, calories);
			// add to items array
			data.items.push(newItem);
			// return new item
			return newItem
		},
		getTotalCalories: function(){
			let total = 0;
			// loop through items and add calories
			data.items.forEach(function(item){
				total = total + item.calories;
				console.log(total)
			});
			// set total calories in data structure
			data.total = total;
			console.log(data.total)
			// return total
			return data.total;
		},
		logData: function(){
			return data
		}
	}
})();


// UI Controller
const UICtrl = (function(){
	// UI selectors
	const UISelectors = {
		itemList: '#item-list',
		itemNameInput: '#item-name',
		itemCaloriesInput: '#item-calories',
		addBtn: '.add-btn',
		totalCalories: '.total-calories',
		deleteBtn: '.del-btn',
		deleteAllBtn: '.deleteAll-btn',
		editBtns: '.edit-btns'
		
	}

	return {
		populateItemList: function(items){
			// create html content
			let html = '';

			// parse data and create list items html
			items.forEach(function(item){
				html += `<li class="collection-item" id="item-${item.id}">
				<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
				<a href="#" class="secondary-content">
					<i class="edit-item fa fa-pencil"></i>
				</a>
				</li>`;
			});

			// insert list items
			document.querySelector(UISelectors.itemList).innerHTML = html;
		},
		getSelectors: function(){
			return UISelectors;
		},
		getItemInput: function(){
			return {
				name:document.querySelector(UISelectors.itemNameInput).value,
				calories:document.querySelector(UISelectors.itemCaloriesInput).value
			}
		},
		addListItem: function(item){
			// create li element
			const li = document.createElement('li');
			// add class
			li.className = 'collection-item';
			// add ID
			li.ad = `item-${item.id}`;
			// add HTML
			li.innerHTML = `<strong>${item.name}: </strong><em>${item.calories} Calories</em><a href="#" class="secondary-content">
			<i class="edit-item fa fa-pencil"></i></a>`;
			// insert item
			document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
		},
		editListItem: function(event){
			//let thisEle = event.target;
			// delete click event
			deleteButton = document.querySelector(UISelectors.deleteBtn)
			deleteButton.innerHTML = `<button class="delete-btn btn red darken-3"><i class="fa fa-minus"></i> Delete Meal</button>`;
			deleteButton.addEventListener('click', deleteItem(event));

			console.log("abscss")
		},
		clearInput: function(){
			document.querySelector(UISelectors.itemNameInput).value = '';
			document.querySelector(UISelectors.itemCaloriesInput).value = '';
		},
		showTotalCalories: function(totalCalories){
			document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
				},
		clearUI: function(){
			document.querySelector(UISelectors.itemList).innerHTML = '';
			document.querySelector(UISelectors.totalCalories).textContent = '0';
		},
		hideShowBtns: function(){
			if (event.target.parentElement.tagName == 'A') {
				document.querySelector(UISelectors.addBtn).classList.add('hidden');
				document.querySelector(UISelectors.editBtns).classList.remove('hidden');
				item = event.target.parentElement.parentElement.id
				items = StorageCtrl.getItemsFromStorage()
				selectedItem = items[item.slice(5)]
				document.querySelector(UISelectors.itemNameInput).value = selectedItem.name;
				document.querySelector(UISelectors.itemCaloriesInput).value = selectedItem.calories;
			}
		}
	}
})();

// App Controller
const App = (function(ItemCtrl, StorageCtrl, UICtrl){
		// Load event listeners
		const loadEventListeners = function(){
			// get UI selectors
			const UISelectors = UICtrl.getSelectors();
			// add item event
			document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
			//deletes all
			document.querySelector(UISelectors.deleteAllBtn).addEventListener('click', deleteAll);
				// edit click event
			// document.querySelector(UISelectors.itemList).addEventListener('click', editItem);
			// edit delete event
			// deleteButton = document.querySelector(UISelectors.deleteBtn).addEventListener('click', deleteItem());
			// add document reload event
			document.addEventListener('DOMContentLoaded', getItemsFromStorage);
			// clear all event
		// edit event
		document.querySelector(UISelectors.itemList).addEventListener('click', UICtrl.hideShowBtns)
			
		}
		// item add submit function
		const itemAddSubmit = function(event){
			// get form input from UI Controller
			const input = UICtrl.getItemInput()
			// check for name and calorie input
			if(input.name !== '' && input.calories !==''){
				const newItem = ItemCtrl.addItem(input.name, input.calories)
				// add item to UI items list
				UICtrl.addListItem(newItem)
				// get total calories
				const totalCalories = ItemCtrl.getTotalCalories();
				// add total calories to UI
				UICtrl.showTotalCalories(totalCalories);
				// store in localStorage
				StorageCtrl.storeItem(newItem);
				// clear fields
				UICtrl.clearInput();
			}
			event.preventDefault()
		}
		// get items from storage
		const getItemsFromStorage = function(){
			// get items from storage
			const items = StorageCtrl.getItemsFromStorage()
			// set storage items to ItemCtrl data items
			items.forEach(function(item){
				ItemCtrl.addItem(item['name'], item['calories'])
			})
			// get total calories
			const totalCalories = ItemCtrl.getTotalCalories();
			// add total calories to UI
			UICtrl.showTotalCalories(totalCalories);
			// populate items list
			UICtrl.populateItemList(items)
		}
		// deleting all items
		const deleteAll = function(event){
			// delete all
			StorageCtrl.deleteAll();
			UICtrl.clearUI()
			event.preventDefault()
		}
		// delete one item
		const deleteItem = function(event){
						// first need the current item id or something
			event.preventDefault()
		}
		// edit event
		const editItem = function(event){
			// add buttons (update, delete, back)
			UICtrl.editListItem(event);
			event.preventDefault()
		}
	
	return {
		init: function(){
			console.log('Initializing App')
			// fetch items from data structure
			const items = ItemCtrl.getItems()
			// populate items list
			UICtrl.populateItemList(items)
			// load event listener
			loadEventListeners();
		}
	}
})(ItemCtrl, StorageCtrl, UICtrl);

// Initialize App
App.init()
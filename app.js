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
		deleteItem: function() {
			// gets item list
			let items  = JSON.parse(localStorage.getItem('items'));
			// delete old item from list
			items.splice((Math.abs(items.indexOf(ItemCtrl.currentItem))), 1);
			console.log(ItemCtrl.currentItem.originalTarget.parentElement.parentElement.id + " päris id");
			console.log((Math.abs(items.indexOf(ItemCtrl.currentItem))) + " See on ID?")
			// saves item list
			console.log(localStorage.setItem("items", JSON.stringify(items)) + "   end delete");
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
			// {id: 0, name: 'Steak Dinner', calories: 1200},
			// {id: 1, name: 'Cookie', calories: 400},
			// {id: 2, name: 'Eggs', calories: 300}
		],
		total: 0,
		currentItem: null
	}

	return {
		getItems: function(){
			return data.items
		},
		addItem: function(name, calories){
			let ID;
			// Create ID
			if(data.items.lenght > 0){
				ID = data.items.lenght;
				data.items.lenght = data.items.lenght +1;
			} else {
				data.items.lenght = 1;
				ID = 0;
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
		updateBtn: '.update-btn',
		delBtn: '.del-btn',
		delAllBtn: '.delAll-btn',
		editBtns: '.edit-btns',
		backBtn: '.back-btn'
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
			li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories </em> <a href="#" class="secondary-content>
			<i class="edit-item fa fa-pencil"></i>
			</a>`;
			// insert item
			document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
		},
		clearInput: function(){
			document.querySelector(UISelectors.itemNameInput).value = '';
			document.querySelector(UISelectors.itemCaloriesInput).value = '';
		},

		clearUI: function(){
			document.querySelector(UISelectors.itemList).innerHTML = '';
			document.querySelector(UISelectors.totalCalories).textContent = '0';
		},
		showTotalCalories: function(totalCalories){
			document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
		},
		hideShowBtns: function(event){
			if (event.target.parentElement.tagName == 'A') {
				document.querySelector(UISelectors.addBtn).classList.add('hidden');
				document.querySelector(UISelectors.editBtns).classList.remove('hidden');
				item = event.target.parentElement.parentElement.id
				items = StorageCtrl.getItemsFromStorage()
				selectedItem = items[item.slice(5)]
				document.querySelector(UISelectors.itemNameInput).value = selectedItem.name;
				document.querySelector(UISelectors.itemCaloriesInput).value = selectedItem.calories;
				ItemCtrl.currentItem = event;
			}
		},
		backUI: function(){
			document.querySelector(UISelectors.editBtns).classList.add('hidden');
			document.querySelector(UISelectors.addBtn).classList.remove('hidden');
			UICtrl.clearInput();
		},
		helloUI: function(){
			console.log("Hello UI?")
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
			// add document reload event
			document.addEventListener('DOMContentLoaded', getItemsFromStorage)
			// delete all event
			document.querySelector(UISelectors.delAllBtn).addEventListener('click', deleteAll);
			// delete item event
			document.querySelector(UISelectors.delBtn).addEventListener('click', deleteItem);
			// Update mean event
			document.querySelector(UISelectors.updateBtn).addEventListener('click', renameItem);
		// edit event
		document.querySelector(UISelectors.itemList).addEventListener('click', UICtrl.hideShowBtns)
		// back event
		document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.backUI)
		

		}
		// item add submit function
		const itemAddSubmit = function(){
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
		const deleteItem = function(){
						 console.log(ItemCtrl.currentItem.originalTarget.parentElement.parentElement.id);
						StorageCtrl.deleteItem();
						UICtrl.backUI();
						location.reload(); 
		}
		// edit event
		const editItem = function(event){
			// add buttons (update, delete, back)
			UICtrl.editListItem(event);
			event.preventDefault()
		}
		const renameItem = function(){
			// get form input from UI Controller
			const input = UICtrl.getItemInput()
			// check for name and calorie input
			if(input.name !== '' && input.calories !==''){
				itemAddSubmit();
				UICtrl.backUI();
				deleteItem();
			}
			event.preventDefault()
		}
		const hello = function(){
			console.log("Hello?")
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
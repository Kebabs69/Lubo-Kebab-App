// This script contains logic specific to the index.html (main order page).

// Removed Stripe initialization from here, it's now handled in index.html to ensure load order.
// The 'stripe' variable is now globally accessible because it was defined in index.html.

// Get elements from the order form and cart display
const payBtn = document.getElementById('payWithCardBtn');
const paymentToggle = document.getElementById('paymentToggle');
const placeOrderBtn = document.querySelector('#orderForm button[type="submit"]');
const orderForm = document.getElementById('orderForm');
const cartItemsList = document.getElementById('cartItems');
const totalPriceSpan = document.getElementById('totalPrice');
const logoutBtn = document.getElementById('logoutBtn');
// Get the Clear Cart button
const clearCartBtn = document.getElementById('clearCartBtn');


// Elements for the image preview modal
const imageModalOverlay = document.getElementById('imageModalOverlay');
const modalImage = document.getElementById('modalImage');
const modalImageTitle = document.getElementById('modalImageTitle');
const imageModalCloseBtn = document.querySelector('.image-modal-close');

// Elements for the generic message modal
const messageModalOverlay = document.getElementById('messageModalOverlay');
const messageModalContent = document.querySelector('#messageModalOverlay .message-modal-content'); // Get content for class toggling
const messageModalTitle = document.getElementById('modalMessageTitle'); // Corrected ID to match HTML
const messageModalText = document.getElementById('modalMessageText'); // Corrected ID to match HTML
const messageModalButton = document.getElementById('modalMessageButton'); // Corrected ID to match HTML
const messageModalCloseBtn = document.querySelector('#messageModalOverlay .message-modal-close'); // Corrected selector

// Elements for the Kebab Customization Modal
const kebabCustomizationModal = document.getElementById('kebabCustomizationModal');
const kebabModalCloseBtn = document.querySelector('#kebabCustomizationModal .kebab-modal-close');
const modalKebabName = document.getElementById('modalKebabName');
const modalKebabSizes = document.getElementById('modalKebabSizes');
const modalKebabToppings = document.getElementById('modalKebabToppings'); // Pre-filled in HTML, but can be dynamic later
const modalKebabSauces = document.getElementById('modalKebabSauces');     // Pre-filled in HTML, but can be dynamic later
const modalKebabNotes = document.getElementById('modalKebabNotes');
const modalQuantityMinus = document.getElementById('modalQuantityMinus');
const modalQuantityInput = document.getElementById('modalQuantityInput');
const modalQuantityPlus = document.getElementById('modalQuantityPlus');
const modalAddToCartButton = document.getElementById('modalAddToCartButton');
const modalCurrentPriceSpan = document.getElementById('modalCurrentPrice');

// Elements for Category Navigation and Dynamic Display
const categoryLinks = document.querySelectorAll('.category-link');
const menuDisplayArea = document.getElementById('menuDisplayArea'); // This is where items will be rendered


// Global array to store the cart state
let cart = [];

// --- NEW: Centralized Menu Data Structures ---
const menuData = {
    kebabs: {
        title: '🥙 Kebabs',
        items: [
            {
                id: 'chicken-kebab',
                name: 'Chicken Kebab',
                imageUrl: '/assets/chicken-preview.png',
                sizes: [
                    { label: 'Small', price: 5.00 },
                    { label: 'Medium', price: 6.00 },
                    { label: 'Large', price: 7.00 }
                ]
            },
            {
                id: 'lamb-kebab',
                name: 'Lamb Kebab',
                imageUrl: '/assets/lamb-kebab-preview.png',
                sizes: [
                    { label: 'Small', price: 6.00 },
                    { label: 'Medium', price: 7.00 },
                    { label: 'Large', price: 8.00 }
                ]
            },
            {
                id: 'veggie-wrap',
                name: 'Veggie Wrap',
                imageUrl: '/assets/veggie-wrap-preview.png',
                sizes: [
                    { label: 'Small', price: 4.00 },
                    { label: 'Medium', price: 5.00 },
                    { label: 'Large', price: 6.00 }
                ]
            },
            {
                id: 'mixed-grill',
                name: 'Mixed Grill',
                imageUrl: '/assets/mixed-grill-preview.jpg',
                sizes: [
                    { label: 'Small', price: 8.00 },
                    { label: 'Medium', price: 9.50 },
                    { label: 'Large', price: 11.00 }
                ]
            }
        ]
    },
    drinks: {
        title: '🥤 Drinks',
        items: [
            { id: 'coca-cola', name: 'Coca Cola', price: 1.50 },
            { id: 'pepsi', name: 'Pepsi', price: 1.50 },
            { id: 'orange-juice', name: 'Orange Juice', price: 2.00 },
            { id: 'apple-juice', name: 'Apple Juice', price: 2.00 },
            { id: 'water', name: 'Water', price: 1.00 }
        ]
    },
    sides: {
        title: '🥗 Sides',
        items: [
            { id: 'fries', name: 'Fries', price: 2.00 },
            { id: 'cheesy-chips', name: 'Cheesy Chips', price: 2.50 },
            { id: 'onion-rings', name: 'Onion Rings', price: 2.00 },
            { id: 'side-salad', name: 'Side Salad', price: 2.00 },
            { id: 'garlic-bread', name: 'Garlic Bread', price: 1.50 }
        ]
    }
    // Add other categories like pizzas, burgers, etc. here if needed
};
// --- END: Centralized Menu Data Structures ---


// Variables to store current modal selection state
let currentKebabId = null;
let currentKebabBasePrice = 0; // Price based on selected size only
let currentKebabQuantity = 1;

// Login Check for index.html - Ensures user is logged in
if (localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'https://Lubo-Kebab-App.onrender.com/login.html'; // Absolute path for redirection
}


// Function to display the custom message modal
function showMessageModal(title, message, type = 'info') {
    console.log(`showMessageModal called: ${title}, ${message}, type: ${type}`); // Debugging
    // Corrected variable names to match HTML element IDs
    const messageTitleElement = document.getElementById('modalMessageTitle');
    const messageTextElement = document.getElementById('modalMessageText');
    const messageButtonElement = document.getElementById('modalMessageButton');

    if (!messageModalOverlay || !messageTitleElement || !messageTextElement || !messageButtonElement || !messageModalContent) {
        console.error("Message modal elements not found, falling back to alert:", title, message);
        alert(title + "\n" + message);
        return;
    }

    // Reset classes to ensure only one type is applied
    messageModalContent.classList.remove('success', 'error', 'warning');

    // Set title and text using the corrected elements
    messageTitleElement.innerHTML = `<i class="fas fa-info-circle icon"></i> ${title}`; // Default info icon
    messageTextElement.textContent = message;

    // Apply specific classes and icons based on type
    if (type === 'success') {
        messageModalContent.classList.add('success');
        messageTitleElement.innerHTML = `<i class="fas fa-check-circle icon"></i> ${title}`;
    } else if (type === 'error') {
        messageModalContent.classList.add('error');
        messageTitleElement.innerHTML = `<i class="fas fa-times-circle icon"></i> ${title}`;
    } else if (type === 'warning') {
        messageModalContent.classList.add('warning');
        messageTitleElement.innerHTML = `<i class="fas fa-exclamation-triangle icon"></i> ${title}`;
    }

    messageModalOverlay.style.display = 'flex'; // Use flex to center content

    // Ensure only one click listener for the OK button
    messageButtonElement.onclick = null; // Clear previous listeners
    messageButtonElement.addEventListener('click', () => {
        messageModalOverlay.style.display = 'none';
    }, { once: true }); // Use {once: true} to automatically remove listener after first click

    // Ensure only one click listener for the close 'x' button
    if (messageModalCloseBtn) {
        messageModalCloseBtn.onclick = null; // Clear previous listeners
        messageModalCloseBtn.addEventListener('click', () => {
            messageModalOverlay.style.display = 'none';
        }, { once: true });
    }

    // Close modal when clicking outside
    messageModalOverlay.onclick = (event) => {
        if (event.target === messageModalOverlay) {
            messageModalOverlay.style.display = 'none';
            messageModalOverlay.onclick = null; // Remove event listener
        }
    };
}


// Function to generate a unique ID for a cart item, including customizations
// This is crucial to distinguish "Small Kebab with Garlic" from "Small Kebab with Chili"
function generateCartItemId(name, customizations) {
    let id = name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase(); // Sanitize name for ID
    if (customizations && (customizations.sauces.length > 0 || customizations.toppings.length > 0 || customizations.notes)) {
        const customString = JSON.stringify(customizations).replace(/[^a-zA-Z0-9]/g, '');
        id += '_' + customString;
    }
    return id;
}


// Function to add an item to the global cart array
function addItemToCart(itemName, itemPrice, quantity, customizations = null) {
    console.log(`addItemToCart called: ${itemName}, Price: ${itemPrice}, Quantity: ${quantity}, Customizations:`, customizations); // Debugging
    // If quantity is 0, remove from cart if exists
    if (quantity <= 0) {
        const existingItemIndex = cart.findIndex(item =>
            item.name === itemName &&
            JSON.stringify(item.customizations) === JSON.stringify(customizations)
        );
        if (existingItemIndex > -1) {
            cart.splice(existingItemIndex, 1);
            updateCartDisplay();
        }
        return;
    }

    // Generate unique ID for the item (name + size + customizations)
    // For Drinks/Sides, customizations will be null/empty, so ID relies on name
    const itemId = generateCartItemId(itemName, customizations);

    const existingItemIndex = cart.findIndex(item => item.id === itemId);

    if (existingItemIndex > -1) {
        // Item with same name AND customizations exists, just update quantity
        cart[existingItemIndex].quantity = quantity;
    } else {
        // Item is new to the cart, add it
        cart.push({
            id: itemId, // Use the unique ID here
            name: itemName,
            price: itemPrice,
            quantity: quantity,
            customizations: customizations || { sauces: [], toppings: [], notes: '' } // Ensure customizations object exists
        });
    }
    updateCartDisplay();
}

// Function to remove an item from the cart by its unique ID
function removeItemFromCart(itemIdToRemove) {
    const initialCartLength = cart.length;
    cart = cart.filter(item => item.id !== itemIdToRemove); // Filter out the item with the matching ID
    if (cart.length < initialCartLength) {
        showMessageModal('Item Removed', 'The item has been removed from your cart.', 'info');
        updateCartDisplay(); // Re-render the cart if an item was actually removed
    } else {
        console.warn('Attempted to remove item with ID that does not exist:', itemIdToRemove);
    }
}


// Function to update the cart display and total price in the UI
function updateCartDisplay() {
    console.log('updateCartDisplay called. Current cart:', cart); // Debugging
    let total = 0;
    if (cartItemsList) {
        cartItemsList.innerHTML = ''; // Clear current cart display

        if (cart.length === 0) {
            cartItemsList.innerHTML = '<li style="color: #666; text-align: center; padding: 10px;">Your cart is empty.</li>';
        } else {
            cart.forEach(item => {
                // Only display items with quantity > 0
                if (item.quantity > 0) {
                    const listItem = document.createElement('li');
                    listItem.classList.add('cart-item-row'); // Add the new class for styling

                    const itemInfoDiv = document.createElement('div');
                    itemInfoDiv.classList.add('cart-item-info');

                    const itemSubtotal = item.price * item.quantity;
                    let itemText = `<span class="item-name">${item.name}</span> (x${item.quantity}) - £${itemSubtotal.toFixed(2)}`;

                    // Append customization details if available and not empty
                    let customizationDetails = [];
                    if (item.customizations) {
                        if (item.customizations.sauces && item.customizations.sauces.length > 0) {
                            customizationDetails.push(`Sauces: ${item.customizations.sauces.join(', ')}`);
                        }
                        if (item.customizations.toppings && item.customizations.toppings.length > 0) {
                            customizationDetails.push(`Toppings: ${item.customizations.toppings.join(', ')}`);
                        }
                        if (item.customizations.notes) {
                            customizationDetails.push(`Notes: ${item.customizations.notes}`);
                        }
                    }

                    itemInfoDiv.innerHTML = itemText;
                    if (customizationDetails.length > 0) {
                        const customDiv = document.createElement('div');
                        customDiv.classList.add('item-customizations');
                        customDiv.innerHTML = customizationDetails.join('<br>');
                        itemInfoDiv.appendChild(customDiv);
                    }
                    
                    listItem.appendChild(itemInfoDiv);
                    total += itemSubtotal;

                    // Create the remove button
                    const removeButton = document.createElement('button');
                    removeButton.classList.add('remove-item-button');
                    removeButton.innerHTML = '<i class="fas fa-times-circle"></i>';
                    removeButton.title = `Remove ${item.name}`;
                    // Attach the unique item ID to the button for easy identification
                    removeButton.dataset.itemId = item.id; 
                    listItem.appendChild(removeButton);

                    cartItemsList.appendChild(listItem);
                }
            });

            // Re-attach event listeners to the new remove buttons after they are rendered
            // Using event delegation on the parent cartItemsList is more efficient
            // Remove previous listener to avoid duplicates
            cartItemsList.removeEventListener('click', handleRemoveButtonClick);
            cartItemsList.addEventListener('click', handleRemoveButtonClick);
        }
    }

    if (totalPriceSpan) {
        totalPriceSpan.textContent = total.toFixed(2);
    }
}

// Event handler for individual item removal using event delegation
function handleRemoveButtonClick(event) {
    if (event.target.closest('.remove-item-button')) {
        const button = event.target.closest('.remove-item-button');
        const itemId = button.dataset.itemId;
        if (itemId) {
            removeItemFromCart(itemId);
        }
    }
}


// Function to open the kebab customization modal
function openKebabCustomizationModal(kebabId) {
    console.log('openKebabCustomizationModal called for ID:', kebabId); // Debugging
    currentKebabId = kebabId;
    const kebab = menuData.kebabs.items.find(item => item.id === kebabId); // Get kebab from new menuData structure

    if (!kebab) {
        console.error('Kebab data not found for ID:', kebabId);
        showMessageModal('Error', 'Could not load kebab details.', 'error');
        return;
    }

    // Reset modal state
    modalKebabName.textContent = kebab.name;
    modalKebabSizes.innerHTML = ''; // Clear previous size options
    modalKebabNotes.value = '';
    modalQuantityInput.value = 1;
    currentKebabQuantity = 1; // Reset internal quantity tracker
    currentKebabBasePrice = 0; // Reset base price

    // Reset all checkboxes in the modal (sauces and toppings)
    // Assuming they are within modalKebabToppings and modalKebabSauces
    const allModalCheckboxes = kebabCustomizationModal.querySelectorAll('.modal-checkbox-group input[type="checkbox"]');
    allModalCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });

    // Populate sizes
    kebab.sizes.forEach(size => {
        const radioHtml = `
            <label>
                <input type="radio" name="kebabSize" value="${size.label}" data-price="${size.price}">
                <span>${size.label} - £${size.price.toFixed(2)}</span>
            </label>
        `;
        modalKebabSizes.insertAdjacentHTML('beforeend', radioHtml);
    });

    // Add event listeners for changes within the modal to update price
    // Using event delegation for radio buttons (sizes)
    modalKebabSizes.removeEventListener('change', updateModalTotalPrice); // Remove old listener
    modalKebabSizes.addEventListener('change', updateModalTotalPrice);

    // Using event delegation for checkboxes (sauces/toppings)
    modalKebabToppings.removeEventListener('change', updateModalTotalPrice); // Remove old listener
    modalKebabToppings.addEventListener('change', updateModalTotalPrice);
    modalKebabSauces.removeEventListener('change', updateModalTotalPrice); // Remove old listener
    modalKebabSauces.addEventListener('change', updateModalTotalPrice);

    // Quantity input listener
    modalQuantityInput.removeEventListener('input', updateModalTotalPrice); // Remove old listener
    modalQuantityInput.addEventListener('input', updateModalTotalPrice);

    // Initial price update (sets to 0.00 until a size is chosen)
    updateModalTotalPrice();

    kebabCustomizationModal.style.display = 'flex'; // Show the modal
}

// Function to close the kebab customization modal
function closeKebabCustomizationModal() {
    console.log('closeKebabCustomizationModal called.'); // Debugging
    kebabCustomizationModal.style.display = 'none';
    currentKebabId = null;
    currentKebabBasePrice = 0;
    currentKebabQuantity = 1; // Reset to default
    // Also reset form fields within modal if necessary, though openKebabCustomizationModal resets them on open
}

// Function to update total price display in the modal
function updateModalTotalPrice() {
    console.log('updateModalTotalPrice called.'); // Debugging
    // Get selected size price
    const selectedSizeRadio = modalKebabSizes.querySelector('input[name="kebabSize"]:checked');
    if (selectedSizeRadio) {
        // Ensure price is parsed as a float
        currentKebabBasePrice = parseFloat(selectedSizeRadio.dataset.price);
    } else {
        currentKebabBasePrice = 0; // No size selected yet
    }

    // Get quantity
    let quantity = parseInt(modalQuantityInput.value, 10);
    if (isNaN(quantity) || quantity < 1) {
        quantity = 1;
        modalQuantityInput.value = 1; // Correct the input if invalid
    }
    currentKebabQuantity = quantity;

    // Calculate total
    const total = currentKebabBasePrice * currentKebabQuantity;
    modalCurrentPriceSpan.textContent = total.toFixed(2);
}


// Event listener for quantity plus/minus buttons in modal
if (modalQuantityMinus) {
    modalQuantityMinus.addEventListener('click', () => {
        let currentVal = parseInt(modalQuantityInput.value, 10);
        if (isNaN(currentVal)) currentVal = 1;
        if (currentVal > 1) {
            modalQuantityInput.value = currentVal - 1;
            updateModalTotalPrice();
        }
    });
}

if (modalQuantityPlus) {
    modalQuantityPlus.addEventListener('click', () => {
        let currentVal = parseInt(modalQuantityInput.value, 10);
        if (isNaN(currentVal)) currentVal = 0; // If somehow NaN, treat as 0 to add 1
        modalQuantityInput.value = currentVal + 1;
        updateModalTotalPrice();
    });
}


// Event listener for "Add to Cart" button inside the modal
if (modalAddToCartButton) {
    modalAddToCartButton.addEventListener('click', () => {
        console.log('Modal Add to Cart button clicked.'); // Debugging
        const selectedSizeRadio = modalKebabSizes.querySelector('input[name="kebabSize"]:checked');
        if (!selectedSizeRadio) {
            showMessageModal('Selection Required', 'Please select a size for your kebab.', 'warning');
            return;
        }

        const selectedSize = selectedSizeRadio.value;
        const selectedPrice = parseFloat(selectedSizeRadio.dataset.price);
        const quantity = parseInt(modalQuantityInput.value, 10);

        if (isNaN(quantity) || quantity < 1) {
            showMessageModal('Invalid Quantity', 'Please enter a valid quantity (at least 1).', 'warning');
            return;
        }

        const selectedSauces = Array.from(modalKebabSauces.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
        const selectedToppings = Array.from(modalKebabToppings.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
        const notes = modalKebabNotes.value.trim();

        // Get kebab name from the currentKebabId reference
        const kebabName = menuData.kebabs.items.find(item => item.id === currentKebabId).name;
        const fullItemName = `${kebabName} - ${selectedSize}`;
        const customizations = {
            sauces: selectedSauces,
            toppings: selectedToppings,
            notes: notes
        };

        addItemToCart(fullItemName, selectedPrice, quantity, customizations);
        closeKebabCustomizationModal();
        showMessageModal('Item Added!', `"${fullItemName}" (x${quantity}) added to your cart.`, 'success');
    });
}

// Close Kebab Customization Modal listeners
if (kebabModalCloseBtn) {
    kebabModalCloseBtn.addEventListener('click', closeKebabCustomizationModal);
}
if (kebabCustomizationModal) {
    kebabCustomizationModal.addEventListener('click', (event) => {
        if (event.target === kebabCustomizationModal) { // Only close if clicking on the overlay, not the content
            closeKebabCustomizationModal();
        }
    });
}

// --- Dynamic Menu Item Rendering ---

/**
 * Renders the items for a specific category into the menuDisplayArea.
 * Attaches event listeners for dynamically created elements.
 * @param {string} categoryName - The ID of the category (e.g., 'kebabs', 'drinks', 'sides').
 */
function renderCategoryItems(categoryName) {
    console.log('renderCategoryItems called for category:', categoryName); // Debugging
    menuDisplayArea.innerHTML = ''; // Clear previous items

    const categoryData = menuData[categoryName];

    if (!categoryData) {
        console.error('Category data not found for:', categoryName); // Debugging
        menuDisplayArea.innerHTML = '<p style="text-align: center; color: #555; width: 100%;">Category not found or empty.</p>';
        return;
    }

    // Add a category title to the display area
    const categoryTitle = document.createElement('h3');
    categoryTitle.style.cssText = `
        font-size: 22px;
        margin-bottom: 15px;
        color: #c0392b;
        border-bottom: 2px solid #eee;
        padding-bottom: 5px;
        width: 100%; /* Ensure title spans full width */
        text-align: center;
    `;
    categoryTitle.textContent = categoryData.title;
    menuDisplayArea.appendChild(categoryTitle);


    categoryData.items.forEach(item => {
        let itemHtml = '';
        if (categoryName === 'kebabs') {
            // Kebab item HTML with modal trigger
            itemHtml = `
                <div class="container kebab-item">
                    <h4 style="margin-bottom: 10px; color: var(--primary-color);">${item.name}</h4>
                    <button type="button" class="preview-btn" data-image-title="${item.name}" data-image-url="${item.imageUrl}">Preview</button>
                    <button type="button" class="add-to-cart-modal-trigger-button" data-kebab-id="${item.id}" data-kebab-name="${item.name}">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            `;
        } else {
            // Drinks and Sides item HTML with inline quantity control
            itemHtml = `
                <div class="container">
                    <div class="item-selection-row" data-item-id="${item.id}">
                        <span class="item-name-price">${item.name} <span class="price">£${item.price.toFixed(2)}</span></span>
                        <div class="item-quantity-control">
                            <input type="number" class="item-quantity" value="0" min="0">
                            <button type="button" class="add-to-cart-button" data-item-name="${item.name}" data-item-price="${item.price}">Add</button>
                        </div>
                    </div>
                </div>
            `;
        }
        // console.log(`Attempting to insert HTML for ${item.name}:`, itemHtml); // More detailed debugging
        menuDisplayArea.insertAdjacentHTML('beforeend', itemHtml);
        // console.log(`Rendered item: ${item.name} in category: ${categoryName}`); // Debugging each item
    });

    // Re-attach event listeners after new items are rendered
    attachDynamicEventListeners();
    console.log('renderCategoryItems completed for category:', categoryName); // Debugging
}

/**
 * Attaches all event listeners for dynamically added content.
 * Should be called after `renderCategoryItems`.
 */
function attachDynamicEventListeners() {
    console.log('attachDynamicEventListeners called.'); // Debugging

    // 1. Kebab modal trigger buttons
    document.querySelectorAll('.add-to-cart-modal-trigger-button').forEach(button => {
        // Important: Always remove previous listeners before adding to prevent duplicates
        button.removeEventListener('click', handleKebabModalTrigger);
        button.addEventListener('click', handleKebabModalTrigger);
    });

    // 2. Drinks/Sides add to cart buttons
    document.querySelectorAll('.item-selection-row .add-to-cart-button').forEach(button => {
        button.removeEventListener('click', handleDrinksSidesAddToCart);
        button.addEventListener('click', handleDrinksSidesAddToCart);
    });

    // 3. Preview buttons
    document.querySelectorAll('.preview-btn').forEach(button => {
        button.removeEventListener('click', handlePreviewButton);
        button.addEventListener('click', handlePreviewButton);
    });
    console.log('All dynamic event listeners re-attached.'); // Debugging
}

// Handler for kebab modal trigger button
function handleKebabModalTrigger(event) {
    console.log('Kebab modal trigger clicked.'); // Debugging
    const kebabId = event.currentTarget.dataset.kebabId;
    openKebabCustomizationModal(kebabId);
}

// Handler for drinks/sides add to cart button
function handleDrinksSidesAddToCart(event) {
    console.log('Drinks/Sides Add to Cart clicked.'); // Debugging
    const button = event.currentTarget;
    const itemName = button.dataset.itemName;
    const itemPrice = parseFloat(button.dataset.itemPrice);
    const quantityInput = button.closest('.item-quantity-control').querySelector('.item-quantity');
    let quantity = parseInt(quantityInput.value, 10);

    if (isNaN(quantity) || quantity < 0) {
        quantity = 0;
    }

    addItemToCart(itemName, itemPrice, quantity, null);
    quantityInput.value = 0;

    if (quantity > 0) {
        showMessageModal('Item Added!', `"${itemName}" (x${quantity}) added to your cart.`, 'success');
    } else if (quantity === 0) {
        showMessageModal('Item Removed!', `"${itemName}" removed from your cart.`, 'info');
    }
}

// Handler for preview button
function handlePreviewButton(event) {
    console.log('Preview button clicked.'); // Debugging
    const button = event.currentTarget;
    const imageUrl = button.dataset.imageUrl;
    const imageTitle = button.dataset.imageTitle;

    if (modalImage && imageModalOverlay && modalImageTitle) {
        modalImage.src = imageUrl;
        modalImageTitle.textContent = imageTitle;
        imageModalOverlay.style.display = 'flex';

        modalImage.onerror = () => {
            console.error('Failed to load image:', imageUrl);
            modalImage.src = 'https://placehold.co/600x400/cccccc/333333?text=Image+Unavailable';
            modalImageTitle.textContent = 'Image Unavailable';
            showMessageModal('Image Error', 'Image for "' + imageTitle + '" could not be loaded. Showing placeholder.', 'error');
        };
    } else {
        console.error('Modal elements not found for image preview.');
    }
}


// --- Category Navigation Logic ---
categoryLinks.forEach(link => {
    link.addEventListener('click', (event) => {
        console.log('Category link clicked:', event.target.dataset.category); // Debugging
        event.preventDefault(); // Prevent default link behavior (page jump)
        const category = event.target.dataset.category;
        if (category) {
            // Remove active class from all links
            categoryLinks.forEach(l => l.classList.remove('active'));
            // Add active class to the clicked link
            event.target.classList.add('active');

            // Render items for the selected category
            renderCategoryItems(category);
        }
    });
});

// Set initial category display on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded fired.'); // Debugging
    // Find the initially active category link (should be 'kebabs' based on HTML)
    const initialActiveLink = document.querySelector('.category-link.active');
    if (initialActiveLink) {
        const initialCategory = initialActiveLink.dataset.category;
        console.log('Initial active category link found:', initialCategory); // Debugging
        if (initialCategory) {
            renderCategoryItems(initialCategory); // Render default category
        }
    } else {
        // Fallback if no active class is set initially, default to kebabs
        console.warn('No initial active category link found, defaulting to kebabs.'); // Debugging
        renderCategoryItems('kebabs');
        const defaultLink = document.querySelector('.category-link[data-category="kebabs"]');
        if (defaultLink) defaultLink.classList.add('active');
    }
});


// Event listener for the "Clear Cart" button
if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
        console.log('Clear Cart button clicked.'); // Debugging
        cart = []; // Clear the global cart array
        updateCartDisplay(); // Update the display to show an empty cart

        // Reset all quantity inputs back to 0 on the currently displayed menu
        // This is important because items are now dynamically rendered
        document.querySelectorAll('.item-quantity').forEach(input => {
            input.value = 0;
        });
        
        showMessageModal('Cart Cleared!', '🛒 Your cart has been emptied.', 'info');
    });
}


// Toggle payment buttons visibility based on selection
if (paymentToggle) {
  paymentToggle.addEventListener('change', () => {
    console.log('Payment toggle changed to:', paymentToggle.value); // Debugging
    const val = paymentToggle.value;
    if (val === 'card') {
      if (payBtn) payBtn.style.display = 'block';
      if (placeOrderBtn) placeOrderBtn.style.display = 'none';
    } else { // 'cash'
      if (payBtn) payBtn.style.display = 'none';
      if (placeOrderBtn) placeOrderBtn.style.display = 'block';
    }
  });
  // Trigger the change event on load to set the initial correct state
  paymentToggle.dispatchEvent(new Event('change'));
}
// Set initial display based on default select value
if (paymentToggle && payBtn) {
  if (paymentToggle.value === 'card') {
    payBtn.style.display = 'block';
  } else {
    payBtn.style.display = 'none';
  }
}


// Stripe payment initiation
if (payBtn) {
  payBtn.addEventListener('click', async () => {
    console.log('Pay with Card button clicked.'); // Debugging
    // Ensure cart is up-to-date before sending
    updateCartDisplay();

    // Filter out items with quantity 0 before sending to backend
    const currentCart = cart.filter(item => item.quantity > 0);

    if (currentCart.length === 0) {
      showMessageModal('Empty Cart', '🛒 Your cart is empty! Please select at least one item.', 'warning');
      return;
    }

    const customerEmailInput = document.querySelector('input[name="Email"]');
    const customerEmail = customerEmailInput.value;

    // Client-side email validation
    if (!customerEmail || !customerEmail.includes('@') || customerEmail.indexOf('.') === -1 || customerEmail.length < 5) {
        showMessageModal('Invalid Email', 'Please enter a valid email address for payment.', 'error');
        customerEmailInput.focus();
        return;
    }

    try {
      // Disable pay button to prevent multiple clicks
      payBtn.disabled = true;
      payBtn.textContent = 'Processing...';

      const response = await fetch('https://Lubo-Kebab-App.onrender.com/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart: currentCart, // Pass the filtered global cart
          customerEmail: customerEmail
        })
      });

      const data = await response.json();

      if (data.error) {
        showMessageModal('Stripe Error', '❌ Stripe error: ' + data.error, 'error');
        console.error("Stripe Checkout Session Error:", data.error); // Log the server error for more details
        return;
      }

      if (data.id) {
        // Correctly redirect using the Stripe.js library
        const result = await stripe.redirectToCheckout({ sessionId: data.id });
        if (result.error) {
          // This error happens if the redirect itself fails for some reason
          showMessageModal('Stripe Redirect Error', '❌ Stripe Redirect Error: ' + result.error.message, 'error');
          console.error('Stripe Redirect Error:', result.error.message);
        }
      } else {
        showMessageModal('Payment Failed', '⚠️ Failed to receive Stripe session ID from server.', 'error');
        console.error('No session ID received from /create-checkout-session');
      }
    } catch (err) {
      showMessageModal('Network Error', '🚨 An unexpected error occurred while trying to checkout with Stripe. Please check your internet connection and try again.', 'error');
      console.error('Fetch error during Stripe checkout:', err);
    } finally {
        // Re-enable button regardless of success/failure if not redirected
        payBtn.disabled = false;
        payBtn.textContent = '💳 Pay with Card';
    }
  });
}

// Handle form submission for cash orders
if (orderForm) {
  placeOrderBtn.addEventListener('click', async e => { // Changed to click listener for placeOrderBtn
    e.preventDefault();
    console.log('Place Order (Cash) button clicked.'); // Debugging

    // Disable the place order button immediately
    if (placeOrderBtn) {
        placeOrderBtn.disabled = true;
        placeOrderBtn.textContent = 'Placing Order...';
    }

    const method = paymentToggle.value;
    // Ensure cart is up-to-date before sending
    updateCartDisplay();
    const currentCart = cart.filter(item => item.quantity > 0); // Filter out items with quantity 0

    if (currentCart.length === 0) {
        showMessageModal('Empty Cart', '🛒 Your cart is empty! Please select at least one item to place an order.', 'warning');
        if (placeOrderBtn) { // Re-enable button if validation fails
            placeOrderBtn.disabled = false;
            placeOrderBtn.textContent = '🧾 Place Order';
        }
        return;
    }

    if (method === 'card') {
      // If card payment is selected, prevent cash order submission. Stripe button handles it.
      if (placeOrderBtn) { // Re-enable button if it shouldn't be here
            placeOrderBtn.disabled = false;
            placeOrderBtn.textContent = '🧾 Place Order';
      }
      return;
    }

    const customerNameInput = document.querySelector('input[name="Full Name"]');
    const customerEmailInput = document.querySelector('input[name="Email"]');
    const customerPhoneInput = document.querySelector('input[name="Mobile Number"]');
    const deliveryAddressInput = document.querySelector('textarea[name="Delivery Address"]');
    const instructionsInput = document.querySelector('textarea[name="Instructions"]');

    // Basic validation for cash order customer details
    if (!customerNameInput.value || !customerEmailInput.value || !customerPhoneInput.value || !deliveryAddressInput.value) {
        showMessageModal('Missing Details', 'Please fill in all your details (Full Name, Email, Mobile Number, Delivery Address) for cash on delivery.', 'warning');
        if (placeOrderBtn) { // Re-enable button if validation fails
            placeOrderBtn.disabled = false;
            placeOrderBtn.textContent = '🧾 Place Order';
        }
        return;
    }

    // Client-side email validation for cash orders
    const customerEmail = customerEmailInput.value;
    if (!customerEmail || !customerEmail.includes('@') || customerEmail.indexOf('.') === -1 || customerEmail.length < 5) {
        showMessageModal('Invalid Email', 'Please enter a valid email address for your order confirmation.', 'error');
        customerEmailInput.focus();
        if (placeOrderBtn) { // Re-enable button if validation fails
            placeOrderBtn.disabled = false;
            placeOrderBtn.textContent = '🧾 Place Order';
        }
        return;
    }

    try {
      const response = await fetch('https://Lubo-Kebab-App.onrender.com/cash-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order: currentCart, // Pass the filtered global cart
          customer: {
            name: customerNameInput.value,
            email: customerEmail,
            phone: customerPhoneInput.value,
            address: deliveryAddressInput.value,
            instructions: instructionsInput.value,
          }
        })
      });

      if (response.ok) {
        cart = []; // Clear cart on successful order
        updateCartDisplay(); // Update display to show empty cart
        // Also clear inputs on successful order, for both types of items
        document.querySelectorAll('.item-quantity').forEach(input => {
            input.value = 0; // For Drinks/Sides
        });

        window.location.href = 'https://Lubo-Kebab-App.onrender.com/success.html'; // Redirect to success page on successful cash order (Absolute path)
      } else {
        const errorResult = await response.json();
        showMessageModal('Order Failed', "❌ Failed to send order: " + (errorResult.message || "Unknown error"), 'error');
        console.error("Cash order server error:", errorResult);
      }
    } catch (error) {
      showMessageModal('Network Error', "🚨 An error occurred while placing the cash order. Please check your internet connection and try again.", 'error');
      console.error("Cash order fetch error:", error);
    } finally {
        // Re-enable the button if for some reason redirection didn't happen
        if (placeOrderBtn && !window.location.href.includes('success.html')) {
            placeOrderBtn.disabled = false;
            placeOrderBtn.textContent = '🧾 Place Order';
        }
    }
  });
}


// Close image modal when close button is clicked
if (imageModalCloseBtn) {
    imageModalCloseBtn.addEventListener('click', () => {
        console.log('Image modal close button clicked.'); // Debugging
        if (imageModalOverlay) {
            imageModalOverlay.style.display = 'none';
            // Clear image source and title when closing
            modalImage.src = '';
            modalImageTitle.textContent = '';
            // Remove onerror/onload handlers to prevent memory leaks/unexpected behavior
            modalImage.onerror = null;
            modalImage.onload = null;
        }
    });
}

// Close image modal when clicking outside the image content
if (imageModalOverlay) {
    imageModalOverlay.addEventListener('click', (event) => {
        console.log('Image modal overlay clicked.'); // Debugging
        // Check if the click occurred directly on the overlay, not on the content
        if (event.target === imageModalOverlay) {
            imageModalOverlay.style.display = 'none';
            // Clear image source and title when closing
            modalImage.src = '';
            modalImageTitle.textContent = '';
            // Remove onerror/onload handlers
            modalImage.onerror = null;
            modalImage.onload = null;
        }
    });
}


// Live clock functionality
function updateClock() {
  const liveClockElement = document.getElementById('liveClock');
  if (liveClockElement) {
    liveClockElement.textContent = new Date().toLocaleTimeString();
  }
}
setInterval(updateClock, 1000);
updateClock();

// Music toggle functionality
const music = document.getElementById('bg-music');
const playBtnMusic = document.getElementById('playBtn');
const pauseBtnMusic = document.getElementById('pauseBtn');

if (playBtnMusic) {
    playBtnMusic.addEventListener('click', () => {
        if (music) music.play();
        playBtnMusic.style.display = 'none';
        if (pauseBtnMusic) pauseBtnMusic.style.display = 'inline-block';
    });
}

if (pauseBtnMusic) {
    pauseBtnMusic.addEventListener('click', () => {
        if (music) music.pause();
        playBtnMusic.style.display = 'inline-block';
        if (pauseBtnMusic) pauseBtnMusic.style.display = 'none';
    });
}


// Opening Status Checker functionality
function checkOpenStatus() {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const totalMinutes = hour * 60 + minute;

  const schedule = {
    0: { open: 660, close: 1380 }, // Sunday 11:00 AM - 11:00 PM
    1: { open: 660, close: 1380 }, // Monday 11:00 AM - 11:00 PM
    2: { open: 660, close: 1380 }, // Tuesday 11:00 AM - 11:00 PM
    3: { open: 660, close: 1380 }, // Wednesday 11:00 AM - 11:00 PM
    4: { open: 660, close: 1380 }, // Thursday 11:00 AM - 11:00 PM
    5: { open: 660, close: 1560 }, // Friday 11:00 AM - 02:00 AM (next day)
    6: { open: 660, close: 1560 }  // Saturday 11:00 AM - 02:00 AM (next day)
  };

  const today = schedule[day];
  let isOpen = false;

  // Handle crossing midnight for Friday and Saturday
  if (today.close < today.open) {
    isOpen = totalMinutes >= today.open || totalMinutes < today.close;
  } else {
    isOpen = totalMinutes >= today.open && totalMinutes < today.close;
  }

  const statusEl = document.getElementById("openStatus");
  if (statusEl) {
    if (isOpen) {
      statusEl.textContent = "✅ We are OPEN!";
      statusEl.style.color = "green";
    } else {
      statusEl.textContent = "❌ Sorry, we're CLOSED.";
      statusEl.style.color = "red";
    }
  }
}
checkOpenStatus();
setInterval(checkOpenStatus, 60000);

// Logout button logic for index.html
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('isLoggedIn'); // Clear the login flag
        window.location.href = 'https://Lubo-Kebab-App.onrender.com/login.html'; // Redirect to login page (Absolute path)
    });
}

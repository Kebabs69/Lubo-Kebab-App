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


<<<<<<< HEAD
// Elements for the image preview modal (NOW USING CANVAS)
const imageModalOverlay = document.getElementById('imageModalOverlay');
const modalCanvas = document.getElementById('modalCanvas'); // Reference to the canvas element
const modalCtx = modalCanvas ? modalCanvas.getContext('2d') : null; // Get 2D rendering context
=======
// Elements for the image preview modal
const imageModalOverlay = document.getElementById('imageModalOverlay');
const modalImage = document.getElementById('modalImage');
>>>>>>> 163e7c4194f2f26b4688a4db84c0e457b4bd5a55
const modalImageTitle = document.getElementById('modalImageTitle');
const imageModalCloseBtn = document.querySelector('.image-modal-close');

// Elements for the generic message modal
const messageModalOverlay = document.getElementById('messageModalOverlay');
const messageModalContent = document.querySelector('#messageModalOverlay .message-modal-content'); // Get content for class toggling
const messageModalTitle = document.getElementById('messageModalTitle');
const messageModalText = document.getElementById('messageModalText');
const messageModalButton = document.getElementById('messageModalButton');
const messageModalCloseBtn = document.querySelector('#messageModalOverlay .message-modal-close');

// NEW: Elements for the Kebab Customization Modal
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

// Global array to store the cart state
let cart = [];

// NEW: Data structure for Kebabs (to dynamically populate the modal)
const kebabMenuData = {
    'chicken-kebab': {
        name: 'Chicken Kebab',
        sizes: [
            { label: 'Small', price: 5.00 },
            { label: 'Medium', price: 6.00 },
            { label: 'Large', price: 7.00 }
        ],
        // Note: Toppings and sauces are currently generic for all kebabs in HTML
        // If they need to be specific per kebab, define them here as arrays,
        // and modify populateKebabCustomizationModal to use them.
    },
    'lamb-kebab': {
        name: 'Lamb Kebab',
        sizes: [
            { label: 'Small', price: 6.00 },
            // FIX: Changed '7.00' to 7.00 and '8.00' to 8.00
<<<<<<< HEAD
            { label: 'Medium', price: 7.00 }, 
=======
            { label: 'Medium', price: 7.00 },
>>>>>>> 163e7c4194f2f26b4688a4db84c0e457b4bd5a55
            { label: 'Large', price: 8.00 }
        ]
    },
    'veggie-wrap': {
        name: 'Veggie Wrap',
        sizes: [
            { label: 'Small', price: 4.00 },
            { label: 'Medium', price: 5.00 },
            { label: 'Large', price: 6.00 }
        ]
    },
    'mixed-grill': {
        name: 'Mixed Grill',
        sizes: [
            { label: 'Small', price: 8.00 },
            { label: 'Medium', price: 9.50 },
            { label: 'Large', price: 11.00 }
        ]
    }
    // Add other kebabs here as needed
};

// Variables to store current modal selection state
let currentKebabId = null;
let currentKebabBasePrice = 0; // Price based on selected size only
let currentKebabQuantity = 1;

// Login Check for index.html - Ensures user is logged in
if (localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'https://lubo-kebab-app-1.onrender.com/login.html'; // Absolute path for redirection
}


// Function to display the custom message modal
function showMessageModal(title, message, type = 'info') {
    if (!messageModalOverlay || !messageModalTitle || !messageModalText || !messageModalButton || !messageModalContent) {
        console.error("Message modal elements not found, falling back to alert:", title, message);
        alert(title + "\n" + message);
        return;
    }

    // Reset classes to ensure only one type is applied
    messageModalContent.classList.remove('success', 'error', 'warning');

    // Set title and text
    messageModalTitle.innerHTML = `<i class="fas fa-info-circle icon"></i> ${title}`; // Default info icon
<<<<<<< HEAD
    messageModalText.textContent = message;
=======
>>>>>>> 163e7c4194f2f26b4688a4db84c0e457b4bd5a55

    // Apply specific classes and icons based on type
    if (type === 'success') {
        messageModalContent.classList.add('success');
        messageModalTitle.innerHTML = `<i class="fas fa-check-circle icon"></i> ${title}`;
    } else if (type === 'error') {
        messageModalContent.classList.add('error');
        messageModalTitle.innerHTML = `<i class="fas fa-times-circle icon"></i> ${title}`;
    } else if (type === 'warning') {
        messageModalContent.classList.add('warning');
        messageModalTitle.innerHTML = `<i class="fas fa-exclamation-triangle icon"></i> ${title}`;
    }

<<<<<<< HEAD
=======
    messageModalText.textContent = message;
>>>>>>> 163e7c4194f2f26b4688a4db84c0e457b4bd5a55
    messageModalOverlay.style.display = 'flex'; // Use flex to center content

    // Ensure only one click listener for the OK button
    messageModalButton.onclick = null; // Clear previous listeners
    messageModalButton.addEventListener('click', () => {
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
<<<<<<< HEAD
    if (customizations && (customizations.sauces.length > 0 || customizations.toppings.length > 0 || customizations.notes)) {
=======
    if (customizations && (customizations.sauces?.length > 0 || customizations.toppings?.length > 0 || customizations.notes)) {
>>>>>>> 163e7c4194f2f26b4688a4db84c0e457b4bd5a55
        const customString = JSON.stringify(customizations).replace(/[^a-zA-Z0-9]/g, '');
        id += '_' + customString;
    }
    return id;
}


// Function to add an item to the global cart array
function addItemToCart(itemName, itemPrice, quantity, customizations = null) {
    // If quantity is 0, remove from cart if exists
    if (quantity <= 0) {
<<<<<<< HEAD
=======
        // Find by name and customizations to ensure we remove the correct one
>>>>>>> 163e7c4194f2f26b4688a4db84c0e457b4bd5a55
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
<<<<<<< HEAD
                    
=======

>>>>>>> 163e7c4194f2f26b4688a4db84c0e457b4bd5a55
                    listItem.appendChild(itemInfoDiv);
                    total += itemSubtotal;

                    // Create the remove button
                    const removeButton = document.createElement('button');
                    removeButton.classList.add('remove-item-button');
                    removeButton.innerHTML = '<i class="fas fa-times-circle"></i>';
                    removeButton.title = `Remove ${item.name}`;
                    // Attach the unique item ID to the button for easy identification
<<<<<<< HEAD
                    removeButton.dataset.itemId = item.id; 
=======
                    removeButton.dataset.itemId = item.id;
>>>>>>> 163e7c4194f2f26b4688a4db84c0e457b4bd5a55
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


// NEW: Function to open the kebab customization modal
function openKebabCustomizationModal(kebabId) {
    currentKebabId = kebabId;
    const kebab = kebabMenuData[kebabId];

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
<<<<<<< HEAD
    modalKebabSizes.removeEventListener('change', updateModalTotalPrice); // Remove old listener
    modalKebabSizes.addEventListener('change', updateModalTotalPrice);

    // Using event delegation for checkboxes (sauces/toppings)
    modalKebabToppings.removeEventListener('change', updateModalTotalPrice); // Remove old listener
    modalKebabToppings.addEventListener('change', updateModalTotalPrice);
    modalKebabSauces.removeEventListener('change', updateModalTotalPrice); // Remove old listener
    modalKebabSauces.addEventListener('change', updateModalTotalPrice);

    // Quantity input listener
    modalQuantityInput.removeEventListener('input', updateModalTotalPrice); // Remove old listener
=======
    // Ensure existing listeners are removed before adding new ones
    modalKebabSizes.removeEventListener('change', updateModalTotalPrice);
    modalKebabSizes.addEventListener('change', updateModalTotalPrice);

    // Using event delegation for checkboxes (sauces/toppings)
    modalKebabToppings.removeEventListener('change', updateModalTotalPrice);
    modalKebabToppings.addEventListener('change', updateModalTotalPrice);
    modalKebabSauces.removeEventListener('change', updateModalTotalPrice);
    modalKebabSauces.addEventListener('change', updateModalTotalPrice);

    // Quantity input listener
    modalQuantityInput.removeEventListener('input', updateModalTotalPrice);
>>>>>>> 163e7c4194f2f26b4688a4db84c0e457b4bd5a55
    modalQuantityInput.addEventListener('input', updateModalTotalPrice);

    // Initial price update (sets to 0.00 until a size is chosen)
    updateModalTotalPrice();

    kebabCustomizationModal.style.display = 'flex'; // Show the modal
}

// NEW: Function to close the kebab customization modal
function closeKebabCustomizationModal() {
    kebabCustomizationModal.style.display = 'none';
    currentKebabId = null;
    currentKebabBasePrice = 0;
    currentKebabQuantity = 1; // Reset to default
    // Also reset form fields within modal if necessary, though openKebabCustomizationModal resets them on open
}

// NEW: Function to update total price display in the modal
function updateModalTotalPrice() {
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

// NEW: Event listener for "plus" buttons on kebab items to open the modal
document.querySelectorAll('.add-to-cart-modal-trigger-button').forEach(button => {
    button.addEventListener('click', () => {
        const kebabId = button.dataset.kebabId;
        openKebabCustomizationModal(kebabId);
    });
});

// NEW: Event listener for quantity plus/minus buttons in modal
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
    }
);
}


// NEW: Event listener for "Add to Cart" button inside the modal
if (modalAddToCartButton) {
    modalAddToCartButton.addEventListener('click', () => {
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

        const fullItemName = `${kebabMenuData[currentKebabId].name} - ${selectedSize}`;
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


<<<<<<< HEAD
// OLD: Event listener for "Add" buttons specifically for Kebab items (with dropdowns) - REMOVED!
// This logic has been replaced by the modal trigger buttons and modal "Add to Cart" button.
/*
document.querySelectorAll('.add-selected-kebab-to-cart-button').forEach(button => {
    button.addEventListener('click', () => {
        const kebabItemDiv = button.closest('.kebab-item');
        const kebabName = button.dataset.kebabName; // e.g., "Chicken Kebab"

        const sizeSelect = kebabItemDiv.querySelector('.kebab-size-select');
        const quantityInput = kebabItemDiv.querySelector('.selected-item-quantity');

        const selectedOption = sizeSelect.options[sizeSelect.selectedIndex];
        const selectedSize = selectedOption.value;
        const selectedPrice = parseFloat(selectedOption.dataset.price);
        let quantity = parseInt(quantityInput.value, 10);

        // Validation
        if (!selectedSize || selectedPrice === 0) {
            showMessageModal('Selection Required', `Please select a size for the ${kebabName}.`, 'warning');
            return;
        }
        if (isNaN(quantity) || quantity <= 0) {
            showMessageModal('Invalid Quantity', 'Please enter a valid quantity (at least 1).', 'warning');
            quantityInput.value = 1; // Reset to 1 for convenience
            return;
        }

        const fullItemName = `${kebabName} - ${selectedSize}`;
        const customizations = getKebabCustomizations(kebabItemDiv);

        addItemToCart(fullItemName, selectedPrice, quantity, customizations);
        
        // Reset inputs after adding to cart
        sizeSelect.value = ""; // Reset dropdown to default "Select Size"
        quantityInput.value = 1; // Reset quantity to 1

        // Clear customization options for the added item (optional, but good UX)
        kebabItemDiv.querySelectorAll('.customization-options input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        kebabItemDiv.querySelector('textarea.item-notes').value = '';

        showMessageModal('Item Added!', `"${fullItemName}" (x${quantity}) added to your cart.`, 'success');
    });
});
*/


// EXISTING: Event listeners for "Add" buttons for Drinks and Sides (using direct item-quantity)
document.querySelectorAll('.item-selection-row .add-to-cart-button').forEach(button => {
    button.addEventListener('click', () => {
        const itemName = button.dataset.itemName;
        const itemPrice = parseFloat(button.dataset.itemPrice);
        
        // Find the quantity input associated with this specific "Add" button
        const quantityInput = button.closest('.item-quantity-control').querySelector('.item-quantity');
        let quantity = parseInt(quantityInput.value, 10);

        // Validate quantity
        if (isNaN(quantity) || quantity < 0) {
            quantity = 0; // Default to 0 or handle as an error
        }

        // For drinks/sides, customizations are not applicable, so pass null or empty object
        addItemToCart(itemName, itemPrice, quantity, null);
        
        // Reset quantity input to 0 after adding to cart
        quantityInput.value = 0; 

        // Show a success message if something was actually added/updated
        if (quantity > 0) {
            showMessageModal('Item Added!', `"${itemName}" (x${quantity}) added to your cart.`, 'success');
        } else if (quantity === 0) { // If quantity was 0, means item was removed
            showMessageModal('Item Removed!', `"${itemName}" removed from your cart.`, 'info');
        }
=======
// REMOVED OLD KEBAB ADD TO CART LOGIC:
// The previous logic for '.add-selected-kebab-to-cart-button' which handled kebabs without a modal
// has been removed as it is now replaced by the kebab customization modal flow.


// EXISTING: Event listeners for "Add to Cart" buttons for Drinks and Sides (using direct item-quantity)
// MODIFIED: Selector updated to target .menu-item instead of .item-selection-row
document.querySelectorAll('#drinks .menu-item .add-to-cart-button, #sides .menu-item .add-to-cart-button').forEach(button => {
    button.addEventListener('click', () => {
        const itemName = button.dataset.itemName;
        const itemPrice = parseFloat(button.dataset.itemPrice);

        // For drinks/sides with the new HTML structure, clicking "Add to Cart" means adding 1 item.
        // If the item is already in the cart, we'll increment its quantity.
        let quantityToAdd = 1;
        let currentQuantityInCart = 0;

        // Check if item already exists in cart to get its current quantity
        const existingItemInCart = cart.find(item => item.name === itemName &&
            !item.customizations.sauces.length && !item.customizations.toppings.length && !item.customizations.notes); // For simple items, check no customizations

        if (existingItemInCart) {
            currentQuantityInCart = existingItemInCart.quantity;
        }

        const newQuantity = currentQuantityInCart + quantityToAdd;

        // For drinks/sides, customizations are not applicable, so pass empty object
        addItemToCart(itemName, itemPrice, newQuantity, { sauces: [], toppings: [], notes: '' });

        showMessageModal('Item Added!', `"${itemName}" (x${newQuantity}) added to your cart.`, 'success');
>>>>>>> 163e7c4194f2f26b4688a4db84c0e457b4bd5a55
    });
});


// Event listener for the "Clear Cart" button
if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
        cart = []; // Clear the global cart array
        updateCartDisplay(); // Update the display to show an empty cart

<<<<<<< HEAD
        // Reset all quantity inputs back to 0 on the menu (for Drinks/Sides)
        document.querySelectorAll('.item-quantity').forEach(input => {
            input.value = 0;
        });
        // OLD: Kebab resets from here are removed as they are now handled by modal state on open
        /*
        document.querySelectorAll('.kebab-size-select').forEach(select => {
            select.value = ""; // For Kebabs
        });
        document.querySelectorAll('.selected-item-quantity').forEach(input => {
            input.value = 1; // For Kebabs
        });
        document.querySelectorAll('.customization-options input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        document.querySelectorAll('.customization-options textarea.item-notes').forEach(textarea => {
            textarea.value = '';
        });
        */
        // Instead, the modal will reset its state when opened again.
        // For general clearing, we just clear the cart and let the modal handle its own reset when it's opened.

=======
        // No need to reset individual quantity inputs on the menu for drinks/sides
        // as they no longer have them in the new HTML structure.
        // Kebab modal state is reset on its `openKebabCustomizationModal` call.
>>>>>>> 163e7c4194f2f26b4688a4db84c0e457b4bd5a55

        showMessageModal('Cart Cleared!', '🛒 Your cart has been emptied.', 'info');
    });
}


// Toggle payment buttons visibility based on selection
if (paymentToggle) {
  paymentToggle.addEventListener('change', () => {
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
<<<<<<< HEAD
=======
// This section might be redundant due to the event listener above, but kept for robustness.
>>>>>>> 163e7c4194f2f26b4688a4db84c0e457b4bd5a55
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

      const response = await fetch('https://lubo-kebab-app-1.onrender.com/create-checkout-session', { // Corrected URL
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
      const response = await fetch('https://lubo-kebab-app-1.onrender.com/cash-order', { // Corrected URL
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
<<<<<<< HEAD
        // Also clear inputs on successful order, for both types of items
        document.querySelectorAll('.item-quantity').forEach(input => {
            input.value = 0;
        });
        // Clear all relevant customer detail inputs as well
        customerNameInput.value = '';
        customerEmailInput.value = '';
        customerPhoneInput.value = '';
        deliveryAddressInput.value = '';
        instructionsInput.value = '';
        
        window.location.href = 'https://lubo-kebab-app-1.onrender.com/success.html'; // Redirect to success page
=======
        // Also clear inputs on successful order
        // Note: Individual item quantity inputs are no longer present for drinks/sides in the new HTML.
        // Their quantity is managed by addItemToCart (incrementing on each "Add" click).
        // Kebab modal quantities are reset when the modal opens.

        // Clear customer detail inputs
        customerNameInput.value = '';
        customerEmailInput.value = '';
        customerPhoneInput.value = '';
        deliveryAddressInput.value = '';
        instructionsInput.value = '';

        window.location.href = 'https://lubo-kebab-app-1.onrender.com/success.html'; // Redirect to success page
>>>>>>> 163e7c4194f2f26b4688a4db84c0e457b4bd5a55
      } else {
        const errorData = await response.json();
        showMessageModal('Order Failed', '❌ Order failed: ' + (errorData.message || 'An unknown error occurred.'), 'error');
        console.error('Cash order failed:', errorData);
      }
    } catch (err) {
      showMessageModal('Network Error', '🚨 An unexpected network error occurred while placing your order. Please check your internet connection and try again.', 'error');
      console.error('Fetch error during cash order:', err);
    } finally {
        // Re-enable button regardless of success/failure
        if (placeOrderBtn) {
            placeOrderBtn.disabled = false;
            placeOrderBtn.textContent = '🧾 Place Order';
        }
    }
  });
}

// === Live Clock and Music Controls ===
function updateClock() {
    const liveClockElement = document.getElementById('liveClock');
    if (liveClockElement) {
        liveClockElement.textContent = new Date().toLocaleTimeString();
    }
}
setInterval(updateClock, 1000); // Update every second
updateClock(); // Initial call

const music = document.getElementById('bg-music');
const playBtnMusic = document.getElementById('playBtn');
const pauseBtnMusic = document.getElementById('pauseBtn');

if (playBtnMusic) {
    playBtnMusic.addEventListener('click', () => {
        music.play();
        playBtnMusic.style.display = 'none';
        pauseBtnMusic.style.display = 'inline-block';
    });
}

if (pauseBtnMusic) {
    pauseBtnMusic.addEventListener('click', () => {
        music.pause();
        playBtnMusic.style.display = 'inline-block';
        pauseBtnMusic.style.display = 'none';
    });
}

// Initial update to display cart when the page loads
document.addEventListener('DOMContentLoaded', updateCartDisplay);
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
const messageModalTitle = document.getElementById('messageModalTitle');
const messageModalText = document.getElementById('messageModalText');
const messageModalButton = document.getElementById('messageModalButton');
const messageModalCloseBtn = document.querySelector('#messageModalOverlay .message-modal-close');

// NEW: Elements for the Kebab Customization Modal (now used for all items)
const kebabCustomizationModal = document.getElementById('kebabCustomizationModal');
const kebabModalCloseBtn = document.querySelector('#kebabCustomizationModal .kebab-modal-close');
const modalKebabName = document.getElementById('modalKebabName'); // Renamed to modalItemName in logic, but ID remains
const modalKebabSizes = document.getElementById('modalKebabSizes');
const modalKebabToppings = document.getElementById('modalKebabToppings');
const modalKebabSauces = document.getElementById('modalKebabSauces');
const modalKebabNotes = document.getElementById('modalKebabNotes');
const modalQuantityMinus = document.getElementById('modalQuantityMinus');
const modalQuantityInput = document.getElementById('modalQuantityInput');
const modalQuantityPlus = document.getElementById('modalQuantityPlus');
const modalAddToCartButton = document.getElementById('modalAddToCartButton');
const modalCurrentPriceSpan = document.getElementById('modalCurrentPrice');

// NEW: Sections in the modal that might be hidden for non-kebab items
const modalSizeSection = document.getElementById('modalSizeSection');
const modalToppingsSection = document.getElementById('modalToppingsSection');
const modalSaucesSection = document.getElementById('modalSaucesSection');


// Global array to store the cart state
let cart = [];

// NEW: Data structure for Kebabs and other items (to dynamically populate the modal)
const menuData = {
    'chicken-kebab': {
        name: 'Chicken Kebab',
        type: 'kebab',
        sizes: [
            { label: 'Small', price: 5.00 },
            { label: 'Medium', price: 6.00 },
            { label: 'Large', price: 7.00 }
        ]
    },
    'lamb-kebab': {
        name: 'Lamb Kebab',
        type: 'kebab',
        sizes: [
            { label: 'Small', price: 6.00 },
            { label: 'Medium', price: 7.00 },
            { label: 'Large', price: 8.00 }
        ]
    },
    'veggie-wrap': {
        name: 'Veggie Wrap',
        type: 'kebab',
        sizes: [
            { label: 'Small', price: 4.00 },
            { label: 'Medium', price: 5.00 },
            { label: 'Large', price: 6.00 }
        ]
    },
    'mixed-grill': {
        name: 'Mixed Grill',
        type: 'kebab',
        sizes: [
            { label: 'Small', price: 8.00 },
            { label: 'Medium', price: 9.50 },
            { label: 'Large', price: 11.00 }
        ]
    },
    // Drinks
    'coca-cola': { name: 'Coca Cola', type: 'drink', price: 1.50 },
    'pepsi': { name: 'Pepsi', type: 'drink', price: 1.50 },
    'sprite': { name: 'Sprite', type: 'drink', price: 1.50 }, // Updated
    'fanta': { name: 'Fanta', type: 'drink', price: 1.50 },     // Updated
    'water': { name: 'Water', type: 'drink', price: 1.00 },
    // Sides
    'fries': { name: 'Fries', type: 'side', price: 2.00 },
    'cheesy-chips': { name: 'Cheesy Chips', type: 'side', price: 2.50 },
    'onion-rings': { name: 'Onion Rings', type: 'side', price: 2.00 },
    'side-salad': { name: 'Side Salad', type: 'side', price: 2.00 },
    'garlic-bread': { name: 'Garlic Bread', type: 'side', price: 1.50 }
};


// Variables to store current modal selection state
let currentItemId = null;
let currentItemType = null; // 'kebab', 'drink', 'side'
let currentItemBasePrice = 0; // Price based on selected size or fixed price for drinks/sides
let currentItemQuantity = 1;

// Login Check for index.html - Ensures user is logged in
// This check now uses the correct domain for redirection.
if (localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'https://lubo-kebab-app-1.onrender.com/login.html'; // Corrected Absolute path for redirection
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

    messageModalText.textContent = message;
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
    if (customizations && (customizations.sauces?.length > 0 || customizations.toppings?.length > 0 || customizations.notes)) {
        const customString = JSON.stringify(customizations).replace(/[^a-zA-Z0-9]/g, '');
        id += '_' + customString;
    }
    return id;
}


// Function to add an item to the global cart array
function addItemToCart(itemName, itemPrice, quantity, customizations = null) {
    // If quantity is 0, remove from cart if exists
    if (quantity <= 0) {
        // Find by name and customizations to ensure we remove the correct one
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


// NEW: Function to open the item customization modal (unified for all items)
function openItemCustomizationModal(itemId, itemType, itemPrice = null) {
    currentItemId = itemId;
    currentItemType = itemType;
    const itemData = menuData[itemId];

    if (!itemData) {
        console.error('Item data not found for ID:', itemId);
        showMessageModal('Error', 'Could not load item details.', 'error');
        return;
    }

    // Reset modal state
    modalKebabName.textContent = itemData.name; // Use generic "Item" in title
    modalKebabNotes.value = '';
    modalQuantityInput.value = 1;
    currentItemQuantity = 1; // Reset internal quantity tracker


    // Show/hide sections based on item type
    if (itemType === 'kebab') {
        modalSizeSection.style.display = 'block';
        modalToppingsSection.style.display = 'block';
        modalSaucesSection.style.display = 'block';

        // Populate sizes for kebabs
        modalKebabSizes.innerHTML = ''; // Clear previous size options
        itemData.sizes.forEach(size => {
            const radioHtml = `
                <label>
                    <input type="radio" name="kebabSize" value="${size.label}" data-price="${size.price}">
                    <span>${size.label} - £${size.price.toFixed(2)}</span>
                </label>
            `;
            modalKebabSizes.insertAdjacentHTML('beforeend', radioHtml);
        });
        currentItemBasePrice = 0; // Kebab price depends on size selection
    } else { // For 'drink' or 'side'
        modalSizeSection.style.display = 'none';
        modalToppingsSection.style.display = 'none';
        modalSaucesSection.style.display = 'none';

        currentItemBasePrice = itemPrice; // Use the fixed price for drinks/sides
    }

    // Reset all checkboxes in the modal (sauces and toppings)
    const allModalCheckboxes = kebabCustomizationModal.querySelectorAll('.modal-checkbox-group input[type="checkbox"]');
    allModalCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });


    // Add event listeners for changes within the modal to update price
    // Using event delegation for radio buttons (sizes)
    modalKebabSizes.removeEventListener('change', updateModalTotalPrice); // Remove previous
    if (itemType === 'kebab') { // Only add if sizes are relevant
        modalKebabSizes.addEventListener('change', updateModalTotalPrice);
    }

    // Checkbox listeners (always present in modal, but only affect price for kebabs if logic was added)
    // For now, they don't affect price, just notes.
    modalKebabToppings.removeEventListener('change', updateModalTotalPrice);
    modalKebabToppings.addEventListener('change', updateModalTotalPrice);
    modalKebabSauces.removeEventListener('change', updateModalTotalPrice);
    modalKebabSauces.addEventListener('change', updateModalTotalPrice);

    // Quantity input listener
    modalQuantityInput.removeEventListener('input', updateModalTotalPrice);
    modalQuantityInput.addEventListener('input', updateModalTotalPrice);

    // Initial price update
    updateModalTotalPrice();

    kebabCustomizationModal.style.display = 'flex'; // Show the modal
}

// NEW: Function to close the item customization modal
function closeItemCustomizationModal() {
    kebabCustomizationModal.style.display = 'none';
    currentItemId = null;
    currentItemType = null;
    currentItemBasePrice = 0;
    currentItemQuantity = 1; // Reset to default
    // Also reset form fields within modal if necessary, though openItemCustomizationModal resets them on open
}

// NEW: Function to update total price display in the modal
function updateModalTotalPrice() {
    let basePrice = 0;

    if (currentItemType === 'kebab') {
        const selectedSizeRadio = modalKebabSizes.querySelector('input[name="kebabSize"]:checked');
        if (selectedSizeRadio) {
            basePrice = parseFloat(selectedSizeRadio.dataset.price);
        }
    } else { // 'drink' or 'side'
        basePrice = currentItemBasePrice;
    }

    // Get quantity
    let quantity = parseInt(modalQuantityInput.value, 10);
    if (isNaN(quantity) || quantity < 1) {
        quantity = 1;
        modalQuantityInput.value = 1; // Correct the input if invalid
    }
    currentItemQuantity = quantity;

    // Calculate total
    const total = basePrice * currentItemQuantity;
    modalCurrentPriceSpan.textContent = total.toFixed(2);
}

// NEW: Event listener for ALL "plus" buttons on menu items to open the modal
document.querySelectorAll('.add-to-cart-modal-trigger-button').forEach(button => {
    button.addEventListener('click', () => {
        const itemId = button.dataset.itemId;
        const itemType = button.dataset.itemType;
        const itemPrice = button.dataset.itemPrice ? parseFloat(button.dataset.itemPrice) : null; // Only for drinks/sides

        openItemCustomizationModal(itemId, itemType, itemPrice);
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
    });
}


// NEW: Event listener for "Add to Cart" button inside the modal
if (modalAddToCartButton) {
    modalAddToCartButton.addEventListener('click', () => {
        let selectedName = menuData[currentItemId].name;
        let selectedPrice = 0;
        let customizations = { sauces: [], toppings: [], notes: modalKebabNotes.value.trim() };
        const quantity = parseInt(modalQuantityInput.value, 10);

        if (isNaN(quantity) || quantity < 1) {
            showMessageModal('Invalid Quantity', 'Please enter a valid quantity (at least 1).', 'warning');
            return;
        }

        if (currentItemType === 'kebab') {
            const selectedSizeRadio = modalKebabSizes.querySelector('input[name="kebabSize"]:checked');
            if (!selectedSizeRadio) {
                showMessageModal('Selection Required', 'Please select a size for your kebab.', 'warning');
                return;
            }
            const selectedSize = selectedSizeRadio.value;
            selectedPrice = parseFloat(selectedSizeRadio.dataset.price);
            selectedName = `${menuData[currentItemId].name} - ${selectedSize}`; // Append size to name

            customizations.sauces = Array.from(modalKebabSauces.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
            customizations.toppings = Array.from(modalKebabToppings.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);

        } else { // For 'drink' or 'side'
            selectedPrice = currentItemBasePrice;
            // No specific sauces/toppings for drinks/sides, only notes are relevant here.
        }

        addItemToCart(selectedName, selectedPrice, quantity, customizations);
        closeItemCustomizationModal();
        showMessageModal('Item Added!', `"${selectedName}" (x${quantity}) added to your cart.`, 'success');
    });
}

// Close Kebab Customization Modal listeners
if (kebabModalCloseBtn) {
    kebabModalCloseBtn.addEventListener('click', closeItemCustomizationModal);
}
if (kebabCustomizationModal) {
    kebabCustomizationModal.addEventListener('click', (event) => {
        if (event.target === kebabCustomizationModal) { // Only close if clicking on the overlay, not the content
            closeItemCustomizationModal();
        }
    });
}


// REMOVED OLD DRINKS/SIDES ADD TO CART LOGIC:
// The previous logic for '.add-to-cart-button' which handled drinks/sides with direct quantity input
// has been removed as it is now replaced by the unified modal flow.


// Event listener for the "Clear Cart" button
if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
        cart = []; // Clear the global cart array
        updateCartDisplay(); // Update the display to show an empty cart
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
// This section might be redundant due to the event listener above, but kept for robustness.
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

      // --- CORRECTED URL HERE ---
      const response = await fetch('https://lubo-kebab-app-1.onrender.com/create-checkout-session', {
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
        placeOrderBtn.disabled = false; // Buttons are enabled by default now
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
      // --- CORRECTED URL HERE ---
      const response = await fetch('https://lubo-kebab-app-1.onrender.com/cash-order', {
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
        // No need to reset individual quantity inputs for drinks/sides
        // as they no longer have them in the new HTML structure.
        // Kebab modal state is reset on its `openItemCustomizationModal` call.

        // --- CORRECTED URL HERE ---
        window.location.href = 'https://lubo-kebab-app-1.onrender.com/success.html'; // Redirect to success page on successful cash order (Absolute path)
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

// Preview Button Logic
document.querySelectorAll('.preview-btn').forEach(button => {
    button.addEventListener('click', () => {
        const imageUrl = button.dataset.imageUrl;
        const imageTitle = button.dataset.imageTitle;

        if (modalImage && imageModalOverlay && modalImageTitle) {
            modalImage.src = imageUrl;
            modalImageTitle.textContent = imageTitle;
            imageModalOverlay.style.display = 'flex'; // Use flex to center content

            // Add an onerror handler to the modal image itself for better debugging
            modalImage.onerror = () => {
                console.error('Failed to load image:', imageUrl);
                // Set a fallback image if the primary one fails
                modalImage.src = 'https://placehold.co/600x400/cccccc/333333?text=Image+Unavailable';
                modalImageTitle.textContent = 'Image Unavailable'; // Update title for fallback
                // MODIFIED: Added imageUrl to the error message
                showMessageModal('Image Error', 'Image for "' + imageTitle + '" could not be loaded from ' + imageUrl + '. Showing placeholder.', 'error'); // Use custom modal
            };

        } else {
            console.error('Modal elements not found for image preview.');
        }
    });
});

// Close image modal when close button is clicked
if (imageModalCloseBtn) {
    imageModalCloseBtn.addEventListener('click', () => {
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


// Logout button logic for index.html
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('isLoggedIn'); // Clear the login flag
        // --- CORRECTED URL HERE ---
        window.location.href = 'https://lubo-kebab-app-1.onrender.com/login.html'; // Redirect to login page (Absolute path)
    });
}

// Initial state of buttons and messages on page load (No postcode logic needed here now)
document.addEventListener('DOMContentLoaded', () => {
    // Buttons are enabled by default now, so no special 'disabled' update needed on load here
    // However, the paymentToggle change event still handles showing/hiding the correct button
    if (paymentToggle) {
        paymentToggle.dispatchEvent(new Event('change'));
    }
});

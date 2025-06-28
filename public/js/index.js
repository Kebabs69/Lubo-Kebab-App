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

// Elements for the Kebab Customization Modal
const kebabCustomizationModal = document.getElementById('kebabCustomizationModal');
const modalKebabName = document.getElementById('modalKebabName');
const modalKebabSizes = document.getElementById('modalKebabSizes');
const modalKebabToppings = document.getElementById('modalKebabToppings');
const modalKebabSauces = document.getElementById('modalKebabSauces');
const modalKebabNotes = document.getElementById('modalKebabNotes');
const modalQuantityInput = document.getElementById('modalQuantityInput');
const modalQuantityMinus = document.getElementById('modalQuantityMinus');
const modalQuantityPlus = document.getElementById('modalQuantityPlus');
const modalCurrentPrice = document.getElementById('modalCurrentPrice');
const modalAddToCartButton = document.getElementById('modalAddToCartButton');
const kebabModalCloseBtn = document.querySelector('#kebabCustomizationModal .kebab-modal-close');

// Global variable to store the currently selected item's base price and type for the modal
let currentModalItem = {
    id: '',
    name: '',
    basePrice: 0, // This will store the price per unit, either from fixed price or selected size
    type: '' // 'kebab', 'drink', 'side', 'customizable-side'
};

// Define prices and options for items
const menuItems = {
    'chicken-kebab': {
        name: 'Chicken Kebab',
        type: 'kebab',
        sizes: {
            'small': 6.50,
            'medium': 8.50,
            'large': 10.50
        }
    },
    'lamb-kebab': {
        name: 'Lamb Kebab',
        type: 'kebab',
        sizes: {
            'small': 7.00,
            'medium': 9.00,
            'large': 11.00
        }
    },
    'mixed-grill': {
        name: 'Mixed Grill',
        type: 'kebab',
        sizes: {
            'regular': 17.00,
            'large': 22.00
        }
    },
    // REMOVED 'veggie-wrap'
    'chicken-shish': { // ADDED Chicken Shish
        name: 'Chicken Shish',
        type: 'kebab', // Set type to kebab so it gets salad and sauce options
        sizes: {
            'small': 4.00,
            'large': 6.00
        }
    },
    'coca-cola': { name: 'Coca Cola', type: 'drink', price: 1.50 },
    'pepsi': { name: 'Pepsi', type: 'drink', price: 1.50 },
    'sprite': { name: 'Sprite', type: 'drink', price: 1.50 },
    'fanta': { name: 'Fanta', type: 'drink', price: 1.50 },
    'water': { name: 'Water', type: 'drink', price: 1.00 },
    'chips': {
        name: 'Chips',
        type: 'customizable-side',
        sizes: {
            'small': 3.00,
            'large': 4.50
        }
    },
    'cheesy-chips': {
        name: 'Cheesy Chips',
        type: 'customizable-side',
        sizes: {
            'small': 4.00,
            'large': 5.50
        }
    },
    'onion-rings': {
        name: 'Onion Rings',
        type: 'customizable-side',
        sizes: {
            'small': 3.50,
            'large': 5.00
        }
    },
    'chicken-nuggets': {
        name: 'Chicken Nuggets',
        type: 'customizable-side',
        sizes: {
            '6-piece': 4.00,
            '9-piece': 5.50
        }
    },
    'garlic-bread': { name: 'Garlic Bread', type: 'side', price: 1.50 }
};

// Cart array to store selected items
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to display a generic message modal
function showMessageModal(title, message, type = 'info', buttonText = 'OK') {
    messageModalTitle.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'times-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'} icon"></i> ${title}`;
    messageModalText.textContent = message;
    messageModalButton.textContent = buttonText;
    messageModalContent.className = `message-modal-content ${type}`; // Add type class for styling
    messageModalOverlay.style.display = 'flex';
}

// Function to hide the generic message modal
function hideMessageModal() {
    messageModalOverlay.style.display = 'none';
}

// Event listener for the generic message modal's close button and OK button
if (messageModalCloseBtn) {
    messageModalCloseBtn.addEventListener('click', hideMessageModal);
}
if (messageModalButton) {
    messageModalButton.addEventListener('click', hideMessageModal);
}


// Function to update the cart display
function updateCartDisplay() {
    cartItemsList.innerHTML = ''; // Clear current cart display
    let total = 0;

    if (cart.length === 0) {
        cartItemsList.innerHTML = '<li style="color: #666; text-align: center; padding: 10px;">Your cart is empty.</li>';
        totalPriceSpan.textContent = '0.00';
        document.getElementById('orderSummary').value = ''; // Clear hidden input
        return;
    }

    cart.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.classList.add('cart-item-row');

        const itemInfo = document.createElement('div');
        itemInfo.classList.add('cart-item-info');

        const itemName = document.createElement('span');
        itemName.classList.add('item-name');
        itemName.textContent = `${item.quantity}x ${item.name}`;
        if (item.size) { // Only show size if it exists
            itemName.textContent += ` (${item.size.charAt(0).toUpperCase() + item.size.slice(1)})`;
        }
        itemInfo.appendChild(itemName);

        if (item.toppings && item.toppings.length > 0) {
            const toppings = document.createElement('div');
            toppings.classList.add('item-customizations');
            toppings.textContent = `Salad: ${item.toppings.join(', ')}`;
            itemInfo.appendChild(toppings);
        }
        if (item.sauces && item.sauces.length > 0) {
            const sauces = document.createElement('div');
            sauces.classList.add('item-customizations');
            sauces.textContent = `Sauces: ${item.sauces.join(', ')}`;
            itemInfo.appendChild(sauces);
        }
        if (item.notes) {
            const notes = document.createElement('div');
            notes.classList.add('item-customizations');
            notes.textContent = `Notes: ${item.notes}`;
            itemInfo.appendChild(notes);
        }

        const itemPrice = document.createElement('span');
        itemPrice.classList.add('item-price');
        itemPrice.textContent = ` £${(item.price * item.quantity).toFixed(2)}`;
        itemInfo.appendChild(itemPrice);

        listItem.appendChild(itemInfo);

        const removeButton = document.createElement('button');
        removeButton.classList.add('remove-item-button');
        removeButton.innerHTML = '<i class="fas fa-times-circle"></i>';
        removeButton.title = `Remove ${item.name}`;
        removeButton.addEventListener('click', () => removeItemFromCart(index));
        listItem.appendChild(removeButton);

        cartItemsList.appendChild(listItem);
        total += item.price * item.quantity;
    });

    totalPriceSpan.textContent = total.toFixed(2);
    document.getElementById('orderSummary').value = JSON.stringify(cart); // Update hidden input
    localStorage.setItem('cart', JSON.stringify(cart)); // Save cart to local storage
}

// Function to add an item to the cart
function addItemToCart(item) {
    // Check if the item already exists in the cart with the exact same customizations
    const existingItemIndex = cart.findIndex(cartItem =>
        cartItem.id === item.id &&
        cartItem.size === item.size &&
        JSON.stringify(cartItem.toppings) === JSON.stringify(item.toppings) &&
        JSON.stringify(cartItem.sauces) === JSON.stringify(item.sauces) &&
        cartItem.notes === item.notes
    );

    if (existingItemIndex > -1) {
        // If it exists, just increase the quantity
        cart[existingItemIndex].quantity += item.quantity;
    } else {
        // Otherwise, add it as a new item
        cart.push(item);
    }
    updateCartDisplay();
    showMessageModal('Item Added!', `${item.quantity}x ${item.name} added to your cart.`, 'success');
}

// Function to remove an item from the cart
function removeItemFromCart(index) {
    const removedItem = cart.splice(index, 1)[0]; // Remove 1 item at the specified index
    updateCartDisplay();
    showMessageModal('Item Removed', `${removedItem.name} removed from your cart.`, 'info');
}

// Event listener for clearing the cart
if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
        if (cart.length > 0) {
            cart = []; // Empty the cart array
            updateCartDisplay(); // Update the display
            showMessageModal('Cart Cleared', 'Your shopping cart has been emptied.', 'info');
        } else {
            showMessageModal('Cart Empty', 'Your cart is already empty!', 'warning');
        }
    });
}


// Function to open the image preview modal
function openImageModal(title, imageUrl) {
    modalImageTitle.textContent = title;
    modalImage.src = imageUrl;
    imageModalOverlay.style.display = 'flex';
}

// Event listeners for preview buttons
document.querySelectorAll('.preview-btn').forEach(button => {
    button.addEventListener('click', function() {
        const imageUrl = this.dataset.imageUrl;
        const imageTitle = this.dataset.imageTitle;
        openImageModal(imageTitle, imageUrl);
    });
});

// Event listener for closing the image preview modal
if (imageModalCloseBtn) {
    imageModalCloseBtn.addEventListener('click', () => {
        imageModalOverlay.style.display = 'none';
    });
}

// Close image modal if clicking outside the content
if (imageModalOverlay) {
    imageModalOverlay.addEventListener('click', (e) => {
        if (e.target === imageModalOverlay) {
            imageModalOverlay.style.display = 'none';
        }
    });
}


// --- Kebab Customization Modal Logic ---

// Function to open the customization modal
function openKebabCustomizationModal(itemId) {
    const item = menuItems[itemId];
    if (!item) {
        console.error('Item not found:', itemId);
        return;
    }

    currentModalItem.id = itemId;
    currentModalItem.name = item.name;
    currentModalItem.type = item.type;
    // For non-customizable items, set basePrice directly from item.price
    currentModalItem.basePrice = item.price || 0; // Will be overridden by size for customizable items

    modalKebabName.textContent = item.name;
    modalQuantityInput.value = 1; // Reset quantity to 1

    // Clear previous options
    modalKebabSizes.innerHTML = '';
    modalKebabNotes.value = '';

    // Reset all checkboxes for toppings and sauces
    document.querySelectorAll('#modalKebabToppings input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.querySelectorAll('#modalKebabSauces input[type="checkbox"]').forEach(cb => cb.checked = false);


    // Show/hide sections based on item type
    const sizeSection = document.getElementById('modalSizeSection');
    const toppingsSection = document.getElementById('modalToppingsSection');
    const saucesSection = document.getElementById('modalSaucesSection');

    // Handle Size & Price Section
    if (item.sizes && Object.keys(item.sizes).length > 0) {
        sizeSection.style.display = 'block';
        // Populate sizes
        for (const size in item.sizes) {
            const price = item.sizes[size];
            const label = document.createElement('label');
            label.innerHTML = `<input type="radio" name="kebabSize" value="${size}" data-price="${price.toFixed(2)}"> <span>${size.charAt(0).toUpperCase() + size.slice(1)} (£${price.toFixed(2)})</span>`;
            modalKebabSizes.appendChild(label);
        }
        // Select the first size by default
        if (Object.keys(item.sizes).length > 0) {
            modalKebabSizes.querySelector('input[type="radio"]').checked = true;
        }
        // Add event listener for size changes to update price
        // Remove previous listener to prevent duplicates
        modalKebabSizes.removeEventListener('change', updateModalPrice);
        modalKebabSizes.addEventListener('change', updateModalPrice);
    } else {
        sizeSection.style.display = 'none';
        // For items without sizes (drinks, simple sides), basePrice is already set from item.price
    }

    // Handle Salads Section (only for 'kebab' type)
    if (item.type === 'kebab') {
        toppingsSection.style.display = 'block';
    } else {
        toppingsSection.style.display = 'none';
    }

    // Handle Sauces Section (for 'kebab' and 'customizable-side' types)
    if (item.type === 'kebab' || item.type === 'customizable-side') {
        saucesSection.style.display = 'block';
    } else {
        saucesSection.style.display = 'none';
    }

    // Add event listeners for quantity changes to update price
    // Remove previous listeners to prevent duplicates
    modalQuantityInput.removeEventListener('input', updateModalPrice);
    modalQuantityInput.removeEventListener('change', updateModalPrice);
    modalQuantityInput.addEventListener('input', updateModalPrice);
    modalQuantityInput.addEventListener('change', updateModalPrice); // For direct input changes

    // Initial price update
    updateModalPrice();

    kebabCustomizationModal.style.display = 'flex';
}

// Function to update the price displayed in the modal
function updateModalPrice() {
    let pricePerUnit = 0;
    const quantity = parseInt(modalQuantityInput.value) || 1; // Default to 1 if input is empty/invalid

    if (currentModalItem.type === 'kebab' || currentModalItem.type === 'customizable-side') {
        const selectedSizeRadio = modalKebabSizes.querySelector('input[name="kebabSize"]:checked');
        if (selectedSizeRadio) {
            pricePerUnit = parseFloat(selectedSizeRadio.dataset.price);
        } else {
            // If no size is selected for a customizable item, default to 0 or show a message
            pricePerUnit = 0;
            // Optionally, show a warning or prevent adding to cart if no size selected
        }
    } else { // For drinks and simple sides
        pricePerUnit = currentModalItem.basePrice;
    }

    modalCurrentPrice.textContent = (pricePerUnit * quantity).toFixed(2);
}

// Event listener for the "Add to Cart" button inside the customization modal
if (modalAddToCartButton) {
    modalAddToCartButton.addEventListener('click', () => {
        const quantity = parseInt(modalQuantityInput.value);
        if (quantity < 1) {
            showMessageModal('Invalid Quantity', 'Please enter a quantity of 1 or more.', 'warning');
            return;
        }

        let selectedPrice = 0;
        let selectedSize = '';
        let selectedToppings = [];
        let selectedSauces = [];
        const notes = modalKebabNotes.value.trim();

        if (currentModalItem.type === 'kebab' || currentModalItem.type === 'customizable-side') {
            const selectedSizeRadio = modalKebabSizes.querySelector('input[name="kebabSize"]:checked');
            if (!selectedSizeRadio && (currentModalItem.type === 'kebab' || currentModalItem.type === 'customizable-side')) {
                showMessageModal('Selection Required', 'Please select a size for your item.', 'warning');
                return;
            }
            selectedPrice = parseFloat(selectedSizeRadio ? selectedSizeRadio.dataset.price : 0);
            selectedSize = selectedSizeRadio ? selectedSizeRadio.value : '';

            // Get selected toppings (only for kebabs)
            if (currentModalItem.type === 'kebab') {
                document.querySelectorAll('#modalKebabToppings input[type="checkbox"]:checked').forEach(checkbox => {
                    selectedToppings.push(checkbox.value);
                });
            }

            // Get selected sauces (for kebabs and customizable sides)
            document.querySelectorAll('#modalKebabSauces input[type="checkbox"]:checked').forEach(checkbox => {
                selectedSauces.push(checkbox.value);
            });
        } else { // For drinks and simple sides (no sizes, toppings, or sauces)
            selectedPrice = currentModalItem.basePrice;
        }

        const itemToAdd = {
            id: currentModalItem.id,
            name: currentModalItem.name,
            price: selectedPrice,
            quantity: quantity,
            type: currentModalItem.type,
            size: selectedSize,
            toppings: selectedToppings,
            sauces: selectedSauces,
            notes: notes
        };

        addItemToCart(itemToAdd);
        kebabCustomizationModal.style.display = 'none'; // Close modal after adding
    });
}

// Event listener for the modal quantity buttons
if (modalQuantityMinus) {
    modalQuantityMinus.addEventListener('click', () => {
        let quantity = parseInt(modalQuantityInput.value);
        if (quantity > 1) {
            modalQuantityInput.value = quantity - 1;
            updateModalPrice();
        }
    });
}

if (modalQuantityPlus) {
    modalQuantityPlus.addEventListener('click', () => {
        let quantity = parseInt(modalQuantityInput.value);
        modalQuantityInput.value = quantity + 1;
        updateModalPrice();
    });
}

// Event listener for closing the customization modal
if (kebabModalCloseBtn) {
    kebabModalCloseBtn.addEventListener('click', () => {
        kebabCustomizationModal.style.display = 'none';
    });
}

// Close customization modal if clicking outside the content
if (kebabCustomizationModal) {
    kebabCustomizationModal.addEventListener('click', (e) => {
        if (e.target === kebabCustomizationModal) {
            kebabCustomizationModal.style.display = 'none';
        }
    });
}

// Event listeners for ALL "Add to Cart" trigger buttons (the plus icons)
document.querySelectorAll('.add-to-cart-modal-trigger-button').forEach(button => {
    button.addEventListener('click', function() {
        const itemId = this.dataset.itemId;
        openKebabCustomizationModal(itemId); // Always open modal now
    });
});


// --- Payment and Order Submission Logic ---

// Event listener for payment method toggle
if (paymentToggle) {
    paymentToggle.addEventListener('change', function() {
        if (this.value === 'card') {
            payBtn.style.display = 'block'; // Show "Pay with Card" button
            placeOrderBtn.style.display = 'none'; // Hide "Place Order" button
        } else {
            payBtn.style.display = 'none'; // Hide "Pay with Card" button
            placeOrderBtn.style.display = 'block'; // Show "Place Order" button
        }
    });
    // Set initial state based on default selected option
    paymentToggle.dispatchEvent(new Event('change'));
}

// Event listener for "Pay with Card" button
if (payBtn) {
    payBtn.addEventListener('click', async () => {
        if (cart.length === 0) {
            showMessageModal('Cart Empty', 'Please add items to your cart before proceeding to payment.', 'warning');
            return;
        }

        const customerName = document.querySelector('input[name="Full Name"]').value;
        const customerEmail = document.querySelector('input[name="Email"]').value;
        const customerPhone = document.querySelector('input[name="Mobile Number"]').value;
        const deliveryAddress = document.querySelector('textarea[name="Delivery Address"]').value;
        const specialInstructions = document.querySelector('textarea[name="Instructions"]').value;

        if (!customerName || !customerEmail || !customerPhone || !deliveryAddress) {
            showMessageModal('Missing Information', 'Please fill in all your details (Name, Email, Mobile, Address) before paying.', 'warning');
            return;
        }

        // Prepare line items for Stripe
        const lineItems = cart.map(item => {
            let description = [];
            if (item.size) description.push(`Size: ${item.size}`);
            if (item.toppings && item.toppings.length > 0) description.push(`Salad: ${item.toppings.join(', ')}`);
            if (item.sauces && item.sauces.length > 0) description.push(`Sauces: ${item.sauces.join(', ')}`);
            if (item.notes) description.push(`Notes: ${item.notes}`);

            return {
                price_data: {
                    currency: 'gbp',
                    product_data: {
                        name: item.name,
                        description: description.join(' | ') || 'No customizations'
                    },
                    unit_amount: Math.round(item.price * 100), // Price in pence
                },
                quantity: item.quantity,
            };
        });

        try {
            // Create a checkout session on your server (this is a mock, in a real app you'd fetch from your backend)
            // For this client-side only example, we'll simulate success.
            // In a real application, you would send the cart data to your server
            // which would then create a Stripe Checkout Session and return its ID.

            // Example of what a real fetch might look like (commented out for client-side demo):
            /*
            const response = await fetch('/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: lineItems,
                    customerDetails: {
                        name: customerName,
                        email: customerEmail,
                        phone: customerPhone,
                        address: deliveryAddress,
                        instructions: specialInstructions
                    }
                }),
            });
            const session = await response.json();
            if (session.id) {
                const result = await stripe.redirectToCheckout({ sessionId: session.id });
                if (result.error) {
                    showMessageModal('Payment Error', result.error.message, 'error');
                }
            } else {
                showMessageModal('Payment Error', 'Failed to create Stripe checkout session.', 'error');
            }
            */

            // --- SIMULATED STRIPE REDIRECT FOR CLIENT-SIDE ONLY DEMO ---
            // In a real app, replace this with the actual Stripe redirect as shown above.
            showMessageModal('Redirecting to Payment...', 'Please wait while we prepare your secure payment. This is a demo; you will be redirected to a success page shortly.', 'info', 'Continue to Demo Success');
            messageModalButton.addEventListener('click', () => {
                window.location.href = '/success.html'; // Redirect to success page on button click
                localStorage.removeItem('cart'); // Clear cart on successful order
            }, { once: true }); // Ensure this listener only fires once

            // Clear the cart immediately for the demo
            cart = [];
            updateCartDisplay();

        } catch (error) {
            console.error('Error during Stripe checkout:', error);
            showMessageModal('Payment Error', 'An error occurred during payment. Please try again.', 'error');
        }
    });
}


// Event listener for "Place Order" button (for cash on delivery)
if (placeOrderBtn) {
    placeOrderBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default form submission

        if (cart.length === 0) {
            showMessageModal('Cart Empty', 'Please add items to your cart before placing your order.', 'warning');
            return;
        }

        const customerName = document.querySelector('input[name="Full Name"]').value;
        const customerEmail = document.querySelector('input[name="Email"]').value;
        const customerPhone = document.querySelector('input[name="Mobile Number"]').value;
        const deliveryAddress = document.querySelector('textarea[name="Delivery Address"]').value;
        const specialInstructions = document.querySelector('textarea[name="Instructions"]').value;

        if (!customerName || !customerEmail || !customerPhone || !deliveryAddress) {
            showMessageModal('Missing Information', 'Please fill in all your details (Name, Email, Mobile, Address) before placing your order.', 'warning');
            return;
        }

        // Simulate order submission for cash on delivery
        console.log('Cash Order Placed:', {
            cart: cart,
            customer: {
                name: customerName,
                email: customerEmail,
                phone: customerPhone,
                address: deliveryAddress,
                instructions: specialInstructions
            }
        });

        // Display confirmation message
        const confirmationMessage = document.getElementById('confirmationMessage');
        if (confirmationMessage) {
            confirmationMessage.style.display = 'block';
            confirmationMessage.scrollIntoView({ behavior: 'smooth' });
        }

        // Clear the cart after successful order
        cart = [];
        updateCartDisplay();
        localStorage.removeItem('cart'); // Clear cart from local storage

        showMessageModal('Order Placed!', 'Your cash on delivery order has been placed successfully!', 'success');

        // Optionally redirect after a delay
        setTimeout(() => {
            window.location.href = '/success.html'; // Redirect to success page
        }, 3000); // Redirect after 3 seconds
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

// === Logout Functionality ===
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('isLoggedIn'); // Clear login status
        localStorage.removeItem('cart'); // Clear cart on logout
        window.location.href = '/login.html'; // Redirect to login page
    });
}


// === Dynamic Menu Display Logic (NEW) ===
const sidebarNavItems = document.querySelectorAll('.sidebar-nav-item');
const menuSections = document.querySelectorAll('.menu-section');

// Function to show a specific menu section and update active class
function showMenuSection(targetId) {
    // Hide all menu sections
    menuSections.forEach(section => {
        section.classList.add('hidden-menu-section');
    });

    // Show the targeted menu section
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
        targetSection.classList.remove('hidden-menu-section');
    }

    // Remove active class from all sidebar items
    sidebarNavItems.forEach(item => {
        item.classList.remove('active');
    });

    // Add active class to the clicked sidebar item
    const activeSidebarItem = document.querySelector(`.sidebar-nav-item[data-target="${targetId}"]`);
    if (activeSidebarItem) {
        activeSidebarItem.classList.add('active');
    }
}

// Add click listeners to sidebar items
sidebarNavItems.forEach(item => {
    item.addEventListener('click', function() {
        const targetId = this.dataset.target;
        showMenuSection(targetId);
    });
});

// Initial display: Show Kebabs section when the page loads
document.addEventListener('DOMContentLoaded', () => {
    showMenuSection('kebabs-section');
    updateCartDisplay(); // Also update cart display on load
});

// This script contains logic specific to the index.html (main order page).

// Removed Stripe initialization from here, it's now handled in index.html to ensure load order.
// The 'stripe' variable is now globally available because it was defined in index.html.

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

// NEW: Global array to store the cart state
let cart = [];

// ✅ Login Check for index.html - Ensures user is logged in
if (localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'https://Lubo-Kebab-App.onrender.com/login.html'; // Absolute path for redirection
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
    messageModalText.textContent = message;

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


// Function to get customizations for a given kebab item block
function getKebabCustomizations(kebabItemDiv) {
    const selectedSauces = [];
    kebabItemDiv.querySelectorAll('input[type="checkbox"][data-custom-type="sauce"]:checked').forEach(sauceCheckbox => {
        selectedSauces.push(sauceCheckbox.value);
    });

    const selectedToppings = [];
    kebabItemDiv.querySelectorAll('input[type="checkbox"][data-custom-type="topping"]:checked').forEach(toppingCheckbox => {
        selectedToppings.push(toppingCheckbox.value);
    });

    const notesTextArea = kebabItemDiv.querySelector('textarea.item-notes');
    const itemNotes = notesTextArea ? notesTextArea.value.trim() : '';

    return {
        sauces: selectedSauces,
        toppings: selectedToppings,
        notes: itemNotes
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
    // If quantity is 0, do nothing or remove from cart if exists
    if (quantity <= 0) {
        // Remove item from cart if its quantity is set to 0 directly
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

    const itemId = generateCartItemId(itemName, customizations);

    const existingItemIndex = cart.findIndex(item => item.id === itemId);

    if (existingItemIndex > -1) {
        // Item with same name AND customizations exists, just update quantity
        cart[existingItemIndex].quantity = quantity;
    } else {
        // Item is new to the cart, add it
        cart.push({
            id: itemId,
            name: itemName,
            price: itemPrice,
            quantity: quantity,
            customizations: customizations || { sauces: [], toppings: [], notes: '' } // Ensure customizations object exists
        });
    }
    updateCartDisplay();
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
                    const itemSubtotal = item.price * item.quantity;
                    let itemText = `${item.name} (x${item.quantity}) - £${itemSubtotal.toFixed(2)}`;

                    // Append customization details if available and not empty
                    if (item.customizations) {
                        if (item.customizations.sauces && item.customizations.sauces.length > 0) {
                            itemText += `<br>&nbsp;&nbsp;&nbsp;Sauces: ${item.customizations.sauces.join(', ')}`;
                        }
                        if (item.customizations.toppings && item.customizations.toppings.length > 0) {
                            itemText += `<br>&nbsp;&nbsp;&nbsp;Toppings: ${item.customizations.toppings.join(', ')}`;
                        }
                        if (item.customizations.notes) {
                            itemText += `<br>&nbsp;&nbsp;&nbsp;Notes: ${item.customizations.notes}`;
                        }
                    }
                    
                    listItem.innerHTML = itemText;
                    cartItemsList.appendChild(listItem);
                    total += itemSubtotal;
                }
            });
        }
    }

    if (totalPriceSpan) {
        totalPriceSpan.textContent = total.toFixed(2);
    }
}


// Event listeners for "Add" buttons (This is the SOLE trigger for adding items)
document.querySelectorAll('.add-to-cart-button').forEach(button => {
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

        let customizations = null;
        // Check if this is a kebab item to get customizations
        const kebabItemDiv = button.closest('.kebab-item');
        if (kebabItemDiv) {
            customizations = getKebabCustomizations(kebabItemDiv);
        }

        addItemToCart(itemName, itemPrice, quantity, customizations);
        
        // Reset quantity input to 0 after adding to cart
        quantityInput.value = 0; 

        // Show a success message if something was actually added/updated
        if (quantity > 0) {
            showMessageModal('Item Added!', `"${itemName}" (x${quantity}) added to your cart.`, 'success');
        } else if (quantity === 0) { // If quantity was 0, means item was removed
            showMessageModal('Item Removed!', `"${itemName}" removed from your cart.`, 'info');
        }
    });
});

// 🔥🔥🔥 CRITICAL FIX: REMOVING THE EVENT LISTENER FROM QUANTITY INPUTS 🔥🔥🔥
// This listener caused items to be added/updated automatically without clicking "Add".
// Now, changing the quantity input will *not* trigger a cart update until the "Add" button is clicked.
/*
document.querySelectorAll('.item-quantity').forEach(input => {
    input.addEventListener('change', (event) => {
        const quantityInput = event.target;
        let quantity = parseInt(quantityInput.value, 10);
        
        if (isNaN(quantity) || quantity < 0) {
            quantity = 0;
            quantityInput.value = 0; // Ensure invalid input resets to 0
        }

        const itemSelectionRow = quantityInput.closest('.item-selection-row');
        if (!itemSelectionRow) {
            console.error("Could not find parent .item-selection-row for quantity input.");
            return;
        }

        const itemName = itemSelectionRow.querySelector('.add-to-cart-button').dataset.itemName;
        const itemPrice = parseFloat(itemSelectionRow.querySelector('.add-to-cart-button').dataset.itemPrice);

        let customizations = null;
        const kebabItemDiv = quantityInput.closest('.kebab-item');
        if (kebabItemDiv) {
            customizations = getKebabCustomizations(kebabItemDiv);
        }

        addItemToCart(itemName, itemPrice, quantity, customizations);
    });
});
*/


// Event listener for the "Clear Cart" button
if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
        cart = []; // Clear the global cart array
        updateCartDisplay(); // Update the display to show an empty cart

        // Reset all quantity inputs back to 0 on the menu
        document.querySelectorAll('.item-quantity').forEach(input => {
            input.value = 0;
        });

        // Clear all customization checkboxes
        document.querySelectorAll('.customization-options input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });

        // Clear all customization notes textareas
        document.querySelectorAll('.customization-options textarea.item-notes').forEach(textarea => {
            textarea.value = '';
        });

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

    // ✅ NEW: Disable the place order button immediately
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
        // Also clear quantities and customizations from the menu after successful order
        document.querySelectorAll('.item-quantity').forEach(input => {
            input.value = 0;
        });
        document.querySelectorAll('.customization-options input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        document.querySelectorAll('.customization-options textarea.item-notes').forEach(textarea => {
            textarea.value = '';
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
                showMessageModal('Image Error', 'Image for "' + imageTitle + '" could retain not be loaded. Showing placeholder.', 'error'); // Use custom modal
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

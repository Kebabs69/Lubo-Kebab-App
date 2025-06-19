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

// NEW: Elements for the image preview modal
const imageModalOverlay = document.getElementById('imageModalOverlay');
const modalImage = document.getElementById('modalImage');
const modalImageTitle = document.getElementById('modalImageTitle');
const imageModalCloseBtn = document.querySelector('.image-modal-close');


// ✅ Login Check for index.html - Ensures user is logged in
// This script runs immediately when the body loads (due to its placement in index.html)
// and redirects to login if not authenticated.
if (localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'https://Lubo-Kebab-App.onrender.com/login.html'; // Absolute path for redirection
}


// Function to build the cart array from selected items, now including customizations
function buildCart() {
  const cartItems = [];

  // Iterate over kebab items
  document.querySelectorAll('.kebab-item').forEach(itemDiv => {
    const checkbox = itemDiv.querySelector('input[type="checkbox"]');
    const select = itemDiv.querySelector('select');
    
    // Only process if the kebab is checked
    if (checkbox && checkbox.checked && select) {
      const name = checkbox.value + ' - ' + select.options[select.selectedIndex].text;
      const price = parseFloat(select.options[select.selectedIndex].dataset.price);

      // --- Capture Customization Details ---
      const selectedSauces = [];
      itemDiv.querySelectorAll('input[type="checkbox"][data-custom-type="sauce"]:checked').forEach(sauceCheckbox => {
          selectedSauces.push(sauceCheckbox.value);
      });

      const selectedToppings = [];
      itemDiv.querySelectorAll('input[type="checkbox"][data-custom-type="topping"]:checked').forEach(toppingCheckbox => {
          selectedToppings.push(toppingCheckbox.value);
      });

      const notesTextArea = itemDiv.querySelector('textarea.item-notes');
      const itemNotes = notesTextArea ? notesTextArea.value.trim() : '';

      cartItems.push({ 
        name, 
        price, 
        quantity: 1, // Quantity is always 1 per selected item, size is in name
        customizations: {
            sauces: selectedSauces,
            toppings: selectedToppings,
            notes: itemNotes
        }
      }); 
    }
  });

  // Iterate over drink items (no customizations for drinks)
  document.querySelectorAll('.drink-item input[type="checkbox"]:checked').forEach(cb => {
    if (cb) { 
      cartItems.push({ name: cb.value, price: parseFloat(cb.dataset.price), quantity: 1 }); 
    }
  });

  // Iterate over side items (no customizations for sides)
  document.querySelectorAll('.side-item input[type="checkbox"]:checked').forEach(cb => {
    if (cb) { 
      cartItems.push({ name: cb.value, price: parseFloat(cb.dataset.price), quantity: 1 }); 
    }
  });

  return cartItems;
}

// Function to update the cart display and total price in the UI
function updateCartDisplay() {
    const cart = buildCart();
    let total = 0; 

    if (cartItemsList) { 
        cartItemsList.innerHTML = ''; 

        if (cart.length === 0) {
            cartItemsList.innerHTML = '<li style="color: #666; text-align: center; padding: 10px;">Your cart is empty.</li>';
        } else {
            cart.forEach(item => {
                const listItem = document.createElement('li');
                // FIX: This line is crucial. item.name already contains "Item Name - Size (£Price)".
                // We no longer append item.price here to avoid duplication.
                let itemText = item.name; 

                // Append customization details if available
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
                
                listItem.innerHTML = itemText; // Use innerHTML because of <br> tags
                cartItemsList.appendChild(listItem);
                total += item.price; 
            });
        }
    }

    if (totalPriceSpan) { 
        totalPriceSpan.textContent = total.toFixed(2); 
    }
}


// Add event listeners to all relevant input fields to trigger cart update
// This includes the new customization checkboxes and textareas
document.querySelectorAll('.kebab-item input[type="checkbox"], .kebab-item select, .kebab-item .customization-options input[type="checkbox"], .kebab-item .customization-options textarea, .drink-item input[type="checkbox"], .side-item input[type="checkbox"]').forEach(element => {
    // For text areas, listen for 'input' event for real-time updates
    if (element.tagName === 'TEXTAREA') {
        element.addEventListener('input', updateCartDisplay);
    } else {
        element.addEventListener('change', updateCartDisplay);
    }
});


// Initial call to display empty cart or pre-selected items (runs when script loads)
updateCartDisplay();


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
    const cartItems = buildCart();

    if (cartItems.length === 0) {
      alert('🛒 Your cart is empty! Please select at least one item.'); // Using alert for now as discussed
      return;
    }

    const customerEmailInput = document.querySelector('input[name="Email"]');
    const customerEmail = customerEmailInput.value;

    // Client-side email validation
    if (!customerEmail || !customerEmail.includes('@') || customerEmail.indexOf('.') === -1 || customerEmail.length < 5) {
        alert('Please enter a valid email address for payment.'); // Using alert for now as discussed
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
          cart: cartItems, // This now includes customizations!
          customerEmail: customerEmail 
        })
      });

      const data = await response.json();

      if (data.error) {
        alert('❌ Stripe error: ' + data.error); // Using alert for now as discussed
        console.error("Stripe Checkout Session Error:", data.error); // Log the server error for more details
        return;
      }

      if (data.id) {
        // Correctly redirect using the Stripe.js library
        // 'stripe' is now globally available because it was defined in index.html
        const result = await stripe.redirectToCheckout({ sessionId: data.id });
        if (result.error) {
          // This error happens if the redirect itself fails for some reason
          alert('❌ Stripe Redirect Error: ' + result.error.message); // Using alert for now as discussed
          console.error('Stripe Redirect Error:', result.error.message);
        }
      } else {
        alert('⚠️ Failed to receive Stripe session ID from server.'); // Using alert for now as discussed
        console.error('No session ID received from /create-checkout-session');
      }
    } catch (err) {
      alert('🚨 An unexpected error occurred while trying to checkout with Stripe.'); // Using alert for now as discussed
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
  orderForm.addEventListener('submit', async e => {
    e.preventDefault();

    // ✅ NEW: Disable the place order button immediately
    if (placeOrderBtn) {
        placeOrderBtn.disabled = true;
        placeOrderBtn.textContent = 'Placing Order...';
    }

    const method = paymentToggle.value;
    const cartItems = buildCart(); // This now includes customizations!

    if (cartItems.length === 0) { 
        alert('🛒 Your cart is empty! Please select at least one item to place an order.'); // Using alert for now as discussed
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
        alert('Please fill in all your details (Full Name, Email, Mobile Number, Delivery Address) for cash on delivery.'); // Using alert for now as discussed
        if (placeOrderBtn) { // Re-enable button if validation fails
            placeOrderBtn.disabled = false;
            placeOrderBtn.textContent = '🧾 Place Order';
        }
        return;
    }

    // Client-side email validation for cash orders
    const customerEmail = customerEmailInput.value;
    if (!customerEmail || !customerEmail.includes('@') || customerEmail.indexOf('.') === -1 || customerEmail.length < 5) {
        alert('Please enter a valid email address for your order confirmation.'); // Using alert for now as discussed
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
          order: cartItems, // This now includes customizations!
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
        window.location.href = 'https://Lubo-Kebab-App.onrender.com/success.html'; // Redirect to success page on successful cash order (Absolute path)
      } else {
        const errorResult = await response.json();
        alert("❌ Failed to send order: " + (errorResult.message || "Unknown error")); // Using alert for now as discussed
        console.error("Cash order server error:", errorResult);
      }
    } catch (error) {
      alert("❌ An error occurred while placing the cash order. Please try again."); // Using alert for now as discussed
      console.error("Cash order fetch error:", error);
    } finally {
        // ✅ NEW: Re-enable the button if for some reason redirection didn't happen
        if (placeOrderBtn && !window.location.href.includes('success.html')) {
            placeOrderBtn.disabled = false;
            placeOrderBtn.textContent = '🧾 Place Order';
        }
    }
  });
}

// NEW: Preview Button Logic
// Add event listeners to all preview buttons
document.querySelectorAll('.preview-btn').forEach(button => {
    button.addEventListener('click', () => {
        const imageUrl = button.dataset.imageUrl;
        const imageTitle = button.dataset.imageTitle;

        if (modalImage && imageModalOverlay && modalImageTitle) {
            modalImage.src = imageUrl;
            modalImageTitle.textContent = imageTitle;
            imageModalOverlay.style.display = 'flex'; // Use flex to center content
        }
    });
});

// Close modal when close button is clicked
if (imageModalCloseBtn) {
    imageModalCloseBtn.addEventListener('click', () => {
        if (imageModalOverlay) {
            imageModalOverlay.style.display = 'none';
        }
    });
}

// Close modal when clicking outside the image content
if (imageModalOverlay) {
    imageModalOverlay.addEventListener('click', (event) => {
        // Check if the click occurred directly on the overlay, not on the content
        if (event.target === imageModalOverlay) {
            imageModalOverlay.style.display = 'none';
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

// Re-attaching event listeners directly here
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

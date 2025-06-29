document.addEventListener('DOMContentLoaded', () => {
    // --- Global Variables & DOM Elements ---
    const cart = [];
    const cartItemsUl = document.getElementById('cartItems');
    const totalPriceSpan = document.getElementById('totalPrice');
    const orderForm = document.getElementById('orderForm');
    const confirmationMessage = document.getElementById('confirmationMessage');
    const freebieBanner = document.getElementById('freebie-banner');
    const liveClock = document.getElementById('liveClock');

    // Music Player Elements
    const bgMusic = document.getElementById('bg-music');
    const playBtn = document.getElementById('playBtn');
    const pauseBtn = document.getElementById('pauseBtn');

    // Image Modal Elements
    const imageModalOverlay = document.getElementById('imageModalOverlay');
    const modalImage = document.getElementById('modalImage');
    const modalImageTitle = document.getElementById('modalImageTitle');
    const imageModalClose = document.querySelector('.image-modal-close');

    // Message Modal Elements
    const messageModalOverlay = document.getElementById('messageModalOverlay');
    const messageModalTitle = document.getElementById('messageModalTitle');
    const messageModalText = document.getElementById('messageModalText');
    const messageModalButton = document.getElementById('messageModalButton');
    const messageModalClose = document.querySelector('.message-modal-close');

    // Kebab Customization Modal Elements
    const kebabCustomizationModal = document.getElementById('kebabCustomizationModal');
    const modalKebabName = document.getElementById('modalKebabName');
    const modalKebabSizes = document.getElementById('modalKebabSizes');
    const modalKebabToppings = document.getElementById('modalKebabToppings');
    const modalKebabSauces = document.getElementById('modalKebabSauces');
    const modalKebabNotes = document.getElementById('modalKebabNotes');
    const modalQuantityInput = document.getElementById('modalQuantityInput');
    const modalQuantityMinus = document.getElementById('modalQuantityMinus');
    const modalQuantityPlus = document.getElementById('modalQuantityPlus');
    const modalAddToCartButton = document.getElementById('modalAddToCartButton');
    const modalCurrentPrice = document.getElementById('modalCurrentPrice');
    const kebabModalClose = kebabCustomizationModal.querySelector('.kebab-modal-close');

    let currentItem = null; // Stores the item being customized

    // Define prices and options for different items
    const itemDetails = {
        'chicken-kebab': {
            name: 'Chicken Kebab',
            type: 'kebab',
            sizes: {
                'Small': 7.00,
                'Large': 11.00
            },
            defaultSize: 'Small',
            toppings: ['Cabbage', 'Lettuce', 'Tomato', 'Cucumber', 'Onion', 'Pickles'],
            sauces: ['Garlic Sauce', 'Chili Sauce', 'Mayonnaise', 'Ketchup', 'BBQ Sauce', 'Mint Sauce', 'Relish', 'Sweet Chilli', 'Burger Sauce']
        },
        'lamb-kebab': {
            name: 'Lamb Kebab',
            type: 'kebab',
            sizes: {
                'Small': 7.50,
                'Large': 11.50
            },
            defaultSize: 'Small',
            toppings: ['Cabbage', 'Lettuce', 'Tomato', 'Cucumber', 'Onion', 'Pickles'],
            sauces: ['Garlic Sauce', 'Chili Sauce', 'Mayonnaise', 'Ketchup', 'BBQ Sauce', 'Mint Sauce', 'Relish', 'Sweet Chilli', 'Burger Sauce']
        },
        'mixed-grill': {
            name: 'Mixed Grill',
            type: 'kebab',
            sizes: {
                'Small': 8.00,
                'Medium': 10.00,
                'Large': 12.00
            },
            defaultSize: 'Small',
            toppings: ['Cabbage', 'Lettuce', 'Tomato', 'Cucumber', 'Onion', 'Pickles'],
            sauces: ['Garlic Sauce', 'Chili Sauce', 'Mayonnaise', 'Ketchup', 'BBQ Sauce', 'Mint Sauce', 'Relish', 'Sweet Chilli', 'Burger Sauce']
        },
        'chicken-shish': { // Formerly Veggie Wrap, now Chicken Shish
            name: 'Chicken Shish',
            type: 'kebab',
            sizes: {
                'Regular': 8.50,
                'Large': 10.50
            },
            defaultSize: 'Regular',
            toppings: ['Cabbage', 'Lettuce', 'Tomato', 'Cucumber', 'Onion', 'Pickles'],
            sauces: ['Garlic Sauce', 'Chili Sauce', 'Mayonnaise', 'Ketchup', 'BBQ Sauce', 'Mint Sauce', 'Relish', 'Sweet Chilli', 'Burger Sauce']
        },
        'classic-beef-burger': {
            name: '1/4lb Beef Burger',
            type: 'burger', // New type
            sizes: {
                'Single': 7.00 // Only one size, assuming a price
            },
            defaultSize: 'Single',
            toppings: ['Onion', 'Lettuce', 'Tomato', 'Cucumber', 'Cabbage', 'Pickles'], // Specified toppings
            sauces: ['Ketchup', 'Mayonnaise', 'BBQ Sauce', 'Garlic Mayo', 'Mint Sauce', 'Chilli Sauce', 'Relish', 'Sweet Chilli'] // Specified sauces
        },
        'cheeseburger': {
            name: 'Cheeseburger',
            type: 'burger',
            sizes: {
                'Single': 7.50 // Only one size, updated price
            },
            defaultSize: 'Single',
            toppings: ['Onion', 'Lettuce', 'Tomato', 'Cucumber', 'Cabbage', 'Pickles'], // Specified toppings
            sauces: ['Ketchup', 'Mayonnaise', 'BBQ Sauce', 'Garlic Mayo', 'Mint Sauce', 'Chilli Sauce', 'Relish', 'Sweet Chilli'] // Specified sauces
        },
        'chicken-burger': {
            name: 'Chicken Burger',
            type: 'burger',
            sizes: {
                'Single': 6.50 // Changed to Single size, adjusted price
            },
            defaultSize: 'Single',
            toppings: ['Onion', 'Lettuce', 'Tomato', 'Cucumber', 'Cabbage', 'Pickles'], // Specified toppings
            sauces: ['Ketchup', 'Mayonnaise', 'BBQ Sauce', 'Garlic Mayo', 'Mint Sauce', 'Chilli Sauce', 'Relish', 'Sweet Chilli'] // Specified sauces
        },
        'chips': {
            name: 'Chips',
            type: 'customizable-side',
            sizes: {
                'Small': 3.00,
                'Large': 4.50
            },
            defaultSize: 'Small',
            sauces: ['Ketchup', 'Mayonnaise', 'Chili Sauce', 'Garlic Sauce']
        },
        'cheesy-chips': {
            name: 'Cheesy Chips',
            type: 'customizable-side',
            sizes: {
                'Small': 4.00,
                'Large': 5.50
            },
            defaultSize: 'Small',
            sauces: ['Ketchup', 'Mayonnaise', 'Chili Sauce', 'Garlic Sauce']
        },
        'onion-rings': {
            name: 'Onion Rings',
            type: 'customizable-side',
            sizes: {
                '6 Pcs': 3.50,
                '10 Pcs': 5.00
            },
            defaultSize: '6 Pcs',
            sauces: ['Ketchup', 'BBQ Sauce']
        },
        'chicken-nuggets': {
            name: 'Chicken Nuggets',
            type: 'customizable-side',
            sizes: {
                '6 Pcs': 4.00,
                '9 Pcs': 5.50
            },
            defaultSize: '6 Pcs',
            sauces: ['Ketchup', 'BBQ Sauce', 'Sweet Chilli']
        },
        'coca-cola': { name: 'Coca Cola', type: 'drink', price: 1.50 },
        'pepsi': { name: 'Pepsi', type: 'drink', price: 1.50 },
        'sprite': { name: 'Sprite', type: 'drink', price: 1.50 },
        'fanta': { name: 'Fanta', type: 'drink', price: 1.50 },
        'water': { name: 'Water', type: 'drink', price: 1.00 }
    };

    function openKebabCustomizationModal(itemId) {
        currentItem = itemDetails[itemId];
        if (!currentItem) {
            showMessageModal('Error', 'Item details not found.', 'error');
            return;
        }

        modalKebabName.textContent = currentItem.name;
        modalQuantityInput.value = 1;
        modalKebabNotes.value = '';

        // Reset checkboxes and radio buttons
        modalKebabToppings.innerHTML = '';
        modalKebabSauces.innerHTML = '';
        modalKebabSizes.innerHTML = '';

        // Show/hide sections based on item type
        document.getElementById('modalSizeSection').style.display = currentItem.sizes ? 'block' : 'none';
        document.getElementById('modalToppingsSection').style.display = (currentItem.type === 'kebab' || currentItem.type === 'burger') ? 'block' : 'none';
        document.getElementById('modalSaucesSection').style.display = (currentItem.type === 'kebab' || currentItem.type === 'customizable-side' || currentItem.type === 'burger') ? 'block' : 'none';

        // Populate sizes if available
        if (currentItem.sizes) {
            for (const size in currentItem.sizes) {
                const price = currentItem.sizes[size];
                const label = document.createElement('label');
                label.innerHTML = `<input type="radio" name="kebabSize" value="${size}" data-price="${price}"> <span>${size} - £${price.toFixed(2)}</span>`;
                modalKebabSizes.appendChild(label);
            }
            // Select default size
            const defaultSizeRadio = modalKebabSizes.querySelector(`input[value="${currentItem.defaultSize}"]`);
            if (defaultSizeRadio) {
                defaultSizeRadio.checked = true;
            } else {
                // Fallback to the first available size if default is not found
                const firstRadio = modalKebabSizes.querySelector('input[type="radio"]');
                if (firstRadio) firstRadio.checked = true;
            }
        }

        // Populate toppings for kebabs AND burgers
        if ((currentItem.type === 'kebab' || currentItem.type === 'burger') && currentItem.toppings) {
            currentItem.toppings.forEach(topping => {
                const label = document.createElement('label');
                label.innerHTML = `<input type="checkbox" value="${topping}"> ${topping}`;
                modalKebabToppings.appendChild(label);
            });
        }

        // Populate sauces for kebabs, customizable sides, AND burgers
        if ((currentItem.type === 'kebab' || currentItem.type === 'customizable-side' || currentItem.type === 'burger') && currentItem.sauces) {
            currentItem.sauces.forEach(sauce => {
                const label = document.createElement('label');
                label.innerHTML = `<input type="checkbox" value="${sauce}"> ${sauce}`;
                modalKebabSauces.appendChild(label);
            });
        }

        updateModalTotalPrice();
        kebabCustomizationModal.style.display = 'flex';
    }

    function updateModalTotalPrice() {
        let basePrice = 0;
        if (currentItem.sizes) { // Check if sizes exist for the item (kebabs, burgers, customizable-sides)
            const selectedSizeRadio = modalKebabSizes.querySelector('input[name="kebabSize"]:checked');
            if (selectedSizeRadio) {
                basePrice = parseFloat(selectedSizeRadio.dataset.price);
            }
        } else { // For simple drinks/sides
            basePrice = currentItem.price;
        }

        const quantity = parseInt(modalQuantityInput.value);
        const totalPrice = basePrice * quantity;
        modalCurrentPrice.textContent = totalPrice.toFixed(2);
    }

    // Event listeners for modal quantity and size changes
    modalQuantityMinus.addEventListener('click', () => {
        let quantity = parseInt(modalQuantityInput.value);
        if (quantity > 1) {
            modalQuantityInput.value = quantity - 1;
            updateModalTotalPrice();
        }
    });

    modalQuantityPlus.addEventListener('click', () => {
        let quantity = parseInt(modalQuantityInput.value);
        modalQuantityInput.value = quantity + 1;
        updateModalTotalPrice();
    });

    modalQuantityInput.addEventListener('input', () => {
        // Ensure quantity is at least 1
        if (parseInt(modalQuantityInput.value) < 1 || isNaN(parseInt(modalQuantityInput.value))) {
            modalQuantityInput.value = 1;
        }
        updateModalTotalPrice();
    });

    modalKebabSizes.addEventListener('change', updateModalTotalPrice);

    // Close kebab customization modal
    kebabModalClose.addEventListener('click', () => {
        kebabCustomizationModal.style.display = 'none';
    });

    kebabCustomizationModal.addEventListener('click', (e) => {
        if (e.target === kebabCustomizationModal) {
            kebabCustomizationModal.style.display = 'none';
        }
    });

    // Event listeners for opening customization modal
    document.querySelectorAll('.add-to-cart-modal-trigger-button').forEach(button => {
        button.addEventListener('click', function() {
            const itemId = this.dataset.itemId;
            const itemType = this.dataset.itemType; // This will now include 'burger'

            if (itemType === 'kebab' || itemType === 'customizable-side' || itemType === 'burger') {
                openKebabCustomizationModal(itemId);
            } else { // For simple drinks/sides, add directly to cart
                const item = itemDetails[itemId];
                if (item) {
                    addToCart({
                        id: itemId,
                        name: item.name,
                        price: item.price,
                        quantity: 1,
                        customizations: {} // No customizations for simple items
                    });
                    showMessageModal('Item Added!', `${item.name} has been added to your cart.`, 'success');
                }
            }
        });
    });


    // Add to Cart from Kebab Customization Modal
    modalAddToCartButton.addEventListener('click', () => {
        if (!currentItem) return;

        const quantity = parseInt(modalQuantityInput.value);
        if (quantity < 1) {
            showMessageModal('Quantity Error', 'Please enter a quantity of at least 1.', 'warning');
            return;
        }

        let selectedPrice = 0;
        let selectedSize = '';
        const selectedSizeRadio = modalKebabSizes.querySelector('input[name="kebabSize"]:checked');
        if (selectedSizeRadio) {
            selectedSize = selectedSizeRadio.value;
            selectedPrice = parseFloat(selectedSizeRadio.dataset.price);
        } else if (currentItem.price) { // For non-customizable items with a fixed price
            selectedPrice = currentItem.price;
            selectedSize = 'Standard'; // Assign a default size for fixed-price items without explicit sizes
        } else {
            showMessageModal('Error', 'Please select a size for your item.', 'warning');
            return;
        }

        const customizations = {};
        // Apply toppings logic for both kebabs AND burgers
        if ((currentItem.type === 'kebab' || currentItem.type === 'burger') && currentItem.toppings) {
            const selectedToppings = Array.from(modalKebabToppings.querySelectorAll('input[type="checkbox"]:checked'))
                                         .map(cb => cb.value);
            if (selectedToppings.length > 0) {
                customizations.toppings = selectedToppings;
            }
        }

        // Apply sauces logic for kebabs, customizable sides, AND burgers
        if ((currentItem.type === 'kebab' || currentItem.type === 'customizable-side' || currentItem.type === 'burger') && currentItem.sauces) {
            const selectedSauces = Array.from(modalKebabSauces.querySelectorAll('input[type="checkbox"]:checked'))
                                        .map(cb => cb.value);
            if (selectedSauces.length > 0) {
                customizations.sauces = selectedSauces;
            }
        }

        const notes = modalKebabNotes.value.trim();
        if (notes) {
            customizations.notes = notes;
        }

        addToCart({
            id: currentItem.id, // Use currentItem.id directly or pass it from the trigger button
            name: currentItem.name,
            size: selectedSize,
            price: selectedPrice,
            quantity: quantity,
            customizations: customizations
        });

        kebabCustomizationModal.style.display = 'none';
        showMessageModal('Item Added!', `${quantity} x ${currentItem.name} (${selectedSize}) added to cart!`, 'success');
    });


    // --- CART MANAGEMENT ---
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cartItems');
    const totalPriceSpan = document.getElementById('totalPrice');
    const orderSummaryInput = document.getElementById('orderSummary');

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function renderCart() {
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<li style="color: #666; text-align: center; padding: 10px;">Your cart is empty.</li>';
        } else {
            cart.forEach((item, index) => {
                const li = document.createElement('li');
                li.className = 'cart-item-row';
                let itemText = `${item.quantity} x ${item.name}`;
                if (item.size && item.size !== 'Standard') { // Only show size if it's not 'Standard'
                    itemText += ` (${item.size})`;
                }
                itemText += ` - £${(item.price * item.quantity).toFixed(2)}`;

                let customizationDetails = '';
                if (item.customizations) {
                    if (item.customizations.toppings && item.customizations.toppings.length > 0) {
                        // Changed "Toppings" to "Salads/Toppings" for generality
                        customizationDetails += `Salads/Toppings: ${item.customizations.toppings.join(', ')}. `;
                    }
                    if (item.customizations.sauces && item.customizations.sauces.length > 0) {
                        customizationDetails += `Sauces: ${item.customizations.sauces.join(', ')}. `;
                    }
                    if (item.customizations.notes) {
                        customizationDetails += `Notes: ${item.customizations.notes}.`;
                    }
                }

                li.innerHTML = `
                    <div class="cart-item-info">
                        <span class="item-name">${itemText}</span>
                        ${customizationDetails ? `<p class="item-customizations">${customizationDetails}</p>` : ''}
                    </div>
                    <button type="button" class="remove-item-button" data-index="${index}"><i class="fas fa-trash-alt"></i></button>
                `;
                cartItemsContainer.appendChild(li);
            });
        }
        updateCartTotal();
        saveCart();
    }

    function addToCart(item) {
        // Check if item is already in cart with same customizations (for merging)
        const existingItemIndex = cart.findIndex(cartItem =>
            cartItem.id === item.id &&
            cartItem.size === item.size &&
            JSON.stringify(cartItem.customizations) === JSON.stringify(item.customizations)
        );

        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += item.quantity;
        } else {
            cart.push(item);
        }
        renderCart();
    }

    function removeFromCart(index) {
        cart.splice(index, 1);
        renderCart();
    }

    function updateCartTotal() {
        let total = 0;
        let orderSummaryText = '';
        cart.forEach(item => {
            total += item.price * item.quantity;
            let itemSummary = `${item.quantity}x ${item.name}`;
            if (item.size && item.size !== 'Standard') itemSummary += ` (${item.size})`; // Only add size if not 'Standard'
            if (item.customizations) {
                if (item.customizations.toppings && item.customizations.toppings.length > 0) {
                    itemSummary += ` [Salads/Toppings: ${item.customizations.toppings.join(', ')}]`; // Updated label
                }
                if (item.customizations.sauces && item.customizations.sauces.length > 0) {
                    itemSummary += ` [Sauces: ${item.customizations.sauces.join(', ')}]`;
                }
                if (item.customizations.notes) {
                    itemSummary += ` [Notes: ${item.customizations.notes}]`;
                }
            }
            orderSummaryText += itemSummary + '; ';
        });
        totalPriceSpan.textContent = total.toFixed(2);
        orderSummaryInput.value = orderSummaryText.trim(); // Update hidden input for form submission
        updateFreebieBanner(total); // Update freebie banner based on total
    }

    // Event listener for removing items from cart
    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-item-button') || e.target.closest('.remove-item-button')) {
            const button = e.target.closest('.remove-item-button');
            const index = parseInt(button.dataset.index);
            removeFromCart(index);
            showMessageModal('Item Removed', 'The item has been removed from your cart.', 'info');
        }
    });

    // Clear Cart Button
    document.getElementById('clearCartBtn').addEventListener('click', () => {
        if (cart.length > 0) {
            cart = [];
            renderCart();
            showMessageModal('Cart Cleared', 'Your shopping cart has been emptied.', 'info');
        } else {
            showMessageModal('Empty Cart', 'Your cart is already empty!', 'warning');
        }
    });

    // Initial render of the cart when the page loads
    document.addEventListener('DOMContentLoaded', renderCart);


    // --- FORM SUBMISSION & STRIPE INTEGRATION ---
    const paymentToggle = document.getElementById('paymentToggle');
    const payWithCardBtn = document.getElementById('payWithCardBtn');
    const placeOrderBtn = orderForm.querySelector('button[type="submit"]');

    // Toggle visibility of Pay with Card button based on payment method
    paymentToggle.addEventListener('change', function() {
        if (this.value === 'card') {
            payWithCardBtn.style.display = 'block';
            placeOrderBtn.style.display = 'none'; // Hide Place Order
        } else {
            payWithCardBtn.style.display = 'none';
            placeOrderBtn.style.display = 'block'; // Show Place Order
        }
    });

    // Initial state based on default selected option
    if (paymentToggle.value === 'card') {
        payWithCardBtn.style.display = 'block';
        placeOrderBtn.style.display = 'none';
    } else {
        payWithCardBtn.style.display = 'none';
        placeOrderBtn.style.display = 'block';
    }


    // Handle 'Pay with Card' button click
    payWithCardBtn.addEventListener('click', async () => {
        if (cart.length === 0) {
            showMessageModal('Empty Cart', 'Your cart is empty. Please add items before paying.', 'warning');
            return;
        }

        const totalAmount = parseFloat(totalPriceSpan.textContent) * 100; // Convert to cents
        if (isNaN(totalAmount) || totalAmount <= 0) {
            showMessageModal('Payment Error', 'Invalid total amount for payment.', 'error');
            return;
        }

        // Collect customer details
        const fullName = orderForm.querySelector('input[name="Full Name"]').value;
        const email = orderForm.querySelector('input[name="Email"]').value;
        const mobileNumber = orderForm.querySelector('input[name="Mobile Number"]').value;
        const deliveryAddress = orderForm.querySelector('textarea[name="Delivery Address"]').value;

        if (!fullName || !email || !mobileNumber || !deliveryAddress) {
            showMessageModal('Missing Details', 'Please fill in all your contact and delivery details before proceeding with payment.', 'warning');
            return;
        }

        // Create a Checkout Session on your server
        try {
            const response = await fetch('https://lubo-kebab-app-1.onrender.com/create-checkout-session', { // Use your Render backend URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: cart.map(item => ({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        size: item.size,
                        customizations: item.customizations
                    })),
                    total: totalAmount.toFixed(0) // Stripe expects integer cents
                }),
            });

            const session = await response.json();

            if (session.error) {
                showMessageModal('Payment Error', `Error: ${session.error}`, 'error');
            } else if (session.id) {
                // Redirect to Stripe Checkout
                const result = await stripe.redirectToCheckout({
                    sessionId: session.id,
                });

                if (result.error) {
                    showMessageModal('Payment Error', `Stripe Checkout Error: ${result.error.message}`, 'error');
                }
            } else {
                showMessageModal('Payment Error', 'Failed to create Stripe Checkout session.', 'error');
            }
        } catch (error) {
            console.error('Error during Stripe checkout:', error);
            showMessageModal('Payment Error', 'An unexpected error occurred during payment processing.', 'error');
        }
    });


    // Handle 'Place Order' button click (for cash on delivery)
    orderForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        if (cart.length === 0) {
            showMessageModal('Empty Cart', 'Your cart is empty. Please add items before placing an order.', 'warning');
            return;
        }

        const paymentMethod = paymentToggle.value;

        if (paymentMethod === 'cash') {
            // Process cash on delivery order
            showMessageModal('Order Placed!', 'Your cash on delivery order has been placed. Thank you!', 'success');
            cart = []; // Clear cart after order
            renderCart();
            orderForm.reset(); // Clear form fields
            document.getElementById('confirmationMessage').style.display = 'block';
            setTimeout(() => {
                document.getElementById('confirmationMessage').style.display = 'none';
            }, 5000);
        } else {
            // If card is selected, the 'Pay with Card' button should be used
            // This 'submit' listener should ideally not be triggered for card payments
            showMessageModal('Payment Required', 'Please use the "Pay with Card" button for card payments, or select "Cash on Delivery".', 'warning');
        }
    });


    // --- SIDEBAR NAVIGATION ---
    document.querySelectorAll('.sidebar-nav-item').forEach(item => {
        item.addEventListener('click', function() {
            // Remove 'active' from all sidebar items
            document.querySelectorAll('.sidebar-nav-item').forEach(navItem => {
                navItem.classList.remove('active');
            });

            // Add 'active' to the clicked item
            this.classList.add('active');

            // Hide all menu sections
            document.querySelectorAll('.menu-section').forEach(section => {
                section.classList.add('hidden-menu-section');
            });

            // Show the target section
            const targetId = this.dataset.target;
            document.getElementById(targetId).classList.remove('hidden-menu-section');
        });
    });

    // Set default active section on load (Kebabs)
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelector('.sidebar-nav-item[data-target="kebabs-section"]').click();
    });


    // Logout Button functionality
    document.getElementById('logoutBtn').addEventListener('click', () => {
        // Clear login status from localStorage
        localStorage.removeItem('isLoggedIn');
        // Redirect to login page
        window.location.href = 'https://lubo-kebab-app-1.onrender.com/login.html';
    });

}); // End of DOMContentLoaded

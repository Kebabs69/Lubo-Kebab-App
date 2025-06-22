<!DOCTYPE html>

<html lang="en">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1" name="viewport"/>
<title>
   Lubo's Kebab
  </title>
<link href="https://fonts.googleapis.com/css2?family=Ubuntu+Mono&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" xintegrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==" crossorigin="anonymous" referrerpolicy="no-referrer" />
<style>
   /* General Reset & Base Styles */
   * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    :root {
      --primary-color: #d2691e; /* Earthy orange/brown for branding */
      --accent-color: #ffc107; /* Yellow for highlights */
      --text-color: #333;
      --light-bg: #fdf5e6; /* Light cream background */
      --dark-bg: #2c3e50; /* Darker background for contrast */
      --border-color: #e3e3e3;
      --box-shadow: 0 4px 20px rgba(0,0,0,0.07);
      --border-radius: 12px;
    }

    body {
      font-family: 'Inter', sans-serif;
      background: url('/assets/kebab-b.jpg') no-repeat center center/cover fixed;
      padding: 0 10px;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      color: var(--text-color);
    }

    header, footer {
      background-color: var(--primary-color);
      color: white;
      padding: 20px;
      text-align: center;
    }

    #top {
      font-size: 46px;
      color: red;
    }

    #top1 {
      font-size: 21px;
      color: black;
    }

    #navbar {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0px;
      margin: 0px 0;
      background-color: var(--primary-color);
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }

    #navbar img {
      width: 150px;
      margin-top: -10px;
      margin-bottom: 5px;
    }

    #navcontent {
      display: flex;
      gap: 20px;
      list-style: none;
      padding-bottom: 10px;
      flex-wrap: wrap;
      justify-content: center;
    }

    #navcontent a {
      text-decoration: none;
      color: white;
      padding: 8px 15px;
      border-radius: 20px;
      transition: background-color 0.3s ease, transform 0.2s ease;
      font-weight: 600;
    }

    #navcontent a:hover {
      background-color: var(--accent-color);
      transform: translateY(-2px);
      color: var(--text-color);
    }
    /* Style for the new logout button */
    #logoutBtn {
        text-decoration: none;
        color: white;
        padding: 8px 15px;
        border-radius: 20px;
        transition: background-color 0.3s ease, transform 0.2s ease;
        font-weight: 600;
        cursor: pointer;
        border: none;
        background: none;
        font-family: 'Inter', sans-serif;
    }
    #logoutBtn:hover {
        background-color: var(--accent-color);
        transform: translateY(-2px);
        color: var(--text-color);
    }


    #container1 {
      text-align: center;
      padding: 50px 0;
    }

    .btn {
      margin-top: 15px;
      padding: 10px 20px;
      border: 3px solid white;
      border-radius: 15px;
      background-color: yellow;
      font-size: 20px;
      font-weight: bold;
      cursor: pointer;
    }

    .btn:hover {
      background-color: red;
    }

    form {
      max-width: 900px;
      margin: 40px auto;
      background: #fff;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }

    .wrapper {
      display: flex;
      flex-wrap: wrap;
      gap: 30px;
      justify-content: center;
      align-items: flex-start;
    }

    .container {
      flex: 1;
      min-width: 280px;
      border: 1px solid #e3e3e3;
      border-radius: 16px;
      padding: 25px;
      background-color: #ffffff;
      box-shadow: 0 4px 20px rgba(0,0,0,0.07);
    }

    /* Styles for images integrated directly into containers */
    .container img {
        max-width: 100%;
        height: auto;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        margin: 15px 0;
    }


    label, input, textarea, select {
      display: block;
      width: 100%;
      margin: 10px 0;
    }

    input[type="checkbox"] {
      width: auto;
      display: inline-block;
      margin-right: 10px;
    }

    p.total {
      font-weight: bold;
      font-size: 18px;
      text-align: right;
    }

    /* Styles for the new Preview Button */
    .preview-btn {
        background-color: #4CAF50;
        color: white;
        padding: 5px 10px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
        margin-left: 10px;
        transition: background-color 0.3s ease;
    }
    .preview-btn:hover {
        background-color: #45a049;
    }

    /* Styles for the Modal (Image Popup) */
    .image-modal-overlay {
        display: none;
        position: fixed;
        z-index: 10000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgba(0,0,0,0.8);
        justify-content: center;
        align-items: center;
        backdrop-filter: blur(5px);
    }

    .image-modal-content {
        background-color: #fefefe;
        margin: auto;
        padding: 20px;
        border: 1px solid #888;
        border-radius: 12px;
        width: 80%;
        max-width: 700px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        position: relative;
        text-align: center;
    }

    .image-modal-content img {
        max-width: 100%;
        height: auto;
        display: block;
        margin: 0 auto 15px auto;
        border-radius: 8px;
    }

    .image-modal-content h4 {
        margin-bottom: 10px;
        color: var(--primary-color);
        font-size: 1.5em;
    }

    .image-modal-close {
        color: #aaa;
        position: absolute;
        top: 10px;
        right: 20px;
        font-size: 32px;
        font-weight: bold;
        cursor: pointer;
    }

    .image-modal-close:hover,
    .image-modal-close:focus {
        color: #000;
        text-decoration: none;
        cursor: pointer;
    }


    #container4 {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin: 40px;
    }

    #container4 > div {
      height: 360px;
      display: flex;
      justify-content: center;
      align-items: flex-end;
      background-size: cover;
      border-radius: 15px;
      border: 2px solid black;
    }

    #row4 { background-image: url('https://media.geeksforgeeks.org/wp-content/uploads/20240711123258/jpeg-optimizer_various-meals-western-food-platter-dark-background.jpg'); }
    #row5 { background-image: url('https://media.geeksforgeeks.org/wp-content/uploads/20240711123257/jpeg-optimizer_2151182491.jpg'); }
    #row6 { background-image: url('https://media.geeksforgeeks.org/wp-content/uploads/20240711123255/jpeg-optimizer_4744.jpg'); }

    #freebie-banner {
      background-color: #ffdd57;
      color: #333;
      font-size: 20px;
      font-weight: bold;
      text-align: center;
      padding: 15px;
      border-radius: 12px;
      margin: 20px 0;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      animation: pop-in 0.8s ease-out;
    }

    @keyframes pop-in {
      from { transform: scale(0.8); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }

    #liveClock {
      position: fixed;
      top: 10px;
      right: 15px;
      background-color: #fff3cd;
      color: #333;
      padding: 8px 14px;
      border-radius: 12px;
      font-weight: bold;
      font-size: 18px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      z-index: 9999;
    }

    /* --- NEW TESTIMONIALS SECTION STYLES --- */
    #testimonials-section {
        background-color: var(--light-bg);
        padding: 50px 20px;
        margin: 40px auto;
        max-width: 1000px;
        border-radius: var(--border-radius);
        box-shadow: var(--box-shadow);
        text-align: center;
        border: 1px solid var(--border-color);
    }

    #testimonials-section h2 {
        font-family: 'Roboto', sans-serif;
        font-size: 2.5em;
        color: var(--primary-color);
        margin-bottom: 40px;
        position: relative;
        display: inline-block;
    }

    #testimonials-section h2::after {
        content: '';
        display: block;
        width: 80px;
        height: 4px;
        background-color: var(--accent-color);
        margin: 10px auto 0;
        border-radius: 2px;
    }

    .testimonials-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 30px;
        padding-top: 20px;
    }

    .testimonial-card {
        background-color: #fff;
        padding: 25px;
        border-radius: var(--border-radius);
        box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        text-align: left;
        border: 1px solid #f0f0f0;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .testimonial-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 8px 20px rgba(0,0,0,0.1);
    }

    .testimonial-card .stars {
        color: var(--accent-color);
        margin-bottom: 15px;
        font-size: 1.2em;
    }

    .testimonial-card p {
        font-style: italic;
        color: #555;
        line-height: 1.6;
        margin-bottom: 15px;
    }

    .testimonial-card .reviewer-name {
        font-weight: 600;
        color: var(--primary-color);
        font-size: 1.1em;
    }
    /* --- END NEW TESTIMONIALS SECTION STYLES --- */
    
input[type="text"], input[type="email"], input[type="tel"], input[type="number"], textarea, select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 16px;
  background: #f9f9f9;
}

/* Kebab Item Styling (Outer Border) */
.kebab-item {
    background-color: #ffffff;
    border: 1px solid black;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 25px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.07);
    position: relative;
}

/* New: Add button that triggers the modal for kebabs */
.add-to-cart-modal-trigger-button {
    position: absolute;
    top: 15px;
    right: 15px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 50%;
    width: 38px;
    height: 38px;
    font-size: 1.5em;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    transition: background-color 0.2s ease, transform 0.2s ease;
    z-index: 5;
}
.add-to-cart-modal-trigger-button:hover {
    background-color: #218838;
    transform: scale(1.05);
}
.add-to-cart-modal-trigger-button:active {
    transform: scale(0.95);
}


/* Styles for the new Preview Button */
.preview-btn {
    background-color: #4CAF50;
    color: white;
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    margin-left: 10px;
    transition: background-color 0.3s ease;
    margin-top: 5px;
}
.preview-btn:hover {
    background-color: #45a049;
}


/* Customization Options for each kebab (within the modal) */
.kebab-item .customization-options {
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 15px;
    margin-top: 15px;
    box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);
    margin-bottom: 0;
}

.kebab-item .customization-options h5 {
    font-size: 1em;
    margin-bottom: 10px;
    color: #555;
    border-bottom: 1px dashed #eee;
    padding-bottom: 5px;
}

.kebab-item .customization-options .checkbox-group {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 10px;
}

.kebab-item .customization-options .checkbox-group label {
    display: flex;
    align-items: center;
    width: auto;
    margin: 0;
    font-size: 0.9em;
    color: #444;
}

.kebab-item .customization-options .checkbox-group input[type="checkbox"] {
    margin-right: 5px;
    width: auto;
}

.kebab-item .customization-options textarea {
    min-height: 60px;
    resize: vertical;
    font-size: 0.9em;
    padding: 8px;
    border-radius: 6px;
}


/* Styles for the old item-selection-row structure (Drinks & Sides) */
.item-selection-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0;
    border-top: 1px dashed #eee;
}
.item-selection-row:first-of-type {
    border-top: none;
}

.item-name-price {
    flex-grow: 1;
    font-size: 1.05em;
    font-weight: 500;
    color: var(--text-color);
}
.item-name-price span.price {
    font-weight: 600;
    color: var(--primary-color);
    margin-left: 8px;
}

.item-quantity-control {
    display: flex;
    align-items: center;
    gap: 10px;
}
.item-quantity-control input[type="number"] {
    width: 60px;
    padding: 6px 8px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    font-size: 0.95em;
    text-align: center;
    background-color: var(--light-bg);
    -moz-appearance: textfield;
}
/* Hide Chrome, Safari, Edge, Opera stepper arrows */
.item-quantity-control input[type="number"]::-webkit-outer-spin-button,
.item-quantity-control input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.add-to-cart-button {
    background-color: #28a745;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1em;
    font-weight: 600;
    transition: background-color 0.2s ease, transform 0.1s ease;
}
.add-to-cart-button:hover {
    background-color: #218838;
    transform: translateY(-1px);
}
.add-to-cart-button:active {
    transform: translateY(0);
}


/* Clear Cart Button Styling */
#clearCartBtn {
    display: block;
    width: 100%;
    margin-top: 15px;
    padding: 12px 20px;
    background-color: #e74c3c;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1em;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
    box-shadow: 0 3px 6px rgba(0,0,0,0.1);
}
#clearCartBtn:hover {
    background-color: #c0392b;
    transform: translateY(-2px);
}
#clearCartBtn:active {
    transform: translateY(0);
}

/* Styles for cart items and remove button */
.cart-item-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 10px 0;
    border-bottom: 1px dashed #eee;
}

.cart-item-row:last-of-type {
    border-bottom: none;
}

.cart-item-info {
    flex-grow: 1;
    margin-right: 10px;
    font-size: 0.95em;
    color: var(--text-color);
}

.cart-item-info .item-name {
    font-weight: 600;
    color: var(--primary-color);
}

.cart-item-info .item-customizations {
    font-size: 0.85em;
    color: #666;
    margin-top: 5px;
    line-height: 1.4;
}

.remove-item-button {
    background: none;
    border: none;
    color: #e74c3c;
    font-size: 1.2em;
    cursor: pointer;
    padding: 5px;
    transition: color 0.2s ease, transform 0.2s ease;
    flex-shrink: 0;
}
.remove-item-button:hover {
    color: #c0392b;
    transform: scale(1.1);
}
/* --- NEW KEBAB CUSTOMIZATION MODAL STYLES --- */
#kebabCustomizationModal {
    display: none;
    position: fixed;
    z-index: 10002;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0,0,0,0.85);
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(8px);
}
.kebab-modal-content {
    background-color: #fefefe;
    margin: auto;
    padding: 30px;
    border-radius: 15px;
    width: 90%;
    max-width: 600px;
    box-shadow: 0 8px 25px rgba(0,0,0,0.4);
    position: relative;
    animation: fadeInScale 0.3s ease-out;
    display: flex;
    flex-direction: column;
    gap: 20px;
}
@keyframes fadeInScale {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
}
.kebab-modal-close {
    color: #aaa;
    position: absolute;
    top: 15px;
    right: 20px;
    font-size: 30px;
    font-weight: bold;
    cursor: pointer;
    transition: color 0.3s ease;
}
.kebab-modal-close:hover {
    color: var(--primary-color);
}
.kebab-modal-title {
    font-family: 'Roboto', sans-serif;
    font-size: 2em;
    color: var(--primary-color);
    text-align: center;
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 2px solid var(--border-color);
}
.modal-section {
    background-color: var(--light-bg);
    padding: 20px;
    border-radius: 10px;
    border: 1px solid #ddd;
    box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);
}
.modal-section h4 {
    font-size: 1.3em;
    color: var(--dark-bg);
    margin-bottom: 15px;
    border-bottom: 1px dashed #ccc;
    padding-bottom: 8px;
}
.modal-checkbox-group, .modal-radio-group {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
}
.modal-checkbox-group label, .modal-radio-group label {
    display: flex;
    align-items: center;
    cursor: pointer;
    width: auto;
    font-size: 0.95em;
    color: #444;
}
.modal-checkbox-group input[type="checkbox"], .modal-radio-group input[type="radio"] {
    margin-right: 8px;
    width: auto;
    transform: scale(1.2);
    cursor: pointer;
}
/* Specific styling for radio buttons to look like selectable cards */
.modal-radio-group label {
    background-color: #fff;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 10px 15px;
    transition: all 0.2s ease;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.modal-radio-group label:hover {
    border-color: var(--accent-color);
    box-shadow: 0 0 0 2px rgba(255, 193, 7, 0.3);
}
.modal-radio-group input[type="radio"]:checked + span {
    font-weight: bold;
    color: var(--primary-color);
}

/* New layout for categories and products */
.main-content {
    display: flex;
    gap: 20px; /* Space between category navigation and product display */
    padding: 20px 10px;
    max-width: 1200px; /* Adjust as needed */
    margin: 20px auto; /* Center the main content */
    background-color: rgba(255, 255, 255, 0.9); /* Slightly transparent white background */
    border-radius: 15px;
    box-shadow: var(--box-shadow);
}

.category-navigation {
    flex: 0 0 200px; /* Fixed width for category navigation */
    padding: 20px;
    background-color: #f8f8f8; /* Light background for categories */
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    align-self: flex-start; /* Align to the top */
}

.category-navigation h3 {
    font-family: 'Roboto', sans-serif;
    color: var(--primary-color);
    margin-bottom: 20px;
    font-size: 1.5em;
    text-align: center;
}

.category-navigation ul {
    list-style: none;
    padding: 0;
}

.category-navigation li {
    margin-bottom: 10px;
}

.category-navigation button {
    width: 100%;
    padding: 12px 15px;
    background-color: #fff;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    text-align: left;
    font-size: 1.1em;
    color: var(--text-color);
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease, border-color 0.3s ease;
    font-weight: 500;
}

.category-navigation button:hover {
    background-color: var(--light-bg);
    border-color: var(--primary-color);
    transform: translateX(5px);
}

.category-navigation button.active {
    background-color: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
    font-weight: 700;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.product-display-area {
    flex-grow: 1; /* Takes up remaining space */
    padding: 20px;
    background-color: #fefefe;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); /* 3 items per row, responsive */
    gap: 30px;
}

/* Responsive adjustments */
@media (max-width: 992px) {
    .main-content {
        flex-direction: column; /* Stack categories and products vertically */
    }
    .category-navigation {
        flex: none; /* Remove fixed width */
        width: 100%; /* Full width for categories */
        margin-bottom: 20px;
    }
    .category-navigation ul {
        display: flex; /* Arrange categories horizontally */
        flex-wrap: wrap;
        justify-content: center;
        gap: 10px; /* Space between horizontal category buttons */
    }
    .category-navigation li {
        margin-bottom: 0; /* Remove vertical margin */
    }
    .category-navigation button {
        width: auto; /* Allow buttons to size based on content */
        min-width: 120px; /* Ensure a minimum width for buttons */
        text-align: center;
    }
}

@media (max-width: 768px) {
    #navbar img {
        width: 120px;
    }
    #navcontent {
        gap: 10px;
    }
    #navcontent a, #logoutBtn {
        padding: 6px 12px;
        font-size: 0.9em;
    }
    .main-content {
        padding: 15px;
        margin: 15px auto;
    }
    .category-navigation {
        padding: 15px;
    }
    .category-navigation h3 {
        font-size: 1.3em;
        margin-bottom: 15px;
    }
    .category-navigation button {
        padding: 10px 12px;
        font-size: 1em;
    }
    .product-display-area {
        padding: 15px;
    }
    .product-grid {
        gap: 20px;
    }
    .kebab-item {
        padding: 15px;
    }
    .add-to-cart-modal-trigger-button {
        width: 34px;
        height: 34px;
        font-size: 1.3em;
    }
}

@media (max-width: 480px) {
    body {
        padding: 0 5px;
    }
    header, footer {
        padding: 15px;
    }
    #top {
        font-size: 36px;
    }
    #top1 {
        font-size: 18px;
    }
    #navbar img {
        width: 100px;
    }
    #navcontent {
        flex-direction: column;
        align-items: stretch;
    }
    #navcontent a, #logoutBtn {
        text-align: center;
        width: 100%;
        margin-bottom: 5px;
    }
    .main-content {
        padding: 10px;
        margin: 10px auto;
        flex-direction: column;
    }
    .category-navigation ul {
        flex-direction: column;
    }
    .category-navigation button {
        width: 100%;
    }
    .product-grid {
        grid-template-columns: 1fr; /* Single column on very small screens */
        gap: 15px;
    }
    .kebab-modal-content {
        padding: 20px;
        width: 95%;
    }
    .kebab-modal-title {
        font-size: 1.5em;
    }
    .modal-section {
        padding: 15px;
    }
    .modal-section h4 {
        font-size: 1.1em;
    }
    .modal-checkbox-group label, .modal-radio-group label {
        font-size: 0.9em;
        padding: 8px 10px;
    }
    .item-quantity-control input[type="number"] {
        width: 50px;
        font-size: 0.9em;
    }
    .add-to-cart-button {
        padding: 8px 12px;
        font-size: 0.9em;
    }
}

</style>
</head>
<body>
    <div id="liveClock"></div>

    <header>
        <div id="top">LUBO'S</div>
        <div id="top1">KEBAB & PIZZA</div>
    </header>

    <nav id="navbar">
        <img src="/assets/logo.png" alt="Logo">
        <ul id="navcontent">
            <li><a href="/index.html">Menu</a></li>
            <li><a href="#about-us">About Us</a></li>
            <li><a href="#contact-us">Contact Us</a></li>
            <li><a href="#" id="logoutBtn">Logout</a></li>
        </ul>
    </nav>

    <div id="freebie-banner">
        🎉 Get a FREE Drink with orders over £25! 🎉
    </div>

    <div class="main-content">
        <div class="category-navigation">
            <h3>Categories</h3>
            <ul id="categoryList">
                </ul>
        </div>

        <div class="product-display-area">
            <div id="productGrid" class="product-grid">
                </div>
        </div>
    </div>


    <form id="orderForm">
        <h2>Your Cart</h2>
        <div id="cartItems">
            <p>Your cart is empty.</p>
        </div>
        <p class="total">Total: £<span id="totalPrice">0.00</span></p>

        <button type="button" id="clearCartBtn">Clear Cart</button>

        <label for="customerName">Name:</label>
        <input type="text" id="customerName" required>

        <label for="customerEmail">Email:</label>
        <input type="email" id="customerEmail" required>

        <label for="customerAddress">Address:</label>
        <textarea id="customerAddress" rows="3" required></textarea>

        <label for="customerPhone">Phone Number:</label>
        <input type="tel" id="customerPhone" required>

        <div class="payment-options">
            <h4>Payment Options:</h4>
            <label>
                <input type="radio" name="paymentMethod" value="cash" checked> Cash on Delivery
            </label>
            <label>
                <input type="radio" name="paymentMethod" value="card" id="paymentToggle"> Pay with Card
            </label>
        </div>
        
        <button type="submit">Place Order</button>
        <button type="button" id="payWithCardBtn" style="display:none;">Pay with Card (Stripe)</button>
    </form>

    <section id="testimonials-section">
        <h2>What Our Customers Say</h2>
        <div class="testimonials-grid">
            <div class="testimonial-card">
                <div class="stars">★★★★★</div>
                <p>"Absolutely delicious kebabs every single time! The meat is perfectly cooked and the sauces are amazing."</p>
                <div class="reviewer-name">- John D.</div>
            </div>
            <div class="testimonial-card">
                <div class="stars">★★★★★</div>
                <p>"Lubo's pizza is a game-changer. Fresh ingredients and a perfect crust. Highly recommend the Pepperoni Feast!"</p>
                <div class="reviewer-name">- Sarah K.</div>
            </div>
            <div class="testimonial-card">
                <div class="stars">★★★★★</div>
                <p>"Fast delivery and consistently good food. My go-to for a quick and satisfying meal. The mixed kebab is a must-try!"</p>
                <div class="reviewer-name">- Mike T.</div>
            </div>
        </div>
    </section>

    <div id="imageModalOverlay" class="image-modal-overlay">
        <div class="image-modal-content">
            <span class="image-modal-close">&times;</span>
            <h4 id="modalImageTitle"></h4>
            <img id="modalImage" src="" alt="Preview Image">
        </div>
    </div>

    <div id="messageModalOverlay" class="image-modal-overlay"> <div class="message-modal-content image-modal-content"> <span class="message-modal-close image-modal-close">&times;</span>
            <h4 id="messageModalTitle"></h4>
            <p id="messageModalText"></p>
            <button id="messageModalCloseBtn" class="modal-add-to-cart-button" style="margin-top: 20px;">Close</button>
        </div>
    </div>

    <div id="kebabCustomizationModal" class="kebab-modal-overlay">
        <div class="kebab-modal-content">
            <span class="kebab-modal-close">&times;</span>
            <h3 id="modalKebabTitle" class="kebab-modal-title">Customize Your Kebab</h3>
            
            <input type="hidden" id="modalProductId">

            <div class="modal-section">
                <h4>Choose your size:</h4>
                <div id="modalSizeOptions" class="modal-radio-group">
                    </div>
            </div>

            <div class="modal-section">
                <h4>Select your bread:</h4>
                <div id="modalBreadOptions" class="modal-radio-group">
                    <label><input type="radio" name="modalBread" value="Pitta Bread" checked> <span>Pitta Bread</span></label>
                    <label><input type="radio" name="modalBread" value="Naan Bread"> <span>Naan Bread</span></label>
                    <label><input type="radio" name="modalBread" value="Wrap"> <span>Wrap</span></label>
                </div>
            </div>

            <div class="modal-section">
                <h4>Salad Options:</h4>
                <div id="modalSaladOptions" class="modal-checkbox-group">
                    <label><input type="checkbox" name="modalSalad" value="Lettuce" checked> Lettuce</label>
                    <label><input type="checkbox" name="modalSalad" value="Tomato" checked> Tomato</label>
                    <label><input type="checkbox" name="modalSalad" value="Onion" checked> Onion</label>
                    <label><input type="checkbox" name="modalSalad" value="Cucumber" checked> Cucumber</label>
                    <label><input type="checkbox" name="modalSalad" value="Red Cabbage"> Red Cabbage</label>
                    <label><input type="checkbox" name="modalSalad" value="Jalapenos"> Jalapenos</label>
                </div>
            </div>

            <div class="modal-section">
                <h4>Sauce Options:</h4>
                <div id="modalSauceOptions" class="modal-checkbox-group">
                    <label><input type="checkbox" name="modalSauce" value="Chilli Sauce" checked> Chilli Sauce</label>
                    <label><input type="checkbox" name="modalSauce" value="Garlic Sauce" checked> Garlic Sauce</label>
                    <label><input type="checkbox" name="modalSauce" value="Mayo"> Mayo</label>
                    <label><input type="checkbox" name="modalSauce" value="Ketchup"> Ketchup</label>
                    <label><input type="checkbox" name="modalSauce" value="Burger Sauce"> Burger Sauce</label>
                </div>
            </div>
            
            <div class="modal-section">
                <h4>Special Notes</h4>
                <textarea id="modalKebabNotes" class="item-notes" placeholder="e.g., 'Extra spicy', 'No tomato'"></textarea>
            </div>


            <div class="modal-quantity-control">
                <button id="modalQuantityMinus"><i class="fas fa-minus"></i></button>
                <input type="number" id="modalQuantityInput" value="1" min="1" max="99">
                <button id="modalQuantityPlus"><i class="fas fa-plus"></i></button>
            </div>

            <button id="modalAddToCartButton" class="modal-add-to-cart-button">
                Add to Cart - £<span id="modalCurrentPrice">0.00</span>
            </button>
        </div>
    </div>

<script src="https://js.stripe.com/v3/"></script>
<script>
    // IMPORTANT: PASTE YOUR ABSOLUTELY CORRECT pk_test_ KEY HERE!
    // This uses 'var' to ensure the 'stripe' object is globally accessible to index.js
    var stripe = Stripe('pk_test_51RUy79GgUCD1xOEWjVwuJ0g8JsDt1npUR5JVj1HRaIBgLLKPZAHFkmYQSPbHObEeYFqpInDUYiOUA043Tj2krv52004zHbr5wj'); // <-- REPLACE with your actual public key
</script>
<script src="/js/index.js?v=202406161400"></script> </body>
</html>
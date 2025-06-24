<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Canceled - Lubo's Kebab</title>
  <!-- Use consistent Inter font, and Oswald for headings -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&display=swap" rel="stylesheet">
  <!-- Font Awesome for the alert icon -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" xintegrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==" crossorigin="anonymous" referrerpolicy="no-referrer" />
  <style>
    /* Define consistent color variables */
    :root {
        --primary-color: #A32A29; /* Deep Red/Maroon for Kebab theme - professional */
        --secondary-color: #262626; /* Dark Grey for text and accents */
        --accent-color: #FFD700; /* Gold/Yellow for highlights */
        --light-bg: #F8F8F8; /* Very light grey for main backgrounds */
        --dark-bg: #1A1A1A; /* Dark background for footer/navbar contrast */
        --text-color-light: #F0F0F0; /* Light text for dark backgrounds */
        --text-color-dark: #333333; /* Dark text for light backgrounds */
        --border-color: #E0E0E0; /* Subtle light border */
        --shadow-light: 0 4px 15px rgba(0,0,0,0.08); /* Light, soft shadow */
        --shadow-strong: 0 8px 25px rgba(0,0,0,0.2); /* Stronger shadow for emphasis */
        --border-radius-card: 12px;
        --border-radius-button: 8px;
        --transition-speed: 0.3s ease;
    }

    body {
      font-family: 'Inter', sans-serif;
      text-align: center;
      background-color: #FFF2F2; /* Very light red background for a 'cancellation' feel */
      color: var(--text-color-dark);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
    }
    .cancel-container {
      background-color: #ffffff; /* Solid white background for the card */
      padding: 40px;
      border-radius: var(--border-radius-card);
      box-shadow: var(--shadow-strong);
      max-width: 600px;
      width: 100%;
      border: 1px solid #E74C3C; /* Brighter red border to signify cancellation */
      animation: fadeInScaleUp var(--transition-speed);
    }

    @keyframes fadeInScaleUp {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
    }

    .logo-small {
        width: 120px; /* Consistent logo size */
        margin-bottom: 25px;
        animation: bounceIn 0.8s ease-out; /* Optional animation */
    }
    @keyframes bounceIn {
        0% { transform: scale(0.3); opacity: 0; }
        50% { transform: scale(1.05); opacity: 1; }
        70% { transform: scale(0.9); }
        100% { transform: scale(1); }
    }


    h1 {
      font-family: 'Oswald', sans-serif;
      font-size: 2.8em;
      margin-bottom: 25px;
      color: var(--primary-color);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 15px; /* Space between icon and text */
    }
    h1 .icon {
        color: #E74C3C; /* Bright red for cancellation icon */
        font-size: 1.2em; /* Make icon a bit larger than text */
        animation: alertPop 0.6s ease-out forwards;
    }
    @keyframes alertPop {
        0% { transform: scale(0); opacity: 0; }
        50% { transform: scale(1.1); opacity: 1; }
        100% { transform: scale(1); }
    }

    p {
      font-size: 1.05em; /* Consistent paragraph size */
      line-height: 1.7;
      margin-bottom: 20px;
      color: var(--secondary-color);
    }
    p:last-of-type {
        margin-bottom: 30px; /* Space before button */
    }

    a {
      display: inline-block;
      margin-top: 20px;
      padding: 14px 30px; /* Consistent button padding */
      font-size: 1.1em;
      font-weight: 600;
      text-decoration: none;
      background-color: var(--primary-color);
      color: white;
      border-radius: var(--border-radius-button);
      transition: background-color var(--transition-speed), transform var(--transition-speed), box-shadow var(--transition-speed);
      box-shadow: var(--shadow-light);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    a:hover {
      background-color: #8D2524; /* Darker shade on hover */
      transform: translateY(-2px);
      box-shadow: var(--shadow-strong);
    }
    a:active {
        transform: translateY(0);
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }

    /* Responsive Adjustments */
    @media (max-width: 600px) {
      .cancel-container {
        padding: 30px;
        margin: 0 15px;
      }
      .logo-small {
        width: 100px;
        margin-bottom: 20px;
      }
      h1 {
        font-size: 2em;
        gap: 10px;
      }
      h1 .icon {
        font-size: 1.1em;
      }
      p {
        font-size: 0.95em;
        margin-bottom: 15px;
      }
      p:last-of-type {
        margin-bottom: 25px;
      }
      a {
        padding: 12px 25px;
        font-size: 1em;
      }
    }
  </style>
</head>
<body>
  <div class="cancel-container">
    <img src="/assets/logo.png" alt="Lubo's Kebab Logo" class="logo-small">
    <h1>
      <span class="icon fas fa-times-circle"></span> Payment Canceled
    </h1>
    <p>Unfortunately, your payment could not be processed, or you decided to cancel the order.</p>
    <p>No charges have been made. You can try placing your order again, or choose cash on delivery.</p>
    <p>We apologize for any inconvenience!</p>
    <a href="/index.html">Back to Menu</a>
  </div>
</body>
</html>
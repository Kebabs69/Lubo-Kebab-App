// This script contains logic specific to the login.html page.
// It will handle the form submission and redirection after successful login.

// Get elements from the login form
const loginEmailInput = document.getElementById('loginEmail');
const loginPasswordInput = document.getElementById('loginPassword');
const loginSubmitBtn = document.getElementById('loginSubmitBtn');
const loginErrorMessage = document.getElementById('error-message'); // Assuming your error message element ID is 'error-message'
// Optional: Add a success message element if you want one for login
// const loginSuccessMessage = document.getElementById('success-message');

// console.log('login.js loaded.'); // Debug log removed

// Add event listener for the login button click
if (loginSubmitBtn) {
    // console.log('Login button element found. Attaching listener...'); // Debug log removed
    loginSubmitBtn.addEventListener('click', async (e) => {
        e.preventDefault(); // Prevent default form submission
        // console.log('Login button clicked!'); // Debug log removed

        const email = loginEmailInput.value;
        const password = loginPasswordInput.value;

        // Clear previous messages
        if (loginErrorMessage) loginErrorMessage.textContent = '';
        // if (loginSuccessMessage) loginSuccessMessage.textContent = '';

        // console.log('Attempting login for email:', email); // Debug log removed

        try {
            // Send login credentials to the server using absolute path
            const response = await fetch('https://lubo-kebab-app-1.onrender.com/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();
            // console.log('Server response:', result); // Debug log removed

            if (response.ok && result.success) {
                // Store login status in localStorage
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userEmail', email); // Optionally store email

                // Redirect to the main ordering page after successful login (absolute path)
                window.location.href = 'https://lubo-kebab-app-1.onrender.com/index.html';
            } else {
                // Display error message
                if (loginErrorMessage) {
                    loginErrorMessage.style.display = 'block';
                    loginErrorMessage.textContent = result.message || 'Invalid email or password. Please check your credentials.';
                }
            }
        } catch (error) {
            console.error('Error during login (frontend catch):', error); // Keep this one for error info
            if (loginErrorMessage) {
                loginErrorMessage.style.display = 'block';
                loginErrorMessage.textContent = 'Network error or unable to connect. Please try again.';
            }
        }
    });
} else {
    console.warn('Login button element not found in HTML. Check ID: loginSubmitBtn'); // Keep this warning
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


// === Opening Status Checker functionality (MOVED FROM INDEX.JS) ===
function checkOpenStatus() {
    const now = new Date();
    const day = now.getDay(); // 0 for Sunday, 1 for Monday, etc.
    const hour = now.getHours();
    const minute = now.getMinutes();
    const totalMinutes = hour * 60 + minute;

    // Define opening hours in minutes from midnight (e.g., 11:00 AM = 11*60 = 660)
    const schedule = {
        0: { open: 660, close: 1380 }, // Sunday 11:00 AM - 11:00 PM
        1: { open: 660, close: 1380 }, // Monday 11:00 AM - 11:00 PM
        2: { open: 660, close: 1380 }, // Tuesday 11:00 AM - 11:00 PM
        3: { open: 660, close: 1380 }, // Wednesday 11:00 AM - 11:00 PM
        4: { open: 660, close: 1380 }, // Thursday 11:00 AM - 11:00 PM
        5: { open: 660, close: 1560 }, // Friday 11:00 AM - 02:00 AM (next day) - 1560 is 26*60 (2AM next day)
        6: { open: 660, close: 1560 }  // Saturday 11:00 AM - 02:00 AM (next day)
    };

    const today = schedule[day];
    let isOpen = false;

    // Handle crossing midnight for Friday and Saturday (or any day where close time is numerically smaller than open)
    if (today.close < today.open) {
        // If current time is past open or before close (next day)
        isOpen = totalMinutes >= today.open || totalMinutes < today.close;
    } else {
        // Normal hours within a single day
        isOpen = totalMinutes >= today.open && totalMinutes < today.close;
    }

    const statusEl = document.getElementById('openStatus');
    if (statusEl) {
        if (isOpen) {
            statusEl.textContent = '✅ We are OPEN!';
            statusEl.style.color = 'green';
        } else {
            statusEl.textContent = '❌ Sorry, we\'re CLOSED.';
            statusEl.style.color = 'red';
        }
    } else {
        console.warn("Element with ID 'openStatus' not found on login page.");
    }
}

// Run the function immediately and then every minute
checkOpenStatus();
setInterval(checkOpenStatus, 60000); // Update every minute (60,000 milliseconds)

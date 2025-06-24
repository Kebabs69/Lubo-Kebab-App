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
            // Send login credentials to the server
            const response = await fetch('https://Lubo-Kebab-App-1.onrender.com/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            // console.log('Fetch response received. Status:', response.status); // Debug log removed

            const data = await response.json(); // Parse the JSON response from the server

            if (response.ok) { // Server responded with a success status (200-299)
                console.log('Login successful:', data.message); // Keep this one for general info
                // Optional: Set a flag in localStorage or session storage to indicate login
                localStorage.setItem('isLoggedIn', 'true'); // Set login flag
                
                // Redirect immediately after successful login
                window.location.href = 'https://Lubo-Kebab-App-1.onrender.com/index.html'; // Direct to absolute path
            } else { // Server responded with an error status (e.g., 400, 401, 500)
                console.error('Login failed:', data.message); // Keep this one for error info
                if (loginErrorMessage) {
                    loginErrorMessage.style.display = 'block';
                    loginErrorMessage.textContent = data.message || 'Login failed. Please check your credentials.';
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
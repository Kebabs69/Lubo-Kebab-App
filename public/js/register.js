// This script contains logic specific to the register.html page.
// It will handle the form submission and redirect after successful registration.

// Get elements from the register form
const registerEmailInput = document.getElementById('regEmail');
const registerPasswordInput = document.getElementById('regPassword');
const registerConfirmPasswordInput = document.getElementById('regConfirmPassword');
const registerSubmitBtn = document.getElementById('registerSubmitBtn');
const registrationErrorMessage = document.getElementById('error-message');
// Ensure you have an element with ID 'success-message' in your register.html for this to work
const registrationSuccessMessage = document.getElementById('success-message'); 

// Add event listener for the register button click
if (registerSubmitBtn) {
  registerSubmitBtn.addEventListener('click', async (e) => { 
    e.preventDefault(); // Prevent default form submission to handle it with fetch

    const email = registerEmailInput.value;
    const password = registerPasswordInput.value;
    const confirmPassword = registerConfirmPasswordInput.value;

    // Client-side password mismatch check
    if (password !== confirmPassword) {
      if (registrationErrorMessage) {
        registrationErrorMessage.style.display = 'block';
        registrationErrorMessage.textContent = 'Passwords do not match.'; 
      }
      if (registrationSuccessMessage) registrationSuccessMessage.textContent = ''; // Clear success message
      return; // Stop the function if passwords don't match
    } else {
      if (registrationErrorMessage) {
        registrationErrorMessage.style.display = 'none';
        registrationErrorMessage.textContent = ''; 
      }
    }

    try {
        // Send registration data to the server
        const response = await fetch('https://Lubo-Kebab-App-1.onrender.com/register', { // Absolute URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, confirmPassword }),
        });

        const data = await response.json(); // Parse the JSON response from the server

        if (response.ok) { // Server responded with a success status (200-299)
            console.log('Registration successful:', data.message);
            if (registrationErrorMessage) registrationErrorMessage.style.display = 'none'; // Clear error
            if (registrationSuccessMessage) registrationSuccessMessage.textContent = data.message || "Registration successful!"; // Display success message
            
            // Redirect to the login page after successful registration
            window.location.href = 'https://Lubo-Kebab-App-1.onrender.com/login.html'; // Absolute URL
            
            // Clear form fields after successful registration
            registerEmailInput.value = '';
            registerPasswordInput.value = '';
            registerConfirmPasswordInput.value = ''; 
        } else { // Server responded with an error status (e.g., 400, 500)
            console.error('Registration failed:', data.message);
            if (registrationErrorMessage) {
                registrationErrorMessage.style.display = 'block';
                registrationErrorMessage.textContent = data.message || 'An error occurred during registration. Please try again.';
            }
            if (registrationSuccessMessage) registrationSuccessMessage.textContent = ''; // Clear success message
        }
    } catch (error) {
        console.error('Error during registration:', error);
        if (registrationErrorMessage) {
            registrationErrorMessage.style.display = 'block';
            registrationErrorMessage.textContent = 'Network error or unable to connect to server. Please try again.';
        }
        if (registrationSuccessMessage) registrationSuccessMessage.textContent = ''; // Clear success message
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
setInterval(updateClock, 1000); 
updateClock(); 

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
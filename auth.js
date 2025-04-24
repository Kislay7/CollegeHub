// DOM Elements
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const loginModal = document.getElementById('login-modal');
const signupModal = document.getElementById('signup-modal');
const showSignup = document.getElementById('show-signup');
const showLogin = document.getElementById('show-login');
const closeBtns = document.querySelectorAll('.close-btn');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');

// Modal Functions
function openModal(modal) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Event Listeners
loginBtn.addEventListener('click', () => openModal(loginModal));
signupBtn.addEventListener('click', () => openModal(signupModal));

showSignup.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal(loginModal);
    openModal(signupModal);
});

showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal(signupModal);
    openModal(loginModal);
});

closeBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const modal = this.closest('.modal');
        closeModal(modal);
    });
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === loginModal) closeModal(loginModal);
    if (e.target === signupModal) closeModal(signupModal);
});

// Form Submission - Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Login attempt started');
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    console.log('Login credentials collected:', { email }); // Don't log password
    
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        console.log('Login successful:', user.email);
        handleSuccessfulAuth(user);
    } catch (error) {
        console.error('Login error:', error);
        handleAuthError(error);
    }
});

// Form Submission - Signup
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Signup attempt started');
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const college = document.getElementById('signup-college').value;
    const course = document.getElementById('signup-course').value;
    
    console.log('Signup data collected:', { name, email, college, course }); // Don't log password
    
    try {
        // Create user with email and password
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        console.log('User created successfully:', user.email);
        
        // Update user profile with display name
        await user.updateProfile({
            displayName: name
        });
        console.log('Profile updated with display name');
        
        // Store additional user data in localStorage
        const userData = {
            name,
            email,
            college,
            course,
            createdAt: new Date().toISOString()
        };
        localStorage.setItem(`user_${user.uid}`, JSON.stringify(userData));
        console.log('Additional user data stored');
        
        handleSuccessfulAuth(user);
    } catch (error) {
        console.error('Signup error:', error);
        handleAuthError(error);
    }
});

// Handle successful authentication
function handleSuccessfulAuth(user) {
    console.log('Handling successful auth for user:', user.email);
    
    closeModal(loginModal);
    closeModal(signupModal);
    
    // Update UI for logged in user
    loginBtn.innerHTML = `<a href="#"><i class="fas fa-user"></i> ${user.displayName || user.email.split('@')[0]}</a>`;
    signupBtn.style.display = 'none';
    
    // Show product management buttons
    const addProductBtn = document.getElementById('add-product-btn');
    const myProductsBtn = document.getElementById('my-products-btn');
    if (addProductBtn) addProductBtn.style.display = 'block';
    if (myProductsBtn) myProductsBtn.style.display = 'block';
    
    // Hide login message
    const loginMessage = document.getElementById('login-message');
    if (loginMessage) loginMessage.style.display = 'none';
    
    // Add logout option if it doesn't exist
    if (!document.getElementById('logout-btn')) {
        const logoutOption = document.createElement('li');
        logoutOption.id = 'logout-btn';
        logoutOption.innerHTML = '<a href="#">Logout</a>';
        document.querySelector('header nav ul').appendChild(logoutOption);
        
        // Add event listener for logout
        document.getElementById('logout-btn').addEventListener('click', logoutUser);
    }
}

// Handle authentication errors
function handleAuthError(error) {
    alert(`Authentication error: ${error.message}`);
}

// Logout User
async function logoutUser() {
    try {
        await auth.signOut();
        // Reset UI
        loginBtn.innerHTML = '<a href="#">Login</a>';
        signupBtn.style.display = 'block';
        
        // Show login message
        const loginMessage = document.getElementById('login-message');
        if (loginMessage) loginMessage.style.display = 'block';
        
        // Hide product management buttons
        const addProductBtn = document.getElementById('add-product-btn');
        const myProductsBtn = document.getElementById('my-products-btn');
        if (addProductBtn) addProductBtn.style.display = 'none';
        if (myProductsBtn) myProductsBtn.style.display = 'none';
        
        document.getElementById('logout-btn').remove();
        localStorage.removeItem('user');
        alert('You have been logged out successfully.');
    } catch (error) {
        alert(`Logout error: ${error.message}`);
    }
}

// Check for logged in user on page load
window.addEventListener('DOMContentLoaded', () => {
    // In a real app, you would check for an authentication token
    const isLoggedIn = false; // Change to true to simulate logged in state
    
    if (isLoggedIn) {
        simulateLogin('testuser@college.com');
    }
});

// User State Management (simplified)
let currentUser = null;

// In a real app, you would:
// 1. Store user data in localStorage or sessionStorage
// 2. Implement proper password hashing
// 3. Use JWT or session tokens for authentication
// 4. Have a backend API to handle user registration and login

// Add authentication state observer to handle the login message on page load
firebase.auth().onAuthStateChanged(function(user) {
    const loginMessage = document.getElementById('login-message');
    if (loginMessage) {
        if (user) {
            // User is signed in, hide the message
            loginMessage.style.display = 'none';
        } else {
            // No user is signed in, show the message
            loginMessage.style.display = 'block';
        }
    }
});

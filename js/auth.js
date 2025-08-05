// Authentication Utility Functions

// Check if user is logged in
function isAuthenticated() {
    return localStorage.getItem('userLoggedIn') === 'true';
}

// Redirect to login if not authenticated
function requireAuth(redirectTo = 'login.html') {
    if (!isAuthenticated()) {
        // Store the current URL to redirect back after login
        sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
        window.location.href = redirectTo;
        return false;
    }
    return true;
}

// Handle successful login
function handleSuccessfulLogin(email, rememberMe = false) {
    localStorage.setItem('userLoggedIn', 'true');
    localStorage.setItem('userEmail', email);
    
    if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
    } else {
        localStorage.removeItem('rememberMe');
    }
    
    // Redirect to the stored URL or home page
    const redirectUrl = sessionStorage.getItem('redirectAfterLogin') || 'index.html';
    sessionStorage.removeItem('redirectAfterLogin');
    window.location.href = redirectUrl;
}

// Log out the user
function logout() {
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userEmail');
    window.location.href = 'login.html';
}

// Get current user data
function getCurrentUser() {
    if (!isAuthenticated()) return null;
    
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : {
        email: localStorage.getItem('userEmail') || 'User',
        firstName: 'User'
    };
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show message function
function showMessage(message, type = 'info', element = null) {
    // If no specific element is provided, try to find a message container
    const container = element || document.querySelector('.message-container');
    if (!container) return;
    
    // Remove existing messages
    const existingMessages = container.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;
    
    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'message-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = () => messageDiv.remove();
    messageDiv.prepend(closeBtn);
    
    // Add to container
    container.prepend(messageDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// Initialize authentication
function initAuth() {
    // Check for remember me on page load
    if (localStorage.getItem('rememberMe') === 'true' && localStorage.getItem('userEmail')) {
        // Auto-login if remember me is checked
        if (!isAuthenticated()) {
            handleSuccessfulLogin(localStorage.getItem('userEmail'), true);
        }
    }
}

// Export functions
window.Auth = {
    isAuthenticated,
    requireAuth,
    handleSuccessfulLogin,
    logout,
    getCurrentUser,
    isValidEmail,
    showMessage,
    initAuth
};

// Initialize auth when script loads
document.addEventListener('DOMContentLoaded', initAuth);

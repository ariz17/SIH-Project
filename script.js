// DOM Elements
const hamburgerMenu = document.getElementById('hamburgerMenu');
const navLinks = document.getElementById('navLinks');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');
const rememberMe = document.getElementById('rememberMe');
const signupLink = document.getElementById('signupLink');
const loginLink = document.getElementById('loginLink');
const loginBox = document.getElementById('loginBox');
const signupBox = document.getElementById('signupBox');

// Hamburger Menu Toggle
hamburgerMenu.addEventListener('click', () => {
    hamburgerMenu.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close menu when clicking on nav links
navLinks.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
        hamburgerMenu.classList.remove('active');
        navLinks.classList.remove('active');
    }
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburgerMenu.contains(e.target) && !navLinks.contains(e.target)) {
        hamburgerMenu.classList.remove('active');
        navLinks.classList.remove('active');
    }
});

// Password Toggle Functionality
togglePassword.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    // Toggle eye icon
    togglePassword.classList.toggle('fa-eye');
    togglePassword.classList.toggle('fa-eye-slash');
});

// Login Form Handling
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Basic validation
    if (!username || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Show loading state
    const loginBtn = document.querySelector('.login-btn');
    const originalText = loginBtn.innerHTML;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating...';
    loginBtn.disabled = true;
    
    // Simulate authentication (replace with actual API call)
    setTimeout(() => {
        // Demo credentials for testing
        if (username === 'admin' && password === 'admin123') {
            showNotification('Login successful! Redirecting to dashboard...', 'success');
            
            // Save remember me preference
            if (rememberMe.checked) {
                localStorage.setItem('rememberUser', username);
            }
            
            // Redirect to selection page
            setTimeout(() => {
                window.location.href = 'selection.html';
            }, 2000);
        } else {
            showNotification('Invalid credentials. Please try again.', 'error');
            loginBtn.innerHTML = originalText;
            loginBtn.disabled = false;
        }
    }, 2000);
});

// Signup Form Toggle
signupLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginBox.style.display = 'none';
    signupBox.style.display = 'block';
});

loginLink.addEventListener('click', (e) => {
    e.preventDefault();
    signupBox.style.display = 'none';
    loginBox.style.display = 'block';
});

// Signup Form Handling
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('signupName').value,
        email: document.getElementById('signupEmail').value,
        department: document.getElementById('signupDepartment').value,
        role: document.getElementById('signupRole').value,
        employeeId: document.getElementById('signupEmployeeId').value,
        reason: document.getElementById('signupReason').value
    };
    
    // Show loading state
    const submitBtn = signupForm.querySelector('.login-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting Request...';
    submitBtn.disabled = true;
    
    // Simulate request submission
    setTimeout(() => {
        // Store pending request (in real app, send to server)
        const pendingRequests = JSON.parse(localStorage.getItem('pendingRequests') || '[]');
        pendingRequests.push({
            ...formData,
            id: Date.now(),
            status: 'pending',
            submittedAt: new Date().toISOString()
        });
        localStorage.setItem('pendingRequests', JSON.stringify(pendingRequests));
        
        showNotification('Access request submitted successfully! Admin will review your request.', 'success');
        
        // Reset form and switch back to login
        signupForm.reset();
        setTimeout(() => {
            signupBox.style.display = 'none';
            loginBox.style.display = 'block';
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }, 2000);
});

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        removeNotification(notification);
    }, 5000);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        removeNotification(notification);
    });
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}

function removeNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Load saved username if remember me was checked
window.addEventListener('load', () => {
    const savedUsername = localStorage.getItem('rememberUser');
    if (savedUsername) {
        document.getElementById('username').value = savedUsername;
        rememberMe.checked = true;
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});




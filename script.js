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
            
            // Redirect to dashboard (replace with actual dashboard URL)
            setTimeout(() => {
                window.location.href = 'dashboard.html';
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

// Add floating animation to feature cards
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
        }
    });
}, observerOptions);

// Observe feature cards
document.addEventListener('DOMContentLoaded', () => {
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
        observer.observe(card);
    });
});

// Input focus effects
document.querySelectorAll('.input-group input').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
        if (!this.value) {
            this.parentElement.classList.remove('focused');
        }
    });
});

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .notification {
        position: fixed;
        top: 100px;
        right: 20px;
        background: white;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: all 0.3s ease;
        max-width: 400px;
        border-left: 4px solid #667eea;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification-success {
        border-left-color: #4ade80;
    }
    
    .notification-error {
        border-left-color: #ef4444;
    }
    
    .notification-warning {
        border-left-color: #f59e0b;
    }
    
    .notification-content {
        padding: 1rem 1.5rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .notification-content i:first-child {
        font-size: 1.2rem;
    }
    
    .notification-success .notification-content i:first-child {
        color: #4ade80;
    }
    
    .notification-error .notification-content i:first-child {
        color: #ef4444;
    }
    
    .notification-warning .notification-content i:first-child {
        color: #f59e0b;
    }
    
    .notification-content span {
        flex: 1;
        font-size: 0.9rem;
        color: #333;
    }
    
    .notification-close {
        background: none;
        border: none;
        cursor: pointer;
        color: #999;
        font-size: 0.9rem;
        padding: 0.25rem;
        border-radius: 4px;
        transition: all 0.2s ease;
    }
    
    .notification-close:hover {
        background: #f5f5f5;
        color: #666;
    }
    
    .input-group.focused i {
        color: #667eea;
        transform: scale(1.1);
    }
    
    .feature-card {
        opacity: 0;
    }
`;
document.head.appendChild(style);

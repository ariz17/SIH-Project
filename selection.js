// Selection page functionality

// Navigate to dashboard
function startWithBlank() {
    window.location.href = 'dashboard.html';
}

// Show import modal
function showImportModal() {
    const modal = document.getElementById('importModal');
    modal.classList.add('show');
}

// Close import modal
function closeImportModal() {
    const modal = document.getElementById('importModal');
    modal.classList.remove('show');
    clearFile();
}

// Handle file upload
function handleFileUpload(input) {
    const file = input.files[0];
    if (file) {
        // Validate file type
        const allowedTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
        if (!allowedTypes.includes(file.type)) {
            alert('Please select a valid Excel file (.xlsx or .xls)');
            input.value = '';
            return;
        }

        // Validate file size (10MB limit)
        const maxSize = 10 * 1024 * 1024; // 10MB in bytes
        if (file.size > maxSize) {
            alert('File size must be less than 10MB');
            input.value = '';
            return;
        }

        // Show selected file
        const selectedFile = document.getElementById('selectedFile');
        const fileName = selectedFile.querySelector('.file-name');
        const importBtn = document.getElementById('importBtn');
        
        fileName.textContent = file.name;
        selectedFile.style.display = 'flex';
        importBtn.disabled = false;
        
        // Hide upload area
        const uploadArea = document.querySelector('.file-upload-area');
        uploadArea.style.display = 'none';
    }
}

// Clear selected file
function clearFile() {
    const fileInput = document.getElementById('fileInput');
    const selectedFile = document.getElementById('selectedFile');
    const importBtn = document.getElementById('importBtn');
    const uploadArea = document.querySelector('.file-upload-area');
    
    fileInput.value = '';
    selectedFile.style.display = 'none';
    importBtn.disabled = true;
    uploadArea.style.display = 'block';
}

// Download template
function downloadTemplate() {
    // Create a sample Excel template data
    const templateData = [
        ['Day', 'Time', 'Subject', 'Faculty', 'Room', 'Batch'],
        ['Monday', '9:00-10:00', 'Data Structures', 'Dr. Smith', 'A-101', 'CSE-A'],
        ['Monday', '10:00-11:00', 'Algorithms', 'Dr. Johnson', 'A-102', 'CSE-A'],
        ['Tuesday', '9:00-10:00', 'Database Systems', 'Prof. Brown', 'B-201', 'CSE-A'],
        ['Tuesday', '10:00-11:00', 'Computer Networks', 'Dr. Wilson', 'B-202', 'CSE-A'],
        ['Wednesday', '9:00-10:00', 'Operating Systems', 'Dr. Davis', 'A-103', 'CSE-A']
    ];

    // Convert to CSV format (simpler than Excel)
    const csvContent = templateData.map(row => row.join(',')).join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Timetable_Template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    // Show notification
    showNotification('Template downloaded successfully!', 'success');
}

// Process import
function processImport() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Please select a file first');
        return;
    }
    
    // Show loading state
    const importBtn = document.getElementById('importBtn');
    const originalText = importBtn.innerHTML;
    importBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    importBtn.disabled = true;
    
    // Simulate file processing
    setTimeout(() => {
        showNotification('File imported successfully! Redirecting to timetable builder...', 'success');
        
        // Redirect to timetable builder with import flag
        setTimeout(() => {
            window.location.href = 'timetable-builder.html?import=true';
        }, 2000);
    }, 3000);
}

// Notification system
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

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('importModal');
    if (e.target === modal) {
        closeImportModal();
    }
});


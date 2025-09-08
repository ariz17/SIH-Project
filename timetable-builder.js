// Timetable Builder JavaScript

let currentSection = 'basic';
let subjects = [];
let faculty = [];
let rooms = [];
let subjectCounter = 0;
let facultyCounter = 0;
let roomCounter = 0;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeTimetableGrid();
    updateCounts();
    
    // Check if imported from Excel
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('import') === 'true') {
        showNotification('Excel file imported successfully! You can now review and modify the data.', 'success');
    }
});

// Navigation functionality
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            if (section) {
                switchSection(section);
            }
        });
    });
}

function switchSection(sectionName) {
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
    
    // Update content sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionName).classList.add('active');
    
    // Update header
    updateHeader(sectionName);
    currentSection = sectionName;
    
    // Update generate button state
    updateGenerateButton();
}

function updateHeader(sectionName) {
    const titles = {
        'basic': 'Department & Semester',
        'subjects': 'Subjects Configuration',
        'faculty': 'Faculty Assignment',
        'rooms': 'Room Configuration',
        'constraints': 'Scheduling Constraints',
        'preview': 'Timetable Preview'
    };
    
    const descriptions = {
        'basic': 'Set up basic information for your timetable',
        'subjects': 'Add and configure subjects for the timetable',
        'faculty': 'Assign faculty members to subjects',
        'rooms': 'Configure available rooms and their capacities',
        'constraints': 'Set scheduling rules and constraints',
        'preview': 'Preview and generate your timetable'
    };
    
    document.getElementById('pageTitle').textContent = titles[sectionName];
    document.getElementById('pageDescription').textContent = descriptions[sectionName];
}

// Subject management
function addSubject() {
    subjectCounter++;
    const subjectId = `subject_${subjectCounter}`;
    
    const subjectItem = document.createElement('div');
    subjectItem.className = 'subject-item';
    subjectItem.id = subjectId;
    
    subjectItem.innerHTML = `
        <div class="item-header">
            <div class="item-title">Subject ${subjectCounter}</div>
            <div class="item-actions">
                <button class="btn-small btn-edit" onclick="editSubject('${subjectId}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-small btn-delete" onclick="deleteSubject('${subjectId}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        <div class="item-form">
            <div class="form-group">
                <label>Subject Name</label>
                <input type="text" placeholder="e.g., Data Structures" required>
            </div>
            <div class="form-group">
                <label>Subject Code</label>
                <input type="text" placeholder="e.g., CS301" required>
            </div>
            <div class="form-group">
                <label>Type</label>
                <select required>
                    <option value="">Select Type</option>
                    <option value="theory">Theory</option>
                    <option value="practical">Practical</option>
                    <option value="tutorial">Tutorial</option>
                </select>
            </div>
            <div class="form-group">
                <label>Classes per Week</label>
                <input type="number" min="1" max="7" value="3" required>
            </div>
            <div class="form-group">
                <label>Credits</label>
                <input type="number" min="1" max="6" value="3" required>
            </div>
            <div class="form-group">
                <label>Duration (minutes)</label>
                <select required>
                    <option value="60" selected>60 minutes</option>
                    <option value="90">90 minutes</option>
                    <option value="120">120 minutes</option>
                </select>
            </div>
        </div>
    `;
    
    document.getElementById('subjectsList').appendChild(subjectItem);
    subjects.push({ id: subjectId, data: {} });
    updateCounts();
}

function deleteSubject(subjectId) {
    if (confirm('Are you sure you want to delete this subject?')) {
        document.getElementById(subjectId).remove();
        subjects = subjects.filter(s => s.id !== subjectId);
        updateCounts();
    }
}

// Faculty management
function addFaculty() {
    facultyCounter++;
    const facultyId = `faculty_${facultyCounter}`;
    
    const facultyItem = document.createElement('div');
    facultyItem.className = 'faculty-item';
    facultyItem.id = facultyId;
    
    facultyItem.innerHTML = `
        <div class="item-header">
            <div class="item-title">Faculty ${facultyCounter}</div>
            <div class="item-actions">
                <button class="btn-small btn-edit" onclick="editFaculty('${facultyId}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-small btn-delete" onclick="deleteFaculty('${facultyId}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        <div class="item-form">
            <div class="form-group">
                <label>Faculty Name</label>
                <input type="text" placeholder="e.g., Dr. John Smith" required>
            </div>
            <div class="form-group">
                <label>Employee ID</label>
                <input type="text" placeholder="e.g., EMP001" required>
            </div>
            <div class="form-group">
                <label>Department</label>
                <select required>
                    <option value="">Select Department</option>
                    <option value="CSE">Computer Science</option>
                    <option value="ECE">Electronics & Communication</option>
                    <option value="EEE">Electrical & Electronics</option>
                    <option value="ME">Mechanical</option>
                    <option value="CE">Civil</option>
                </select>
            </div>
            <div class="form-group">
                <label>Designation</label>
                <select required>
                    <option value="">Select Designation</option>
                    <option value="professor">Professor</option>
                    <option value="associate">Associate Professor</option>
                    <option value="assistant">Assistant Professor</option>
                    <option value="lecturer">Lecturer</option>
                </select>
            </div>
            <div class="form-group">
                <label>Max Classes/Day</label>
                <input type="number" min="1" max="8" value="4" required>
            </div>
            <div class="form-group">
                <label>Subjects</label>
                <select multiple>
                    <option value="ds">Data Structures</option>
                    <option value="algo">Algorithms</option>
                    <option value="db">Database Systems</option>
                </select>
            </div>
        </div>
    `;
    
    document.getElementById('facultyList').appendChild(facultyItem);
    faculty.push({ id: facultyId, data: {} });
    updateCounts();
}

function deleteFaculty(facultyId) {
    if (confirm('Are you sure you want to delete this faculty member?')) {
        document.getElementById(facultyId).remove();
        faculty = faculty.filter(f => f.id !== facultyId);
        updateCounts();
    }
}

// Room management
function addRoom() {
    roomCounter++;
    const roomId = `room_${roomCounter}`;
    
    const roomItem = document.createElement('div');
    roomItem.className = 'room-item';
    roomItem.id = roomId;
    
    roomItem.innerHTML = `
        <div class="item-header">
            <div class="item-title">Room ${roomCounter}</div>
            <div class="item-actions">
                <button class="btn-small btn-edit" onclick="editRoom('${roomId}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-small btn-delete" onclick="deleteRoom('${roomId}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        <div class="item-form">
            <div class="form-group">
                <label>Room Number</label>
                <input type="text" placeholder="e.g., A-101" required>
            </div>
            <div class="form-group">
                <label>Building</label>
                <select required>
                    <option value="">Select Building</option>
                    <option value="A">Block A</option>
                    <option value="B">Block B</option>
                    <option value="C">Block C</option>
                    <option value="LAB">Lab Block</option>
                </select>
            </div>
            <div class="form-group">
                <label>Type</label>
                <select required>
                    <option value="">Select Type</option>
                    <option value="classroom">Classroom</option>
                    <option value="lab">Laboratory</option>
                    <option value="seminar">Seminar Hall</option>
                    <option value="auditorium">Auditorium</option>
                </select>
            </div>
            <div class="form-group">
                <label>Capacity</label>
                <input type="number" min="10" max="500" placeholder="e.g., 60" required>
            </div>
            <div class="form-group">
                <label>Equipment</label>
                <select multiple>
                    <option value="projector">Projector</option>
                    <option value="computers">Computers</option>
                    <option value="whiteboard">Whiteboard</option>
                    <option value="ac">Air Conditioning</option>
                </select>
            </div>
        </div>
    `;
    
    document.getElementById('roomsList').appendChild(roomItem);
    rooms.push({ id: roomId, data: {} });
    updateCounts();
}

function deleteRoom(roomId) {
    if (confirm('Are you sure you want to delete this room?')) {
        document.getElementById(roomId).remove();
        rooms = rooms.filter(r => r.id !== roomId);
        updateCounts();
    }
}

// Update counts in navigation
function updateCounts() {
    document.getElementById('subjectCount').textContent = subjects.length;
    document.getElementById('facultyCount').textContent = faculty.length;
    document.getElementById('roomCount').textContent = rooms.length;
}

// Initialize timetable grid
function initializeTimetableGrid() {
    const tbody = document.getElementById('timetableBody');
    const timeSlots = [
        '9:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-1:00',
        '1:00-2:00', '2:00-3:00', '3:00-4:00', '4:00-5:00'
    ];
    
    timeSlots.forEach(time => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="time-slot">${time}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        `;
        tbody.appendChild(row);
    });
}

// Generate timetable
function generateTimetable() {
    const generateBtn = document.getElementById('generateBtn') || document.querySelector('.btn-generate');
    const originalText = generateBtn.innerHTML;
    
    // Show loading state
    generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    generateBtn.disabled = true;
    
    // Simulate timetable generation
    setTimeout(() => {
        populateSampleTimetable();
        showNotification('Timetable generated successfully!', 'success');
        
        // Switch to preview section
        switchSection('preview');
        
        // Reset button
        generateBtn.innerHTML = originalText;
        generateBtn.disabled = false;
    }, 3000);
}

// Populate sample timetable
function populateSampleTimetable() {
    const sampleClasses = [
        { subject: 'Data Structures', faculty: 'Dr. Smith', room: 'A-101' },
        { subject: 'Algorithms', faculty: 'Prof. Johnson', room: 'A-102' },
        { subject: 'Database Systems', faculty: 'Dr. Brown', room: 'B-201' },
        { subject: 'Computer Networks', faculty: 'Prof. Wilson', room: 'B-202' },
        { subject: 'Operating Systems', faculty: 'Dr. Davis', room: 'A-103' }
    ];
    
    const tbody = document.getElementById('timetableBody');
    const rows = tbody.querySelectorAll('tr');
    
    // Clear existing content
    rows.forEach(row => {
        const cells = row.querySelectorAll('td:not(.time-slot)');
        cells.forEach(cell => cell.innerHTML = '');
    });
    
    // Populate with sample data
    let classIndex = 0;
    for (let i = 0; i < Math.min(rows.length, 6); i++) {
        const row = rows[i];
        const cells = row.querySelectorAll('td:not(.time-slot)');
        
        for (let j = 0; j < Math.min(cells.length, 5); j++) {
            if (Math.random() > 0.3 && classIndex < sampleClasses.length) {
                const classData = sampleClasses[classIndex % sampleClasses.length];
                cells[j].innerHTML = `
                    <div class="class-slot">
                        <div class="subject">${classData.subject}</div>
                        <div class="faculty">${classData.faculty}</div>
                        <div class="room">${classData.room}</div>
                    </div>
                `;
                classIndex++;
            }
        }
    }
}

// Update generate button state
function updateGenerateButton() {
    const generateBtn = document.querySelector('.btn-generate');
    const hasBasicInfo = document.getElementById('department').value && document.getElementById('semester').value;
    const hasSubjects = subjects.length > 0;
    const hasFaculty = faculty.length > 0;
    const hasRooms = rooms.length > 0;
    
    if (hasBasicInfo && hasSubjects && hasFaculty && hasRooms) {
        generateBtn.disabled = false;
    } else {
        generateBtn.disabled = true;
    }
}

// Save draft functionality
function saveDraft() {
    const draftData = {
        basic: {
            department: document.getElementById('department').value,
            semester: document.getElementById('semester').value,
            batches: document.getElementById('batches').value,
            maxClasses: document.getElementById('maxClasses').value,
            startTime: document.getElementById('startTime').value,
            classDuration: document.getElementById('classDuration').value
        },
        subjects: subjects,
        faculty: faculty,
        rooms: rooms,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('timetableDraft', JSON.stringify(draftData));
    showNotification('Draft saved successfully!', 'success');
}

// Load draft on page load
function loadDraft() {
    const draft = localStorage.getItem('timetableDraft');
    if (draft) {
        const data = JSON.parse(draft);
        
        // Load basic info
        if (data.basic) {
            Object.keys(data.basic).forEach(key => {
                const element = document.getElementById(key);
                if (element) element.value = data.basic[key];
            });
        }
        
        // Load subjects, faculty, rooms
        subjects = data.subjects || [];
        faculty = data.faculty || [];
        rooms = data.rooms || [];
        
        updateCounts();
        updateGenerateButton();
    }
}

// Sidebar toggle for mobile
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('open');
}

// Notification system
function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
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
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        removeNotification(notification);
    }, 5000);
    
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

// Add form change listeners
document.addEventListener('DOMContentLoaded', function() {
    const basicForm = document.querySelector('.basic-form');
    if (basicForm) {
        basicForm.addEventListener('change', updateGenerateButton);
    }
    
    // Load draft if available
    loadDraft();
});


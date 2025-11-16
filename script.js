// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// FAQ Accordion functionality
document.addEventListener('DOMContentLoaded', () => {
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling; // The .accordion-content div
            const isActive = header.classList.toggle('active');

            if (isActive) {
                content.style.maxHeight = content.scrollHeight + 'px';
                content.style.paddingTop = '10px';
                content.style.paddingBottom = '20px';
            } else {
                content.style.maxHeight = null;
                content.style.paddingTop = '0';
                content.style.paddingBottom = '0';
            }
        });
    });

    // Login/Logout functionality
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const welcomeMessage = document.getElementById('welcome-message');
    const receiptsSection = document.getElementById('receipts');
    const receiptsNavLink = document.getElementById('receipts-nav-link');
    const bookAppointmentBtn = document.querySelector('.book-appointment-btn'); // Main header button

    // Function to update UI based on login status
    function updateLoginUI() {
        const username = localStorage.getItem('medicareUsername');
        if (username) {
            welcomeMessage.textContent = `Welcome, ${username}!`;
            welcomeMessage.style.display = 'inline-block';
            loginBtn.style.display = 'none';
            logoutBtn.style.display = 'inline-block';
            receiptsSection.style.display = 'block'; // Show receipts section
            receiptsNavLink.style.display = 'inline-block'; // Show receipts nav link
            bookAppointmentBtn.style.display = 'inline-block'; // Ensure it's visible
        } else {
            welcomeMessage.style.display = 'none';
            loginBtn.style.display = 'inline-block';
            logoutBtn.style.display = 'none';
            receiptsSection.style.display = 'none'; // Hide receipts section
            receiptsNavLink.style.display = 'none'; // Hide receipts nav link
            bookAppointmentBtn.style.display = 'inline-block'; // Ensure it's visible
        }
    }

    // Handle Login
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        let username = prompt('Please enter your name:');
        if (username && username.trim() !== '') {
            username = username.trim();
            localStorage.setItem('medicareUsername', username);
            updateLoginUI();
            alert(`Logged in as ${username}`);
        } else if (username !== null) {
            alert('Name cannot be empty.');
        }
    });

    // Handle Logout
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('medicareUsername');
        updateLoginUI();
        alert('You have been logged out.');
    });

    // Handle Appointment Form Submission
    const appointmentForm = document.getElementById('appointment-form');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(appointmentForm);
            const appointmentDetails = Object.fromEntries(formData.entries());

            // Basic validation
            if (!appointmentDetails.patientName || !appointmentDetails.patientEmail || !appointmentDetails.doctor || !appointmentDetails.appointmentDate || !appointmentDetails.appointmentTime || !appointmentDetails.reason) {
                alert('Please fill in all required fields for the appointment.');
                return;
            }

            // In a real application, you would send this data to a server
            console.log('Appointment Booked:', appointmentDetails);
            alert(`Appointment booked successfully!\n\nDetails:\nPatient: ${appointmentDetails.patientName}\nDoctor: ${appointmentDetails.doctor}\nDate: ${appointmentDetails.appointmentDate}\nTime: ${appointmentDetails.appointmentTime}\nReason: ${appointmentDetails.reason}`);

            appointmentForm.reset(); // Clear the form
            // Optionally, redirect to a confirmation page or the receipts section
            // window.location.hash = '#receipts';
        });
    }

    // Handle Contact Form Submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const contactDetails = Object.fromEntries(formData.entries());

            // Basic validation
            if (!contactDetails.name || !contactDetails.email || !contactDetails.subject || !contactDetails.message) {
                alert('Please fill in all required fields for the contact form.');
                return;
            }

            // In a real application, you would send this data to a server
            console.log('Contact Form Submitted:', contactDetails);
            alert(`Thank you for your message, ${contactDetails.name}! We will get back to you shortly.`);

            contactForm.reset(); // Clear the form
        });
    }

    // AI Symptom Checker Logic
    const symptomsInput = document.getElementById('symptoms-input');
    const analyzeSymptomsBtn = document.getElementById('analyze-symptoms-btn');
    const aiResponseBox = document.getElementById('ai-response');
    const aiDiagnosisText = document.getElementById('ai-diagnosis-text');

    if (analyzeSymptomsBtn) {
        analyzeSymptomsBtn.addEventListener('click', () => {
            const symptoms = symptomsInput.value.toLowerCase();
            let response = "Based on your description, your symptoms are general. Please consider booking a general consultation for a proper diagnosis.";

            if (symptoms.includes('fever') && symptoms.includes('cough') && symptoms.includes('sore throat')) {
                response = "Your symptoms suggest a common cold or flu. Rest, hydrate, and consider an online general consultation if symptoms persist or worsen.";
            } else if (symptoms.includes('headache') && symptoms.includes('nausea')) {
                response = "These symptoms could indicate various conditions, including migraines or digestive issues. A general consultation is recommended.";
            } else if (symptoms.includes('rash') || symptoms.includes('itchy skin')) {
                response = "Skin irritation or rash. You might benefit from a consultation with a dermatologist.";
            } else if (symptoms.includes('anxiety') || symptoms.includes('stress') || symptoms.includes('depressed')) {
                response = "It sounds like you're experiencing mental health concerns. We recommend booking a consultation with a mental health professional for support.";
            } else if (symptoms.includes('child') || symptoms.includes('baby') || symptoms.includes('pediatric')) {
                response = "For symptoms related to children, a pediatrician would be the most appropriate specialist.";
            }

            aiDiagnosisText.textContent = response;
            aiResponseBox.style.display = 'block';
        });
    }

    // AI Doctor Suggestion Logic for Appointment Form
    const reasonForVisitTextarea = document.getElementById('reason');
    const doctorSuggestionElement = document.getElementById('doctor-suggestion');
    const suggestedDoctorTypeElement = document.getElementById('suggested-doctor-type');
    const doctorSelect = document.getElementById('doctor-select');

    if (reasonForVisitTextarea) {
        reasonForVisitTextarea.addEventListener('input', () => {
            const reason = reasonForVisitTextarea.value.toLowerCase();
            let suggestedDoctor = '';

            if (reason.includes('skin') || reason.includes('rash') || reason.includes('acne')) {
                suggestedDoctor = 'Dermatologist';
            } else if (reason.includes('child') || reason.includes('baby') || reason.includes('pediatric')) {
                suggestedDoctor = 'Pediatrician';
            } else if (reason.includes('heart') || reason.includes('chest pain')) {
                suggestedDoctor = 'Cardiologist';
            } else if (reason.includes('cold') || reason.includes('flu') || reason.includes('fever') || reason.includes('general checkup')) {
                suggestedDoctor = 'General Practitioner';
            } else if (reason.includes('anxiety') || reason.includes('stress') || reason.includes('depressed')) {
                suggestedDoctor = 'Mental Health Professional'; // Not in dropdown, but good suggestion
            }

            if (suggestedDoctor) {
                suggestedDoctorTypeElement.textContent = suggestedDoctor;
                doctorSuggestionElement.style.display = 'flex'; // Use flex to align icon and text
            } else {
                doctorSuggestionElement.style.display = 'none';
            }
        });
    }

    // Initial UI update on page load
    updateLoginUI();
});

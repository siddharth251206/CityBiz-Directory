let formElement = document.getElementById("business-form");
const user = JSON.parse(localStorage.getItem('user'));

if (!user) {
    // Not logged in
    alert('You must be logged in to access this page.');
    window.location.href = '/login';
} else if (user.role !== 'owner') {
    // Logged in, but NOT an owner
    alert('Access Denied: Only Business Owners can add a new business.');
    
    // Send them to their appropriate dashboard
    if (user.role === 'admin') {
        window.location.href = '/admin';
    } else {
        window.location.href = '/';
    }
}

// Helper function for image size validation
function checkSize(input) {
  if (input.files[0].size > 100 * 1024) {
    alert("Please upload an image under 100KB.");
    input.value = "";
  }
}

// Add the submit event listener
formElement.addEventListener("submit", async (e) => {
 const submitBtn = formElement.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting...';

  // 1. Get auth token
  const token = localStorage.getItem('token');
  if (!token) {
    alert('You must be logged in to add a business.');
    window.location.href = '/login';
    return;
  }

  // 2. NEW: Use FormData to send the file and text
  // This automatically handles 'multipart/form-data'
  const formData = new FormData(e.target);
  
  // 3. NEW: Fetch call
  try {
    const response = await fetch('/api/businesses', {
      method: 'POST',
      headers: {
        // --- REMOVED 'Content-Type': 'application/json' ---
        // The browser will set it automatically for FormData
        'Authorization': `Bearer ${token}`
      },
      body: formData // <-- Send formData directly
    });

    if (response.ok) {
      alert('Business submitted successfully! It is pending approval.');
      formElement.reset();
    } else {
      const error = await response.json();
      alert(`Submission failed: ${error.message}`);
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    alert('An error occurred. Please try again.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit Business';
  }
});
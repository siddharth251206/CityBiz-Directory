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
        window.location.href = '/dashboard/viewer';
    }
}
// Helper function to convert file to Base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
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
  e.preventDefault();

  // 1. Get all form data
  // This automatically picks up all your new fields:
  // name, description, phone, email, website, address, city, state, pincode, and category_id
  const formData = new FormData(e.target);
  const newBiz = Object.fromEntries(formData.entries());

  // 2. Convert the image to Base64
  const file = formData.get('image');
  if (file && file.size > 0) {
    newBiz.image = await fileToBase64(file);
  } else {
    // Handle case where no file is selected (if not required)
    newBiz.image = null; 
  }

  // 3. Get the auth token from localStorage (set during login)
  const token = localStorage.getItem('token');
  if (!token) {
    alert('You must be logged in to add a business.');
    window.location.href = '/login'; // Redirect to login
    return;
  }

  // 4. REPLACED localStorage WITH A FETCH CALL
  try {
    const response = await fetch('/api/businesses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Send the token for your auth middleware
      },
      body: JSON.stringify(newBiz) // Send all form data as JSON
    });

    if (response.ok) {
      alert('Business submitted successfully! It is pending approval.');
      formElement.reset();
    } else {
      // Get error message from the server
      const error = await response.json();
      alert(`Submission failed: ${error.message}`);
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    alert('An error occurred. Please try again.');
  }
});
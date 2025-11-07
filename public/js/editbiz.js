
function checkSize(input) {
  if (input.files[0] && input.files[0].size > 100 * 1024) { // Or whatever your limit is
    alert("Please upload an image under 100KB.");
    input.value = "";
  }
}
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('edit-business-form');
    // The businessId is now passed from the viewRoute
    const businessId = document.getElementById('edit-business-form').dataset.id;
    const token = localStorage.getItem('token');

    const imagePreviewContainer = document.getElementById('image-preview-container');
    const currentImage = document.getElementById('current-image');
    // --- 1. POPULATE THE FORM ON PAGE LOAD ---
    async function loadBusinessData() {
        if (!token) {
            alert('You must be logged in to edit.');
            window.location.href = '/login';
            return;
        }

        try {
            const response = await fetch(`/api/businesses/edit-data/${businessId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message);
            }

            const business = await response.json();
            originalImage = business.image;
            // Populate all the form fields with the fetched data
            document.getElementById('biz-name').value = business.name;
            document.getElementById('description').value = business.description;
            document.getElementById('phone').value = business.phone;
            document.getElementById('email').value = business.email;
            document.getElementById('website').value = business.website || '';
            document.getElementById('address').value = business.address;
            document.getElementById('city').value = business.city;
            document.getElementById('state').value = business.state;
            document.getElementById('pincode').value = business.pincode;
            document.getElementById('category').value = business.category_id;
            // NEW: Show current image if it exists
             if (business.image) {
                currentImage.src = business.image;
                imagePreviewContainer.style.display = 'block';
            }
            // We also need to update the page title
            document.title = `Edit: ${business.name}`;
            document.querySelector('.form-section h2').textContent = `Edit Business: ${business.name}`;

        } catch (error) {
            alert(`Error loading data: ${error.message}`);
            // If they don't own it, send them back to their dashboard
            window.location.href = '/dashboard/owner';
        }
    }

    // --- 2. HANDLE THE FORM SUBMISSION ---
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving...';
        const formData = new FormData(e.target);
        
        // If no new file is selected, delete 'image' field
        // so the backend doesn't overwrite with an empty file.
        const file = formData.get('image');
        if (file && file.size === 0) {
            formData.delete('image');
        }

        try {
            const response = await fetch(`/api/businesses/${businessId}`, {
                method: 'PUT',
                headers: {
                    // --- REMOVED 'Content-Type': 'application/json' ---
                    'Authorization': `Bearer ${token}`
                },
                body: formData // <-- Send formData directly
            });

            if (response.ok) {
                alert('Business updated successfully!');
                window.location.href = '/dashboard/owner';
            } else {
                const err = await response.json();
                throw new Error(err.message);
            }
        } catch (error) {
            alert(`Update failed: ${error.message}`);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Save Changes';
        }
    });

    // --- 3. RUN THE DATA LOADER ---
    loadBusinessData();
});
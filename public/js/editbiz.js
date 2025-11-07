document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('edit-business-form');
    // The businessId is now passed from the viewRoute
    const businessId = document.getElementById('edit-business-form').dataset.id;
    const token = localStorage.getItem('token');

    let originalImage = null;

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
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        data.image = originalImage;
        try {
            const response = await fetch(`/api/businesses/${businessId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert('Business updated successfully!');
                // Send them back to the dashboard to see the change
                window.location.href = '/dashboard/owner';
            } else {
                const err = await response.json();
                throw new Error(err.message);
            }
        } catch (error) {
            alert(`Update failed: ${error.message}`);
        }
    });

    // --- 3. RUN THE DATA LOADER ---
    loadBusinessData();
});
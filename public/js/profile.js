// public/js/profile.js

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('profile-form');
    const saveBtn = document.getElementById('save-btn');
    const token = localStorage.getItem('token');

    if (!token) {
        // This is a backup check; the server should have redirected already.
        alert('You must be logged in to view this page.');
        window.location.href = '/login';
        return;
    }

    // --- 1. Load current profile data ---
    async function loadProfile() {
        try {
            const response = await fetch('/api/users/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    alert('Session expired. Please log in again.');
                    window.location.href = '/login';
                }
                throw new Error('Failed to load profile');
            }

            const user = await response.json();
            
            // Populate the form
            document.getElementById('name').value = user.name;
            document.getElementById('email').value = user.email;
            document.getElementById('phone').value = user.phone || '';

        } catch (error) {
            console.error('Error loading profile:', error);
            alert('Could not load your profile. Please try again later.');
        }
    }

    // --- 2. Handle form submission ---
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving...';

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to update');
            }

            alert('Profile updated successfully!');
            
            // --- CRITICAL ---
            // Update the localStorage user object so the name is
            // correct on other pages (e.Lg., dashboards)
            const localUser = JSON.parse(localStorage.getItem('user'));
            localUser.name = result.user.name;
            localUser.email = result.user.email;
            localStorage.setItem('user', JSON.stringify(localUser));

        } catch (error) {
            console.error('Error updating profile:', error);
            alert(`Update failed: ${error.message}`);
        } finally {
            saveBtn.disabled = false;
            saveBtn.textContent = 'Save Changes';
        }
    });

    // --- 3. Run the load function ---
    loadProfile();
});
// public/js/globalAuth.js

document.addEventListener('DOMContentLoaded', () => {
    
    // This file is now *only* responsible for the logout button
    
    const logoutBtn = document.getElementById('logout-btn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            
            try {
                // 1. Call the new logout API endpoint to clear the cookie
                await fetch('/api/users/logout', { method: 'POST' });

                // 2. Clear user data from localStorage
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                
                // 3. Redirect to homepage
                alert('You have been logged out.');
                window.location.href = '/';

            } catch (error) {
                console.error('Logout failed:', error);
                alert('Logout failed. Please try again.');
            }
        });
    }
});
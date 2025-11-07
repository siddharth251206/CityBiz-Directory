// public/js/favorites.js

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("favorites-grid");
    const heading = document.getElementById("results-heading");
    const token = localStorage.getItem('token');

    if (!token) {
        alert('You must be logged in to view favorites.');
        window.location.href = '/login';
        return;
    }

    async function loadFavorites() {
        try {
            const response = await fetch('/api/favorites', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    alert('Session expired. Please log in again.');
                    window.location.href = '/login';
                }
                throw new Error('Failed to fetch favorites');
            }

            const businesses = await response.json();
            
            if (businesses.length === 0) {
                heading.textContent = 'You have not favorited any businesses yet.';
                container.innerHTML = "<p class='empty-state'>Start by finding a business on the search page and clicking the 'Add to Favorites' button.</p>";
            } else {
                heading.textContent = `Showing ${businesses.length} saved businesses`;
                // We can reuse our renderBusinesses function from utils.js!
                renderBusinesses(container, businesses, false);
            }

        } catch (error) {
            console.error('Error loading favorites:', error);
            heading.textContent = 'Could not load favorites';
            container.innerHTML = "<p class='empty-state'>An error occurred. Please try again later.</p>";
        }
    }

    loadFavorites();
});
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

    // --- 1. Function to load favorites ---
    async function loadFavorites() {
        try {
            const response = await fetch('/api/favorites', {
                headers: { 'Authorization': `Bearer ${token}` }
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
                
                // --- THIS IS THE UPDATE ---
                // We pass the new options object
                renderBusinesses(container, businesses, false, { showRemoveButton: true });
                // --- END UPDATE ---
            }

        } catch (error) {
            console.error('Error loading favorites:', error);
            heading.textContent = 'Could not load favorites';
            container.innerHTML = "<p class='empty-state'>An error occurred. Please try again later.</p>";
        }
    }

    // --- 2. NEW: Function to handle remove click ---
    async function handleRemoveClick(e) {
        // Use event delegation to find the remove button
        if (!e.target.classList.contains('card-btn-remove')) {
            return;
        }

        const button = e.target;
        const card = button.closest('.cards');
        const favoriteId = button.dataset.favoriteId;

        if (!favoriteId) return;

        // Ask for confirmation
        if (!confirm('Are you sure you want to remove this from your favorites?')) {
            return;
        }

        try {
            button.disabled = true;
            button.textContent = 'Removing...';

            const response = await fetch(`/api/favorites/${favoriteId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || 'Failed to remove');
            }

            // Success! Remove the card from the page
            card.style.transition = 'opacity 0.5s ease';
            card.style.opacity = '0';
            setTimeout(() => {
                card.remove();
                // Check if the list is now empty
                if (container.children.length === 0) {
                     heading.textContent = 'You have not favorited any businesses yet.';
                     container.innerHTML = "<p class='empty-state'>Start by finding a business on the search page and clicking the 'Add to Favorites' button.</p>";
                }
            }, 500);

        } catch (error) {
            alert(`Error: ${error.message}`);
            button.disabled = false;
            button.textContent = 'Remove';
        }
    }

    // --- 3. Run and Listen ---
    loadFavorites();
    container.addEventListener('click', handleRemoveClick);
});
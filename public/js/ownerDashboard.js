document.addEventListener('DOMContentLoaded', () => {
    const businessListContainer = document.getElementById('owner-business-list');
    const welcomeMessage = document.getElementById('welcome-message');

    if (!businessListContainer) {
        console.error('Dashboard container not found!');
        return;
    }

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (welcomeMessage && user) {
        welcomeMessage.textContent = `Welcome, ${user.name || 'Owner'}!`;
    }

    if (!token) {
        alert('You must be logged in to view this page.');
        window.location.href = '/login';
        return;
    }

    // --- NEW: Function to render the special Owner Card ---
function renderOwnerCards(businesses) {
    businessListContainer.innerHTML = ''; 

    if (businesses.length === 0) {
        businessListContainer.innerHTML = `
            <div class="empty-state">
                <img src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png" alt="No Businesses">
                <p>You haven’t added any businesses yet.<br>Click <b>Add New Business</b> to get started!</p>
            </div>`;
        return;
    }

    businesses.forEach(biz => {
        const card = document.createElement('div');
        card.className = 'owner-card';

        const imageUrl = biz.image || `https://placehold.co/400x250/eee/ccc?text=No+Image`;

        card.innerHTML = `
            <div class="owner-card-image">
                <img src="${imageUrl}" alt="${biz.name}">
            </div>

            <div class="owner-card-content">
                <div class="owner-card-header">
                    <h3 class="owner-card-title">${biz.name}</h3>
                    <span class="status-tag ${biz.status}">${biz.status.toUpperCase()}</span>
                </div>

                <div class="owner-card-stats">
                    <div class="stat-item">
                        ⭐ <strong>${biz.avg_rating || "0.0"}</strong>
                        <span>(${biz.review_count || 0} Reviews)</span>
                    </div>
                    <div class="stat-item">
                        ❤️ <strong>${biz.favorite_count || 0}</strong>
                        <span>Favorites</span>
                    </div>
                </div>

                <div class="owner-card-actions">
                    <a href="/edit/${biz.business_id}" class="btn-action-edit">Edit</a>
                    <button class="btn-action-delete" data-id="${biz.business_id}">Delete</button>
                </div>
            </div>
        `;
        businessListContainer.appendChild(card);
    });

    attachDeleteListeners();
}

    // --- NEW: Function to handle delete button clicks ---
    function attachDeleteListeners() {
        document.querySelectorAll('.btn-action-delete').forEach(button => {
            button.addEventListener('click', async (e) => {
                const id = e.target.dataset.id;
                
                if (!confirm('Are you sure you want to delete this business? This action cannot be undone.')) {
                    return; // User clicked "Cancel"
                }

                try {
                    const response = await fetch(`/api/businesses/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (response.ok) {
                        alert('Business deleted successfully.');
                        // Remove the card from the page
                        e.target.closest('.owner-card').remove();
                    } else {
                        const err = await response.json();
                        alert(`Error: ${err.message}`);
                    }
                } catch (err) {
                    alert('An error occurred. Please try again.');
                }
            });
        });
    }

    // --- Main function to fetch data ---
    async function loadOwnerBusinesses() {
        try {
            const response = await fetch('/api/businesses/mybusinesses', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    alert('Your session has expired. Please log in again.');
                    window.location.href = '/login';
                }
                throw new Error('Failed to fetch businesses');
            }

            const businesses = await response.json();
            renderOwnerCards(businesses); // Call our new render function

        } catch (error) {
            console.error('Error fetching businesses:', error);
            businessListContainer.innerHTML = '<p class="empty-state">Could not load your businesses. Please try again later.</p>';
        }
    }

    // 4. Load the data
    loadOwnerBusinesses();
});
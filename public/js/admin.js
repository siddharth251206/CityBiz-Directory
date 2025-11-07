document.addEventListener('DOMContentLoaded', () => {
    const listContainer = document.getElementById('pending-list');
    const token = localStorage.getItem('token');

    if (!token) {
        alert('You must be logged in as an admin.');
        window.location.href = '/login';
        return;
    }

    // --- 1. Renders the list of pending businesses ---
    function renderPending(businesses) {
        listContainer.innerHTML = ''; // Clear "Loading..."

        if (businesses.length === 0) {
            listContainer.innerHTML = '<p class="empty-state">No businesses are currently pending approval.</p>';
            return;
        }

        businesses.forEach(biz => {
            const card = document.createElement('div');
            card.className = 'admin-card';
            card.innerHTML = `
                <div class="admin-card-header">
                    <h3 class="admin-card-title">${biz.name}</h3>
                    <span class="admin-card-category">${biz.category_name}</span>
                </div>
                <div class="admin-card-body">
                    <p><strong>Description:</strong> ${biz.description.substring(0, 150)}...</p>
                    <p><strong>Status:</strong> <span class="status-tag pending">${biz.status}</span></p>
                    <p><strong>Review Count:</strong> ${biz.review_count}</p>
                </div>
                <div class="admin-card-actions">
                    <button class="btn-admin approve" data-id="${biz.business_id}">Approve</button>
                    <button class="btn-admin reject" data-id="${biz.business_id}">Reject</button>
                </div>
            `;
            listContainer.appendChild(card);
        });

        // Add event listeners to all new buttons
        attachActionListeners();
    }

    // --- 2. Attaches click listeners for Approve/Reject ---
    function attachActionListeners() {
        listContainer.addEventListener('click', async (e) => {
            const button = e.target;
            const id = button.dataset.id;
            const action = button.classList.contains('approve') ? 'approve' : 'reject';

            if (!id) return; // Didn't click a button

            if (action === 'approve') {
                if (confirm('Are you sure you want to approve this business?')) {
                    await updateBusinessStatus(id, 'approved', button);
                }
            }

            if (action === 'reject') {
                if (confirm('Are you sure you want to REJECT (DELETE) this business? This is permanent.')) {
                    await deleteBusiness(id, button);
                }
            }
        });
    }

    // --- 3. Function to send the APPROVE (PUT) request ---
    async function updateBusinessStatus(id, status, button) {
        try {
            const response = await fetch(`/api/businesses/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: status }) // Send { "status": "approved" }
            });

            if (response.ok) {
                alert('Business approved!');
                // Remove the card from the list
                button.closest('.admin-card').remove();
            } else {
                const err = await response.json();
                throw new Error(err.message);
            }
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    }

    // --- 4. Function to send the REJECT (DELETE) request ---
    async function deleteBusiness(id, button) {
        try {
            const response = await fetch(`/api/businesses/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                alert('Business rejected and deleted.');
                // Remove the card from the list
                button.closest('.admin-card').remove();
            } else {
                const err = await response.json();
                throw new Error(err.message);
            }
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    }

    // --- 5. Initial function to fetch all pending businesses ---
    async function loadPendingBusinesses() {
        try {
            const response = await fetch('/api/businesses/pending', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    alert('Access Denied. Redirecting to login.');
                    window.location.href = '/login';
                }
                throw new Error('Failed to fetch data');
            }

            const businesses = await response.json();
            renderPending(businesses);

        } catch (error) {
            listContainer.innerHTML = `<p class="empty-state">Error: ${error.message}</p>`;
        }
    }

    // Start the page
    loadPendingBusinesses();
});
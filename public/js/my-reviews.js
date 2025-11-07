// public/js/my-reviews.js

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("review-list");
    const heading = document.getElementById("results-heading");
    const token = localStorage.getItem('token');

    if (!token) {
        alert('You must be logged in to view your reviews.');
        window.location.href = '/login';
        return;
    }

    // Helper to format the date
    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Function to render the review cards
    function renderReviews(reviews) {
        if (reviews.length === 0) {
            heading.textContent = 'You have not written any reviews yet.';
            container.innerHTML = "<p class='empty-state'>You can write a review from any business's detail page.</p>";
        } else {
            heading.textContent = `You have written ${reviews.length} reviews`;
            
            reviews.forEach(review => {
                const card = document.createElement('div');
                card.className = 'review-card-mybiz';
                card.innerHTML = `
                    <div class="review-card-header">
                        <h3 class="review-card-title">
                            Review for: <a href="/business/${review.business_id}">${review.business_name}</a>
                        </h3>
                        <div class="review-card-rating">
                            <span class="rating-stars">⭐ ${review.rating}.0</span>
                        </div>
                    </div>
                    <p class="review-card-comment">"${review.comment}"</p>
                    <div class="review-card-footer">
                        <span class="review-card-date">Posted on: ${formatDate(review.created_at)}</span>
                        <div class="review-card-actions">
                            <button class="btn-delete-review" data-id="${review.review_id}">Delete</button>
                        </div>
                    </div>
                `;
                container.appendChild(card);
            });

            // Add delete listeners
            attachDeleteListeners();
        }
    }

    // Function to handle delete
    function attachDeleteListeners() {
        container.querySelectorAll('.btn-delete-review').forEach(button => {
            button.addEventListener('click', async (e) => {
                const reviewId = e.target.dataset.id;
                
                if (!confirm('Are you sure you want to delete this review?')) {
                    return;
                }

                try {
                    const response = await fetch(`/api/reviews/${reviewId}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });

                    if (response.ok) {
                        alert('Review deleted.');
                        e.target.closest('.review-card-mybiz').remove();
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

    // Main function to fetch data
    async function loadReviews() {
        try {
            const response = await fetch('/api/reviews/my-reviews', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    alert('Session expired. Please log in again.');
                    window.location.href = '/login';
                }
                throw new Error('Failed to fetch reviews');
            }

            const reviews = await response.json();
            renderReviews(reviews);

        } catch (error) {
            console.error('Error loading reviews:', error);
            heading.textContent = 'Could not load your reviews';
            container.innerHTML = "<p class='empty-state'>An error occurred. Please try again later.</p>";
        }
    }

    loadReviews();
});
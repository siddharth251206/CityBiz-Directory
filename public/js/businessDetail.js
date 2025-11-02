document.addEventListener('DOMContentLoaded', () => {

    const reviewForm = document.querySelector('.review-form');
    const favoriteBtn = document.getElementById('favorite-btn');

    // 1. Handle Review Form Submission
    if (reviewForm) {
        reviewForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const token = localStorage.getItem('token');
            if (!token) {
                alert('You must be logged in to leave a review.');
                window.location.href = '/login';
                return;
            }

            // Get form data
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            
            // Get business_id from the form's data attribute
            data.business_id = e.target.dataset.id;

            try {
                const response = await fetch('/api/reviews', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    alert('Review submitted successfully!');
                    // Reload the page to show the new review
                    window.location.reload(); 
                } else {
                    const error = await response.json();
                    alert(`Error: ${error.message}`);
                }

            } catch (err) {
                console.error('Review submission failed:', err);
                alert('An error occurred. Please try again.');
            }
        });
    }

    // 2. Handle "Add to Favorites" Button Click
    if (favoriteBtn) {
        favoriteBtn.addEventListener('click', async (e) => {
            e.preventDefault();

            const token = localStorage.getItem('token');
            if (!token) {
                alert('You must be logged in to add a favorite.');
                window.location.href = '/login';
                return;
            }

            // Get the business_id (we stored it on the review form)
            const business_id = reviewForm ? reviewForm.dataset.id : null;
            if (!business_id) {
                alert('Could not find business ID.');
                return;
            }

            try {
                const response = await fetch('/api/favorites', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ business_id: business_id })
                });

                if (response.ok) {
                    alert('Added to favorites!');
                    favoriteBtn.textContent = '❤️ Favorited';
                    favoriteBtn.disabled = true;
                } else {
                    const error = await response.json();
                    alert(`Error: ${error.message}`);
                }

            } catch (err) {
                console.error('Favorite submission failed:', err);
                alert('An error occurred. Please try again.');
            }
        });
    }
});
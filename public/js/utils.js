/**
 * Renders a list of business cards into a container.
 * @param {HTMLElement} container - The element to inject cards into.
 * @param {Array} businesses - An array of business objects.
 * @param {boolean} [append=false] - If true, adds cards. If false, replaces content.
 */
function renderBusinesses(container, businesses, append = false, options = {}) {
  const { showRemoveButton = false } = options;
  // If we are NOT appending, clear the container first.
  if (!append) {
    container.innerHTML = "";
  }

  // Handle the "Empty State"
  if (!append && businesses.length === 0) {
    container.innerHTML = "<p class='empty-state'>No businesses found for your search. Try changing your filters.</p>";
    return;
  }

  businesses.forEach((biz) => {
    const card = document.createElement("div");
    card.className = "cards"; 

    const reviewCount = biz.review_count || 0; 
    const isOpen = Math.random() > 0.5; // Dummy data
    const imageUrl = biz.image || `https://placehold.co/200x250/eee/ccc?text=No+Image&font=lato`;
   const actionButtons = [];
    if (showRemoveButton) {
        // Add the Remove button
        actionButtons.push(
            `<button class="card-btn-remove" data-favorite-id="${biz.favorite_id}">
                Remove
             </button>`
        );
    }

    // Add the default buttons
    actionButtons.push(
        `<a href="${biz.website || '#'}" class="card-btn-website" ${!biz.website ? 'disabled' : ''}>Website</a>`,
        `<a href="/business/${biz.business_id}" class="card-btn-details title">View Details</a>`
    );
    
    // Join all button HTML strings together
    const actionsHTML = actionButtons.join('');
   card.innerHTML = `
      <div class="card-image">
        <img src="${imageUrl}" alt="${biz.name}">
      </div>
      <div class="card-content">
        <div class="card-header">
          <h3 class="card-title">${biz.name}</h3>
          <span class="card-status ${isOpen ? 'open' : 'closed'}">
            ${isOpen ? 'Open Now' : 'Closed'}
          </span>
        </div>
        <div class="card-meta">
          <span class="card-category">${biz.category_name}</span>
          <span class="card-location"> - ${biz.city}</span>
        </div>
        <div class="card-rating">
          <span class="rating-stars">⭐ ${biz.avg_rating}</span>
          <span class="review-count">(${reviewCount} reviews)</span>
        </div>
        <p class="card-address">${biz.phone} | ${biz.address}</p>
        <div class="card-actions">
          ${actionsHTML} 
        </div>
      </div>
    `;
    
    container.appendChild(card);
  });

  // Since it's a real link now, we don't need the old click event.
  // We can leave this function empty or remove it from searchbiz.js
  attachDetailsClickEvents(container, append);
}

/**
 * Attaches click event listeners. (No longer needed for 'View Details')
 */
function attachDetailsClickEvents(container, append) {
  // This function is no longer needed for the "View Details" button
  // because it is now a direct <a> link.
  // We can still use it if we add other interactive elements later.
}
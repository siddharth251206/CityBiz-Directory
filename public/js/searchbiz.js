// public/js/searchbiz.js

// --- GLOBAL STATE ---
// businessesData is the master list from the EJS <script> tag
const allBusinesses = [...businessesData]; 
let currentFilteredBusinesses = []; // Holds the full filtered list
let currentPage = 1;
const resultsPerPage = 9; // Show 9 cards per page (for your 3-column grid)

// --- DOM ELEMENTS ---
const container = document.getElementById("topbuss");
const applyFiltersBtn = document.getElementById("applyFiltersBtn");
const resultsHeading = document.getElementById("results-heading");
const loadMoreBtn = document.getElementById("load-more-btn");

/**
 * Renders a specific "page" of businesses to the container.
 */
function renderPage(page) {
    // 1. Calculate the slice of businesses to render
    const start = (page - 1) * resultsPerPage;
    const end = start + resultsPerPage;
    const businessesToRender = currentFilteredBusinesses.slice(start, end);

    // 2. Render these businesses. 
    // We set 'append' to true ONLY if it's not the first page.
    const append = (page > 1);
    renderBusinesses(container, businessesToRender, append); // This calls utils.js

    // 3. Update "Load More" button visibility
    if (end >= currentFilteredBusinesses.length) {
        loadMoreBtn.style.display = "none"; // Hide button if no more results
    } else {
        loadMoreBtn.style.display = "block"; // Show button
    }
}

/**
 * Main function to filter and sort the master list.
 */
function applyFilters() {
    currentPage = 1; // Reset to page 1 for every new search
    let filtered = [...allBusinesses];

    // 1. Get filter values
    const searchValue = document.getElementById("searchInput").value.toLowerCase();
    const category = document.getElementById("filtercat").value;
    const ratingValue = document.getElementById("filterstar").value;
    const sortOrder = document.getElementById("sortOrder").value;
    
    // (We can add the 'City' filter from your EJS later)

    // 2. Filter by Name
    if (searchValue) {
        filtered = filtered.filter((biz) => biz.name.toLowerCase().includes(searchValue));
    }

    // 3. Filter by Category
    if (category !== "All") {
        filtered = filtered.filter((biz) => biz.category_name === category);
    }

    // 4. Filter by Rating
    if (ratingValue !== "all") {
        const [min] = ratingValue.split("-").map(Number);
        filtered = filtered.filter((biz) => biz.avg_rating >= min);
    }

    // 5. Sort
    if (sortOrder === "asc") {
        filtered.sort((a, b) => a.avg_rating - b.avg_rating);
    } else {
        filtered.sort((a, b) => b.avg_rating - a.avg_rating);
    }

    // 6. Save the full filtered list
    currentFilteredBusinesses = [...filtered];

    // 7. Update heading with the TOTAL count
    resultsHeading.textContent = `Showing ${currentFilteredBusinesses.length} businesses`;

    // 8. Render the first page of results
    renderPage(currentPage);
}

/**
 * Function to load the next page of results
 */
function loadMore() {
    currentPage++;
    renderPage(currentPage);
}

// --- INITIALIZE THE PAGE ---
document.addEventListener("DOMContentLoaded", () => {
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener("click", applyFilters);
    }
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener("click", loadMore);
    }

    // Initial render on page load
    applyFilters();
});



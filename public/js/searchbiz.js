  // 'data' variable is passed from the EJS file [cite: 5]
const originalData = [...data];
const container = document.getElementById("topbuss");

function applyFilters() {
  let filtered = [...originalData];

  // 1. Filter by Name
  const searchValue = document.getElementById("searchInput").value.toLowerCase();
  if (searchValue) {
    filtered = filtered.filter((biz) => biz.name.toLowerCase().includes(searchValue));
  }

  // 2. Filter by Category
  const category = document.getElementById("filtercat").value;
  if (category !== "All") {
    filtered = filtered.filter((biz) => biz.category_name === category);
  }

  // 3. Filter by Rating
  const ratingValue = document.getElementById("filterstar").value;
  if (ratingValue !== "all") {
    const [min, max] = ratingValue.split("-").map(Number);
    filtered = filtered.filter((biz) => biz.avg_rating >= min && biz.avg_rating <= max);
  }

  // 4. Sort
  const sortOrder = document.getElementById("sortOrder").value;
  if (sortOrder === "asc") {
    filtered.sort((a, b) => a.avg_rating - b.avg_rating);
  } else if (sortOrder === "desc") {
    filtered.sort((a, b) => b.avg_rating - a.avg_rating);
  }

  // 5. Render the final result
  renderBusinesses(container, filtered);
}

// Attach event listeners
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("sortOrder").addEventListener("change", applyFilters);
  document.getElementById("searchBtn").addEventListener("click", applyFilters);
  document.getElementById("filtercat").addEventListener("change", applyFilters);
  document.getElementById("filterstar").addEventListener("change", applyFilters);
  
  // Initial render
  renderBusinesses(container, originalData);
});
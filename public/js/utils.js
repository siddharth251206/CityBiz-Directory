// public/js/utils.js

/**
 * Renders a list of business cards into a container.
 * @param {HTMLElement} container - The element to inject cards into.
 * @param {Array} businesses - An array of business objects.
 */
function renderBusinesses(container, businesses) {
  container.innerHTML = ""; // Clear existing content

  if (businesses.length === 0) {
    container.innerHTML = "<p>No businesses found.</p>";
    return;
  }

  businesses.forEach((biz) => {
    const card = document.createElement("div");
    card.className = "cards";
    //
    // -----------------  THE FIXES ARE HERE -----------------
    //
    card.innerHTML = `
      <img class="rounded img_height" src="${biz.image}" alt="${biz.name}">
      <h3 class="margin-l">${biz.name}</h3>
      <div class="rating margin-l">⭐ ${biz.avg_rating} / 5</div> 
      <div class="category-pill">${biz.category_name}</div>
      <div class="title">View Details</div>
      <div class="details">
        <p>${biz.description}</p>
        <h3 style="color:rgb(24, 24, 77)">Contact Details</h3>
        <address>
          📧 Email: <a href="mailto:${biz.email}">${biz.email}</a><br>
          📞 Phone: ${biz.phone}
        </address>
      </div>
    `;
    //
    // ----------------- END OF FIXES -----------------
    //
    
    // Add color logic for rating
    const ratingBox = card.querySelector(".rating");
    if (biz.avg_rating <= 2) ratingBox.style.backgroundColor = "red";
    else if (biz.avg_rating <= 3) ratingBox.style.backgroundColor = "yellow";
    else ratingBox.style.backgroundColor = "greenyellow";

    container.appendChild(card);
  });

  // After rendering, attach the click events
  attachDetailsClickEvents();
}

/**
 * Attaches click event listeners for the "View Details" functionality.
 */
function attachDetailsClickEvents() {
  const all_details = document.querySelectorAll(".cards");
  let overlay = document.querySelector(".overlay");

  if (!overlay) {
    overlay = document.createElement("div");
    overlay.classList.add("overlay");
    document.body.appendChild(overlay);
  }

  all_details.forEach((card) => {
    const title = card.querySelector(".title");
    const detail = card.querySelector(".details");

    title.addEventListener("click", (e) => {
      e.stopPropagation();

      document.querySelectorAll(".details.active").forEach((openDetail) => {
        if (openDetail !== detail) {
          openDetail.classList.remove("active");
          setTimeout(() => (openDetail.style.display = "none"), 500);
        }
      });

      if (detail.classList.contains("active")) {
        detail.classList.remove("active");
        title.textContent = "View Details";
        setTimeout(() => (detail.style.display = "none"), 500);
        overlay.classList.remove("active");
        card.classList.remove("active");
      } else {
        detail.style.display = "block";
        title.textContent = "Hide Details";
        setTimeout(() => detail.classList.add("active"), 10);
        overlay.classList.add("active");
        card.classList.add("active");
      }
    });
  });

  // Attach overlay click once
  if (!overlay.dataset.listenerAttached) {
    overlay.addEventListener("click", () => {
      document.querySelectorAll(".details.active").forEach((openDetail) => {
        openDetail.classList.remove("active");
        setTimeout(() => (openDetail.style.display = "none"), 500);
      });
      overlay.classList.remove("active");
      document.querySelectorAll(".cards.active").forEach((activeCard) => {
        activeCard.classList.remove("active");
      });
    });
    overlay.dataset.listenerAttached = "true";
  }
}
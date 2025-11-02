// public/js/mainpage.js

document.addEventListener('DOMContentLoaded', () => {
  // 'businesses' variable is passed from the EJS file [cite: 35]
  const container = document.getElementById('topbuss');
  
  // Call the shared function from utils.js
  renderBusinesses(container, businesses); 
});
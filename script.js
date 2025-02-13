

// Load business data from JSON file
async function loadBusinessData() {
    const response = await fetch('data.json');
    return await response.json();
}


// Homepage: Display list of businesses
async function displayBusinessList(filteredBusinesses = null) {
    const businessList = document.getElementById('business-list');
    if (!businessList) return; // Skip if not on the homepage

    const businesses = await loadBusinessData();
    const businessesToDisplay = filteredBusinesses || businesses;

    businessList.innerHTML = businessesToDisplay
        .map(
            (business) => `
        <div class="business-item">
          <h2><a href="business.html?id=${business.id}">${business.name}</a></h2>
           <div class="business-item-div"> <img src="${business.logo}" alt="${business.name}"></div>
          <p><strong>Address:🗺️</strong> ${business.address}</p>
          <p><strong>Phone:📞</strong> <span class="phone-number">${business.phone}</span></p>
          <p><strong>Rating:⭐</strong> ${business.rating} / 5</p>
        </div>
      `
        )
        .join('');
}
// Business Page: Display business details
async function displayBusinessDetails() {
    const businessDetails = document.getElementById('business-details');
    if (!businessDetails) return; // Skip if not on the business page

    const urlParams = new URLSearchParams(window.location.search);
    const businessId = urlParams.get('id');

    if (!businessId) {
        businessDetails.innerHTML = '<p>Business not found.</p>';
        return;
    }

    const businesses = await loadBusinessData();
    const business = businesses.find((b) => b.id === parseInt(businessId));

    if (!business) {
        businessDetails.innerHTML = '<p>Business not found.</p>';
        return;
    }

    // Populate contact section
    document.getElementById('contact-business-name').textContent = business.name;
    document.getElementById('contact-phone').textContent = business.phone;

    // Add click event to "Call Now" button
    const callButton = document.getElementById('call-button');
    callButton.addEventListener('click', () => {
        alert(`Calling ${business.name} at ${business.phone}`);
    });

    // Populate business details
    document.getElementById('business-name').textContent = business.name;
    document.getElementById('business-logo').innerHTML = `<img src="${business.logo}" alt="${business.name} Logo">`;
    document.getElementById('business-title').textContent = business.title;
    document.getElementById('business-description').textContent = business.description;
    document.getElementById('business-address').textContent = business.address;
    document.getElementById('business-rating').textContent = business.rating;

    // Populate reviews
    const reviewsList = document.getElementById('business-reviews');
    reviewsList.innerHTML = business.reviews.map((review) => `<li>${review}</li>`).join('');

    // Populate FAQs
    const faqsContainer = document.getElementById('business-faqs');
    faqsContainer.innerHTML = business.faqs
        .map(
            (faq) => `
        <div class="faq-item">
          <p><strong>Q:</strong> ${faq.question}</p>
          <p><strong>A:</strong> ${faq.answer}</p>
        </div>
      `
        )
        .join('');
}
// Search functionality
async function handleSearch() {
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput.value.trim().toLowerCase();

    if (!searchTerm) {
        displayBusinessList(); // Show all businesses if search term is empty
        return;
    }

    const businesses = await loadBusinessData();
    const filteredBusinesses = businesses.filter((business) =>
        business.name.toLowerCase().includes(searchTerm)
    );

    displayBusinessList(filteredBusinesses);
}

// Initialize based on the current page
if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
    displayBusinessList();

    // Add event listener for search button
    const searchButton = document.getElementById('search-button');
    if (searchButton) {
        searchButton.addEventListener('click', handleSearch);
    }

    // Add event listener for pressing "Enter" in the search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }
} else if (window.location.pathname.endsWith('business.html')) {
    displayBusinessDetails();
}
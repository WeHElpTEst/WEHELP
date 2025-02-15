let currentPage = 1; // Declare currentPage as a global variable
const itemsPerPage = 6; // Number of items per page

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

    // Calculate start and end index for the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedBusinesses = businessesToDisplay.slice(startIndex, endIndex);

    // Clear existing content
    businessList.innerHTML = '';

    // Display paginated businesses
    businessList.innerHTML = paginatedBusinesses
        .map(
            (business) => `
        <div class="col-md-4 mb-4">
          <div class="business-item">
            <h2><a href="business.html?id=${business.id}">${business.name}</a></h2>
            <div class="business-item-div"> <img class="img-fluid rounded" src="${business.logo}" alt="${business.name}"></div>
            <p><strong>Address:🗺️</strong> ${business.address}</p>
            <p><strong>Phone:📞</strong> <span class="phone-number">${business.phone}</span></p>
            <p><strong>Rating:⭐</strong> ${business.rating} / 5</p>
          </div>
        </div>
      `
        )
        .join('');

    // Update pagination controls
    updatePaginationControls(businessesToDisplay.length);
}

// Update pagination controls
function updatePaginationControls(totalItems) {
    const pageInfo = document.getElementById('page-info');
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');

    if (!pageInfo || !prevButton || !nextButton) return; // Skip if not on the homepage

    // Update page info
    pageInfo.textContent = `Page ${currentPage} of ${Math.ceil(totalItems / itemsPerPage)}`;

    // Enable/disable previous button
    prevButton.disabled = currentPage === 1;

    // Enable/disable next button
    nextButton.disabled = currentPage === Math.ceil(totalItems / itemsPerPage);
}

// Event listeners for pagination buttons
document.getElementById('prev-page')?.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayBusinessList();
    }
});

document.getElementById('next-page')?.addEventListener('click', async () => {
    const totalItems = (await loadBusinessData()).length;
    if (currentPage < Math.ceil(totalItems / itemsPerPage)) {
        currentPage++;
        displayBusinessList();
    }
});
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
    // document.getElementById('business-logo').innerHTML = `<img src="${business.logo}" alt="${business.name}" class="img-fluid rounded">`;
    document.getElementById('business-title').textContent = business.title;
    document.getElementById('business-description').textContent = business.description;
    document.getElementById('business-address').textContent = business.address;
    document.getElementById('business-rating').textContent = business.rating;

    // Populate reviews
    const reviewsList = document.getElementById('business-reviews');
    reviewsList.innerHTML = business.reviews
        .map((review) => `<li class="list-group-item">${review}</li>`)
        .join('');

    // Populate FAQs
    const faqsContainer = document.getElementById('business-faqs');
    faqsContainer.innerHTML = business.faqs
        .map(
            (faq, index) => `
        <div class="accordion-item">
          <h2 class="accordion-header" id="faq-heading-${index}">
            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#faq-collapse-${index}" aria-expanded="true" aria-controls="faq-collapse-${index}">
              ${faq.question}
            </button>
          </h2>
          <div id="faq-collapse-${index}" class="accordion-collapse collapse" aria-labelledby="faq-heading-${index}" data-bs-parent="#business-faqs">
            <div class="accordion-body">
              ${faq.answer}
            </div>
          </div>
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
        currentPage = 1; // Reset to the first page
        displayBusinessList(); // Show all businesses if search term is empty
        return;
    }

    const businesses = await loadBusinessData();
    const filteredBusinesses = businesses.filter((business) =>
        business.name.toLowerCase().includes(searchTerm)
    );

    currentPage = 1; // Reset to the first page
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
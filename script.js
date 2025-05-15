document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const resultsContainer = document.getElementById('resultsContainer');
    let servicesData = [];
    let dataLoaded = false;

    // Show loading message
    resultsContainer.innerHTML = '<p class="no-results">Loading services data, please wait...</p>';

    // Fetch services data
    fetch('services.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            servicesData = data;
            dataLoaded = true;
            resultsContainer.innerHTML = '<p class="no-results">Data loaded successfully. Enter a search query above.</p>';
            console.log('Services data loaded successfully:', servicesData.length, 'services');
        })
        .catch(error => {
            console.error('Error fetching services data:', error);
            resultsContainer.innerHTML = `
                <p class="no-results">Error loading services data: ${error.message}</p>
                <p class="no-results">This could be due to CORS restrictions when running locally.</p>
                <p class="no-results">Try using a local web server to serve these files:</p>
                <code>python -m http.server</code> or <code>npx serve</code>
            `;
        });

    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            performSearch();
        }
    });

    function performSearch() {
        const query = searchInput.value.toLowerCase().trim();
        if (!query) {
            resultsContainer.innerHTML = '<p class="no-results">Please enter a search term.</p>';
            return;
        }

        if (!dataLoaded) {
            resultsContainer.innerHTML = '<p class="no-results">Services data is still loading. Please wait and try again.</p>';
            return;
        }

        const keywords = query.split(/\s+/).filter(k => k.length > 0);
        const filterWords = ['cheapest', 'fastest'];
        const platformKeywords = ['instagram', 'youtube', 'facebook', 'twitter', 'tiktok', 'telegram', 'discord', 'google', 'whatsapp'];

        let filters = {
            sortByPrice: keywords.includes('cheapest'),
            sortByTime: keywords.includes('fastest'),
            platform: null
        };

        platformKeywords.forEach(platform => {
            if (keywords.includes(platform)) {
                filters.platform = platform;
            }
        });
        
        // Remove filter words from search keywords
        const searchKeywords = keywords.filter(k => !filterWords.includes(k) && !platformKeywords.includes(k) );

        let results = servicesData.filter(service => {
            let match = true;

            if (filters.platform) {
                const serviceNameLower = service.service_name ? service.service_name.toLowerCase() : '';
                const categoryLower = service.category ? service.category.toLowerCase() : '';
                if (!serviceNameLower.includes(filters.platform) && !categoryLower.includes(filters.platform)) {
                    match = false;
                }
            }

            if (searchKeywords.length > 0) {
                const nameMatch = searchKeywords.every(keyword => 
                    (service.service_name && service.service_name.toLowerCase().includes(keyword)) ||
                    (service.description && service.description.toLowerCase().includes(keyword)) ||
                    (service.category && service.category.toLowerCase().includes(keyword))
                );
                if (!nameMatch) match = false;
            }
            
            return match;
        });

        if (filters.sortByPrice) {
            results.sort((a, b) => {
                const priceA = parseFloat(a.price_per_1000_inr) || Infinity;
                const priceB = parseFloat(b.price_per_1000_inr) || Infinity;
                return priceA - priceB;
            });
        }

        // Basic time sorting (can be improved with better time parsing)
        if (filters.sortByTime) {
            results.sort((a, b) => {
                const timeA = parseAvgTime(a.avg_delivery_time);
                const timeB = parseAvgTime(b.avg_delivery_time);
                return timeA - timeB;
            });
        }
        
        displayResults(results);
    }
    
    // Helper function to parse average delivery time into a comparable number (e.g., minutes)
    // This is a simplified parser and might need enhancements for complex time strings.
    function parseAvgTime(timeStr) {
        if (!timeStr || typeof timeStr !== 'string') return Infinity;
        timeStr = timeStr.toLowerCase();
        let totalMinutes = Infinity;
        
        const matchMinutes = timeStr.match(/(\d+)\s*minutes?/);
        if (matchMinutes) {
            totalMinutes = parseInt(matchMinutes[1], 10);
        }
        
        const matchHours = timeStr.match(/(\d+)\s*hours?/);
        if (matchHours) {
             // If only hours are mentioned and it's less than previous minute match, use hours.
            const hoursInMinutes = parseInt(matchHours[1], 10) * 60;
            if (totalMinutes === Infinity || hoursInMinutes < totalMinutes) {
                 totalMinutes = hoursInMinutes;
            }
        } 
        
        if (timeStr.includes('instant')) {
            totalMinutes = 0; // Treat "instant" as the fastest
        }

        // If "Not Enough Data" or similar, keep as Infinity (sorts last)
        if (timeStr.includes('not enough data')){
            return Infinity;
        }

        return totalMinutes;
    }

    function displayResults(results) {
        resultsContainer.innerHTML = ''; // Clear previous results

        if (results.length === 0) {
            resultsContainer.innerHTML = '<p class="no-results">No services found matching your query.</p>';
            return;
        }

        results.forEach(service => {
            const serviceElement = document.createElement('div');
            serviceElement.classList.add('service-item');

            // Helper to safely display data, handling null or undefined
            const displayValue = (value, defaultValue = 'N/A') => value !== null && typeof value !== 'undefined' ? value : defaultValue;

            serviceElement.innerHTML = `
                <h3>${displayValue(service.service_name)} (ID: ${displayValue(service.service_id)})</h3>
                <p><strong>Category:</strong> ${displayValue(service.category)}</p>
                <p><strong>Price per 1000:</strong> ${service.price_per_1000_inr ? `₹${displayValue(service.price_per_1000_inr)}` : 'N/A'}</p>
                <p><strong>Min Order:</strong> ${displayValue(service.min_order)}</p>
                <p><strong>Max Order:</strong> ${displayValue(service.max_order)}</p>
                <p><strong>Avg. Delivery Time:</strong> ${displayValue(service.avg_delivery_time, service["avg._delivery_time"])}</p> <!-- Handle slight key variation -->
                <p><strong>Description:</strong> ${displayValue(service.description)}</p>
            `;
            resultsContainer.appendChild(serviceElement);
        });
    }
}); 
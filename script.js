// Listen for messages from the service worker
if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.addEventListener('message', event => {
        if (event.data && event.data.type === 'CACHE_UPDATED') {
            console.log('Cache updated, reloading page for fresh content...');
            window.location.reload();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const resultsContainer = document.getElementById('resultsContainer');
    const sortContainer = document.getElementById('sortContainer');
    const sortDropdown = document.getElementById('sortDropdown');
    let servicesData = [];
    let dataLoaded = false;
    let currentResults = []; // Store current search results
    // Check if we're on a mobile device
    const isMobile = window.matchMedia('(max-width: 600px)').matches;

    // Ensure sort container is initially hidden
    if (sortContainer) {
        sortContainer.style.display = 'none';
        console.log('Sort container display set to none on initial load');
    } else {
        console.error('Sort container element not found!');
    }

    // Show loading message
    resultsContainer.innerHTML = '<p class="no-results">Loading services data, please wait...</p>';

    // Log initial element state for debugging
    console.log('Sort container found:', sortContainer !== null);
    console.log('Initial sort container display style:', sortContainer ? sortContainer.style.display : 'element not found');

    // Add cache-busting parameter to prevent browser caching
    const cacheBuster = `?v=${Date.now()}`;

    // Fetch services data with cache-busting
    fetch(`services.json${cacheBuster}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            servicesData = data;
            dataLoaded = true;
            console.log('Services data loaded successfully. Total services:', servicesData.length);
            console.log('First service for verification:', servicesData[0]);

            if (servicesData.length === 0) {
                resultsContainer.innerHTML = '<p class="no-results">No services found in the data file. Please check services.json.</p>';
            } else {
                resultsContainer.innerHTML = '<p class="no-results">Data loaded successfully. Enter a search query above.</p>';
            }
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

    // Add event listener for sort dropdown
    sortDropdown.addEventListener('change', () => {
        if (currentResults.length > 0) {
            sortResults(currentResults);
            displayResults(currentResults);
        }
    });

    // Helper function to ensure sort visibility based on results
    function updateSortContainerVisibility(hasResults) {
        if (!sortContainer) return;

        if (hasResults) {
            // For mobile devices, add a smooth animation when showing the dropdown
            if (isMobile) {
                sortContainer.style.opacity = '0';
                sortContainer.style.display = 'flex';
                sortContainer.style.transform = 'translateY(-10px)';
                sortContainer.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

                // Force a reflow before applying the animation
                sortContainer.offsetHeight;

                sortContainer.style.opacity = '1';
                sortContainer.style.transform = 'translateY(0)';
            } else {
                sortContainer.style.display = 'flex';
            }
            console.log('Making sort container visible:', sortContainer.style.display);

            // Add click event listener to dropdown for mobile to improve touch interaction
            if (isMobile && sortDropdown) {
                enhanceMobileDropdown();
            }
        } else {
            sortContainer.style.display = 'none';
            console.log('Hiding sort container:', sortContainer.style.display);
        }
    }

    // Function to enhance mobile dropdown behavior
    function enhanceMobileDropdown() {
        // Make sure we only add the event once
        if (sortDropdown.dataset.enhanced) return;

        sortDropdown.dataset.enhanced = 'true';

        // Add a subtle animation when opening the dropdown
        sortDropdown.addEventListener('focus', () => {
            sortDropdown.style.transform = 'scale(1.02)';
            sortDropdown.style.transition = 'transform 0.2s ease';
        });

        sortDropdown.addEventListener('blur', () => {
            sortDropdown.style.transform = 'scale(1)';
        });

        // Add vibration feedback on mobile if supported
        sortDropdown.addEventListener('change', () => {
            if ('vibrate' in navigator) {
                navigator.vibrate(20); // Short vibration for feedback
            }
        });

        console.log('Mobile dropdown enhancements applied');
    }

    function performSearch() {
        const query = searchInput.value.toLowerCase().trim();
        if (!query) {
            resultsContainer.innerHTML = '<p class="no-results">Please enter a search term.</p>';
            updateSortContainerVisibility(false);
            return;
        }

        if (!dataLoaded) {
            resultsContainer.innerHTML = '<p class="no-results">Services data is still loading. Please wait and try again.</p>';
            updateSortContainerVisibility(false);
            return;
        }

        console.log('Performing search for:', query);

        // Parse query keywords
        const keywords = query.split(/\s+/).filter(k => k.length > 0);
        console.log('Search keywords:', keywords);

        // Identify filter and platform keywords
        const filterWords = ['cheapest', 'fastest'];
        const platformKeywords = ['instagram', 'youtube', 'facebook', 'twitter', 'tiktok', 'telegram', 'discord', 'google', 'whatsapp'];

        // Service type keywords we're looking for
        const serviceTypeKeywords = ['likes', 'followers', 'views', 'subscribers', 'comments', 'shares', 'members'];

        // Extract filters from query
        let filters = {
            sortByPrice: keywords.includes('cheapest'),
            sortByTime: keywords.includes('fastest'),
            platform: null,
            serviceType: null,
            returnOnlyCheapest: keywords.includes('cheapest'),
            returnOnlyFastest: keywords.includes('fastest')
        };

        // Identify platform from query
        for (const platform of platformKeywords) {
            if (keywords.some(k => k.includes(platform))) {
                filters.platform = platform;
                break;
            }
        }

        // Identify service type from query
        for (const serviceType of serviceTypeKeywords) {
            if (keywords.some(k => k.includes(serviceType))) {
                filters.serviceType = serviceType;
                break;
            }
        }

        console.log('Filters applied:', filters);

        // Remove filter words and platform words from search keywords
        let searchKeywords = keywords.filter(k =>
            !filterWords.includes(k) &&
            !platformKeywords.includes(k) &&
            !serviceTypeKeywords.includes(k)
        );

        // Special handling for typos and partial matches
        searchKeywords = searchKeywords.map(k => {
            // Handle common typos (e.g., "Instaram" -> "Instagram")
            if (k.includes('insta') || k.includes('instag')) return 'instagram';
            if (k.includes('you') || k.includes('tube')) return 'youtube';
            if (k.includes('tik')) return 'tiktok';
            if (k.includes('face')) return 'facebook';
            return k;
        }).filter(k => k !== ''); // Remove any empty strings

        console.log('Actual search keywords (after removing filters):', searchKeywords);

        // Filter services based on user query
        let results = servicesData.filter(service => {
            // Convert all service fields to lowercase for case-insensitive matching
            const serviceNameLower = (service.service_name || '').toLowerCase();
            const categoryLower = (service.category || '').toLowerCase();
            const descriptionLower = (service.description || '').toLowerCase();

            // Platform filtering (e.g., Instagram, YouTube)
            if (filters.platform &&
                !serviceNameLower.includes(filters.platform) &&
                !categoryLower.includes(filters.platform)) {
                return false;
            }

            // Service type filtering (e.g., likes, followers)
            if (filters.serviceType &&
                !serviceNameLower.includes(filters.serviceType) &&
                !descriptionLower.includes(filters.serviceType)) {
                return false;
            }

            // Additional keyword filtering if any remain
            if (searchKeywords.length > 0) {
                // Service should match all remaining keywords
                const allFieldsText = serviceNameLower + ' ' + categoryLower + ' ' + descriptionLower;
                return searchKeywords.every(keyword => allFieldsText.includes(keyword));
            }

            return true;
        });

        console.log('Search results count:', results.length);

        // Sort results based on filter
        if (filters.sortByPrice) {
            results.sort((a, b) => {
                // Extract numeric values from price strings
                const priceA = parseFloat((a.price_per_1000_inr || '').replace('₹', '')) || Infinity;
                const priceB = parseFloat((b.price_per_1000_inr || '').replace('₹', '')) || Infinity;
                return priceA - priceB;
            });

            // If "cheapest" was requested, only return the cheapest one
            if (filters.returnOnlyCheapest && results.length > 0) {
                results = [results[0]];
            }
        }

        // Sort by delivery time if requested
        if (filters.sortByTime) {
            results.sort((a, b) => {
                const timeA = parseAvgTime(a.avg_delivery_time);
                const timeB = parseAvgTime(b.avg_delivery_time);
                return timeA - timeB;
            });

            // If "fastest" was requested, only return the fastest one
            if (filters.returnOnlyFastest && results.length > 0) {
                results = [results[0]];
            }
        }

        // Reset the sort dropdown to default
        sortDropdown.value = 'default';

        // Store current results
        currentResults = results;

        // Update sort container visibility
        updateSortContainerVisibility(results.length > 0);

        displayResults(results);
    }

    // Helper function to parse average delivery time into a comparable number (e.g., minutes)
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

    // Function to sort results based on dropdown selection
    function sortResults(results) {
        const sortType = sortDropdown.value;

        switch (sortType) {
            case 'price-asc':
                results.sort((a, b) => {
                    const priceA = parseFloat((a.price_per_1000_inr || '').replace('₹', '')) || Infinity;
                    const priceB = parseFloat((b.price_per_1000_inr || '').replace('₹', '')) || Infinity;
                    return priceA - priceB;
                });
                break;

            case 'price-desc':
                results.sort((a, b) => {
                    const priceA = parseFloat((a.price_per_1000_inr || '').replace('₹', '')) || Infinity;
                    const priceB = parseFloat((b.price_per_1000_inr || '').replace('₹', '')) || Infinity;
                    return priceB - priceA;
                });
                break;

            case 'time-asc':
                results.sort((a, b) => {
                    const timeA = parseAvgTime(a.avg_delivery_time);
                    const timeB = parseAvgTime(b.avg_delivery_time);
                    return timeA - timeB;
                });
                break;

            // Default case - no sorting needed as we'll use the original order
            default:
                break;
        }
    }

    function displayResults(results) {
        resultsContainer.innerHTML = ''; // Clear previous results

        if (results.length === 0) {
            resultsContainer.innerHTML = `
                <p class="no-results">No services found matching your query.</p>
                <p class="no-results">Try a different search term or check your browser console for debugging information.</p>
            `;
            updateSortContainerVisibility(false);
            return;
        }

        // Ensure sort container is visible with results
        updateSortContainerVisibility(true);

        results.forEach(service => {
            const serviceElement = document.createElement('div');
            serviceElement.classList.add('service-item');

            // Helper to safely display data, handling null or undefined
            const displayValue = (value, defaultValue = 'N/A') => value !== null && typeof value !== 'undefined' ? value : defaultValue;

            serviceElement.innerHTML = `
                <h3>${displayValue(service.service_name)} (ID: ${displayValue(service.service_id)})</h3>
                <p><strong>Category:</strong> ${displayValue(service.category)}</p>
                <p><strong>Price per 1000:</strong> ${service.price_per_1000_inr ? `${displayValue(service.price_per_1000_inr)}` : 'N/A'}</p>
                <p><strong>Min Order:</strong> ${displayValue(service.min_order)}</p>
                <p><strong>Max Order:</strong> ${displayValue(service.max_order)}</p>
                <p><strong>Avg. Delivery Time:</strong> ${displayValue(service.avg_delivery_time, service["avg._delivery_time"])}</p> <!-- Handle slight key variation -->
                <p><strong>Description:</strong> ${displayValue(service.description)}</p>
            `;
            resultsContainer.appendChild(serviceElement);
        });
    }
});
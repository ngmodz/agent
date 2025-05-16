// This script handles page reloading for cache invalidation

// Store the last reload time in session storage
const LAST_RELOAD_KEY = 'last_page_reload_time';
const RELOAD_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds

// Check if we need to reload the page
function checkForReload() {
    const lastReloadTime = sessionStorage.getItem(LAST_RELOAD_KEY);
    const currentTime = Date.now();
    
    // If this is the first load or it's been more than RELOAD_INTERVAL since last reload
    if (!lastReloadTime || (currentTime - parseInt(lastReloadTime, 10)) > RELOAD_INTERVAL) {
        // Update the last reload time
        sessionStorage.setItem(LAST_RELOAD_KEY, currentTime.toString());
        
        // If this isn't the first load (we have a lastReloadTime), reload the page
        if (lastReloadTime) {
            console.log('Reloading page to ensure fresh content...');
            window.location.reload(true); // true forces reload from server, not cache
        }
    }
}

// Run the check when the page loads
window.addEventListener('load', () => {
    // Add a small delay to avoid immediate reload
    setTimeout(checkForReload, 100);
    
    // Also check for reload when the page becomes visible again
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            checkForReload();
        }
    });
});

// This file manages versioning for cache busting
const APP_VERSION = '1.0.1';
const BUILD_TIMESTAMP = Date.now();

// Export version information
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        APP_VERSION,
        BUILD_TIMESTAMP
    };
}

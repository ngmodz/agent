document.addEventListener('DOMContentLoaded', () => {
    // Create overlay element for smooth transitions
    const overlay = document.createElement('div');
    overlay.className = 'page-overlay';
    document.body.appendChild(overlay);
    
    // Get all links that should trigger page transitions
    const transitionLinks = document.querySelectorAll('a[href="index.html"], a[href="image.html"]');
    
    // Track if transition is in progress
    let isTransitioning = false;
    
    // Listen for link clicks
    transitionLinks.forEach(link => {
        link.addEventListener('click', handleLinkClick);
    });
    
    // Smooth page load
    handlePageLoad();
    
    /**
     * Handle smooth page load
     */
    function handlePageLoad() {
        // Container should already have animation applied via CSS
        const container = document.querySelector('.container');
        
        // Make sure images and other resources are loaded before showing content
        window.addEventListener('load', () => {
            if (container) {
                // No need to do anything, CSS animation handles it
                container.style.visibility = 'visible';
            }
        });
    }
    
    /**
     * Handle link clicks with smooth transition
     */
    function handleLinkClick(e) {
        if (isTransitioning) return;
        
        e.preventDefault();
        isTransitioning = true;
        
        const targetUrl = e.currentTarget.getAttribute('href');
        
        // Show overlay
        overlay.classList.add('active');
        
        // After overlay is visible, navigate to new page
        setTimeout(() => {
            window.location.href = targetUrl;
        }, 400); // Match with overlay transition duration
    }
    
    /**
     * Handle browser back/forward navigation
     */
    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            // Page is loaded from cache (back/forward navigation)
            // Container animation will handle the transition
            overlay.classList.remove('active');
            isTransitioning = false;
        }
    });
}); 
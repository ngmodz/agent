document.addEventListener('DOMContentLoaded', () => {
    // Get existing overlay element or create it if not present
    let overlay = document.querySelector('.page-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'page-overlay';
        document.body.appendChild(overlay);
    }
    
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
        const currentPage = window.location.pathname.includes('image.html') ? 'image' : 'agent';
        
        // Ensure the body and container have the right initial styles
        document.body.style.position = 'relative';
        
        // Don't show content until everything is loaded
        if (container) {
            // Use a consistent approach for both pages to prevent flash
            window.addEventListener('load', () => {
                // Force layout calculation before showing content
                document.body.offsetHeight;
                
                // Short delay to ensure everything is properly rendered
                setTimeout(() => {
                    // Make container visible with proper position
                    container.style.visibility = 'visible';
                    container.style.opacity = '1';
                    
                    // Force browser to apply styles
                    window.getComputedStyle(container).opacity;
                    
                    // Remove the overlay if present
                    if (overlay) {
                        overlay.classList.remove('active');
                    }
                }, 50);
            });
        }
    }
    
    /**
     * Handle link clicks with smooth transition
     */
    function handleLinkClick(e) {
        if (isTransitioning) return;
        
        e.preventDefault();
        isTransitioning = true;
        
        const targetUrl = e.currentTarget.getAttribute('href');
        const container = document.querySelector('.container');
        const isGoingToAgentPage = targetUrl.includes('index.html');
        
        // If mobile device, use a slightly different approach to prevent flashing
        const isMobile = window.innerWidth <= 768;
        
        // First hide current content
        if (container) {
            container.style.opacity = '0';
            // Force browser to recognize the style change
            window.getComputedStyle(container).opacity;
        }
        
        // Show overlay
        overlay.classList.add('active');
        
        // Use consistent timing for both transitions to prevent flash
        const transitionDelay = isMobile ? 550 : 450;
        
        // After overlay is visible, navigate to new page
        setTimeout(() => {
            window.location.href = targetUrl;
        }, transitionDelay);
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
            
            // Make container visible properly
            const container = document.querySelector('.container');
            if (container) {
                // Short delay before showing content
                setTimeout(() => {
                    container.style.visibility = 'visible';
                }, 50);
            }
        }
    });
}); 
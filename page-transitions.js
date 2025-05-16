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
            // Use different approach based on which page we're on
            // This helps fix the flash when going from image to agent page
            if (currentPage === 'agent') {
                // We need to ensure all critical resources are loaded before showing content
                window.addEventListener('load', () => {
                    // Short delay to ensure everything is rendered properly
                    setTimeout(() => {
                        // Position is set correctly before making visible
                        container.style.visibility = 'visible';
                        // Force browser to apply styles before animation
                        window.getComputedStyle(container).opacity;
                    }, 50);
                });
            } else {
                // For image page, we can show content right away
                window.addEventListener('load', () => {
                    container.style.visibility = 'visible';
                });
            }
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
        
        // Different timing for different page transitions to prevent flash
        const transitionDelay = isGoingToAgentPage && isMobile ? 550 : 400;
        
        // After overlay is visible, navigate to new page
        setTimeout(() => {
            window.location.href = targetUrl;
        }, transitionDelay); // Longer transition when going to agent page on mobile
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
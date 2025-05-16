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
        const isMobile = window.innerWidth <= 768;
        
        // Ensure the body and container have the right initial styles
        document.body.style.position = 'relative';
        
        // For mobile, preemptively remove any active overlays
        if (isMobile) {
            overlay.classList.remove('active');
        }
        
        // Don't show content until everything is loaded
        if (container) {
            // Use a consistent approach for both pages to prevent flash
            window.addEventListener('load', () => {
                // Force layout calculation before showing content
                document.body.offsetHeight;
                
                // Different timing for mobile to ensure smoother transitions
                const revealDelay = isMobile ? 100 : 50;
                
                // Short delay to ensure everything is properly rendered
                setTimeout(() => {
                    // Pre-calculate styles to force layout
                    if (isMobile) {
                        window.getComputedStyle(document.body).height;
                    }
                    
                    // Make container visible with proper position
                    container.style.visibility = 'visible';
                    container.style.opacity = '1';
                    
                    // Force browser to apply styles
                    window.getComputedStyle(container).opacity;
                    
                    // Remove the overlay if present
                    if (overlay) {
                        overlay.classList.remove('active');
                    }
                    
                    // Add page-loaded class to body to reset fixed position on mobile
                    if (isMobile) {
                        setTimeout(() => {
                            document.body.classList.add('page-loaded');
                        }, 100);
                    }
                }, revealDelay);
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
        
        // For mobile, add the transitioning class to prevent unwanted animations
        if (isMobile) {
            document.body.classList.remove('page-loaded');
            document.body.classList.add('page-transitioning');
        }
        
        // First hide current content
        if (container) {
            container.style.opacity = '0';
            // Force browser to recognize the style change
            window.getComputedStyle(container).opacity;
            
            // For mobile, add translate3d to trigger GPU acceleration
            if (isMobile) {
                container.style.transform = 'translate3d(0, 10px, 0)';
                // Force reflow
                window.getComputedStyle(container).transform;
            }
        }
        
        // Show overlay
        overlay.classList.add('active');
        window.getComputedStyle(overlay).opacity; // Force reflow for overlay
        
        // Adjust timing based on device and page direction
        const transitionDelay = isMobile ? 
            (isGoingToAgentPage ? 600 : 550) : // Mobile delays
            (isGoingToAgentPage ? 500 : 450);  // Desktop delays
        
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
            const isMobile = window.innerWidth <= 768;
            
            // Remove transitioning class
            if (isMobile) {
                document.body.classList.remove('page-transitioning');
            }
            
            // Container animation will handle the transition
            overlay.classList.remove('active');
            isTransitioning = false;
            
            // Make container visible properly
            const container = document.querySelector('.container');
            if (container) {
                // Apply GPU acceleration for mobile
                if (isMobile) {
                    container.style.transform = 'translate3d(0, 0, 0)';
                }
                
                // Short delay before showing content
                setTimeout(() => {
                    container.style.visibility = 'visible';
                    container.style.opacity = '1';
                    
                    // Add page-loaded class to body after a short delay
                    if (isMobile) {
                        setTimeout(() => {
                            document.body.classList.add('page-loaded');
                        }, 100);
                    }
                }, isMobile ? 100 : 50);
            }
        }
    });
}); 
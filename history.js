document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const historyContainer = document.getElementById('historyContainer');
    
    // Flag to track if we're in offline mode
    let isOfflineMode = false;

    // Check if Supabase is initialized
    if (typeof supabaseClient === 'undefined') {
        showError('Supabase client is not initialized. Please check your configuration.');
        return;
    }

    // Load image history when the page is loaded
    window.addEventListener('load', () => {
        loadImageHistory();
    });
    
    // Add network status event listeners
    window.addEventListener('online', () => {
        console.log('Network connection restored');
        if (isOfflineMode) {
            showNotification('You are back online. Refreshing data...');
            loadImageHistory();
        }
    });
    
    window.addEventListener('offline', () => {
        console.log('Network connection lost');
        showNotification('You are offline. Some features may be limited.', 'warning');
        isOfflineMode = true;
        // Load offline images when going offline
        loadOfflineImages();
    });
    
    // Function to show notification
    function showNotification(message, type = 'info') {
        // Create notification element if it doesn't exist
        let notification = document.getElementById('notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'notification';
            notification.className = `notification ${type}`;
            document.body.appendChild(notification);
            
            // Add style for notifications
            const style = document.createElement('style');
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 10px 20px;
                    border-radius: 4px;
                    color: white;
                    font-weight: bold;
                    z-index: 1000;
                    opacity: 0;
                    transform: translateY(-20px);
                    transition: opacity 0.3s, transform 0.3s;
                    max-width: 300px;
                }
                .notification.info {
                    background-color: #007bff;
                }
                .notification.warning {
                    background-color: #ff9800;
                }
                .notification.error {
                    background-color: #dc3545;
                }
                .notification.visible {
                    opacity: 1;
                    transform: translateY(0);
                }
            `;
            document.head.appendChild(style);
        }
        
        // Set message and type
        notification.textContent = message;
        notification.className = `notification ${type}`;
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('visible');
        }, 10);
        
        // Hide notification after 5 seconds
        setTimeout(() => {
            notification.classList.remove('visible');
        }, 5000);
    }

    // Function to load image history
    async function loadImageHistory() {
        try {
            // Show loading spinner
            historyContainer.innerHTML = '<div class="loading-spinner"><div class="spinner"></div></div>';

            // Check if we're offline
            if (!navigator.onLine) {
                isOfflineMode = true;
                loadOfflineImages();
                return;
            }

            // Get image history from Supabase
            const result = await getImageHistory();

            // Check if we're offline based on the response
            if (result.offline) {
                isOfflineMode = true;
                loadOfflineImages();
                return;
            }

            // Clear loading spinner
            historyContainer.innerHTML = '';

            if (!result.success) {
                showError('Failed to load image history. Please try again later.');
                return;
            }

            // Check if there are any images in the history
            if (result.data.length === 0) {
                // If no online images, check for offline images
                const offlineImages = getOfflineImages();
                if (offlineImages.length > 0) {
                    displayOfflineImages(offlineImages);
                } else {
                    showEmptyHistory();
                }
                return;
            }

            // Display images in the history
            result.data.forEach(image => {
                const historyItem = createHistoryItem(image);
                historyContainer.appendChild(historyItem);
            });
            
            // Check for offline images and add them too
            const offlineImages = getOfflineImages();
            if (offlineImages.length > 0) {
                // Add a divider if we have online images
                const divider = document.createElement('div');
                divider.className = 'history-divider';
                divider.innerHTML = '<span>Offline Images</span>';
                historyContainer.appendChild(divider);
                
                // Add offline images
                offlineImages.forEach(image => {
                    const historyItem = createOfflineHistoryItem(image);
                    historyContainer.appendChild(historyItem);
                });
            }
            
            // Reset offline mode flag
            isOfflineMode = false;
        } catch (error) {
            console.error('Error loading image history:', error);
            showError('An error occurred while loading image history.');
        }
    }
    
    // Function to load offline images
    function loadOfflineImages() {
        // Clear container
        historyContainer.innerHTML = '';
        
        // Get offline images from local storage
        const offlineImages = getOfflineImages();
        
        if (offlineImages.length === 0) {
            showOfflineMessage();
            return;
        }
        
        // Display offline images
        displayOfflineImages(offlineImages);
    }
    
    // Function to get offline images from local storage
    function getOfflineImages() {
        try {
            return JSON.parse(localStorage.getItem('offlineImages') || '[]');
        } catch (error) {
            console.error('Error parsing offline images:', error);
            return [];
        }
    }
    
    // Function to display offline images
    function displayOfflineImages(offlineImages) {
        // Add offline mode indicator
        const offlineIndicator = document.createElement('div');
        offlineIndicator.className = 'offline-indicator';
        offlineIndicator.innerHTML = '<span>Offline Mode</span>';
        historyContainer.appendChild(offlineIndicator);
        
        // Display each offline image
        offlineImages.forEach(image => {
            const historyItem = createOfflineHistoryItem(image);
            historyContainer.appendChild(historyItem);
        });
    }
    
    // Function to create an offline history item
    function createOfflineHistoryItem(image) {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item offline-item';
        historyItem.dataset.id = image.id;

        // Format date
        const createdAt = new Date(image.created_at);
        const formattedDate = createdAt.toLocaleDateString() + ' ' + createdAt.toLocaleTimeString();

        // Create the HTML content
        historyItem.innerHTML = `
            <button class="delete-btn" title="Delete" data-id="${image.id}">&times;</button>
            <div class="offline-badge">Offline</div>
            <div class="image-container">
                <img src="${image.imageDataUrl}" alt="${image.serviceName}" class="history-image">
            </div>
            <div class="history-details">
                <div class="history-title">${image.serviceName || 'Untitled'}</div>
                <div class="history-date">${formattedDate}</div>
                <div class="history-category">${image.category}</div>
            </div>
        `;

        // Add click event to the history item
        historyItem.addEventListener('click', (e) => {
            // Don't navigate if the delete button was clicked
            if (e.target.classList.contains('delete-btn')) {
                return;
            }
            
            // For offline items, just show the image in a modal
            showImageModal(image.imageDataUrl, image.serviceName);
        });

        // Add click event to the delete button
        const deleteBtn = historyItem.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent the history item click event
            
            if (confirm('Are you sure you want to delete this offline image?')) {
                deleteOfflineImage(image.id);
            }
        });

        return historyItem;
    }
    
    // Function to show an image in a modal
    function showImageModal(imageUrl, title) {
        // Create modal container
        const modalContainer = document.createElement('div');
        modalContainer.className = 'image-modal-container';
        
        // Create modal content
        modalContainer.innerHTML = `
            <div class="image-modal">
                <div class="modal-header">
                    <h3>${title || 'Image Preview'}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <img src="${imageUrl}" alt="${title}" class="modal-image">
                </div>
            </div>
        `;
        
        // Add modal to body
        document.body.appendChild(modalContainer);
        
        // Prevent body scrolling
        document.body.style.overflow = 'hidden';
        
        // Add close event to modal close button
        const closeBtn = modalContainer.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modalContainer);
            document.body.style.overflow = '';
        });
        
        // Add close event to modal background
        modalContainer.addEventListener('click', (e) => {
            if (e.target === modalContainer) {
                document.body.removeChild(modalContainer);
                document.body.style.overflow = '';
            }
        });
        
        // Add escape key event to close modal
        document.addEventListener('keydown', function escapeClose(e) {
            if (e.key === 'Escape') {
                document.body.removeChild(modalContainer);
                document.body.style.overflow = '';
                document.removeEventListener('keydown', escapeClose);
            }
        });
        
        // Add modal styles
        const style = document.createElement('style');
        style.textContent = `
            .image-modal-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                animation: fadeIn 0.3s ease;
            }
            
            .image-modal {
                background-color: white;
                border-radius: 8px;
                max-width: 90%;
                max-height: 90%;
                display: flex;
                flex-direction: column;
                animation: scaleIn 0.3s ease;
            }
            
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 15px;
                border-bottom: 1px solid #ddd;
            }
            
            .modal-close {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #666;
            }
            
            .modal-body {
                padding: 15px;
                overflow: auto;
                text-align: center;
            }
            
            .modal-image {
                max-width: 100%;
                max-height: 70vh;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes scaleIn {
                from { transform: scale(0.9); }
                to { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Function to delete an offline image
    function deleteOfflineImage(id) {
        try {
            // Get offline images
            const offlineImages = getOfflineImages();
            
            // Filter out the image to delete
            const updatedImages = offlineImages.filter(image => image.id !== id);
            
            // Save back to local storage
            localStorage.setItem('offlineImages', JSON.stringify(updatedImages));
            
            // Remove the history item from the DOM with animation
            const historyItem = document.querySelector(`.history-item[data-id="${id}"]`);
            if (historyItem) {
                historyItem.style.transform = 'scale(0.8)';
                historyItem.style.opacity = '0';
                setTimeout(() => {
                    historyItem.remove();
                    
                    // Check if there are any images left
                    if (historyContainer.querySelectorAll('.history-item').length === 0) {
                        if (navigator.onLine) {
                            loadImageHistory();
                        } else {
                            showOfflineMessage();
                        }
                    }
                }, 300);
            }
        } catch (error) {
            console.error('Error deleting offline image:', error);
            alert('An error occurred while deleting the image.');
        }
    }

    // Function to create a history item element
    function createHistoryItem(image) {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.dataset.id = image.id;

        // Extract category from prompt_data
        const category = image.prompt_data?.category || 'Unknown';

        // Format date
        const createdAt = new Date(image.created_at);
        const formattedDate = createdAt.toLocaleDateString() + ' ' + createdAt.toLocaleTimeString();

        // Create the HTML content
        historyItem.innerHTML = `
            <button class="delete-btn" title="Delete" data-id="${image.id}">&times;</button>
            <div class="image-container">
                <img src="${image.image_url}" alt="${image.service_name}" class="history-image">
                <div class="image-loading">Loading...</div>
            </div>
            <div class="history-details">
                <div class="history-title">${image.service_name || 'Untitled'}</div>
                <div class="history-date">${formattedDate}</div>
                <div class="history-category">${category}</div>
            </div>
        `;

        // Add error handling for image loading
        const img = historyItem.querySelector('.history-image');
        const loadingText = historyItem.querySelector('.image-loading');
        
        img.addEventListener('load', () => {
            loadingText.style.display = 'none';
        });
        
        img.addEventListener('error', () => {
            loadingText.textContent = 'Failed to load image';
            loadingText.style.color = '#dc3545';
        });

        // Add click event to the history item
        historyItem.addEventListener('click', (e) => {
            // Don't navigate if the delete button was clicked
            if (e.target.classList.contains('delete-btn')) {
                return;
            }
            
            // Navigate to the image.html page with the image ID
            window.location.href = `image.html?id=${image.id}`;
        });

        // Add click event to the delete button
        const deleteBtn = historyItem.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', async (e) => {
            e.stopPropagation(); // Prevent the history item click event
            
            if (confirm('Are you sure you want to delete this image?')) {
                await deleteImage(image.id);
            }
        });

        return historyItem;
    }

    // Function to delete an image
    async function deleteImage(id) {
        try {
            // Check if we're offline
            if (!navigator.onLine) {
                showNotification('Cannot delete while offline', 'error');
                return;
            }
            
            // Show loading state
            const historyItem = document.querySelector(`.history-item[data-id="${id}"]`);
            if (historyItem) {
                historyItem.classList.add('deleting');
                historyItem.style.opacity = '0.5';
            }
            
            const result = await deleteImageFromHistory(id);

            if (!result.success) {
                // Check if we're offline based on the response
                if (result.offline) {
                    showNotification('Cannot delete while offline', 'error');
                    // Reset the item's appearance
                    if (historyItem) {
                        historyItem.classList.remove('deleting');
                        historyItem.style.opacity = '1';
                    }
                    return;
                }
                
                alert('Failed to delete image. Please try again.');
                // Reset the item's appearance
                if (historyItem) {
                    historyItem.classList.remove('deleting');
                    historyItem.style.opacity = '1';
                }
                return;
            }

            // Remove the history item from the DOM with animation
            if (historyItem) {
                historyItem.style.transform = 'scale(0.8)';
                historyItem.style.opacity = '0';
                setTimeout(() => {
                    historyItem.remove();
                    
                    // Check if there are any images left
                    if (historyContainer.querySelectorAll('.history-item').length === 0) {
                        showEmptyHistory();
                    }
                }, 300);
            }
        } catch (error) {
            console.error('Error deleting image:', error);
            alert('An error occurred while deleting the image.');
        }
    }

    // Function to show empty history message
    function showEmptyHistory() {
        historyContainer.innerHTML = `
            <div class="empty-history">
                <h3>No images in history</h3>
                <p>You haven't created any images yet.</p>
                <a href="image.html" class="create-new-btn">Create New Image</a>
            </div>
        `;
    }

    // Function to show offline message
    function showOfflineMessage() {
        historyContainer.innerHTML = `
            <div class="offline-message">
                <h3>You're offline</h3>
                <p>Connect to the internet to view your image history.</p>
                <button class="retry-btn">Retry</button>
            </div>
        `;
        
        // Add event listener to retry button
        const retryBtn = historyContainer.querySelector('.retry-btn');
        if (retryBtn) {
            retryBtn.addEventListener('click', loadImageHistory);
        }
    }

    // Function to show error message
    function showError(message) {
        historyContainer.innerHTML = `
            <div class="error-message">
                <h3>Error</h3>
                <p>${message}</p>
                <a href="image.html" class="create-new-btn">Create New Image</a>
                <button class="retry-btn">Retry</button>
            </div>
        `;
        
        // Add event listener to retry button
        const retryBtn = historyContainer.querySelector('.retry-btn');
        if (retryBtn) {
            retryBtn.addEventListener('click', loadImageHistory);
        }
    }
}); 
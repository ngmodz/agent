document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const historyContainer = document.getElementById('historyContainer');

    // Check if Supabase is initialized
    if (typeof supabaseClient === 'undefined') {
        showError('Supabase client is not initialized. Please check your configuration.');
        return;
    }

    // Load image history when the page is loaded
    window.addEventListener('load', () => {
        loadImageHistory();
    });

    // Function to load image history
    async function loadImageHistory() {
        try {
            // Clear loading spinner
            historyContainer.innerHTML = '';

            // Get image history from Supabase
            const result = await getImageHistory();

            if (!result.success) {
                showError('Failed to load image history. Please try again later.');
                return;
            }

            // Check if there are any images in the history
            if (result.data.length === 0) {
                showEmptyHistory();
                return;
            }

            // Display images in the history
            result.data.forEach(image => {
                const historyItem = createHistoryItem(image);
                historyContainer.appendChild(historyItem);
            });
        } catch (error) {
            console.error('Error loading image history:', error);
            showError('An error occurred while loading image history.');
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
            <img src="${image.image_url}" alt="${image.service_name}" class="history-image">
            <div class="history-details">
                <div class="history-title">${image.service_name || 'Untitled'}</div>
                <div class="history-date">${formattedDate}</div>
                <div class="history-category">${category}</div>
            </div>
        `;

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
            const result = await deleteImageFromHistory(id);

            if (!result.success) {
                alert('Failed to delete image. Please try again.');
                return;
            }

            // Remove the history item from the DOM
            const historyItem = document.querySelector(`.history-item[data-id="${id}"]`);
            if (historyItem) {
                historyItem.remove();
            }

            // Check if there are any images left
            if (historyContainer.children.length === 0) {
                showEmptyHistory();
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

    // Function to show error message
    function showError(message) {
        historyContainer.innerHTML = `
            <div class="error-message">
                <h3>Error</h3>
                <p>${message}</p>
                <a href="image.html" class="create-new-btn">Create New Image</a>
            </div>
        `;
    }
}); 
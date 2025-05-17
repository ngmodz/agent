document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const mainForm = document.getElementById('mainForm');
    const formatSelection = document.getElementById('formatSelection');
    const canvasContainer = document.getElementById('canvasContainer');
    const submitFormBtn = document.getElementById('submitForm');
    const downloadBtn = document.getElementById('downloadBtn');
    const startOverBtn = document.getElementById('startOverBtn');
    const imageCanvas = document.getElementById('imageCanvas');
    const servicesList = document.getElementById('servicesList');
    const addServiceBtn = document.getElementById('addServiceBtn');

    // Form input elements
    const categoryInput = document.getElementById('category');
    const serviceNameInput = document.getElementById('serviceName');
    
    // Service counter for unique IDs
    let serviceCounter = 1;
    
    // Format options
    const formatOptions = document.querySelectorAll('.format-option');
    
    // Check if we're on mobile
    const isMobile = window.innerWidth <= 768;

    // Force initialization after everything is loaded to avoid flash
    window.addEventListener('load', () => {
        // Initialize social media buttons
        initSocialMediaButtons();
        
        // Initialize add service button
        initAddServiceButton();
        
        // Mark body as loaded for proper positioning on mobile
        if (isMobile) {
            setTimeout(() => {
                document.body.classList.add('page-loaded');
            }, 300);
        }
    });

    // SVG constants for image generation
    const instagramLogoSVG = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="256" height="256" viewBox="0 0 256 256">
        <defs>
            <linearGradient id="instagramGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#833AB4"/>
                <stop offset="50%" style="stop-color:#C13584"/>
                <stop offset="100%" style="stop-color:#F77737"/>
            </linearGradient>
        </defs>
        <circle cx="128" cy="128" r="120" fill="url(#instagramGradient)"/>
        <g transform="translate(60, 60) scale(0.53)">
            <path fill="#FFFFFF" d="M128,23.064c34.177,0,38.225,0.13,51.722,0.745c12.48,0.57,19.258,2.655,23.769,4.408c5.974,2.322,10.238,5.096,14.717,9.575c4.48,4.479,7.253,8.743,9.575,14.717c1.753,4.511,3.838,11.289,4.408,23.768c0.615,13.498,0.745,17.546,0.745,51.723c0,34.178-0.13,38.226-0.745,51.723c-0.57,12.48-2.655,19.257-4.408,23.768c-2.322,5.974-5.096,10.239-9.575,14.718c-4.479,4.479-8.743,7.253-14.717,9.574c-4.511,1.753-11.289,3.839-23.769,4.408c-13.495,0.616-17.543,0.746-51.722,0.746c-34.18,0-38.228-0.13-51.723-0.746c-12.48-0.57-19.257-2.655-23.768-4.408c-5.974-2.321-10.239-5.095-14.718-9.574c-4.479-4.48-7.253-8.744-9.574-14.718c-1.753-4.51-3.839-11.288-4.408-23.768c-0.616-13.497-0.746-17.545-0.746-51.723c0-34.177,0.13-38.225,0.746-51.722c0.57-12.48,2.655-19.258,4.408-23.769c2.321-5.974,5.095-10.238,9.574-14.717c4.48-4.48,8.744-7.253,14.718-9.575c4.51-1.753,11.288-3.838,23.768-4.408c13.497-0.615,17.545-0.745,51.723-0.745 M128,0C93.237,0,88.878,0.147,75.226,0.77c-13.625,0.622-22.93,2.786-31.071,5.95c-8.418,3.271-15.556,7.648-22.672,14.764C14.367,28.6,9.991,35.738,6.72,44.155C3.555,52.297,1.392,61.602,0.77,75.226C0.147,88.878,0,93.237,0,128c0,34.763,0.147,39.122,0.77,52.774c0.622,13.625,2.785,22.93,5.95,31.071c3.27,8.417,7.647,15.556,14.763,22.672c7.116,7.116,14.254,11.492,22.672,14.763c8.142,3.165,17.446,5.328,31.07,5.95c13.653,0.623,18.012,0.77,52.775,0.77s39.122-0.147,52.774-0.77c13.624-0.622,22.929-2.785,31.07-5.95c8.418-3.27,15.556-7.647,22.672-14.763c7.116-7.116,11.493-14.254,14.764-22.672c3.164-8.142,5.328-17.446,5.95-31.07c0.623-13.653,0.77-18.012,0.77-52.775s-0.147-39.122-0.77-52.774c-0.622-13.624-2.786-22.929-5.95-31.07c-3.271-8.418-7.648-15.556-14.764-22.672C227.4,14.368,220.262,9.99,211.845,6.72c-8.142-3.164-17.447-5.328-31.071-5.95C167.122,0.147,162.763,0,128,0z"/>
            <path fill="#FFFFFF" d="M128,62.27C91.698,62.27,62.27,91.7,62.27,128c0,36.302,29.428,65.73,65.73,65.73c36.301,0,65.73-29.428,65.73-65.73C193.73,91.699,164.301,62.27,128,62.27z M128,170.667c-23.564,0-42.667-19.103-42.667-42.667S104.436,85.333,128,85.333s42.667,19.103,42.667,42.667S151.564,170.667,128,170.667z"/>
            <path fill="#FFFFFF" d="M211.686,59.673c0,8.484-6.876,15.36-15.36,15.36c-8.483,0-15.36-6.876-15.36-15.36c0-8.483,6.877-15.36,15.36-15.36C204.81,44.313,211.686,51.19,211.686,59.673z"/>
        </g>
    </svg>`;

    const facebookLogoSVG = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="256" height="256" viewBox="0 0 256 256">
        <defs>
            <linearGradient id="facebookGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#3b5998"/>
                <stop offset="100%" style="stop-color:#0b93ff"/>
            </linearGradient>
        </defs>
        <circle cx="128" cy="128" r="120" fill="url(#facebookGradient)"/>
        <path fill="#FFFFFF" d="M137.85,208.35v-72.53h24.35l3.65-28.28h-28v-18.03c0-8.18,2.27-13.76,14.01-13.76l14.97-0.01V51.37c-2.59-0.34-11.47-1.11-21.82-1.11c-21.58,0-36.36,13.17-36.36,37.36v20.85H85.21v28.28h23.44v72.53H137.85z"/>
    </svg>`;

    const youtubeLogoSVG = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="256" height="256" viewBox="0 0 256 256">
        <defs>
            <linearGradient id="youtubeGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#94002d"/>
                <stop offset="100%" style="stop-color:#eb3018"/>
            </linearGradient>
        </defs>
        <circle cx="128" cy="128" r="120" fill="url(#youtubeGradient)"/>
        <path fill="#FFFFFF" d="M187.5,88.4c-1.9-7.2-7.5-12.8-14.6-14.8C159.4,70,128,70,128,70s-31.4,0-44.9,3.6c-7.1,2-12.7,7.6-14.6,14.8C65,102,65,128,65,128s0,26,3.5,39.6c1.9,7.2,7.5,12.8,14.6,14.8c13.5,3.6,44.9,3.6,44.9,3.6s31.4,0,44.9-3.6c7.1-2,12.7-7.6,14.6-14.8c3.5-13.6,3.5-39.6,3.5-39.6S191,102,187.5,88.4z M112,152V104l36,24L112,152z"/>
    </svg>`;

    // Form data storage
    let formData = {
        category: '',
        serviceName: '',
        services: [],
        format: ''
    };

    // Event listeners
    submitFormBtn.addEventListener('click', handleFormSubmit);
    formatOptions.forEach(option => {
        option.addEventListener('click', handleFormatSelection);
    });
    downloadBtn.addEventListener('click', handleDownload);
    startOverBtn.addEventListener('click', handleStartOver);

    // Initialize add service button
    function initAddServiceButton() {
        addServiceBtn.addEventListener('click', addNewService);
        
        // Initialize remove buttons for existing services
        document.querySelectorAll('.remove-service').forEach(btn => {
            btn.addEventListener('click', removeService);
        });
    }
    
    // Add a new service input row
    function addNewService() {
        const serviceItem = document.createElement('div');
        serviceItem.className = 'service-item';
        
        serviceItem.innerHTML = `
            <button type="button" class="remove-service">&times;</button>
            <div class="form-group">
                <label for="service${serviceCounter}">Service Details</label>
                <input type="text" id="service${serviceCounter}" class="form-control service-detail" placeholder="e.g. 500 followers">
            </div>
            <div class="form-group">
                <label for="price${serviceCounter}">Price</label>
                <div class="price-input-container">
                    <input type="text" id="price${serviceCounter}" class="form-control price-input" placeholder="Enter price" min="0">
                    <span class="price-currency">₹</span>
                </div>
            </div>
        `;
        
        servicesList.appendChild(serviceItem);
        
        // Add event listener to the new remove button
        const removeBtn = serviceItem.querySelector('.remove-service');
        removeBtn.addEventListener('click', removeService);
        
        // Check if this is the second service being added
        if (servicesList.querySelectorAll('.service-item').length === 2) {
            // Add remove button to the first service item
            const firstServiceItem = servicesList.querySelector('.service-item');
            if (!firstServiceItem.querySelector('.remove-service')) {
                const firstRemoveBtn = document.createElement('button');
                firstRemoveBtn.type = 'button';
                firstRemoveBtn.className = 'remove-service';
                firstRemoveBtn.innerHTML = '&times;';
                firstRemoveBtn.addEventListener('click', removeService);
                firstServiceItem.appendChild(firstRemoveBtn);
                firstServiceItem.style.paddingRight = '40px';
            }
        }
        
        serviceCounter++;
    }
    
    // Remove a service input row
    function removeService(e) {
        const serviceItem = e.target.closest('.service-item');
        servicesList.removeChild(serviceItem);
        
        // Check if there's only one service left
        if (servicesList.querySelectorAll('.service-item').length === 1) {
            // Remove the remove button from the last service item
            const lastServiceItem = servicesList.querySelector('.service-item');
            const removeBtn = lastServiceItem.querySelector('.remove-service');
            if (removeBtn) {
                removeBtn.remove();
                lastServiceItem.style.paddingRight = '10px';
            }
        }
    }

    // Handle main form submission
    function handleFormSubmit(e) {
        e.preventDefault();

        // Validate form
        if (!validateForm()) {
            return;
        }

        // Store form data
        formData.category = categoryInput.value;
        formData.serviceName = serviceNameInput.value;
        
        // Get all services
        formData.services = [];
        const serviceItems = document.querySelectorAll('.service-item');
        
        serviceItems.forEach((item, index) => {
            const serviceDetail = item.querySelector('.service-detail').value;
            const price = parseInt(item.querySelector('.price-input').value) || 0;
            
            formData.services.push({
                detail: serviceDetail,
                price: price
            });
        });

        // Hide main form and show format selection
        mainForm.style.display = 'none';
        
        // Force reflow before showing format selection
        window.getComputedStyle(formatSelection).opacity;
        
        formatSelection.style.display = 'block';
        
        // Use transform for hardware acceleration on mobile
        if (isMobile) {
            formatSelection.style.transform = 'translate3d(0, 0, 0)';
            // Force reflow
            window.getComputedStyle(formatSelection).transform;
        }
    }

    // Validate form inputs
    function validateForm() {
        let isValid = true;

        if (!serviceNameInput.value.trim()) {
            alert('Please enter a service name');
            serviceNameInput.focus();
            isValid = false;
            return isValid;
        }
        
        // Validate all service items
        const serviceItems = document.querySelectorAll('.service-item');
        
        for (let i = 0; i < serviceItems.length; i++) {
            const item = serviceItems[i];
            const serviceDetail = item.querySelector('.service-detail');
            const priceInput = item.querySelector('.price-input');
            
            if (!serviceDetail.value.trim()) {
                alert('Please enter service details');
                serviceDetail.focus();
                isValid = false;
                return isValid;
            }
            
            if (!priceInput.value.trim() || isNaN(parseInt(priceInput.value))) {
                alert('Please enter a valid price (numbers only)');
                priceInput.focus();
                isValid = false;
                return isValid;
            }
        }

        return isValid;
    }

    // Handle format selection
    function handleFormatSelection(e) {
        // Remove selected class from all options
        formatOptions.forEach(option => {
            option.classList.remove('selected');
        });

        // Add selected class to clicked option
        const selectedOption = e.currentTarget;
        selectedOption.classList.add('selected');

        // Store selected format
        formData.format = selectedOption.dataset.format;

        // Generate image
        generateImage();

        // Hide format selection
        formatSelection.style.display = 'none';
        
        // Force reflow before showing canvas
        window.getComputedStyle(canvasContainer).opacity;
        
        // Show canvas container with hardware acceleration
        canvasContainer.style.display = 'block';
        
        if (isMobile) {
            canvasContainer.style.transform = 'translate3d(0, 0, 0)';
            // Force reflow
            window.getComputedStyle(canvasContainer).transform;
        }
    }

    // Generate image based on form data and selected format
    function generateImage() {
        const ctx = imageCanvas.getContext('2d');
        let width, height;

        // Set canvas dimensions based on selected format
        switch (formData.format) {
            case 'square':
                width = 1080;
                height = 1080;
                break;
            case 'landscape':
                width = 1920;
                height = 1080;
                break;
            case 'portrait':
                width = 1080;
                height = 1920;
                break;
            default:
                width = 1080;
                height = 1080;
        }

        // Set canvas dimensions
        imageCanvas.width = width;
        imageCanvas.height = height;

        // Calculate font sizes based on canvas dimensions
        const titleSize = Math.floor(width * 0.06);
        const subtitleSize = Math.floor(width * 0.055);
        const detailSize = Math.floor(width * 0.04);
        const serviceDetailSize = Math.floor(width * 0.04);

        // Draw background as white first
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);

        // Calculate border height (approximately 2% of total height)
        const borderHeight = Math.floor(height * 0.02);

        // Draw purple border only at the top that extends to the edges
        ctx.fillStyle = '#B598E4';
        ctx.fillRect(0, 0, width, borderHeight);

        // Draw logo and content
        drawLogoAndContent(ctx, width, height, titleSize, subtitleSize, detailSize, serviceDetailSize);
    }

    // Draw logo and content
    function drawLogoAndContent(ctx, width, height, titleSize, subtitleSize, detailSize, serviceDetailSize) {
        // Set text alignment
        ctx.textAlign = 'center';
        
        // Draw logo based on category
        const logoSize = Math.floor(width * 0.15); // Small size for the logo (15% of width)
        const logoX = width / 2 - logoSize / 2;
        
        // Adjust logo Y position based on format
        let logoY;
        if (formData.format === 'square') {
            logoY = height * 0.08; // Position logo higher in square format
        } else if (formData.format === 'portrait') {
            logoY = height * 0.1; // Position for portrait mode
        } else {
            logoY = height * 0.1; // Default position for other formats
        }

        // Function to draw the logo
        function drawLogo(logoSVG) {
            const img = new Image();
            img.onload = function() {
                ctx.drawImage(img, logoX, logoY, logoSize, logoSize);
                drawContent();
            };
            const svgBlob = new Blob([logoSVG], {type: 'image/svg+xml'});
            const url = URL.createObjectURL(svgBlob);
            img.src = url;
        }

        // Function to draw the content (service name, details, prices, and watermark)
        function drawContent() {
            // Draw service name
            ctx.font = `bold ${subtitleSize}px "Times New Roman"`;
            ctx.fillStyle = '#000000';
            
            // Handle long service names by wrapping text
            const maxLineWidth = width * 0.8;
            const serviceNameLines = wrapText(ctx, formData.serviceName, maxLineWidth);

            // Adjust vertical position based on format
            let startY;
            if (formData.format === 'portrait') {
                startY = height * 0.25; // Adjusted for 9:16 ratio
            } else if (formData.format === 'square') {
                startY = height * 0.32; // Increased spacing for square format
            } else {
                startY = height * 0.28; // Original position for landscape format
            }
            
            // Draw each line of the wrapped service name
            let y = startY;
            const lineHeight = subtitleSize * 1.2;

            serviceNameLines.forEach(line => {
                ctx.fillText(line, width / 2, y);
                y += lineHeight;
            });

            // Add some spacing after the service name
            y += lineHeight * 1.0;
            
            // Calculate line height for service details
            const serviceLineHeight = serviceDetailSize * 1.5;
            
            // Adjust spacing for service details based on format
            if (formData.format === 'square') {
                // For square format, add extra spacing before service details
                y += lineHeight * 0.5;
            }
            
            // Draw each service detail
            formData.services.forEach((service, index) => {
                // Create the price text with the currency symbol
                const priceText = `₹${service.price}`;
                
                // Set up fonts for measurement
                const serviceFont = `${serviceDetailSize * 1.2}px "Times New Roman"`;
                const priceFont = `bold ${serviceDetailSize * 1.2}px "Times New Roman"`;
                
                // Calculate the center point
                const centerX = width / 2;
                
                // Measure text widths
                ctx.font = serviceFont;
                const serviceWidth = ctx.measureText(service.detail).width;
                
                ctx.font = priceFont;
                const priceWidth = ctx.measureText(priceText).width;
                
                // Calculate total width and starting positions
                const totalWidth = serviceWidth + priceWidth + 20; // 20px spacing between service and price
                const startX = centerX - (totalWidth / 2);
                
                // Draw service detail left-aligned from the start position
                ctx.font = serviceFont;
                ctx.fillStyle = '#000000';
                ctx.textAlign = 'left';
                ctx.fillText(service.detail, startX, y);
                
                // Draw price right after the service name
                ctx.font = priceFont;
                ctx.fillStyle = '#007bff'; // Blue color for price
                ctx.fillText(priceText, startX + serviceWidth + 20, y); // 20px spacing
                
                // Move to next service with spacing
                y += serviceLineHeight * 0.8; // Reduced spacing between services
            });

            // Draw watermark
            ctx.font = `${detailSize * 0.7}px "Times New Roman"`;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.textAlign = 'center'; // Ensure text alignment is set to center
            
            // Adjust watermark position based on format
            let watermarkY;
            if (formData.format === 'portrait') {
                watermarkY = height * 0.97; // Adjusted for 9:16 ratio
            } else {
                watermarkY = height * 0.95; // Original position for other formats
            }
            
            ctx.fillText('Viralgurux', width / 2, watermarkY);
        }

        // Choose which logo to draw based on category
        if (formData.category === 'Instagram') {
            drawLogo(instagramLogoSVG);
        } else if (formData.category === 'Facebook') {
            drawLogo(facebookLogoSVG);
        } else if (formData.category === 'YouTube') {
            drawLogo(youtubeLogoSVG);
        } else {
            // Draw the category name as text for other categories
            ctx.font = `bold ${titleSize}px "Times New Roman"`;
            ctx.fillStyle = '#000000';
            ctx.fillText(formData.category, width / 2, logoY + logoSize/2); // Y position for text if no logo
            drawContent(); // Draw other text immediately
        }
    }

    // Function to wrap text
    function wrapText(ctx, text, maxWidth) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = ctx.measureText(currentLine + ' ' + word).width;

            if (width < maxWidth) {
                currentLine += ' ' + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }

        lines.push(currentLine);
        return lines;
    }

    // Handle image download
    function handleDownload() {
        // Create a temporary link
        const link = document.createElement('a');
        
        // Create a safe filename with no spaces
        const safeServiceName = formData.serviceName.substring(0, 10).replace(/\s+/g, '-');

        // Set download attributes
        link.download = `${formData.category}-${safeServiceName}.png`;
        link.href = imageCanvas.toDataURL('image/png');

        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Refresh the page after a short delay to ensure download starts first
        setTimeout(() => {
            window.location.reload();
        }, 500);
    }

    // Initialize social media buttons
    function initSocialMediaButtons() {
        const categoryInput = document.getElementById('category');
        const socialButtons = document.querySelectorAll('.social-btn');

        // Add click event to all social buttons
        socialButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove selected class from all buttons
                socialButtons.forEach(btn => btn.classList.remove('selected'));

                // Add selected class to clicked button
                button.classList.add('selected');

                // Update hidden input value
                categoryInput.value = button.dataset.value;
            });
        });
    }

    // Handle Start Over button click
    function handleStartOver() {
        // Reset form data
        formData = {
            category: '',
            serviceName: '',
            services: [],
            format: ''
        };

        // Reset form input values
        serviceNameInput.value = '';
        
        // Reset services list to just one service
        servicesList.innerHTML = `
            <div class="service-item">
                <div class="form-group">
                    <label for="service0">Service Details</label>
                    <input type="text" id="service0" class="form-control service-detail" placeholder="e.g. 500 followers">
                </div>
                <div class="form-group">
                    <label for="price0">Price</label>
                    <div class="price-input-container">
                        <input type="text" id="price0" class="form-control price-input" placeholder="Enter price" min="0">
                        <span class="price-currency">₹</span>
                    </div>
                </div>
            </div>
        `;
        
        // Reset service counter
        serviceCounter = 1;

        // Reset social media buttons to default (Instagram)
        const socialButtons = document.querySelectorAll('.social-btn');
        socialButtons.forEach(btn => btn.classList.remove('selected'));
        document.querySelector('.instagram-btn').classList.add('selected');
        categoryInput.value = 'Instagram';

        // Reset format options
        formatOptions.forEach(option => {
            option.classList.remove('selected');
        });

        // Hide canvas container and format selection
        canvasContainer.style.display = 'none';
        formatSelection.style.display = 'none';
        
        // Force reflow before showing main form
        window.getComputedStyle(mainForm).opacity;
        
        // Show main form with hardware acceleration
        mainForm.style.display = 'block';
        
        if (isMobile) {
            mainForm.style.transform = 'translate3d(0, 0, 0)';
            // Force reflow
            window.getComputedStyle(mainForm).transform;
        }
    }

    // No longer need the createSVGElement function as we're using inline SVG
});

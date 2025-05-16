document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const mainForm = document.getElementById('mainForm');
    const formatSelection = document.getElementById('formatSelection');
    const canvasContainer = document.getElementById('canvasContainer');
    const submitFormBtn = document.getElementById('submitForm');
    const downloadBtn = document.getElementById('downloadBtn');
    const startOverBtn = document.getElementById('startOverBtn');
    const imageCanvas = document.getElementById('imageCanvas');

    // Form input elements
    const categoryInput = document.getElementById('category');
    const serviceNameInput = document.getElementById('serviceName');
    const priceInput = document.getElementById('price');
    const quantityInput = document.getElementById('quantity');

    // Format options
    const formatOptions = document.querySelectorAll('.format-option');

    // Initialize social media buttons
    initSocialMediaButtons();

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
        price: 0,
        quantity: '',
        format: ''
    };

    // Event listeners
    submitFormBtn.addEventListener('click', handleFormSubmit);
    formatOptions.forEach(option => {
        option.addEventListener('click', handleFormatSelection);
    });
    downloadBtn.addEventListener('click', handleDownload);
    startOverBtn.addEventListener('click', handleStartOver);

    // Handle main form submission
    function handleFormSubmit(e) {
        e.preventDefault();

        // Validate form
        if (!validateForm()) {
            return;
        }

        // Store form data
        formData.category = categoryInput.value; // This now gets the value from our hidden input
        formData.serviceName = serviceNameInput.value;
        formData.price = parseInt(priceInput.value) || 0; // Use parseInt to remove decimals
        formData.quantity = quantityInput.value; // Store quantity as string

        // Hide main form and show format selection
        mainForm.style.display = 'none';
        formatSelection.style.display = 'block';
    }

    // Validate form inputs
    function validateForm() {
        let isValid = true;

        if (!serviceNameInput.value.trim()) {
            alert('Please enter a service name');
            serviceNameInput.focus();
            isValid = false;
        } else if (!priceInput.value.trim() || isNaN(parseInt(priceInput.value))) {
            alert('Please enter a valid price (numbers only)');
            priceInput.focus();
            isValid = false;
        } else if (!quantityInput.value.trim()) {
            alert('Please enter a quantity');
            quantityInput.focus();
            isValid = false;
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

        // Show canvas container
        formatSelection.style.display = 'none';
        canvasContainer.style.display = 'block';
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
                height = 1350;
                break;
            default:
                width = 1080;
                height = 1080;
        }

        // Set canvas dimensions
        imageCanvas.width = width;
        imageCanvas.height = height;

        // Draw background as white first
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);

        // Calculate border height (approximately 2% of total height)
        const borderHeight = Math.floor(height * 0.02);

        // Draw purple border only at the top that extends to the edges
        ctx.fillStyle = '#B598E4';
        // Top border - full width, extends from top edge
        ctx.fillRect(0, 0, width, borderHeight);
        // Bottom border removed as requested

        // Draw black text content
        drawBlackTextContent(ctx, width, height);
    }

    // Draw content with black text on white background
    function drawBlackTextContent(ctx, width, height) {
        // Set black text color
        ctx.fillStyle = '#000000';

        // Calculate font sizes based on canvas dimensions (increased for better visibility)
        const titleSize = Math.floor(width * 0.06);
        const subtitleSize = Math.floor(width * 0.045);
        const detailSize = Math.floor(width * 0.04);

        // Set text alignment
        ctx.textAlign = 'center';

        // Draw logo based on category
        const logoSize = Math.floor(width * 0.15); // Small size for the logo (15% of width)
        const logoX = width / 2 - logoSize / 2;
        const logoY = height * 0.15;

        function drawLogo(logoSVG) {
            // Create a temporary image to draw the SVG
            const img = new Image();
            img.onload = function() {
                ctx.drawImage(img, logoX, logoY, logoSize, logoSize);

                // Continue drawing the rest of the content
                drawRemainingContent();
            };

            // Convert SVG to data URL
            const svgBlob = new Blob([logoSVG], {type: 'image/svg+xml'});
            const url = URL.createObjectURL(svgBlob);
            img.src = url;
        }

        if (formData.category === 'Instagram') {
            drawLogo(instagramLogoSVG);
        } else if (formData.category === 'Facebook') {
            drawLogo(facebookLogoSVG);
        } else if (formData.category === 'YouTube') {
            drawLogo(youtubeLogoSVG);
        } else {
            // Draw the category name as text for other categories
            ctx.font = `bold ${titleSize}px Arial`;
            ctx.fillText(formData.category, width / 2, height * 0.25); // Y position for text if no logo
            drawRemainingContent(); // Draw other text immediately
        }

        function drawRemainingContent() {
            // Draw service name
            ctx.font = `${subtitleSize}px Arial`;

            // Handle long service names by wrapping text
            const maxLineWidth = width * 0.8;
            const serviceNameLines = wrapText(ctx, formData.serviceName, maxLineWidth);

            // Draw each line of the wrapped service name
            let y = height * 0.4;
            const lineHeight = subtitleSize * 1.2;

            serviceNameLines.forEach(line => {
                ctx.fillText(line, width / 2, y);
                y += lineHeight;
            });

            // Draw price
            ctx.font = `bold ${detailSize}px Arial`;
            ctx.fillText(`Price: ₹${formData.price}`, width / 2, height * 0.65);

            // Draw quantity
            ctx.fillText(`Quantity: ${formData.quantity}`, width / 2, height * 0.72);

            // Draw watermark
            ctx.font = `${detailSize * 0.7}px Arial`;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.fillText('Viralgurux', width / 2, height * 0.95);
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
            price: 0,
            quantity: '',
            format: ''
        };

        // Reset form input values
        serviceNameInput.value = '';
        priceInput.value = '';
        quantityInput.value = '';

        // Reset social media buttons to default (Instagram)
        const socialButtons = document.querySelectorAll('.social-btn');
        socialButtons.forEach(btn => btn.classList.remove('selected'));
        document.querySelector('.instagram-btn').classList.add('selected');
        categoryInput.value = 'Instagram';

        // Reset format options
        formatOptions.forEach(option => {
            option.classList.remove('selected');
        });

        // Hide canvas container and format selection, show main form
        canvasContainer.style.display = 'none';
        formatSelection.style.display = 'none';
        mainForm.style.display = 'block';
    }

    // No longer need the createSVGElement function as we're using inline SVG
});

document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const mainForm = document.getElementById('mainForm');
    const formatSelection = document.getElementById('formatSelection');
    const canvasContainer = document.getElementById('canvasContainer');
    const submitFormBtn = document.getElementById('submitForm');
    const downloadBtn = document.getElementById('downloadBtn');
    const imageCanvas = document.getElementById('imageCanvas');

    // Form input elements
    const categoryInput = document.getElementById('category');
    const serviceNameInput = document.getElementById('serviceName');
    const priceInput = document.getElementById('price');
    const quantityInput = document.getElementById('quantity');

    // Format options
    const formatOptions = document.querySelectorAll('.format-option');

    // Form data storage
    let formData = {
        category: '',
        serviceName: '',
        price: 0,
        quantity: 0,
        format: ''
    };

    // Event listeners
    submitFormBtn.addEventListener('click', handleFormSubmit);
    formatOptions.forEach(option => {
        option.addEventListener('click', handleFormatSelection);
    });
    downloadBtn.addEventListener('click', handleDownload);

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
        formData.price = parseFloat(priceInput.value);
        formData.quantity = parseInt(quantityInput.value);

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
        } else if (!priceInput.value || isNaN(parseFloat(priceInput.value)) || parseFloat(priceInput.value) < 0) {
            alert('Please enter a valid price');
            priceInput.focus();
            isValid = false;
        } else if (!quantityInput.value || isNaN(parseInt(quantityInput.value)) || parseInt(quantityInput.value) < 1) {
            alert('Please enter a valid quantity');
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

        // Draw background
        drawBackground(ctx, width, height);

        // Draw content
        drawContent(ctx, width, height);
    }

    // Draw background (white)
    function drawBackground(ctx, width, height) {
        // Fill with white background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);

        // Add a subtle border
        ctx.strokeStyle = '#EEEEEE';
        ctx.lineWidth = 10;
        ctx.strokeRect(5, 5, width - 10, height - 10);

        // Add a small colored accent based on category
        let accentColor;
        switch (formData.category) {
            case 'Instagram':
                accentColor = '#E1306C'; // Instagram color
                break;
            case 'Facebook':
                accentColor = '#1877F2'; // Facebook blue
                break;
            case 'YouTube':
                accentColor = '#FF0000'; // YouTube red
                break;
            default:
                accentColor = '#007bff'; // Default blue
        }

        // Draw a small accent line at the top
        ctx.fillStyle = accentColor;
        ctx.fillRect(0, 0, width, 10);
    }

    // Draw content on the canvas
    function drawContent(ctx, width, height) {
        // Set text color (black)
        ctx.fillStyle = '#000000';

        // Calculate font sizes based on canvas dimensions
        const titleSize = Math.floor(width * 0.05);
        const subtitleSize = Math.floor(width * 0.035);
        const detailSize = Math.floor(width * 0.03);

        // Set text alignment
        ctx.textAlign = 'center';

        // Get accent color for category title
        let accentColor;
        switch (formData.category) {
            case 'Instagram':
                accentColor = '#E1306C'; // Instagram color
                break;
            case 'Facebook':
                accentColor = '#1877F2'; // Facebook blue
                break;
            case 'YouTube':
                accentColor = '#FF0000'; // YouTube red
                break;
            default:
                accentColor = '#007bff'; // Default blue
        }

        // Draw category (as title) with accent color
        ctx.fillStyle = accentColor;
        ctx.font = `bold ${titleSize}px Arial`;
        ctx.fillText(formData.category, width / 2, height * 0.25);

        // Switch back to black for remaining text
        ctx.fillStyle = '#000000';

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
        ctx.fillText(`Price: ₹${formData.price.toFixed(2)}`, width / 2, height * 0.65);

        // Draw quantity
        ctx.fillText(`Quantity: ${formData.quantity}`, width / 2, height * 0.72);

        // Draw watermark
        ctx.font = `${detailSize * 0.7}px Arial`;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillText('Viralgurux', width / 2, height * 0.95);
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

        // Set download attributes
        link.download = `${formData.category}-${formData.serviceName.substring(0, 10)}.png`;
        link.href = imageCanvas.toDataURL('image/png');

        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
});

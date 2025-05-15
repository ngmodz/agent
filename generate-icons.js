// This script generates placeholder icons for the PWA
// You can run it with Node.js: node generate-icons.js

const fs = require('fs');
const path = require('path');

// Make sure the icons directory exists
const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Function to generate a simple SVG icon with text
function generateSvgIcon(size, text) {
  return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#007bff"/>
    <text x="50%" y="50%" font-family="Arial" font-size="${size/4}px" fill="white" text-anchor="middle" dominant-baseline="middle">${text}</text>
  </svg>`;
}

// Generate the icons
const iconSizes = [
  { size: 192, filename: 'icon-192x192.png' },
  { size: 512, filename: 'icon-512x512.png' }
];

iconSizes.forEach(({ size, filename }) => {
  const svgContent = generateSvgIcon(size, 'Agent');
  fs.writeFileSync(path.join(iconsDir, `${filename.replace('.png', '.svg')}`), svgContent);
  console.log(`Generated ${filename.replace('.png', '.svg')}`);
  console.log(`Note: You'll need to convert the SVG to PNG. You can use online tools like:
  - https://svgtopng.com/
  - https://convertio.co/svg-png/
  Or use software like Inkscape, GIMP, or Photoshop`);
});

console.log(`
Placeholder SVG icons have been generated in the 'icons' directory.
For better results, replace these with proper PNG icons of the corresponding sizes.

Remember to:
1. Convert the SVGs to PNGs with the correct filenames
2. Or create your own custom icons with the specified dimensions
`);

// Also create a simple placeholder for icon-maskable
const maskableSvgContent = generateSvgIcon(512, 'Agent');
fs.writeFileSync(path.join(iconsDir, 'icon-maskable.svg'), maskableSvgContent);
console.log(`Generated additional maskable icon placeholder in SVG format`); 
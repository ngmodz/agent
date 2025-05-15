# PWA Setup for Agent Website

This document explains how to properly set up the Progressive Web App (PWA) features of the Agent website.

## Icon Setup

The PWA requires two icon sizes to function properly:
- 192x192 pixels
- 512x512 pixels

### Current Status
We've included SVG placeholder icons in the `icons` folder:
- `icon-192x192.svg`
- `icon-512x512.svg`

However, the PWA manifest expects PNG files with these names:
- `icon-192x192.png`
- `icon-512x512.png`

### Converting SVG to PNG
You have several options to create the PNG icons:

1. **Online Converters**:
   - [SVG to PNG Converter](https://svgtopng.com/)
   - [Convertio](https://convertio.co/svg-png/)

2. **Using Design Software**:
   - Adobe Photoshop
   - GIMP (free)
   - Inkscape (free)
   - Figma (free)

3. **Creating Custom Icons**:
   - For better results, consider designing custom icons with your brand elements
   - Ensure they match the required dimensions (192x192px and 512x512px)
   - Save them with the correct filenames in the `icons` directory

## Verifying PWA Installation

1. Open the website in Chrome or Edge
2. Open Developer Tools (F12)
3. Go to the "Application" tab
4. Check "Manifest" section to verify manifest data is loaded
5. Check "Service Workers" section to verify the service worker is active
6. In Chrome, you should see an install prompt in the address bar

## PWA Features Implemented

- ✅ Responsive design for mobile devices
- ✅ Web App Manifest
- ✅ Service Worker for offline functionality
- ✅ Cache API implementation
- ✅ Offline fallback page
- ✅ "Add to Home Screen" capability

## Testing PWA Features

1. **Offline Mode**: Turn off your network connection and reload the page
2. **Installation**: Use the browser's "Add to Home Screen" option
3. **Startup**: Launch the app from your home screen to verify standalone mode

## Troubleshooting

If the PWA features aren't working:
1. Ensure all icon files are present and properly formatted
2. Check the browser console for any error messages
3. Verify that the service worker is registered (in Application tab) 
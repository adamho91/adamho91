// Image Pixelizer for Featured Images
// This script automatically pixelizes '.featured-img' and '.case-study-preview-image' elements

(function() {
    // Image Pixelizer Class
    class ImagePixelizer {
      constructor(options = {}) {
        this.pixelSize = options.pixelSize || 30; // Size of each pixel block
        this.duration = options.duration || 1000; // Duration in milliseconds
        this.fadeTime = options.fadeTime || 300; // Transition time in milliseconds
        this.selector = options.selector || '.featured-img, .case-study-preview-image'; // CSS selector for images
        this.processedImages = new Set(); // Track processed images
        this.fallbackColor = options.fallbackColor || '#e0e0e0'; // Fallback color for CORS issues
        this.initialized = false; // Track if we've initialized
      }
  
      init() {
        if (!this.initialized) {
          this.initialized = true;
          this.processImages();
          
          // Set up a single mutation observer
          this.setupMutationObserver();
          
          // Handle window load event once
          window.addEventListener('load', () => this.processImages(), { once: true });
        } else {
          // Just process images if already initialized
          this.processImages();
        }
      }
      
      processImages() {
        // Find all images with the specified selector
        const images = document.querySelectorAll(this.selector);
        
        // Process each image that hasn't been processed yet
        images.forEach(img => {
          if (this.processedImages.has(img)) return;
          this.processedImages.add(img);
          
          this.processImage(img);
        });
      }
      
      processImage(img) {
        // Add crossorigin attribute to help with CORS
        if (!img.hasAttribute('crossorigin') && img.src.startsWith('http')) {
          img.setAttribute('crossorigin', 'anonymous');
        }
        
        // Create a wrapper for the image
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        wrapper.style.width = '100%';
        wrapper.style.height = '100%';
        wrapper.style.overflow = 'hidden';
        
        // Insert wrapper before image
        img.parentNode.insertBefore(wrapper, img);
        
        // Move image into wrapper
        wrapper.appendChild(img);
        
        // Force the image to be hidden initially
        img.style.opacity = '0';
        img.style.transition = `opacity ${this.fadeTime}ms ease-in-out`;
        
        // Use a simple color placeholder immediately
        const color = this.fallbackColor;
        this.createColorPlaceholder(img, wrapper, color);
        
        // Try to get the dominant color asynchronously
        this.getDominantColor(img, (detectedColor) => {
          // Update the placeholder color if we detected one
          const placeholders = wrapper.querySelectorAll('.pixelizer-placeholder');
          if (placeholders.length > 0 && detectedColor !== this.fallbackColor) {
            placeholders[0].style.backgroundColor = detectedColor;
          }
        });
      }
      
      setupMutationObserver() {
        // Add a mutation observer to handle dynamically added images
        const observer = new MutationObserver((mutations) => {
          // Only run if we see new nodes added
          if (mutations.some(mutation => mutation.addedNodes.length > 0)) {
            this.processImages();
          }
        });
        
        // Start observing the document with the configured parameters
        observer.observe(document.body, { 
          childList: true,
          subtree: true 
        });
      }
      
      getDominantColor(img, callback) {
        // Default color in case we can't detect
        let color = this.fallbackColor;
        
        const tryGetColor = () => {
          try {
            // Create a tiny canvas to sample the image
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Set to 1x1 pixel to get average color
            canvas.width = 1;
            canvas.height = 1;
            
            // Try to draw the image to the tiny canvas
            ctx.drawImage(img, 0, 0, 1, 1);
            const data = ctx.getImageData(0, 0, 1, 1).data;
            color = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
            callback(color);
          } catch (e) {
            console.log('Could not get image color:', e);
            callback(color);
          }
        };
        
        // If image is already loaded, try immediately
        if (img.complete) {
          tryGetColor();
        } else {
          // Otherwise wait for it to load (using once to ensure single execution)
          img.addEventListener('load', tryGetColor, { once: true });
        }
      }
      
      createColorPlaceholder(img, wrapper, color) {
        // Create a simple colored placeholder
        const placeholder = document.createElement('div');
        placeholder.className = 'pixelizer-placeholder';
        placeholder.style.position = 'absolute';
        placeholder.style.top = '0';
        placeholder.style.left = '0';
        placeholder.style.width = '100%';
        placeholder.style.height = '100%';
        placeholder.style.backgroundColor = color;
        placeholder.style.transition = `opacity ${this.fadeTime}ms ease-in-out`;
        
        wrapper.appendChild(placeholder);
        
        // Fade out the placeholder after the duration
        setTimeout(() => {
          img.style.opacity = '1';
          placeholder.style.opacity = '0';
          
          // Remove the placeholder after transition
          setTimeout(() => {
            if (placeholder.parentNode === wrapper) {
              wrapper.removeChild(placeholder);
            }
          }, this.fadeTime);
        }, this.duration);
      }
    }
  
    // Create a single instance of the pixelizer
    const pixelizer = new ImagePixelizer({
      pixelSize: 40,      // Larger pixels
      duration: 2000,     // Longer duration
      fadeTime: 500,      // Slower fade
      fallbackColor: '#e0e0e0' // Light gray fallback
    });
  
    // Initialize on DOMContentLoaded (once)
    document.addEventListener('DOMContentLoaded', () => pixelizer.init(), { once: true });
})();

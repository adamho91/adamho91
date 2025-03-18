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
        this.fallbackColor = options.fallbackColor || '#f0f0f0'; // Fallback color for CORS issues
      }
  
      init() {
        // Find all images with the specified selector
        const images = document.querySelectorAll(this.selector);
        
        // Process each image
        images.forEach(img => {
          // Skip if already processed
          if (this.processedImages.has(img)) return;
          this.processedImages.add(img);
          
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
          
          // Try to get the dominant color
          this.getDominantColor(img, (color) => {
            // Create a solid color placeholder
            this.createColorPlaceholder(img, wrapper, color);
            
            // When image is loaded, try to create the real pixelized version
            if (img.complete) {
              this.pixelizeImage(img, wrapper);
            } else {
              img.onload = () => this.pixelizeImage(img, wrapper);
            }
          });
        });
      }
      
      getDominantColor(img, callback) {
        // Default color in case we can't detect
        let color = this.fallbackColor;
        
        try {
          // Create a tiny canvas to sample the image
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Set to 1x1 pixel to get average color
          canvas.width = 1;
          canvas.height = 1;
          
          // Try to draw the image to the tiny canvas
          if (img.complete) {
            ctx.drawImage(img, 0, 0, 1, 1);
            const data = ctx.getImageData(0, 0, 1, 1).data;
            color = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
          } else {
            // If image isn't loaded yet, set up a one-time load handler
            const tempHandler = () => {
              try {
                ctx.drawImage(img, 0, 0, 1, 1);
                const data = ctx.getImageData(0, 0, 1, 1).data;
                color = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
              } catch (e) {
                console.log('Could not get image color:', e);
              }
              callback(color);
              img.removeEventListener('load', tempHandler);
            };
            img.addEventListener('load', tempHandler);
            return; // Exit early, callback will be called when image loads
          }
        } catch (e) {
          console.log('Could not get image color:', e);
        }
        
        // Call the callback with whatever color we determined
        callback(color);
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
  
      pixelizeImage(img, wrapper) {
        try {
          // Create canvas for pixelized version
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Set canvas dimensions
          canvas.width = img.naturalWidth || img.width || 300;
          canvas.height = img.naturalHeight || img.height || 200;
          
          // Position canvas absolutely over the image
          canvas.style.position = 'absolute';
          canvas.style.top = '0';
          canvas.style.left = '0';
          canvas.style.width = '100%';
          canvas.style.height = '100%';
          canvas.style.opacity = '1';
          canvas.style.transition = `opacity ${this.fadeTime}ms ease-in-out`;
          
          // Try to draw the image to canvas
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Try to get pixel data - this may fail due to CORS
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          // Create a new image data for the pixelized version
          const pixelizedData = ctx.createImageData(canvas.width, canvas.height);
          
          // For each block
          for (let y = 0; y < Math.ceil(canvas.height / this.pixelSize); y++) {
            for (let x = 0; x < Math.ceil(canvas.width / this.pixelSize); x++) {
              // Calculate the average color for this block
              let r = 0, g = 0, b = 0, a = 0;
              let count = 0;
              
              // Loop through each pixel in the block
              for (let py = 0; py < this.pixelSize; py++) {
                for (let px = 0; px < this.pixelSize; px++) {
                  const posX = x * this.pixelSize + px;
                  const posY = y * this.pixelSize + py;
                  
                  // Skip if outside image
                  if (posX >= canvas.width || posY >= canvas.height) continue;
                  
                  // Get pixel index
                  const i = (posY * canvas.width + posX) * 4;
                  
                  // Sum up RGBA values
                  r += data[i];
                  g += data[i + 1];
                  b += data[i + 2];
                  a += data[i + 3];
                  count++;
                }
              }
              
              // Calculate average color
              r = Math.floor(r / count);
              g = Math.floor(g / count);
              b = Math.floor(b / count);
              a = Math.floor(a / count);
              
              // Fill the entire block with the average color
              for (let py = 0; py < this.pixelSize; py++) {
                for (let px = 0; px < this.pixelSize; px++) {
                  const posX = x * this.pixelSize + px;
                  const posY = y * this.pixelSize + py;
                  
                  // Skip if outside image
                  if (posX >= canvas.width || posY >= canvas.height) continue;
                  
                  // Get pixel index in new image data
                  const i = (posY * canvas.width + posX) * 4;
                  
                  // Set color
                  pixelizedData.data[i] = r;
                  pixelizedData.data[i + 1] = g;
                  pixelizedData.data[i + 2] = b;
                  pixelizedData.data[i + 3] = a;
                }
              }
            }
          }
          
          // Put the pixelized data back to the canvas
          ctx.putImageData(pixelizedData, 0, 0);
          
          // Add the canvas to the wrapper
          wrapper.appendChild(canvas);
          
          // Ensure the pixelized version is shown for the full duration
          setTimeout(() => {
            img.style.opacity = '1';
            canvas.style.opacity = '0';
            
            // Remove the canvas after transition
            setTimeout(() => {
              if (canvas.parentNode === wrapper) {
                wrapper.removeChild(canvas);
              }
            }, this.fadeTime);
          }, this.duration);
          
        } catch (error) {
          console.log('Pixelizer: Could not process image due to CORS or other issues', error);
          // The placeholder will still work, so the user sees something
        }
      }
    }
  
    // Create a single instance of the pixelizer
    const pixelizer = new ImagePixelizer({
      pixelSize: 40,      // Larger pixels
      duration: 2000,     // Longer duration
      fadeTime: 500,      // Slower fade
      fallbackColor: '#e0e0e0' // Light gray fallback
    });
  
    // Initialize on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', function() {
      pixelizer.init();
    });
  
    // Also check on window load to catch any images loaded later
    window.addEventListener('load', function() {
      pixelizer.init();
    });
  
    // Add a mutation observer to handle dynamically added images
    const observer = new MutationObserver(function(mutations) {
      // Only run if we see new nodes added
      if (mutations.some(mutation => mutation.addedNodes.length > 0)) {
        pixelizer.init();
      }
    });
  
    // Start observing the document with the configured parameters
    observer.observe(document.body, { 
      childList: true,
      subtree: true 
    });
})();

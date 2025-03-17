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
      }
  
      init() {
        // Find all images with the specified selector
        const images = document.querySelectorAll(this.selector);
        
        // Process each image
        images.forEach(img => {
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
          
          // Hide original image initially
          img.style.opacity = '0';
          img.style.transition = `opacity ${this.fadeTime}ms ease-in-out`;
          
          // When image is loaded, create the pixelized version
          if (img.complete) {
            this.pixelizeImage(img, wrapper);
          } else {
            img.onload = () => this.pixelizeImage(img, wrapper);
          }
        });
      }
  
      pixelizeImage(img, wrapper) {
        // Create canvas for pixelized version
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas dimensions
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Position canvas absolutely over the image
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.opacity = '1';
        canvas.style.transition = `opacity ${this.fadeTime}ms ease-in-out`;
        
        // Draw pixelized version to canvas
        ctx.drawImage(img, 0, 0, img.width, img.height);
        
        // Calculate the number of pixels in the grid
        const numBlocksX = Math.ceil(img.width / this.pixelSize);
        const numBlocksY = Math.ceil(img.height / this.pixelSize);
        
        // Get the pixel data
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const data = imageData.data;
        
        // Create a new image data for the pixelized version
        const pixelizedData = ctx.createImageData(img.width, img.height);
        
        // For each block
        for (let y = 0; y < numBlocksY; y++) {
          for (let x = 0; x < numBlocksX; x++) {
            // Calculate the average color for this block
            let r = 0, g = 0, b = 0, a = 0;
            let count = 0;
            
            // Loop through each pixel in the block
            for (let py = 0; py < this.pixelSize; py++) {
              for (let px = 0; px < this.pixelSize; px++) {
                const posX = x * this.pixelSize + px;
                const posY = y * this.pixelSize + py;
                
                // Skip if outside image
                if (posX >= img.width || posY >= img.height) continue;
                
                // Get pixel index
                const i = (posY * img.width + posX) * 4;
                
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
                if (posX >= img.width || posY >= img.height) continue;
                
                // Get pixel index in new image data
                const i = (posY * img.width + posX) * 4;
                
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
        
        // Fade in the original image and fade out the pixelized canvas after the duration
        setTimeout(() => {
          img.style.opacity = '1';
          canvas.style.opacity = '0';
          
          // Remove the canvas after transition
          setTimeout(() => {
            wrapper.removeChild(canvas);
          }, this.fadeTime);
        }, this.duration);
      }
    }
  
    // Initialize the pixelizer when the DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
      const pixelizer = new ImagePixelizer();
      pixelizer.init();
    });
  
    // Also handle images that might load after initial DOM load
    window.addEventListener('load', function() {
      const pixelizer = new ImagePixelizer();
      pixelizer.init();
    });
  })();
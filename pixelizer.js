/**
 * Main JavaScript file for the website
 * Combines image pixelizer and other functionality
 */

(function() {
  // Track initialization to prevent duplicate setup
  let initialized = false;
  
  /**
   * Image Pixelizer Class
   * Creates a color-based loading effect for images
   */
  class ImagePixelizer {
    constructor(options = {}) {
      this.pixelSize = options.pixelSize || 30; // Size of each pixel block
      this.duration = options.duration || 1000; // Duration in milliseconds
      this.fadeTime = options.fadeTime || 300; // Transition time in milliseconds
      this.selector = options.selector || '.featured-img, .case-study-preview-image'; // CSS selector for images
      this.processedImages = new Set(); // Track processed images
      this.fallbackColor = options.fallbackColor || '#e0e0e0'; // Fallback color for CORS issues
    }
  
    init() {
      this.processImages();
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

  /**
   * Image Preview System
   * Handles image previews when hovering over case study images
   */
  class ImagePreviewSystem {
    constructor() {
      this.previewContainer = null;
      this.stackContainer = null;
      this.stackItems = [];
      this.hoverTimeout = null;
      this.currentHoverElement = null;
      this.isTouch = false;
    }
    
    init() {
      // Create preview container
      this.previewContainer = document.createElement('div');
      this.previewContainer.className = 'preview-container';
      document.body.appendChild(this.previewContainer);
      
      // Create stack container
      this.stackContainer = document.createElement('div');
      this.stackContainer.className = 'preview-stack';
      document.body.appendChild(this.stackContainer);
      
      // Add styles
      this.addStyles();
      
      // Setup event listeners
      this.setupEventListeners();
    }
    
    addStyles() {
      const style = document.createElement('style');
      style.textContent = `
        @media (min-width: 991px) {
          .preview-container {
            position: fixed;
            width: 400px;
            overflow: hidden;
            display: none;
            z-index: 9999;
            bottom: 8px;
            left: 8px;
            background: white;
            pointer-events: none;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          }
          .preview-container img {
            width: 100%;
            height: auto;
            display: block;
          }
          .preview-stack {
            position: fixed;
            bottom: 8px;
            left: 8px;
            z-index: 9999;
            display: flex;
            gap: 8px;
            pointer-events: none;
            align-items: flex-end;
          }
          .preview-item {
            background: white;
            opacity: 1;
            transition: opacity 0.3s ease;
            width: 400px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          }
          .preview-item img {
            width: 100%;
            height: auto;
            display: block;
            vertical-align: bottom;
          }
          .preview-item.fading {
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    setupEventListeners() {
      // Detect touch devices
      window.addEventListener('touchstart', () => {
        this.isTouch = true;
      }, { once: true });
      
      // Handle window resize
      window.addEventListener('resize', () => {
        if (!this.isDesktop()) {
          this.stackItems.forEach(item => item.remove());
          this.stackItems = [];
          this.previewContainer.style.display = 'none';
        }
      });
      
      // Setup image hover and click events
      document.querySelectorAll('.case-study-preview-image').forEach(img => {
        img.addEventListener('mouseenter', (e) => {
          if (this.isTouch || !this.isDesktop()) return;
          if (e.target === img) {
            this.currentHoverElement = img;
            this.showPreview(img);
          }
        });
        
        img.addEventListener('mouseleave', (e) => {
          if (this.isTouch || !this.isDesktop()) return;
          if (e.target === img && !e.relatedTarget?.closest('.case-study-preview-image')) {
            this.hidePreview();
          }
        });
        
        img.addEventListener('click', () => {
          if (!this.isDesktop()) return;
          
          if (this.stackItems.length === 0) {
            this.previewContainer.style.display = 'none';
          }
          
          const stackItem = document.createElement('div');
          stackItem.className = 'preview-item';
          const stackImg = new Image();
          stackImg.src = img.src;
          stackItem.appendChild(stackImg);
          
          this.stackItems.unshift(stackItem);
          this.stackContainer.prepend(stackItem);
          this.updateStackSizes();
          
          setTimeout(() => {
            stackItem.classList.add('fading');
            setTimeout(() => {
              const index = this.stackItems.indexOf(stackItem);
              if (index > -1) {
                this.stackItems.splice(index, 1);
                stackItem.remove();
                this.updateStackSizes();
              }
            }, 300);
          }, 3000);
        });
      });
      
      // Handle mouse movement for preview
      let lastMouseMove = 0;
      document.addEventListener('mousemove', (e) => {
        if (this.isTouch || !this.isDesktop()) return;
        
        const now = Date.now();
        if (now - lastMouseMove > 100) {
          lastMouseMove = now;
          const hoveredImg = e.target.closest('.case-study-preview-image');
          if (hoveredImg && hoveredImg !== this.currentHoverElement) {
            this.currentHoverElement = hoveredImg;
            this.showPreview(hoveredImg, true);
          }
        }
      });
    }
    
    isDesktop() {
      return window.innerWidth >= 991;
    }
    
    getWidthForPosition(position, totalItems) {
      if (totalItems <= 5) return 400;
      if (position === 0) return 400;
      if (position === 1) return 200;
      if (position === 2) return 150;
      if (position === 3) return 100;
      return 50;
    }
    
    updateStackSizes() {
      if (!this.isDesktop()) return;
      this.stackItems.forEach((item, index) => {
        const width = this.getWidthForPosition(index, this.stackItems.length);
        item.style.width = `${width}px`;
      });
    }
    
    showPreview(img, immediate = false) {
      if (!this.isDesktop()) return;
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = setTimeout(() => {
        if (this.currentHoverElement === img && this.stackItems.length === 0) { 
          const previewImg = new Image();
          previewImg.src = img.src;
          
          // Clear the container
          this.previewContainer.innerHTML = '';
          
          // Make sure the container height is auto to preserve aspect ratio
          this.previewContainer.style.height = 'auto';
          
          // Add the image to the container
          this.previewContainer.appendChild(previewImg);
          this.previewContainer.style.display = 'block';
        }
      }, immediate ? 0 : 50);
    }
    
    hidePreview() {
      if (!this.isDesktop()) return;
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = setTimeout(() => {
        this.currentHoverElement = null;
        if (this.stackItems.length === 0) { 
          this.previewContainer.style.display = 'none';
        }
      }, 50);
    }
  }

  /**
   * Setup mutation observer to handle dynamically added content
   */
  function setupMutationObserver(pixelizer) {
    const observer = new MutationObserver((mutations) => {
      // Only run if we see new nodes added
      if (mutations.some(mutation => mutation.addedNodes.length > 0)) {
        pixelizer.processImages();
      }
    });
    
    // Start observing the document with the configured parameters
    observer.observe(document.body, { 
      childList: true,
      subtree: true 
    });
  }

  /**
   * Initialize all site functionality
   * This is the main entry point that runs once when the DOM is ready
   */
  function initSite() {
    if (initialized) return;
    initialized = true;
    
    // Initialize the pixelizer
    const pixelizer = new ImagePixelizer({
      pixelSize: 40,      // Larger pixels
      duration: 2000,     // Longer duration
      fadeTime: 500,      // Slower fade
      fallbackColor: '#e0e0e0' // Light gray fallback
    });
    
    // Initialize pixelizer
    pixelizer.init();
    
    // Setup mutation observer
    setupMutationObserver(pixelizer);
    
    // Initialize image preview system
    const previewSystem = new ImagePreviewSystem();
    previewSystem.init();
    
    // Handle any additional initialization for images loaded later
    window.addEventListener('load', () => {
      pixelizer.processImages();
    }, { once: true });
  }

  // Initialize everything when the DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSite, { once: true });
  } else {
    // DOM already loaded, run immediately
    initSite();
  }
})(); 

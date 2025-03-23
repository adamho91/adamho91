/**
 * Consolidated JavaScript for the website
 * Combines pixelizer and preview functionality
 */

(function() {
  // Global initialization tracking
  const initialized = {
    pixelizer: false,
    preview: false
  };
  
  // Shared color palette
  const hexCodes = [
    '#c7f3c6', '#eaff00', '#f5320b', '#948eff', '#c7f3c6', 
    '#dbff00', '#fdceeb', '#0095ff', '#cde0f5', '#fdceeb', 
    '#e362d3', '#01a451'
  ];
  
  /**
   * Utility functions
   */
  const Utils = {
    getRandomColor: function() {
      return hexCodes[Math.floor(Math.random() * hexCodes.length)];
    },
    
    isDesktop: function() {
      return window.innerWidth >= 991;
    },
    
    isMobile: function() {
      return window.innerWidth <= 479;
    },
    
    // Debug helper
    log: function(message) {
      console.log(`[Consolidated] ${message}`);
    }
  };
  
  /**
   * Image Pixelizer System
   */
  const PixelizerSystem = {
    options: {
      pixelSize: 40,
      duration: 2000,
      fadeTime: 500,
      // Expanded selector to match more image types
      selector: '.featured-img, .case-study-preview-image, img[data-src], .w-dyn-items img, .collection-item img, .col-list-item img',
      fallbackColor: '#e0e0e0'
    },
    
    processedImages: new Set(),
    
    init: function(customOptions = {}) {
      if (initialized.pixelizer) return;
      initialized.pixelizer = true;
      
      Utils.log("Initializing Pixelizer System");
      
      // Merge custom options
      Object.assign(this.options, customOptions);
      
      // Process images
      this.processImages();
      
      // Setup mutation observer
      this.setupMutationObserver();
      
      // Handle images loaded later
      window.addEventListener('load', () => {
        Utils.log("Window loaded - processing additional images");
        this.processImages();
      }, { once: true });
    },
    
    processImages: function() {
      const images = document.querySelectorAll(this.options.selector);
      Utils.log(`Found ${images.length} images to process`);
      
      images.forEach(img => {
        if (this.processedImages.has(img)) return;
        this.processedImages.add(img);
        
        this.processImage(img);
      });
    },
    
    processImage: function(img) {
      // Skip if image is already processed or doesn't have a src
      if (!img.src && !img.dataset.src) return;
      
      // Add crossorigin attribute for CORS
      if (!img.hasAttribute('crossorigin') && img.src && img.src.startsWith('http')) {
        img.setAttribute('crossorigin', 'anonymous');
      }
      
      // Create wrapper
      const wrapper = document.createElement('div');
      wrapper.style.position = 'relative';
      wrapper.style.width = '100%';
      wrapper.style.height = '100%';
      wrapper.style.overflow = 'hidden';
      
      // Insert wrapper and move image
      img.parentNode.insertBefore(wrapper, img);
      wrapper.appendChild(img);
      
      // Hide image initially
      img.style.opacity = '0';
      img.style.transition = `opacity ${this.options.fadeTime}ms ease-in-out`;
      
      // Create placeholder
      const color = this.options.fallbackColor;
      this.createColorPlaceholder(img, wrapper, color);
      
      // Try to get dominant color
      this.getDominantColor(img, (detectedColor) => {
        const placeholders = wrapper.querySelectorAll('.pixelizer-placeholder');
        if (placeholders.length > 0 && detectedColor !== this.options.fallbackColor) {
          placeholders[0].style.backgroundColor = detectedColor;
        }
      });
    },
    
    getDominantColor: function(img, callback) {
      let color = this.options.fallbackColor;
      
      const tryGetColor = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          canvas.width = 1;
          canvas.height = 1;
          
          ctx.drawImage(img, 0, 0, 1, 1);
          const data = ctx.getImageData(0, 0, 1, 1).data;
          color = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
          callback(color);
        } catch (e) {
          console.log('Could not get image color:', e);
          callback(color);
        }
      };
      
      if (img.complete && img.naturalWidth > 0) {
        tryGetColor();
      } else {
        img.addEventListener('load', tryGetColor, { once: true });
      }
    },
    
    createColorPlaceholder: function(img, wrapper, color) {
      const placeholder = document.createElement('div');
      placeholder.className = 'pixelizer-placeholder';
      placeholder.style.position = 'absolute';
      placeholder.style.top = '0';
      placeholder.style.left = '0';
      placeholder.style.width = '100%';
      placeholder.style.height = '100%';
      placeholder.style.backgroundColor = color;
      placeholder.style.transition = `opacity ${this.options.fadeTime}ms ease-in-out`;
      
      wrapper.appendChild(placeholder);
      
      setTimeout(() => {
        img.style.opacity = '1';
        placeholder.style.opacity = '0';
        
        setTimeout(() => {
          if (placeholder.parentNode === wrapper) {
            wrapper.removeChild(placeholder);
          }
        }, this.options.fadeTime);
      }, this.options.duration);
    },
    
    setupMutationObserver: function() {
      const observer = new MutationObserver((mutations) => {
        if (mutations.some(mutation => mutation.addedNodes.length > 0)) {
          Utils.log("DOM changed - processing new images");
          this.processImages();
        }
      });
      
      observer.observe(document.body, { 
        childList: true,
        subtree: true 
      });
    }
  };
  
  /**
   * Image Preview System
   */
  const PreviewSystem = {
    previewContainer: null,
    stackContainer: null,
    stackItems: [],
    hoverTimeout: null,
    currentHoverElement: null,
    isTouch: false,
    
    init: function() {
      if (initialized.preview) return;
      initialized.preview = true;
      
      Utils.log("Initializing Preview System");
      
      // Create containers
      this.previewContainer = document.createElement('div');
      this.previewContainer.className = 'preview-container';
      document.body.appendChild(this.previewContainer);
      
      this.stackContainer = document.createElement('div');
      this.stackContainer.className = 'preview-stack';
      document.body.appendChild(this.stackContainer);
      
      // Add styles
      this.addStyles();
      
      // Setup event listeners
      this.setupEventListeners();
      
      // Detect touch devices
      window.addEventListener('touchstart', () => {
        this.isTouch = true;
      }, { once: true });
      
      // Handle window resize
      window.addEventListener('resize', () => {
        if (!Utils.isDesktop()) {
          this.stackItems.forEach(item => item.remove());
          this.stackItems = [];
          this.previewContainer.style.display = 'none';
        }
      });
    },
    
    addStyles: function() {
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
    },
    
    setupEventListeners: function() {
      // Setup image hover and click events - use a more general selector
      const setupPreviewForImages = () => {
        const images = document.querySelectorAll('.case-study-preview-image, .col-list-item img, .collection-item img');
        Utils.log(`Setting up preview for ${images.length} images`);
        
        images.forEach(img => {
          // Skip if already processed
          if (img.dataset.previewInitialized) return;
          img.dataset.previewInitialized = 'true';
          
          img.addEventListener('mouseenter', (e) => {
            if (this.isTouch || !Utils.isDesktop()) return;
            this.currentHoverElement = img;
            this.showPreview(img);
          });
          
          img.addEventListener('mouseleave', (e) => {
            if (this.isTouch || !Utils.isDesktop()) return;
            if (!e.relatedTarget?.closest('.case-study-preview-image, .col-list-item img, .collection-item img')) {
              this.hidePreview();
            }
          });
          
          img.addEventListener('click', () => {
            if (!Utils.isDesktop()) return;
            
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
      };
      
      // Initial setup
      setupPreviewForImages();
      
      // Setup for dynamically added images
      const observer = new MutationObserver((mutations) => {
        if (mutations.some(mutation => mutation.addedNodes.length > 0)) {
          setupPreviewForImages();
        }
      });
      
      observer.observe(document.body, { 
        childList: true,
        subtree: true 
      });
      
      // Handle mouse movement for preview - throttled to improve performance
      let lastMouseMove = 0;
      document.addEventListener('mousemove', (e) => {
        if (this.isTouch || !Utils.isDesktop()) return;
        
        const now = Date.now();
        if (now - lastMouseMove > 100) {
          lastMouseMove = now;
          const hoveredImg = e.target.closest('.case-study-preview-image, .col-list-item img, .collection-item img');
          if (hoveredImg && hoveredImg !== this.currentHoverElement) {
            this.currentHoverElement = hoveredImg;
            this.showPreview(hoveredImg, true);
          }
        }
      });
    },
    
    getWidthForPosition: function(position, totalItems) {
      if (totalItems <= 5) return 400;
      if (position === 0) return 400;
      if (position === 1) return 200;
      if (position === 2) return 150;
      if (position === 3) return 100;
      return 50;
    },
    
    updateStackSizes: function() {
      if (!Utils.isDesktop()) return;
      this.stackItems.forEach((item, index) => {
        const width = this.getWidthForPosition(index, this.stackItems.length);
        item.style.width = `${width}px`;
      });
    },
    
    showPreview: function(img, immediate = false) {
      if (!Utils.isDesktop()) return;
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = setTimeout(() => {
        if (this.currentHoverElement === img && this.stackItems.length === 0) { 
          // Clear the container first
          this.previewContainer.innerHTML = '';
          
          // Reset any previous styling
          this.previewContainer.style.height = 'auto';
          this.previewContainer.style.padding = '0';
          this.previewContainer.style.margin = '0';
          this.previewContainer.style.overflow = 'hidden';
          
          // Create new image
          const previewImg = new Image();
          
          // Set up the image load handler to ensure proper sizing
          previewImg.onload = () => {
            // Calculate aspect ratio
            const aspectRatio = previewImg.naturalHeight / previewImg.naturalWidth;
            
            // Set image styles to ensure proper display
            previewImg.style.width = '100%';
            previewImg.style.height = 'auto';
            previewImg.style.display = 'block';
            
            // Make sure the preview container is positioned correctly
            this.previewContainer.style.position = 'fixed';
            this.previewContainer.style.bottom = '8px';
            this.previewContainer.style.left = '8px';
            this.previewContainer.style.zIndex = '9999';
          };
          
          // Set the image source after setting up the handler
          previewImg.src = img.src;
          
          // Add the image to the container
          this.previewContainer.appendChild(previewImg);
          this.previewContainer.style.display = 'block';
        }
      }, immediate ? 0 : 50);
    },
    
    hidePreview: function() {
      if (!Utils.isDesktop()) return;
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = setTimeout(() => {
        this.currentHoverElement = null;
        if (this.stackItems.length === 0) { 
          this.previewContainer.style.display = 'none';
        }
      }, 50);
    }
  };
  
  /**
   * Initialize all systems when the DOM is ready
   */
  function initSite() {
    Utils.log("Initializing site");
    
    // Initialize pixelizer and preview systems
    PixelizerSystem.init();
    PreviewSystem.init();
    
    // Initialize jQuery shuffle if jQuery is available
    if (typeof jQuery !== 'undefined') {
      initJQueryShuffle();
    }
  }
  
  /**
   * Initialize jQuery shuffle functionality
   */
  function initJQueryShuffle() {
    Utils.log("Initializing jQuery shuffle");
    
    (function ($) {
      $.fn.shuffle = function () {
        var allElems = this.get(),
          getRandom = function (max) {
            return Math.floor(Math.random() * max);
          },
          shuffled = $.map(allElems, function () {
            var random = getRandom(allElems.length),
              randEl = $(allElems[random]).clone(true)[0];
            allElems.splice(random, 1);
            return randEl;
          });
        
        this.each(function (i) {
          $(this).replaceWith($(shuffled[i]));
        });
        
        return $(shuffled);
      };
    })(jQuery);
    
    // Shuffle elements
    $(".draggable").shuffle();
    $(".renown").shuffle();
    $(".projectnamecard").shuffle();
    $(".randomcollab").shuffle();
    $(".cereal").shuffle();
    $(".randomele").shuffle();
    $(".bbbs").shuffle();
    $(".clientlist-container").shuffle();
    $(".db-130").shuffle();
    $(".col-press-item").shuffle();
    $(".col-list-item").shuffle();
  }
  
  // Initialize everything when the DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSite, { once: true });
  } else {
    // DOM already loaded, run immediately
    initSite();
  }
})(); 

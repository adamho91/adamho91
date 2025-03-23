/**
 * Consolidated JavaScript for the website
 * Combines pixelizer, preview, draggable, and other functionality
 */

(function() {
  // Global initialization tracking
  const initialized = {
    pixelizer: false,
    preview: false,
    draggable: false,
    colorEffects: false,
    vectorPoints: false
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
   * Draggable System
   */
  const DraggableSystem = {
    draggedItem: null,
    placeholder: null,
    
    init: function() {
      if (initialized.draggable) return;
      initialized.draggable = true;
      
      if (Utils.isDesktop()) {
        this.initDragDrop();
      }
      
      // Add transition for background color
      document.body.style.transition = "background-color 0.3s ease";
      
      // Listen for window resize
      window.addEventListener('resize', () => {
        if (Utils.isDesktop()) {
          this.initDragDrop();
        }
      });
    },
    
    initDragDrop: function() {
      let items = document.querySelectorAll('.col-list-item');
      
      // Remove existing event listeners to prevent duplicates
      items.forEach(item => {
        item.removeEventListener('dragstart', this.dragStartHandler);
        item.removeEventListener('dragend', this.dragEndHandler);
        item.removeEventListener('dragover', this.dragOverHandler);
        item.removeEventListener('dragleave', this.dragLeaveHandler);
        item.removeEventListener('drop', this.dropHandler);
      });
      
      // Refresh items list
      items = document.querySelectorAll('.col-list-item');
      
      // Add event listeners
      items.forEach(item => {
        item.setAttribute('draggable', 'true');
        
        // Make children non-draggable
        item.querySelectorAll('*').forEach(child => {
          child.setAttribute('draggable', 'false');
        });
        
        // Add hover effect (using mouseenter/mouseleave to avoid conflicts)
        item.addEventListener('mouseenter', () => {
          item.style.backgroundColor = "#f5f5f5";
        });
        
        item.addEventListener('mouseleave', () => {
          item.style.backgroundColor = "";
        });
        
        // Add drag events
        item.addEventListener('dragstart', this.dragStartHandler.bind(this));
        item.addEventListener('dragend', this.dragEndHandler.bind(this));
        item.addEventListener('dragover', this.dragOverHandler);
        item.addEventListener('dragleave', this.dragLeaveHandler);
        item.addEventListener('drop', this.dropHandler.bind(this));
      });
    },
    
    dragStartHandler: function(e) {
      this.draggedItem = e.currentTarget;
      const iframe = this.draggedItem.querySelector('iframe');
      
      if (iframe) {
        this.placeholder = iframe.cloneNode(true);
        this.placeholder.style.visibility = 'hidden';
        iframe.style.display = 'none';
        this.draggedItem.insertBefore(this.placeholder, iframe);
      }
      
      document.body.style.backgroundColor = "#f5f5f5";
      this.draggedItem.style.opacity = '0.5';
      this.draggedItem.style.outline = "4px solid #0095ff";
    },
    
    dragEndHandler: function(e) {
      if (this.placeholder) {
        this.placeholder.remove();
        const iframe = this.draggedItem.querySelector('iframe');
        if (iframe) {
          iframe.style.display = '';
        }
      }
      
      this.draggedItem.style.opacity = '1';
      this.draggedItem.style.outline = "";
      this.draggedItem = null;
      document.body.style.backgroundColor = "#ffffff";
      this.initDragDrop();
    },
    
    dragOverHandler: function(e) {
      e.preventDefault();
      this.style.outline = "4px solid #0095ff";
    },
    
    dragLeaveHandler: function(e) {
      this.style.outline = "";
    },
    
    dropHandler: function(e) {
      if (this.draggedItem) {
        const dropTarget = e.currentTarget;
        const draggedIndex = Array.from(document.querySelectorAll('.col-list-item')).indexOf(this.draggedItem);
        const dropIndex = Array.from(document.querySelectorAll('.col-list-item')).indexOf(dropTarget);
        
        if (draggedIndex < dropIndex) {
          dropTarget.parentElement.insertBefore(this.draggedItem, dropTarget.nextSibling);
        } else {
          dropTarget.parentElement.insertBefore(this.draggedItem, dropTarget);
        }
        
        dropTarget.style.outline = "";
      }
    }
  };
  
  /**
   * Color Effects System
   */
  const ColorEffectsSystem = {
    isHovered: false,
    interval: null,
    timeout: null,
    
    init: function() {
      if (initialized.colorEffects) return;
      initialized.colorEffects = true;
      
      // Add styles for oracle statement
      const style = document.createElement('style');
      style.textContent = `
        .oraclestatement {
          padding-left: 22px;
          text-indent: -22px;
        }
      `;
      document.head.appendChild(style);
      
      // Setup color change for elements
      this.setupRandomColors();
      
      // Setup color change animation
      setTimeout(() => this.startColorChange(), 10000);
      
      // Setup hover effect
      document.body.addEventListener('mouseover', (event) => {
        const target = event.target;
        if (target.matches('._2up, .oracle-collaborator')) {
          this.isHovered = true;
          target.style.backgroundColor = Utils.getRandomColor();
          clearInterval(this.interval);
          clearTimeout(this.timeout);
        }
      });
      
      // Reset hover state on mouseout
      document.body.addEventListener('mouseout', (event) => {
        const target = event.target;
        if (target.matches('._2up, .oracle-collaborator')) {
          this.isHovered = false;
        }
      });
    },
    
    setupRandomColors: function() {
      // Set text colors
      const textElements = document.querySelectorAll('.displaytitle');
      const randomColor = Utils.getRandomColor();
      textElements.forEach(element => {
        element.style.color = randomColor;
        element.style.borderColor = randomColor;
      });
      
      // Set background colors for db3 and db4 elements
      const db3Elements = document.querySelectorAll('.db3');
      const db4Elements = document.querySelectorAll('.db4');
      
      db3Elements.forEach(db3Element => {
        const randomColorDb3 = Utils.getRandomColor();
        db3Element.style.backgroundColor = randomColorDb3;
        
        const db4Sibling = db3Element.closest(':scope > * + .db4');
        if (db4Sibling) {
          let randomColorDb4 = Utils.getRandomColor();
          while (randomColorDb4 === randomColorDb3) {
            randomColorDb4 = Utils.getRandomColor();
          }
          db4Sibling.style.backgroundColor = randomColorDb4;
        }
      });
      
      db4Elements.forEach(db4Element => {
        if (!db4Element.previousElementSibling || !db4Element.previousElementSibling.classList.contains('db3')) {
          db4Element.style.backgroundColor = Utils.getRandomColor();
        }
      });
      
      // Set colors for other elements
      this.setColorForElements(document.querySelectorAll('.db5'));
      this.setColorForElements(document.querySelectorAll('.db6'));
      this.setColorForElements(document.querySelectorAll('.multiplybox'));
      
      // Animate list items
      if (!Utils.isMobile()) {
        const items = document.querySelectorAll('.col-list-item');
        items.forEach((item, index) => {
          item.style.opacity = "0";
          setTimeout(() => {
            item.style.transition = "opacity 125ms ease-out";
            item.style.opacity = "1";
          }, index * 150);
        });
      }
      
      // Setup indicator flicker
      this.setupIndicatorFlicker();
    },
    
    setColorForElements: function(elements) {
      elements.forEach(element => {
        element.style.backgroundColor = Utils.getRandomColor();
      });
    },
    
    startColorChange: function() {
      if (!this.isHovered) {
        this.changeTwoRandomColors();
        this.interval = setInterval(() => this.changeTwoRandomColors(), 1000);
        setTimeout(() => {
          clearInterval(this.interval);
          this.timeout = setTimeout(() => this.startColorChange(), 60000);
        }, 4000);
      }
    },
    
    changeTwoRandomColors: function() {
      const combinedSelectors = '._2up, .oracle-collaborator';
      const items = document.querySelectorAll(combinedSelectors);
      if (items.length < 2) return;
      
      const index1 = Math.floor(Math.random() * items.length);
      let index2;
      do {
        index2 = Math.floor(Math.random() * items.length);
      } while (index2 === index1);
      
      items[index1].style.backgroundColor = Utils.getRandomColor();
      items[index2].style.backgroundColor = Utils.getRandomColor();
    },
    
    setupIndicatorFlicker: function() {
      const indicators = document.querySelectorAll('.circle-indicator');
      if (indicators.length === 0) return;
      
      const flicker = () => {
        const randomIndex = Math.floor(Math.random() * indicators.length);
        const indicator = indicators[randomIndex];
        
        indicator.style.opacity = '0';
        
        let randomTime = (Math.random() * 1 + 1) * 1000;
        
        setTimeout(() => {
          indicator.style.opacity = '1';
          flicker();
        }, randomTime);
      };
      
      flicker();
    }
  };
  
  /**
   * Vector Points System
   */
  const VectorPointsSystem = {
    init: function() {
      if (initialized.vectorPoints) return;
      initialized.vectorPoints = true;
      
      const cursor = document.createElement("div");
      cursor.className = "custom-cursor";
      document.body.appendChild(cursor);
      
      document.addEventListener("mousemove", (e) => {
        cursor.style.left = `${e.pageX}px`;
        cursor.style.top = `${e.pageY}px`;
        
        const vectorPoint = document.createElement("div");
        vectorPoint.className = "vector-point";
        document.body.appendChild(vectorPoint);
        vectorPoint.style.left = `${e.pageX}px`;
        vectorPoint.style.top = `${e.pageY}px`;
        vectorPoint.style.backgroundColor = Utils.getRandomColor();
        
        const size = Math.random() * 5 + 3;
        vectorPoint.style.width = `${size}px`;
        vectorPoint.style.height = `${size}px`;
        
        this.fadeOutVectorPoint(vectorPoint);
      });
    },
    
    fadeOutVectorPoint: function(vectorPoint) {
      setTimeout(() => {
        vectorPoint.style.opacity = "0";
        vectorPoint.addEventListener("transitionend", () => {
          vectorPoint.remove();
        });
      }, 1250);
    }
  };
  
  /**
   * Initialize all systems when the DOM is ready
   */
  function initSite() {
    Utils.log("Initializing site");
    
    // Initialize all systems
    PixelizerSystem.init();
    PreviewSystem.init();
    
    // Initialize other systems if needed
    if (typeof DraggableSystem !== 'undefined') DraggableSystem.init();
    if (typeof ColorEffectsSystem !== 'undefined') ColorEffectsSystem.init();
    if (typeof VectorPointsSystem !== 'undefined') VectorPointsSystem.init();
    
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

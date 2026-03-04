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
   * Bellissimo Script - Added to ensure it works
   */
  const BellissimoSystem = {
    init: function() {
      Utils.log("Initializing Bellissimo System");
      
      // Add your Bellissimo-specific code here
      // This is a placeholder for any special functionality needed
      
      // Example: Set up event listeners for Bellissimo elements
      document.querySelectorAll('.bellissimo-element').forEach(el => {
        el.addEventListener('click', this.handleBellissimoClick);
      });
    },
    
    handleBellissimoClick: function(e) {
      // Handle Bellissimo click events
      console.log('Bellissimo element clicked:', e.target);
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
    
    // Initialize Bellissimo system
    BellissimoSystem.init();
    
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
  
  // Expose key functions to global scope for external scripts
  window.pixelizerSystem = PixelizerSystem;
  window.previewSystem = PreviewSystem;
  window.bellissimoSystem = BellissimoSystem;
})(); 

// ─── ENEMY SPAWN SYSTEM ──────────────────────────────────────────────────────
// Appears bottom-left alongside the preview-stack.
// First spawn: 10s. Subsequent: random 2–5 min.
// Click to defeat → +20% of current XP bar → dissolves → respawns later.
// Pure p5.js dither, self-contained, no extra HTML needed.
// ─────────────────────────────────────────────────────────────────────────────

(function () {

  // ── Config ─────────────────────────────────────────────────────────────────
  const FIRST_SPAWN_MS = 10 * 1000;
  const MIN_RESPAWN_MS = 2 * 60 * 1000;
  const MAX_RESPAWN_MS = 5 * 60 * 1000;

  const ENEMY_NAMES = [
    'Glitch Rat',  'Pixel Wraith', 'Noise Fiend',  'Error Sprite',
    'Data Leech',  'Void Crawler', 'Bit Phantom',  'Null Shade',
    'Cache Demon', 'Stack Ghoul',  'Loop Specter', 'Hex Lurker',
  ];

  // Reds, oranges, sickly greens — distinct from bellissimo's cooler palette
  const ENEMY_COLORS = [
    '#ff2200', '#ff6600', '#cc0000', '#ff9900',
    '#aaff00', '#ff0055', '#ffcc00', '#bb0000',
  ];

  function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function randDelay() { return MIN_RESPAWN_MS + Math.random() * (MAX_RESPAWN_MS - MIN_RESPAWN_MS); }

  // ── CSS ────────────────────────────────────────────────────────────────────
  // Sits in bottom-left, above the preview-stack (z-index 10000 vs 9999)
  // Uses the same font/feel as the rest of the folio
  document.head.insertAdjacentHTML('beforeend', `<style>
    #esys {
      position: fixed;
      bottom: 8px;
      left: 8px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
      pointer-events: none;
      opacity: 0;
      transform: translateY(12px);
      transition: opacity 0.5s ease, transform 0.5s ease;
    }
    #esys.show {
      opacity: 1;
      transform: translateY(0);
      pointer-events: all;
    }
    #esys.hide {
      opacity: 0;
      transform: translateY(16px);
      transition: opacity 0.7s ease, transform 0.7s ease;
    }
    #esys-wrap {
      width: 80px;
      height: 80px;
      position: relative;
      cursor: crosshair;
      image-rendering: pixelated;
    }
    /* Force p5 canvas to stay inside wrapper — fixes the top-left bleed bug */
    #esys-wrap canvas {
      position: absolute !important;
      top: 0     !important;
      left: 0    !important;
      width: 100%  !important;
      height: 100% !important;
    }
    #esys-meta {
      font-family: monospace;
      font-size: 9px;
      line-height: 1.4;
      user-select: none;
      cursor: crosshair;
    }
    #esys-name {
      color: #ff6633;
      text-shadow: 0 0 6px #ff2200;
      display: block;
    }
    #esys-prompt {
      color: #ff220088;
      display: block;
    }
    /* Floating XP pop */
    .esys-pop {
      position: fixed;
      font-family: monospace;
      font-size: 16px;
      font-weight: bold;
      color: #ff3300;
      text-shadow: 0 0 8px #ff6600;
      pointer-events: none;
      z-index: 99999;
      opacity: 1;
      transition: transform 1s ease, opacity 1s ease;
    }
  </style>`);

  // ── DOM ────────────────────────────────────────────────────────────────────
  const esys   = document.createElement('div');  esys.id = 'esys';
  const wrap   = document.createElement('div');  wrap.id = 'esys-wrap';
  const meta   = document.createElement('div');  meta.id = 'esys-meta';
  meta.innerHTML = `<span id="esys-name"></span><span id="esys-prompt">[ click to defeat ]</span>`;
  esys.appendChild(wrap);
  esys.appendChild(meta);
  document.body.appendChild(esys);

  const nameEl = meta.querySelector('#esys-name');

  // ── State ──────────────────────────────────────────────────────────────────
  let sketch      = null;
  let alive       = false;
  let dissolving  = false;
  let fc          = 0;        // frame counter shared into sketch closure
  let hitPulse    = 0;
  let curColor    = ENEMY_COLORS[0];
  let tgtColor    = ENEMY_COLORS[0];

  // ── p5 sketch ─────────────────────────────────────────────────────────────
  function launchSketch() {
    if (!window.p5) { setTimeout(launchSketch, 80); return; }
    if (sketch) { sketch.remove(); sketch = null; wrap.innerHTML = ''; }

    dissolving = false;
    alive      = true;
    hitPulse   = 0;
    fc         = 0;
    curColor   = rand(ENEMY_COLORS);
    tgtColor   = rand(ENEMY_COLORS);

    sketch = new window.p5(s => {
      const G = 16; // grid size — chunkier than bellissimo's 25

      // Build dither grid each frame
      function makeGrid() {
        const t = fc * 0.18;
        const out = [];
        for (let i = 0; i < G; i++) {
          out[i] = [];
          for (let j = 0; j < G; j++) {
            if (dissolving) {
              // Scatter static — random sparse dots, fades out fast
              out[i][j] = { v: Math.random() < (0.12 - fc * 0.003) ? 1 : 0, sp: false };
              continue;
            }
            // Diagonal sweep noise (vs bellissimo's symmetric noise)
            const n = s.noise(i * 0.2 + t, j * 0.15 - t * 0.55) * 100;
            // Centre-pull bias (inverse of bellissimo's corner bias)
            const cx = (i - G / 2) / G, cy = (j - G / 2) / G;
            const d  = Math.sqrt(cx*cx + cy*cy); // 0 at centre, ~0.7 at corner
            const th = s.map(hitPulse, 0, 2, 30, 75) * (0.3 + d * 0.7);
            out[i][j] = { v: n < th ? 1 : 0, sp: Math.random() < 0.05 };
          }
        }
        return out;
      }

      s.setup = function () {
        const c = s.createCanvas(80, 80);
        c.parent(wrap);
        // Keep canvas anchored inside wrapper — prevents top-left bleed
        c.style('position', 'absolute');
        c.style('top',  '0');
        c.style('left', '0');
        c.style('width',  '100%');
        c.style('height', '100%');
        s.noSmooth();
        s.frameRate(8); // faster than bellissimo (4fps) — feels more threatening
      };

      s.draw = function () {
        s.background('#0d0d0d');

        // Colour lerp
        curColor = s.lerpColor(s.color(curColor), s.color(tgtColor), 0.08).toString();
        if (fc % 12 === 0 && !dissolving) tgtColor = rand(ENEMY_COLORS);

        fc++;
        hitPulse *= 0.78;

        const grid = makeGrid();
        const cs   = s.width / G;

        for (let i = 0; i < G; i++) {
          for (let j = 0; j < G; j++) {
            const { v, sp } = grid[i][j];
            const base  = s.color('#0d0d0d');
            const pixel = sp ? s.color(rand(ENEMY_COLORS)) : s.color(curColor);
            s.fill(s.lerpColor(base, pixel, v));
            s.noStroke();
            s.rect(i * cs, j * cs, cs + 1, cs + 1);
          }
        }

        // Stop sketch once dissolve frames are exhausted
        if (dissolving && fc > 30) s.noLoop();
      };
    });
  }

  // ── XP pop ────────────────────────────────────────────────────────────────
  function showPop(amount) {
    const el = document.createElement('div');
    el.className   = 'esys-pop';
    el.textContent = `+${amount} XP`;
    const r = wrap.getBoundingClientRect();
    el.style.left = `${r.left + r.width / 2 - 28}px`;
    el.style.top  = `${r.top  + r.height / 2}px`;
    document.body.appendChild(el);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.style.transform = 'translateY(-60px) scale(1.15)';
      el.style.opacity   = '0';
    }));
    setTimeout(() => el.remove(), 1100);
  }

  // ── Defeat sequence ────────────────────────────────────────────────────────
  function defeat() {
    if (!alive) return;
    alive      = false;
    dissolving = true;
    hitPulse   = 2.5;

    // Reward: 20% of current XP bar
    const xp = window.xpSystem;
    if (xp && xp.player) {
      const reward = Math.ceil(xp.player.xpNeeded * 0.20);
      showPop(reward);
      setTimeout(() => xp.addXP(reward), 180);
    }

    // Let dissolve run for ~600ms then fade container out
    setTimeout(() => {
      esys.classList.add('hide');
      esys.classList.remove('show');
      setTimeout(() => {
        esys.classList.remove('hide');
        if (sketch) { sketch.remove(); sketch = null; wrap.innerHTML = ''; }
        scheduleSpawn(randDelay());
      }, 750);
    }, 600);
  }

  // ── Spawn ──────────────────────────────────────────────────────────────────
  function spawn() {
    nameEl.textContent = rand(ENEMY_NAMES);
    launchSketch();
    // Double rAF ensures the class triggers a transition
    requestAnimationFrame(() => requestAnimationFrame(() => {
      esys.classList.add('show');
    }));
  }

  function scheduleSpawn(delay) { setTimeout(spawn, delay); }

  // ── Click handler — on both canvas wrapper and label ──────────────────────
  wrap.addEventListener('click',  defeat);
  meta.addEventListener('click',  defeat);

  // ── Boot ───────────────────────────────────────────────────────────────────
  function boot() {
    if (!window.p5) {
      const s = document.createElement('script');
      s.src   = 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.2/p5.min.js';
      document.head.appendChild(s);
    }
    scheduleSpawn(FIRST_SPAWN_MS);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();

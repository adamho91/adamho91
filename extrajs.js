<script>
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        @media (min-width: 991px) {
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
                max-height: 80vh; /* Limit height for very tall images */
            }
            .preview-item img {
                width: 100%;
                height: auto;
                display: block;
                vertical-align: bottom;
                object-fit: contain;
                max-height: 80vh; /* Ensure image doesn't exceed viewport height */
            }
            .preview-item.fading {
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    const stackContainer = document.createElement('div');
    stackContainer.className = 'preview-stack';
    document.body.appendChild(stackContainer);

    let stackItems = [];
    let isTouch = false;

    const isDesktop = () => window.innerWidth >= 991;

    const getWidthForPosition = (position, totalItems) => {
        if (totalItems <= 5) return 400;
        if (position === 0) return 400;
        if (position === 1) return 200;
        if (position === 2) return 150;
        if (position === 3) return 100;
        return 50;
    };

    const updateStackSizes = () => {
        if (!isDesktop()) return;
        stackItems.forEach((item, index) => {
            const width = getWidthForPosition(index, stackItems.length);
            item.style.width = `${width}px`;
        });
    };

    // Pre-load images to get dimensions
    const imageCache = new Map();
    const preloadImage = (src) => {
        if (imageCache.has(src)) {
            return Promise.resolve(imageCache.get(src));
        }
        
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const data = {
                    width: img.naturalWidth,
                    height: img.naturalHeight,
                    aspectRatio: img.naturalHeight / img.naturalWidth
                };
                imageCache.set(src, data);
                resolve(data);
            };
            img.onerror = () => {
                const data = { width: 400, height: 300, aspectRatio: 0.75 };
                imageCache.set(src, data);
                resolve(data);
            };
            img.src = src;
        });
    };

    window.addEventListener('touchstart', function onFirstTouch() {
        isTouch = true;
        window.removeEventListener('touchstart', onFirstTouch);
    });

    window.addEventListener('resize', () => {
        if (!isDesktop()) {
            stackItems.forEach(item => item.remove());
            stackItems = [];
        }
    });

    // Preload all case study images on page load
    document.querySelectorAll('.case-study-preview-image').forEach(img => {
        if (img.src) {
            preloadImage(img.src);
        }

        img.addEventListener('click', async () => {
            if (!isDesktop()) return;

            try {
                // Preload image to get dimensions
                const imgData = await preloadImage(img.src);
                
                const stackItem = document.createElement('div');
                stackItem.className = 'preview-item';
                
                const stackImg = new Image();
                stackImg.style.width = '100%';
                stackImg.style.height = 'auto';
                stackImg.src = img.src;
                
                stackItem.appendChild(stackImg);
                stackContainer.appendChild(stackItem);
                stackItems.unshift(stackItem);
                
                updateStackSizes();

                setTimeout(() => {
                    stackItem.classList.add('fading');
                    setTimeout(() => {
                        const index = stackItems.indexOf(stackItem);
                        if (index > -1) {
                            stackItems.splice(index, 1);
                            stackItem.remove();
                            updateStackSizes();
                        }
                    }, 300);
                }, 3000);
            } catch (error) {
                console.error("Error creating stack item:", error);
            }
        });
    });
});

const style = document.createElement('style');
style.textContent = `
  .serially {
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }
  
  .fade-in {
    opacity: 1;
  }
  
  .fade-out {
    opacity: 0 !important;
    transition: opacity 0.2s ease-out;
  }
`;
document.head.appendChild(style);

function shuffleContent() {
    const elements = Array.from(document.querySelectorAll('.serially'));
    const contents = elements.map(el => el.textContent);
    
    for (let i = contents.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [contents[i], contents[j]] = [contents[j], contents[i]];
    }
    
    elements.forEach((el, i) => {
        el.textContent = contents[i];
    });
}

let isAnimating = true;
let currentTimeout = null;
let scrollTimeout = null;
let isScrollFading = false;

function instantFadeOutAll() {
    isAnimating = false;
    isScrollFading = false;
    if (currentTimeout) {
        clearTimeout(currentTimeout);
    }
    
    document.querySelectorAll('.serially').forEach(el => {
        el.classList.remove('fade-in');
        el.classList.add('fade-out');
    });
}

function rhythmicFadeOut() {
    if (!isScrollFading) return;
    
    const visibleElements = Array.from(document.querySelectorAll('.serially.fade-in'));
    if (visibleElements.length === 0) {
        isScrollFading = false;
        return;
    }
    
    const rhythms = [
        [50, 100, 25, 150, 75, 125],
        [150, 150, 150, 50, 50, 50],
        [100, 25, 100, 25, 100, 25],
        [200, 50, 50, 200, 50, 50]
    ];
    
    const currentRhythm = rhythms[Math.floor(Math.random() * rhythms.length)];
    let rhythmIndex = 0;
    
    function fadeNextOut() {
        if (!isScrollFading || visibleElements.length === 0) return;
        
        const randomIndex = Math.floor(Math.random() * visibleElements.length);
        const element = visibleElements[randomIndex];
        element.classList.remove('fade-in');
        element.classList.add('fade-out');
        
        visibleElements.splice(randomIndex, 1);
        
        if (visibleElements.length > 0) {
            const delay = currentRhythm[rhythmIndex % currentRhythm.length];
            rhythmIndex++;
            setTimeout(fadeNextOut, delay);
        }
    }
    
    fadeNextOut();
}

function animateElements() {
    const elements = Array.from(document.querySelectorAll('.serially:not(.fade-in)'));
    if (elements.length === 0 || !isAnimating) return;
    
    const rhythms = [
        [50, 100, 25, 150, 75, 125],
        [150, 150, 150, 50, 50, 50],
        [100, 25, 100, 25, 100, 25],
        [200, 50, 50, 200, 50, 50]
    ];
    
    const currentRhythm = rhythms[Math.floor(Math.random() * rhythms.length)];
    let rhythmIndex = 0;
    
    function fadeNext() {
        if (elements.length === 0 || !isAnimating) return;
        
        const randomIndex = Math.floor(Math.random() * elements.length);
        const element = elements[randomIndex];
        element.classList.add('fade-in');
        element.classList.remove('fade-out');
        
        elements.splice(randomIndex, 1);
        
        if (elements.length > 0 && isAnimating) {
            const delay = currentRhythm[rhythmIndex % currentRhythm.length];
            rhythmIndex++;
            currentTimeout = setTimeout(fadeNext, delay);
        }
    }
    
    fadeNext();
}

document.addEventListener('click', instantFadeOutAll);

document.addEventListener('scroll', () => {
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }

    scrollTimeout = setTimeout(() => {
        if (isAnimating && !isScrollFading) {
            isAnimating = false;
            isScrollFading = true;
            if (currentTimeout) {
                clearTimeout(currentTimeout);
            }
            rhythmicFadeOut();
        }
    }, 50);
}, { passive: true });

document.addEventListener('DOMContentLoaded', () => {
    shuffleContent();
    animateElements();
});

document.addEventListener('keypress', (e) => {
    if (e.key === 'r' || e.key === 'R') {
        isAnimating = true;
        isScrollFading = false;
        const elements = document.querySelectorAll('.serially');
        elements.forEach(el => {
            el.classList.remove('fade-in', 'fade-out');
        });
        shuffleContent();
        setTimeout(animateElements, 100);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    console.log('Document ready, initializing XP System...');
    window.xpSystem.init();
});

if (document.readyState === 'complete') {
    console.log('Document already loaded, initializing XP System...');
    window.xpSystem.init();
}

const heights = [20, 40, 80, 160, 320];

function getRandomHeight() {
    const randomIndex = Math.floor(Math.random() * heights.length);
    return heights[randomIndex];
}

function isDesktopWidth() {
    return window.innerWidth >= 767;
}

function setRandomSpacerHeights() {
    if (!isDesktopWidth()) return;
    
    const spacers = document.querySelectorAll('.randomspacer');
    
    spacers.forEach(spacer => {
        const height = getRandomHeight();
        spacer.style.height = `${height}px`;
    });
}

document.addEventListener('DOMContentLoaded', setRandomSpacerHeights);
window.addEventListener('load', setRandomSpacerHeights);
window.addEventListener('resize', setRandomSpacerHeights);
window.xpSystem = {
    player: {level: 1, xp: 0, xpNeeded: 20, class: 'Wanderer', sublevel: 'A'},
    classes: {
        'Wanderer': {level: 1, color: '#0095ff'},
        'Novice': {level: 10, color: '#f5320b'},
        'Apprentice': {level: 20, color: '#e362d3'},
        'Specialist': {level: 30, color: '#948eff'},
        'Image Maker': {level: 40, color: '#ff4d4d'},
        'Transient': {level: 50, color: '#9933ff'},
        'Artificer': {level: 60, color: '#ff3399'},
        'Ascended': {level: 70, color: '#0066ff'},
        'Storyteller': {level: 80, color: '#cc00ff'},
        'Artisan': {level: 90, color: '#ff0066'},
        'Graphic Designer': {level: 99, color: '#6600ff'}
    },
    sublevels: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
    clickedItems: new Set(),
    elements: {},
    hueRotation: 0,

    init() {
        if (window.xpSystemInitialized) return;
        window.xpSystemInitialized = true;

        const flash = document.createElement('div');
        flash.className = 'level-flash';
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s ease-out;
        `;
        document.body.appendChild(flash);

        this.elements = {
            fill: document.querySelector('.my-fill'),
            level: document.querySelector('.my-level'),
            xpCount: document.querySelector('.my-xp-count'),
            classDisplay: document.querySelector('.my-class'),
            sublevelDisplay: document.querySelector('.classay'),
            flash: flash
        };
        
        if (Object.values(this.elements).some(el => !el)) return;

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown') {
                this.addXP(-3);
            }
        });

        document.addEventListener('click', (e) => {
            if (e.target.matches('.col-list-item') || e.target.closest('.col-list-item')) {
                const item = e.target.closest('.col-list-item');
                this.handleItemClick(item);
            }
            if (e.target.matches('.case-study-preview-image')) {
                this.handleCaseStudyClick(e.target);
            }
            if (e.target.matches('.featured-img')) {
                this.handleCaseStudyClick(e.target);
            }
            if (e.target.matches('a[class*="Link Block 7"]')) {
                const link = e.target;
                const linkId = link.href || link.textContent.trim();
                this.handleLinkBlockClick(linkId);
            }
        });

        this.loadProgress();
        this.updateDisplay();
        this.updateSublevel();
        this.startXPGain();
    },

    startXPGain() {
        setInterval(() => {
            if (this.player.level < 99) {
                this.addXP(1);
            }
        }, 4000);
    },

    addXP(amount) {
        this.player.xp += amount;
        this.player.xp = Math.max(0, this.player.xp);
        this.hueRotation = (this.player.xp / this.player.xpNeeded) * 10;
        if (this.player.xp >= this.player.xpNeeded) this.levelUp();
        this.updateDisplay();
        this.saveProgress();
    },

    handleItemClick(item) {
        const itemId = item.textContent.trim() || item.id || `item-${Date.now()}`;
        if (!this.clickedItems.has(itemId)) {
            this.clickedItems.add(itemId);
            this.showXPGain(item, 3);
            this.addXP(3);
        }
    },

    handleCaseStudyClick(element) {
        this.showXPGain(element, 1);
        this.addXP(1);
    },

    handleLinkBlockClick(linkId) {
        if (!this.clickedItems.has(`link-${linkId}`)) {
            this.clickedItems.add(`link-${linkId}`);
            this.levelUp();
            this.showXPGain(document.querySelector('a[class*="Link Block 7"]'), "Level Up!");
        }
    },

    updateSublevel() {
        this.elements.sublevelDisplay.textContent = this.player.sublevel;
    },

    updateDisplay() {
        const {level, xp, xpNeeded, class: className} = this.player;
        this.elements.fill.style.width = `${(xp/xpNeeded)*100}%`;
        this.elements.level.textContent = `Level ${level}`;
        this.elements.xpCount.textContent = `${Math.floor(xp)}/${xpNeeded} XP`;
        this.elements.classDisplay.textContent = className;
        
        const classData = this.classes[className];
        this.elements.classDisplay.style.color = classData.color;
        this.elements.fill.style.background = classData.color;
        this.elements.fill.style.filter = this.hueRotation > 0 ? 
            `brightness(${Math.max(0.5, 1 - (this.hueRotation * 0.05))})` : 'none';
    },

    showXPGain(item, amount) {
        const text = document.createElement('div');
        text.textContent = `+${amount} XP`;
        text.className = 'xp-gain';
        const rect = item.getBoundingClientRect();
        text.style.left = `${rect.left + rect.width/2}px`;
        text.style.top = `${rect.top}px`;
        document.body.appendChild(text);
        setTimeout(() => text.remove(), 500);
    },

    levelUp() {
        const newLevel = Math.min(99, this.player.level + 1);
        
        // Check if we're crossing a tier (levels divisible by 10)
        if (Math.floor(newLevel / 10) > Math.floor(this.player.level / 10)) {
            const randomColor = this.classes[Object.keys(this.classes)[Math.floor(Math.random() * Object.keys(this.classes).length)]].color;
            this.elements.flash.style.backgroundColor = randomColor;
            this.elements.flash.style.opacity = '0.5';
            setTimeout(() => {
                this.elements.flash.style.opacity = '0';
            }, 300);
        }

        this.player.level = newLevel;
        this.player.xp = 0;
        this.player.xpNeeded = Math.floor(20 * Math.pow(1.1, this.player.level - 1));
        this.hueRotation = 0;
        
        const subIdx = this.sublevels.indexOf(this.player.sublevel);
        this.player.sublevel = subIdx < this.sublevels.length - 1 ? 
            this.sublevels[subIdx + 1] : this.sublevels[0];
        
        const oldClass = this.player.class;
        this.updateClass();
        if (oldClass !== this.player.class) this.showClassUpAnimation();
        this.updateSublevel();
    },

    updateClass() {
        let highest = {level: 1, class: 'Wanderer'};
        Object.entries(this.classes).forEach(([name, data]) => {
            if (this.player.level >= data.level && data.level > highest.level) {
                highest = {level: data.level, class: name};
            }
        });
        this.player.class = highest.class;
    },

    showClassUpAnimation() {
        this.elements.classDisplay.style.animation = 'classUp 1s ease';
    },

    saveProgress() {
        localStorage.setItem('playerXP', JSON.stringify(this.player));
        localStorage.setItem('clickedItems', JSON.stringify([...this.clickedItems]));
    },

    loadProgress() {
        const saved = localStorage.getItem('playerXP');
        const clicks = localStorage.getItem('clickedItems');
        if (saved) {
            const data = JSON.parse(saved);
            if (data.level && data.xp !== undefined && data.xpNeeded) this.player = data;
        }
        if (clicks) this.clickedItems = new Set(JSON.parse(clicks));
    }
};

window.xpSystem.init();



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



// Enemy System Script
// Spawns a monster every 2-5 minutes randomly.
// Clicking the enemy-system container gives 20% of current XP bar progress.
// enemy-picture reacts with a p5.js dither animation (enemy variant).

(function () {
  // ─── Enemy p5 Dither Animation ───────────────────────────────────────────────
  // Waits for p5.js to be available, then starts a hostile-looking dither sketch
  // inside the element with class "enemy-picture".

  function initEnemyDither(container) {
    if (!window.p5) {
      setTimeout(() => initEnemyDither(container), 100);
      return;
    }

    // Prevent double-init
    if (container._enemyP5) return;

    // Enemy class colours – reds, oranges, sickly greens
    const enemyColors = [
      '#ff2200', '#ff6600', '#cc0000', '#ff9900',
      '#33ff00', '#ff0066', '#ffcc00', '#990000',
    ];

    container._enemyP5 = new window.p5(function (p) {
      const SIZE = 20; // grid cells
      let grid = [];
      let frameCounter = 0;
      let pulseIntensity = 0;
      let currentColor = enemyColors[0];
      let targetColor  = enemyColors[0];
      let alive = true; // set false on defeat

      // Pick a random enemy color
      function randomEnemyColor() {
        return enemyColors[Math.floor(Math.random() * enemyColors.length)];
      }

      p.setup = function () {
        const canvas = p.createCanvas(container.offsetWidth || 80, container.offsetHeight || 80);
        canvas.parent(container);
        p.noSmooth();
        p.frameRate(6); // Slightly faster than bellissimo – feels more hostile
        targetColor = randomEnemyColor();
      };

      // Called externally when the enemy takes a hit / is defeated
      container.enemyHit = function () {
        pulseIntensity = 1.5;
        targetColor = '#ff0000';
      };

      container.enemyDefeat = function () {
        alive = false;
        targetColor = '#000000';
      };

      function buildGrid() {
        grid = [];
        for (let i = 0; i < SIZE; i++) {
          grid[i] = [];
          for (let j = 0; j < SIZE; j++) {
            // Dither: noisy, chunky, corner-biased differently from bellissimo
            let t = frameCounter * 0.15;

            // Use a diagonal noise sweep (different from bellissimo's symmetric corners)
            let noiseVal = p.noise(i * 0.15 + t, j * 0.12 - t * 0.7) * 100;

            // Bias toward centre (inverse of bellissimo's corner bias)
            let cx = (i - SIZE / 2) / SIZE;
            let cy = (j - SIZE / 2) / SIZE;
            let centreDist = Math.sqrt(cx * cx + cy * cy); // 0 at center, ~0.7 at corner
            let threshold = p.map(pulseIntensity, 0, 1.5, 30, 70) * (0.4 + centreDist * 0.6);

            let intensity = noiseVal < threshold ? 1 : 0;
            let sparkle   = Math.random() < 0.04; // slightly more sparkle than bellissimo

            grid[i][j] = { intensity, sparkle };
          }
        }
      }

      p.draw = function () {
        p.background('#0d0d0d');

        if (!alive) {
          // Draw a dissolving static effect on defeat
          p.background('#0d0d0d');
          for (let i = 0; i < SIZE; i++) {
            for (let j = 0; j < SIZE; j++) {
              if (Math.random() < 0.05) {
                p.fill(Math.random() * 80);
                p.noStroke();
                let cs = p.width / SIZE;
                p.rect(i * cs, j * cs, cs + 1, cs + 1);
              }
            }
          }
          return;
        }

        // Lerp current colour toward target
        let from = p.color(currentColor);
        let to   = p.color(targetColor);
        let lerped = p.lerpColor(from, to, 0.08);
        currentColor = lerped.toString();

        // Cycle colours slowly
        if (frameCounter % 18 === 0) {
          targetColor = randomEnemyColor();
        }

        frameCounter++;
        pulseIntensity *= 0.85;
        buildGrid();

        let cellSize = p.width / SIZE;

        for (let i = 0; i < SIZE; i++) {
          for (let j = 0; j < SIZE; j++) {
            let { intensity, sparkle } = grid[i][j];
            let base  = p.color('#0d0d0d');
            let pixel = sparkle && intensity > 0
              ? p.color(randomEnemyColor())
              : p.color(currentColor);

            p.fill(p.lerpColor(base, pixel, intensity));
            p.noStroke();
            p.rect(i * cellSize, j * cellSize, cellSize + 1, cellSize + 1);
          }
        }
      };
    });
  }

  // ─── Enemy Spawn Logic ───────────────────────────────────────────────────────

  const ENEMY_NAMES = [
    'Glitch Rat', 'Pixel Wraith', 'Noise Fiend', 'Error Sprite',
    'Data Leech', 'Void Crawler', 'Bit Phantom', 'Null Shade',
  ];

  function randomEnemyName() {
    return ENEMY_NAMES[Math.floor(Math.random() * ENEMY_NAMES.length)];
  }

  // Returns a random spawn delay between 2 and 5 minutes (ms)
  function randomDelay() {
    return (2 + Math.random() * 3) * 60 * 1000;
  }

  // Show the enemy container, wire up click, and start the dither
  function spawnEnemy() {
    const system = document.querySelector('.enemy-system');
    if (!system) return;

    // Update enemy name text if the element exists
    const nameEl = system.querySelector('.enemyname');
    if (nameEl) nameEl.textContent = randomEnemyName();

    // Show the container
    system.style.display = '';
    system.style.opacity = '0';
    system.style.transition = 'opacity 0.6s ease';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => { system.style.opacity = '1'; });
    });

    // Init the dither on enemy-picture
    const picEl = system.querySelector('.enemy-picture');
    if (picEl) initEnemyDither(picEl);

    // Wire up the click reward (once per spawn)
    function onEnemyClick() {
      // Give 20% of current XP bar
      const xp = window.xpSystem;
      if (xp && xp.player) {
        const reward = Math.ceil(xp.player.xpNeeded * 0.20);
        // Trigger hit animation on the dither
        if (picEl && picEl.enemyHit) picEl.enemyHit();

        // Defeat: give XP, hide after short delay
        if (picEl && picEl.enemyDefeat) picEl.enemyDefeat();

        setTimeout(() => {
          xp.addXP(reward);
          // Show floating reward text
          showRewardText(system, `+${reward} XP`);
        }, 300);

        // Hide the enemy after defeat animation
        setTimeout(() => {
          system.style.transition = 'opacity 0.8s ease';
          system.style.opacity = '0';
          setTimeout(() => {
            system.style.display = 'none';
            // Destroy the p5 sketch so it can be re-created fresh next spawn
            if (picEl && picEl._enemyP5) {
              picEl._enemyP5.remove();
              delete picEl._enemyP5;
              picEl.innerHTML = '';
            }
            scheduleNextSpawn();
          }, 800);
        }, 600);
      }

      system.removeEventListener('click', onEnemyClick);
    }

    system.addEventListener('click', onEnemyClick);
  }

  function scheduleNextSpawn() {
    setTimeout(spawnEnemy, randomDelay());
  }

  // ─── Floating reward text ────────────────────────────────────────────────────
  function showRewardText(anchor, text) {
    const el = document.createElement('div');
    el.textContent = text;
    el.style.cssText = `
      position: fixed;
      font-family: monospace;
      font-size: 20px;
      font-weight: bold;
      color: #ff2200;
      pointer-events: none;
      z-index: 99999;
      text-shadow: 0 0 8px #ff6600;
      transition: transform 0.8s ease, opacity 0.8s ease;
      opacity: 1;
    `;
    // Place near the anchor element
    const rect = anchor.getBoundingClientRect();
    el.style.left = `${rect.left + rect.width / 2 - 40}px`;
    el.style.top  = `${rect.top + rect.height / 2}px`;
    document.body.appendChild(el);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transform = 'translateY(-60px)';
        el.style.opacity   = '0';
      });
    });

    setTimeout(() => el.remove(), 900);
  }

  // ─── Boot ────────────────────────────────────────────────────────────────────
  function boot() {
    // Hide the enemy system initially
    const system = document.querySelector('.enemy-system');
    if (system) {
      system.style.display = 'none';
      system.style.cursor  = 'pointer';
    }

    // Schedule the first spawn
    scheduleNextSpawn();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

</script>

// Main script file for folio functionality
// Styles for the elements (only click indicator, no bellissimo styling)
const styles = `
    .click-indicator {
        position: absolute;
        width: 0px;
        height: 0px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 9998;
        animation: click-ripple 0.8s ease-out forwards;
    }
    
    @keyframes click-ripple {
        0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
    }
`;

// Initialize everything when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    // Add styles
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
    
    // Load external libraries
    loadExternalLibraries();
    
    // Initialize click tracking
    initializeClickTracking();
    
    // Initialize dither pattern once p5.js is loaded
    checkP5AndInitialize();
});

// Load external libraries
function loadExternalLibraries() {
    // Load p5.js if not already loaded
    if (!window.p5) {
        const p5Script = document.createElement('script');
        p5Script.src = 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.2/p5.min.js';
        document.head.appendChild(p5Script);
    }
    
    // Load vizceral.min.js if not already loaded
    if (!window.Vizceral) {
        const vizceralScript = document.createElement('script');
        vizceralScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/vizceral/4.9.0/vizceral.min.js';
        document.head.appendChild(vizceralScript);
    }
}

// Check if p5.js is loaded and initialize
function checkP5AndInitialize() {
    if (window.p5) {
        // Check if the bellissimo div exists before initializing
        if (document.getElementById('bellissimo')) {
            initializeDitherPattern();
        } else {
            console.error('Error: #bellissimo element not found in the document');
        }
    } else {
        setTimeout(checkP5AndInitialize, 100);
    }
}

// Initialize click tracking
function initializeClickTracking() {
    document.addEventListener('click', (e) => {
        // Create click indicator
        const clickIndicator = document.createElement('div');
        clickIndicator.className = 'click-indicator';
        clickIndicator.style.left = `${e.clientX}px`;
        clickIndicator.style.top = `${e.clientY}px`;
        document.body.appendChild(clickIndicator);
        
        // Remove after animation completes
        setTimeout(() => {
            clickIndicator.remove();
        }, 800);
        
        // Log click position
        console.log(`Click at: X=${e.clientX}, Y=${e.clientY}`);
    });
}

// Initialize dither pattern
function initializeDitherPattern() {
    // Initialize p5 sketch
    new p5(function(p) {
        let size = 25;
        let grid = [];
        let frameCount = 0;
        let patternIntensity = 0.5; // Start with some intensity
        let currentColor = '#ffffff'; // Start with white
        let targetColor = '#ffffff';
        let isScrolling = false;
        let pulseIntensity = 0;
        let flashColor = null;
        let flashDuration = 0;
        
        // Class colors array for sparkles
        const classColors = [
            '#c7f3c6', '#eaff00', '#f5320b', '#948eff', '#c7f3c6', 
            '#dbff00', '#fdceeb', '#0095ff', '#cde0f5', '#fdceeb', '#e362d3'
        ];
        
        p.setup = function() {
            let canvas = p.createCanvas(40, 40);
            canvas.parent('bellissimo');
            initializeGrid();
            p.noSmooth();
            p.frameRate(4);
            
            // General click event for pulse effect
            document.addEventListener('click', () => {
                pulseIntensity = 1;
                patternIntensity = 1;
            });
            
            // Special click events for featured images and case study previews
            document.addEventListener('click', (e) => {
                if (e.target.classList.contains('featured-img') || 
                    e.target.classList.contains('case-study-preview-image') ||
                    e.target.closest('.featured-img') || 
                    e.target.closest('.case-study-preview-image')) {
                    
                    // Get a random color from the classColors array
                    flashColor = classColors[Math.floor(p.random(classColors.length))];
                    flashDuration = 3; // Flash for 3 frames
                    
                    // Also set as the target color for a lasting effect
                    targetColor = flashColor;
                }
            });
        };
        
        function getRandomClassColor() {
            return classColors[Math.floor(p.random(classColors.length))];
        }
        
        function getCornerBias(i, j) {
            let corners = [
                [0, 0],
                [0, size-1],
                [size-1, 0],
                [size-1, size-1]
            ];
            
            let minDist = 1.0;
            corners.forEach(corner => {
                let dx = (i - corner[0]) / size;
                let dy = (j - corner[1]) / size;
                let dist = p.sqrt(dx*dx + dy*dy);
                minDist = p.min(minDist, dist);
            });
            
            return minDist / p.sqrt(2);
        }
        
        function calculateCellValue(i, j) {
            // If we're flashing, return full intensity
            if (flashDuration > 0) {
                return {
                    intensity: 1,
                    sparkle: false
                };
            }
            
            let value = 0;
            let cornerEffect = getCornerBias(i, j);
            let cornerBiasStrength = 0.6 + (pulseIntensity * 0.4);
            
            let mouseXNorm = p.mouseX / window.innerWidth;
            let mouseYNorm = p.mouseY / window.innerHeight;
            
            let t = frameCount * 0.1;
            let noiseVal = p.noise(
                i * 0.1 + t + (isScrolling ? 0.5 : 0), 
                j * 0.1 + t + (pulseIntensity * 0.3)
            ) * 100;
            
            let intensityThreshold = p.map(patternIntensity, 0, 1, 20, 60);
            
            if (noiseVal < intensityThreshold) {
                let threshold = 0.5 - (cornerBiasStrength * (1 - cornerEffect) * 0.5);
                threshold = p.map(mouseXNorm, 0, 1, 0.3, 0.7) * threshold;
                value += p.random() > threshold ? 1 : 0;
            }
            
            if (isScrolling) {
                value = value * 0.8;
            }
            
            return {
                intensity: value,
                sparkle: p.random() < 0.02 // 2% chance for sparkle
            };
        }
        
        function initializeGrid() {
            grid = [];
            for (let i = 0; i < size; i++) {
                grid[i] = [];
                for (let j = 0; j < size; j++) {
                    grid[i][j] = calculateCellValue(i, j);
                }
            }
        }
        
        p.draw = function() {
            // If we're flashing, use the flash color as background
            if (flashDuration > 0) {
                p.background(flashColor);
                flashDuration--;
            } else {
                p.background('#1a1a1a');
                
                currentColor = lerpColor(currentColor, targetColor, 0.1);
                
                frameCount++;
                initializeGrid();
                
                pulseIntensity *= 0.9;
                
                let cellSize = p.width / size;
                for (let i = 0; i < size; i++) {
                    for (let j = 0; j < size; j++) {
                        let x = i * cellSize;
                        let y = j * cellSize;
                        let cell = grid[i][j];
                        
                        let c;
                        if (cell.sparkle && cell.intensity > 0) {
                            // Use a random class color for sparkle
                            c = p.color(getRandomClassColor());
                        } else {
                            c = p.color(currentColor);
                        }
                        
                        p.fill(p.lerpColor(p.color('#1a1a1a'), c, cell.intensity));
                        p.noStroke();
                        p.rect(x, y, cellSize + 1, cellSize + 1);
                    }
                }
            }
        };
        
        function lerpColor(c1, c2, amt) {
            let from = p.color(c1);
            let to = p.color(c2);
            return p.lerpColor(from, to, amt);
        }
    });
}


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
                max-height: 80vh;
            }
            .preview-item img {
                width: 100%;
                height: auto;
                display: block;
                vertical-align: bottom;
                object-fit: contain;
                max-height: 80vh;
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

    document.querySelectorAll('.case-study-preview-image').forEach(img => {
        img.addEventListener('click', () => {
            if (!isDesktop() || isTouch) return;

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
                this.addXP(6);
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
            this.showXPGain(item, 10);
            this.addXP(10);
        }
    },

    handleCaseStudyClick(element) {
        this.showXPGain(element, 24);
        this.addXP(24);
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
</script><script>
let draggedItem = null;
let placeholder = null;

document.addEventListener("DOMContentLoaded", () => {
    if (window.innerWidth > 991) { 
        initDragDrop();
    }
});

document.body.style.transition = "background-color 0.3s ease";

function initDragDrop() {
    let items = document.querySelectorAll('.col-list-item');
    items.forEach(item => {
        item.removeEventListener('dragstart', dragStartHandler);
        item.removeEventListener('dragend', dragEndHandler);
        item.removeEventListener('dragover', dragOverHandler);
        item.removeEventListener('dragleave', dragLeaveHandler);
        item.removeEventListener('drop', dropHandler);
    });

    items = document.querySelectorAll('.col-list-item');

    items.forEach(item => {
        item.setAttribute('draggable', 'true');

        item.querySelectorAll('*').forEach(child => {
            child.setAttribute('draggable', 'false');
        });
        item.addEventListener('mouseover', () => {
            item.style.backgroundColor = "#f5f5f5";
        });
        item.addEventListener('mouseout', () => {
            item.style.backgroundColor = "";
        });
        item.addEventListener('dragstart', dragStartHandler);
        item.addEventListener('dragend', dragEndHandler);
        item.addEventListener('dragover', dragOverHandler);
        item.addEventListener('dragleave', dragLeaveHandler);
        item.addEventListener('drop', dropHandler);
    });
}
function dragStartHandler(e) {
    draggedItem = this;
    const iframe = draggedItem.querySelector('iframe');
    if (iframe) {
        placeholder = iframe.cloneNode(true);
        placeholder.style.visibility = 'hidden';
        iframe.style.display = 'none';
        draggedItem.insertBefore(placeholder, iframe);
    }
    
    document.body.style.backgroundColor = "#f5f5f5";
    draggedItem.style.opacity = '0.5';
    draggedItem.style.outline = "4px solid #0095ff";
}

function dragEndHandler(e) {
    if (placeholder) {
        placeholder.remove();
        const iframe = draggedItem.querySelector('iframe');
        if (iframe) {
            iframe.style.display = '';
        }
    }

    draggedItem.style.opacity = '1';
    draggedItem.style.outline = "";
    draggedItem = null;
    document.body.style.backgroundColor = "#ffffff";
    initDragDrop();
}

function dragOverHandler(e) {
    e.preventDefault();
    this.style.outline = "4px solid #0095ff";
}

function dragLeaveHandler(e) {
    this.style.outline = "";
}

function dropHandler(e) {
    if (draggedItem) {
        const draggedIndex = Array.from(document.querySelectorAll('.col-list-item')).indexOf(draggedItem);
        const dropIndex = Array.from(document.querySelectorAll('.col-list-item')).indexOf(this);

        if (draggedIndex < dropIndex) {
            this.parentElement.insertBefore(draggedItem, this.nextSibling);
        } else {
            this.parentElement.insertBefore(draggedItem, this);
        }
        this.style.outline = "";
    }
}
</script>


<script>
document.addEventListener('DOMContentLoaded', function() {
    var colors = [
        '#c7f3c6',
        '#eaff00',
        '#f5320b',
        '#948eff',
        '#c7f3c6',
        '#dbff00',
        '#fdceeb',
        '#0095ff',
        '#cde0f5',
        '#fdceeb',
        '#e362d3',
        '#01a451'
    ];
    var isHovered = false;
    var interval;
    var timeout;

    function getRandomColor() {
        return colors[Math.floor(Math.random() * colors.length)];
    }

    function changeTwoRandomColors() {
        const combinedSelectors = '._2up, .oracle-collaborator';
        const items = document.querySelectorAll(combinedSelectors);
        if (items.length < 2) return;

        const index1 = Math.floor(Math.random() * items.length);
        let index2;
        do {
            index2 = Math.floor(Math.random() * items.length);
        } while (index2 === index1);

        items[index1].style.backgroundColor = getRandomColor();
        items[index2].style.backgroundColor = getRandomColor();
    }

    function startColorChange() {
        if (!isHovered) {
            changeTwoRandomColors();
            interval = setInterval(changeTwoRandomColors, 1000);
            setTimeout(() => {
                clearInterval(interval);
                timeout = setTimeout(startColorChange, 60000);
            }, 4000);
        }
    }

    document.body.addEventListener('mouseover', function(event) {
        var target = event.target;
        if (target.matches('._2up, .oracle-collaborator')) {
            isHovered = true;
            target.style.backgroundColor = getRandomColor();
            clearInterval(interval);
            clearTimeout(timeout);
        }
    });

    setTimeout(startColorChange, 10000);
});

</script>

<style>
.oraclestatement {
  padding-left: 22px;
  text-indent: -22px;
}
</style>
   
<script>
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
</script>
<script>
document.addEventListener('DOMContentLoaded', function () {
    const hexCodes = ['#c7f3c6', '#eaff00', '#f5320b', '#948eff', '#c7f3c6', '#dbff00', '#fdceeb', '#0095ff', '#cde0f5', '#fdceeb', '#e362d3', '#01a451'];
    
    const textElements = document.querySelectorAll('.displaytitle');
    const randomColor = hexCodes[Math.floor(Math.random() * hexCodes.length)];
    textElements.forEach(function (element) {
      element.style.color = randomColor;
      element.style.borderColor = randomColor;
    });

    // Set background color for .db3 and .db4 elements
    const db3Elements = document.querySelectorAll('.db3');
    const db4Elements = document.querySelectorAll('.db4');
    db3Elements.forEach(function (db3Element) {
      const randomColorDb3 = hexCodes[Math.floor(Math.random() * hexCodes.length)];
      db3Element.style.backgroundColor = randomColorDb3;

      const db4Sibling = db3Element.closest(':scope > * + .db4');
      if (db4Sibling) {
        let randomColorDb4 = hexCodes[Math.floor(Math.random() * hexCodes.length)];
        while (randomColorDb4 === randomColorDb3) {
          randomColorDb4 = hexCodes[Math.floor(Math.random() * hexCodes.length)];
        }
        db4Sibling.style.backgroundColor = randomColorDb4;
      }
    });

    db4Elements.forEach(function (db4Element) {
      if (!db4Element.previousElementSibling || !db4Element.previousElementSibling.classList.contains('db3')) {
        const randomColorDb4 = hexCodes[Math.floor(Math.random() * hexCodes.length)];
        db4Element.style.backgroundColor = randomColorDb4;
      }
    });


    function setColorForElements(elements) {
      elements.forEach(function (element) {
        const randomColor = hexCodes[Math.floor(Math.random() * hexCodes.length)];
        element.style.backgroundColor = randomColor;
      });
    }
    setColorForElements(document.querySelectorAll('.db5'));
    setColorForElements(document.querySelectorAll('.db6'));
    setColorForElements(document.querySelectorAll('.multiplybox'));
    // Check if the viewport width is more than 479px
    if (window.innerWidth > 479) {
        // Set opacity animation for .col-list-item
        const items = document.querySelectorAll('.col-list-item');
        items.forEach((item, index) => {
          item.style.opacity = "0";
          setTimeout(() => {
            item.style.transition = "opacity 125ms ease-out";
            item.style.opacity = "1";
          }, index * 150);
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const indicators = document.querySelectorAll('.circle-indicator');

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
});

</script> 
<script>
    const hexCodes = ['#c7f3c6', '#eaff00', '#f5320b', '#948eff', '#c7f3c6', '#dbff00', '#fdceeb', '#0095ff', '#cde0f5', '#fdceeb', '#e362d3', '#01a451'];

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
        vectorPoint.style.backgroundColor = hexCodes[Math.floor(Math.random() * hexCodes.length)];

        const size = Math.random() * 5 + 3;
        vectorPoint.style.width = `${size}px`;
        vectorPoint.style.height = `${size}px`;

        fadeOutVectorPoint(vectorPoint);
    });

    function fadeOutVectorPoint(vectorPoint) {
        setTimeout(() => {
            vectorPoint.style.opacity = "0";
            vectorPoint.addEventListener("transitionend", () => {
                vectorPoint.remove();
            });
        }, 1250);
    }

</script>

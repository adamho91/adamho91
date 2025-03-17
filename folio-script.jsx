// Main script file for folio functionality
document.addEventListener('DOMContentLoaded', () => {
    // Load external libraries
    loadExternalLibraries();
    
    // Add required styles
    addStyles();
    
    // Initialize preview functionality
    initializePreviewSystem();
    
    // Initialize animation system
    initializeAnimationSystem();
    
    // Initialize dither pattern
    initializeDitherPattern();
});

// Load external libraries
function loadExternalLibraries() {
    // Load p5.js
    if (!window.p5) {
        const p5Script = document.createElement('script');
        p5Script.src = 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.2/p5.min.js';
        document.head.appendChild(p5Script);
    }
    
    // Load vizceral.min.js
    const vizceralScript = document.createElement('script');
    vizceralScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/vizceral/4.9.0/vizceral.min.js';
    document.head.appendChild(vizceralScript);
}

// Add required styles
function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @media (min-width: 991px) {
            .rpg-container {
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
            .rpg-container img {
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
        
        .serially {
            opacity: 0;
            transition: opacity 0.4s ease-in-out;
        }
        
        .fade-in {
            opacity: 1;
        }
        
        .fade-out {
            opacity: 0 !important;
            transition: opacity 0.3s ease-out;
        }
        
        #ditherdiv {
            width: 100px;
            height: 100px;
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #1a1a1a;
            z-index: 9999;
            transition: transform 0.3s ease;
        }
        
        #ditherdiv.pulse {
            transform: scale(1.1);
        }
        
        .xp-gain {
            position: absolute;
            color: #fff;
            background: rgba(0,0,0,0.7);
            padding: 4px 8px;
            border-radius: 4px;
            pointer-events: none;
            animation: float-up 0.5s ease-out forwards;
            z-index: 10000;
        }
        
        @keyframes float-up {
            0% { transform: translateY(0); opacity: 1; }
            100% { transform: translateY(-20px); opacity: 0; }
        }
        
        @keyframes classUp {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
}

// Initialize preview system
function initializePreviewSystem() {
    const previewContainer = document.createElement('div');
    previewContainer.className = 'rpg-container';
    document.body.appendChild(previewContainer);

    const stackContainer = document.createElement('div');
    stackContainer.className = 'preview-stack';
    document.body.appendChild(stackContainer);

    let stackItems = [];
    let hoverTimeout;
    let currentHoverElement = null;
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
            previewContainer.style.display = 'none';
        }
    });

    const showPreview = (img, immediate = false) => {
        if (!isDesktop()) return;
        clearTimeout(hoverTimeout);
        hoverTimeout = setTimeout(() => {
            if (currentHoverElement === img && stackItems.length === 0) { // Only show preview if no stack exists
                const previewImg = new Image();
                previewImg.src = img.src;
                previewContainer.innerHTML = '';
                previewContainer.appendChild(previewImg);
                previewContainer.style.display = 'block';
            }
        }, immediate ? 0 : 50);
    };

    const hidePreview = () => {
        if (!isDesktop()) return;
        clearTimeout(hoverTimeout);
        hoverTimeout = setTimeout(() => {
            currentHoverElement = null;
            if (stackItems.length === 0) { // Only hide if no stack exists
                previewContainer.style.display = 'none';
            }
        }, 50);
    };

    // Add event listeners once elements are available
    setTimeout(() => {
        document.querySelectorAll('.case-study-preview-image').forEach(img => {
            img.addEventListener('mouseenter', (e) => {
                if (isTouch || !isDesktop()) return;
                if (e.target === img) {
                    currentHoverElement = img;
                    showPreview(img);
                }
            });
            
            img.addEventListener('mouseleave', (e) => {
                if (isTouch || !isDesktop()) return;
                if (e.target === img && !e.relatedTarget?.closest('.case-study-preview-image')) {
                    hidePreview();
                }
            });

            img.addEventListener('click', () => {
                if (!isDesktop()) return;

                // If this is the first click, hide the preview container
                if (stackItems.length === 0) {
                    previewContainer.style.display = 'none';
                }

                const stackItem = document.createElement('div');
                stackItem.className = 'preview-item';
                const stackImg = new Image();
                stackImg.src = img.src;
                stackItem.appendChild(stackImg);
                
                stackItems.unshift(stackItem);
                stackContainer.prepend(stackItem);
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
    }, 500);

    let lastMouseMove = 0;
    document.addEventListener('mousemove', (e) => {
        if (isTouch || !isDesktop()) return;
        
        const now = Date.now();
        if (now - lastMouseMove > 100) {
            lastMouseMove = now;
            const hoveredImg = e.target.closest('.case-study-preview-image');
            if (hoveredImg && hoveredImg !== currentHoverElement) {
                currentHoverElement = hoveredImg;
                showPreview(hoveredImg, true);
            }
        }
    });
}

// Initialize animation system
function initializeAnimationSystem() {
    // Animation control
    let isAnimating = true;
    let currentTimeout = null;
    let scrollTimeout = null;
    let isScrollFading = false;

    // Function to shuffle only the content
    function shuffleContent() {
        const elements = Array.from(document.querySelectorAll('.serially'));
        if (elements.length === 0) return;
        
        const contents = elements.map(el => el.textContent);
        
        // Fisher-Yates shuffle of contents
        for (let i = contents.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [contents[i], contents[j]] = [contents[j], contents[i]];
        }
        
        // Apply shuffled contents back to elements
        elements.forEach((el, i) => {
            el.textContent = contents[i];
        });
    }

    // Function to instantly fade out all elements (for click)
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

    // Function to rhythmically fade out elements (for scroll)
    function rhythmicFadeOut() {
        if (!isScrollFading) return;
        
        const visibleElements = Array.from(document.querySelectorAll('.serially.fade-in'));
        if (visibleElements.length === 0) {
            isScrollFading = false;
            return;
        }
        
        // Faster rhythm patterns
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

    // Regular animation function for fade-in
    function animateElements() {
        const elements = Array.from(document.querySelectorAll('.serially:not(.fade-in)'));
        if (elements.length === 0 || !isAnimating) return;
        
        const rhythms = [
            [100, 200, 50, 300, 150, 250],
            [300, 300, 300, 100, 100, 100],
            [200, 50, 200, 50, 200, 50],
            [400, 100, 100, 400, 100, 100]
        ];
        
        const currentRhythm = rhythms[Math.floor(Math.random() * rhythms.length)];
        let rhythmIndex = 0;
        
        function fadeNext() {
            if (elements.length === 0 || !isAnimating) return;
            
            const randomIndex = Math.floor(Math.random() * elements.length);
            const element = elements[randomIndex];
            
            element.classList.add('fade-in');
            elements.splice(randomIndex, 1);
            
            if (elements.length > 0 && isAnimating) {
                const delay = currentRhythm[rhythmIndex % currentRhythm.length];
                rhythmIndex++;
                currentTimeout = setTimeout(fadeNext, delay);
            }
        }
        
        fadeNext();
    }

    // Click handler
    document.addEventListener('click', instantFadeOutAll);

    // Scroll handler with debounce
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

    // Initialize animation
    setTimeout(() => {
        shuffleContent();
        animateElements();
    }, 500);

    // Optional: Press 'R' to restart
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
}

// Initialize dither pattern
function initializeDitherPattern() {
    // Create dither div if it doesn't exist
    if (!document.getElementById('ditherdiv')) {
        const ditherDiv = document.createElement('div');
        ditherDiv.id = 'ditherdiv';
        document.body.appendChild(ditherDiv);
    }

    // Wait for p5.js to load
    const checkP5Loaded = setInterval(() => {
        if (window.p5) {
            clearInterval(checkP5Loaded);
            
            // Initialize p5 sketch
            new p5(function(p) {
                let size = 25;
                let grid = [];
                let frameCount = 0;
                let patternIntensity = 0;
                let currentColor = '#ffffff';
                let targetColor = '#ffffff';
                let isScrolling = false;
                let pulseIntensity = 0;
                
                // Class colors array for sparkles
                const classColors = [
                    '#c7f3c6', '#eaff00', '#f5320b', '#948eff', '#c7f3c6', 
                    '#dbff00', '#fdceeb', '#0095ff', '#cde0f5', '#fdceeb', '#e362d3'
                ];
                
                p.setup = function() {
                    let canvas = p.createCanvas(100, 100);
                    canvas.parent('ditherdiv');
                    initializeGrid();
                    p.noSmooth();
                    p.frameRate(4);
                    
                    // Event Listeners
                    document.addEventListener('click', () => {
                        pulseIntensity = 1;
                        patternIntensity = 1;
                    });
            
                    document.addEventListener('scroll', () => {
                        isScrolling = true;
                        setTimeout(() => {
                            isScrolling = false;
                        }, 50);
                    }, { passive: true });
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
                };
                
                function lerpColor(c1, c2, amt) {
                    let from = p.color(c1);
                    let to = p.color(c2);
                    return p.lerpColor(from, to, amt);
                }
            });
        }
    }, 100);
}

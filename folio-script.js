// Main script file for folio functionality
// Styles for the elements
const styles = `
    #bellissimo {
        width: 100px;
        height: 100px;
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #1a1a1a;
        z-index: 9999;
        transition: transform 0.3s ease;
    }
    
    #bellissimo.pulse {
        transform: scale(1.1);
    }
    
    .click-indicator {
        position: absolute;
        width: 20px;
        height: 20px;
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
            canvas.parent('bellissimo');
            initializeGrid();
            p.noSmooth();
            p.frameRate(4);
            
            // Event Listeners - only keep click for pulse effect
            document.addEventListener('click', () => {
                pulseIntensity = 1;
                patternIntensity = 1;
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

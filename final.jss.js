// Global variable for chakra speed
let chakraSpeed = 1.0;
let currentNames = [];
let animationFrame = null;
let imagesLoaded = false;

const japaneseNames = [
    'Sasuke', 'Sakura', 'Kakashi', 'Hinata', 'Shikamaru', 'Ino', 'Choji',
    'Rock Lee', 'Neji', 'Tenten', 'Gaara', 'Temari', 'Kankuro', 'Jiraiya',
    'Tsunade', 'Orochimaru', 'Itachi', 'Kisame', 'Deidara', 'Sasori',
    'Hidan', 'Kakuzu', 'Konan', 'Pain', 'Minato', 'Kushina', 'Yamato',
    'Sai', 'Shino', 'Kiba', 'Asuma', 'Kurenai', 'Iruka', 'Anko', 'Guy',
    'Obito', 'Madara', 'Hashirama', 'Tobirama', 'Hiruzen'
];

const narutoIdleImg = new Image();
const narutoActiveImg = new Image();
const chakraImg = new Image();

// Debug info
const debugInfo = document.getElementById('debugInfo');

function updateDebugInfo(message) {
    debugInfo.textContent = message;
    console.log(message);
}

// Initialize chakra background particles
function initChakraParticles() {
    const overlay = document.getElementById('chakraOverlay');
    overlay.innerHTML = '';
    
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'chakra-particle';
        
        const size = Math.random() * 30 + 10;
        const left = Math.random() * 100;
        const delay = Math.random() * 6;
        const duration = Math.random() * 4 + 4;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${left}vw`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.animationDuration = `${duration}s`;
        
        overlay.appendChild(particle);
    }
}

// Image loading with error handling
let loadedCount = 0;
function checkImagesLoaded() {
    loadedCount++;
    updateDebugInfo(`Images loaded: ${loadedCount}/3`);
    
    if (loadedCount === 3) {
        imagesLoaded = true;
        document.getElementById('visualizeBtn').disabled = false;
        document.getElementById('visualizeBtn').textContent = '▶ Visualize';
        updateDebugInfo('All images loaded successfully!');
    }
}

function handleImageError(img, type) {
    updateDebugInfo(`Failed to load ${type} image, using fallback`);
    // Create a simple colored circle as fallback
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    
    if (type === 'naruto') {
        // Orange circle for Naruto
        ctx.fillStyle = '#ff8c00';
        ctx.beginPath();
        ctx.arc(50, 50, 45, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Naruto', 50, 50);
    } else {
        // Yellow circle for chakra
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(50, 50, 45, 0, Math.PI * 2);
        ctx.fill();
    }
    
    img.src = canvas.toDataURL();
    checkImagesLoaded();
}

narutoIdleImg.onload = checkImagesLoaded;
narutoActiveImg.onload = checkImagesLoaded;
chakraImg.onload = checkImagesLoaded;

narutoIdleImg.onerror = () => handleImageError(narutoIdleImg, 'naruto');
narutoActiveImg.onerror = () => handleImageError(narutoActiveImg, 'naruto');
chakraImg.onerror = () => handleImageError(chakraImg, 'chakra');

// Use the provided Naruto image
narutoIdleImg.src = 'https://i.redd.it/1bp93qp03vv71.png';
narutoActiveImg.src = 'https://i.redd.it/1bp93qp03vv71.png';
chakraImg.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiNGRkQ3MDAiLz4KPHBhdGggZD0iTTEyIDJMMTUgOUwyMiAxMkwxNSA5TDEyIDE2TDkgOUwyIDEyTDkgOUwxMiAyWiIgZmlsbD0iI0ZGOEMwMCIvPgo8L3N2Zz4K';

function generateNames(n) {
    const shuffled = [...japaneseNames].sort(() => Math.random() - 0.5);
    currentNames = shuffled.slice(0, n);
}

function dijkstra(N, S, edges) {
    const graph = Array.from({ length: N + 1 }, () => []);
    edges.forEach(({ u, v, t }) => {
        graph[u].push([v, t]);
        graph[v].push([u, t]); // Undirected graph
    });
    
    const minTime = Array(N + 1).fill(Infinity);
    minTime[S] = 0;
    const heap = [[0, S]];
    
    while (heap.length > 0) {
        heap.sort((a, b) => a[0] - b[0]);
        const [currTime, node] = heap.shift();
        
        if (currTime > minTime[node]) continue;
        
        for (const [neighbor, cost] of graph[node]) {
            const newTime = currTime + cost;
            if (newTime < minTime[neighbor]) {
                minTime[neighbor] = newTime;
                heap.push([newTime, neighbor]);
            }
        }
    }
    
    return minTime;
}

function parseInput() {
    const N = parseInt(document.getElementById('numNinjas').value);
    const S = parseInt(document.getElementById('sourceNinja').value);
    const connections = document.getElementById('connections').value.trim().split('\n');
    const queries = document.getElementById('queries').value.trim().split('\n').map(Number);
    
    const edges = connections.map(line => {
        const [u, v, t] = line.trim().split(/\s+/).map(Number);
        return { u, v, t };
    });
    
    return { N, S, edges, queries };
}

function visualize() {
    if (!imagesLoaded) {
        updateDebugInfo('Images still loading, please wait...');
        return;
    }
    
    updateDebugInfo('Starting visualization...');
    const { N, S, edges, queries } = parseInput();
    generateNames(N);
    
    const minTime = dijkstra(N, S, edges);
    
    const results = queries.map(target => {
        if (target < 1 || target > N) return { ninja: target, time: 'INVALID' };
        if (minTime[target] === Infinity) return { ninja: target, time: 'UNREACHABLE' };
        return { ninja: target, time: minTime[target] };
    });
    
    displayResults(results);
    animateNetwork(N, S, edges, queries, minTime);
}

function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    const resultsContent = document.getElementById('resultsContent');
    
    resultsContent.innerHTML = '';
    results.forEach((result, idx) => {
        const nameIdx = result.ninja - 1;
        const name = currentNames[nameIdx] || `Ninja ${result.ninja}`;
        
        const item = document.createElement('div');
        item.className = 'result-item';
        
        const nameSpan = document.createElement('span');
        nameSpan.textContent = name + ':';
        
        const timeSpan = document.createElement('span');
        timeSpan.className = 'result-time ' + (result.time === 'UNREACHABLE' || result.time === 'INVALID' ? 'error' : 'success');
        timeSpan.textContent = typeof result.time === 'number' ? `${result.time} ms` : result.time;
        
        item.appendChild(nameSpan);
        item.appendChild(timeSpan);
        resultsContent.appendChild(item);
    });
    
    resultsDiv.style.display = 'block';
}

function animateNetwork(N, S, edges, queries, minTime) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas with transparent background
    ctx.clearRect(0, 0, width, height);
    
    const nodes = [];
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;
    
    for (let i = 1; i <= N; i++) {
        if (i === S) {
            nodes.push({ id: i, x: centerX, y: centerY });
        } else {
            const angle = ((i - (i > S ? 1 : 0)) / (N - 1)) * Math.PI * 2 - Math.PI / 2;
            nodes.push({
                id: i,
                x: centerX + Math.cos(angle) * radius,
                y: centerY + Math.sin(angle) * radius
            });
        }
    }
    
    let frame = 0;
    const chakraParticles = [];
    const activatedNodes = new Set([S]);
    const activeLinks = new Set();
    let narutoActiveTimer = 0;
    
    function animate() {
        // Clear with transparent background
        ctx.clearRect(0, 0, width, height);
        
        // Draw connections
        edges.forEach(({ u, v, t }) => {
            const nodeU = nodes.find(n => n.id === u);
            const nodeV = nodes.find(n => n.id === v);
            if (!nodeU || !nodeV) return;
            
            const linkKey = `${u}-${v}`;
            const isActive = activeLinks.has(linkKey);
            
            if (isActive) {
                ctx.shadowBlur = 15;
                ctx.shadowColor = '#00d4ff';
                ctx.strokeStyle = '#00d4ff';
                ctx.lineWidth = 4;
            } else {
                ctx.shadowBlur = 0;
                ctx.strokeStyle = 'rgba(255, 140, 0, 0.4)';
                ctx.lineWidth = 2;
            }
            
            ctx.beginPath();
            ctx.moveTo(nodeU.x, nodeU.y);
            ctx.lineTo(nodeV.x, nodeV.y);
            ctx.stroke();
            ctx.shadowBlur = 0;
            
            const midX = (nodeU.x + nodeV.x) / 2;
            const midY = (nodeU.y + nodeV.y) / 2;
            ctx.fillStyle = '#ffd700';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(t, midX, midY - 5);
        });
        
        // Update and draw chakra particles with speed control
        for (let i = chakraParticles.length - 1; i >= 0; i--) {
            const p = chakraParticles[i];
            p.progress += p.speed * chakraSpeed;
            
            if (p.progress >= 1) {
                activatedNodes.add(p.target);
                activeLinks.delete(p.linkKey);
                chakraParticles.splice(i, 1);
                
                edges.forEach(({ u, v, t }) => {
                    if (u === p.target && !activatedNodes.has(v) && minTime[v] !== Infinity) {
                        const fromNode = nodes.find(n => n.id === u);
                        const toNode = nodes.find(n => n.id === v);
                        if (fromNode && toNode) {
                            setTimeout(() => {
                                const newLinkKey = `${u}-${v}`;
                                activeLinks.add(newLinkKey);
                                chakraParticles.push({
                                    from: fromNode,
                                    to: toNode,
                                    target: v,
                                    progress: 0,
                                    speed: 0.015,
                                    linkKey: newLinkKey
                                });
                            }, t * 0.5 / chakraSpeed);
                        }
                    }
                });
            } else {
                const x = p.from.x + (p.to.x - p.from.x) * p.progress;
                const y = p.from.y + (p.to.y - p.from.y) * p.progress;
                
                const size = 30;
                ctx.save();
                ctx.globalAlpha = 0.9;
                ctx.drawImage(chakraImg, x - size/2, y - size/2, size, size);
                ctx.restore();
            }
        }
        
        const narutoIsActive = narutoActiveTimer > 0;
        if (narutoActiveTimer > 0) narutoActiveTimer--;
        
        // Draw nodes
        nodes.forEach(node => {
            const isSource = node.id === S;
            const isQuery = queries.includes(node.id);
            const isActivated = activatedNodes.has(node.id);
            const isUnreachable = minTime[node.id] === Infinity;
            
            if (isSource) {
                const imgSize = 80;
                const imgToDraw = narutoIdleImg;
                
                if (narutoIsActive) {
                    const glowSize = 60;
                    const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowSize);
                    gradient.addColorStop(0, 'rgba(255, 215, 0, 0.8)');
                    gradient.addColorStop(0.5, 'rgba(255, 140, 0, 0.4)');
                    gradient.addColorStop(1, 'rgba(255, 69, 0, 0)');
                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, glowSize, 0, Math.PI * 2);
                    ctx.fill();
                }
                
                // Draw Naruto image
                ctx.save();
                ctx.beginPath();
                ctx.arc(node.x, node.y, imgSize/2, 0, Math.PI * 2);
                ctx.closePath();
                ctx.clip();
                ctx.drawImage(imgToDraw, node.x - imgSize/2, node.y - imgSize/2, imgSize, imgSize);
                ctx.restore();
                
                ctx.strokeStyle = '#ffd700';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.arc(node.x, node.y, imgSize/2, 0, Math.PI * 2);
                ctx.stroke();
                
                ctx.fillStyle = '#ffd700';
                ctx.font = 'bold 14px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('Naruto', node.x, node.y + imgSize/2 + 20);
            } else {
                if (isActivated && !isUnreachable) {
                    const glowSize = 35;
                    const pulseSize = Math.sin(frame * 0.05) * 5;
                    const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowSize + pulseSize);
                    
                    if (isQuery) {
                        gradient.addColorStop(0, 'rgba(255, 100, 0, 0.7)');
                        gradient.addColorStop(0.5, 'rgba(255, 140, 0, 0.3)');
                        gradient.addColorStop(1, 'rgba(255, 69, 0, 0)');
                    } else {
                        gradient.addColorStop(0, 'rgba(30, 255, 200, 0.6)');
                        gradient.addColorStop(0.5, 'rgba(30, 200, 255, 0.3)');
                        gradient.addColorStop(1, 'rgba(0, 150, 255, 0)');
                    }
                    
                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, glowSize + pulseSize, 0, Math.PI * 2);
                    ctx.fill();
                }
                
                ctx.beginPath();
                ctx.arc(node.x, node.y, 22, 0, Math.PI * 2);
                
                if (isUnreachable) {
                    ctx.fillStyle = 'rgba(42, 42, 42, 0.8)';
                    ctx.strokeStyle = '#ff3333';
                } else if (isActivated && isQuery) {
                    ctx.fillStyle = '#ff6b35';
                    ctx.strokeStyle = '#ff8c42';
                } else if (isActivated) {
                    ctx.fillStyle = '#1e90ff';
                    ctx.strokeStyle = '#00d4ff';
                } else {
                    ctx.fillStyle = 'rgba(26, 26, 46, 0.8)';
                    ctx.strokeStyle = '#4a4a5e';
                }
                
                ctx.fill();
                ctx.lineWidth = isQuery ? 3 : 2;
                ctx.stroke();
                
                ctx.fillStyle = '#ffffff';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                const nameIdx = node.id - 1;
                const name = currentNames[nameIdx] || `Ninja ${node.id}`;
                ctx.fillText(name, node.x, node.y);
            }
            
            if (minTime[node.id] !== Infinity) {
                ctx.fillStyle = '#ffd700';
                ctx.font = '11px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(`${minTime[node.id]}ms`, node.x, node.y + (isSource ? 55 : 35));
            } else if (!isSource) {
                ctx.fillStyle = '#ff6b6b';
                ctx.font = '10px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('UNREACHABLE', node.x, node.y + 35);
            }
        });
        
        frame++;
        
        if (chakraParticles.length > 0 || frame < 300) {
            animationFrame = requestAnimationFrame(animate);
        } else {
            updateDebugInfo('Animation completed');
        }
    }
    
    edges.forEach(({ u, v, t }) => {
        if (u === S && minTime[v] !== Infinity) {
            const fromNode = nodes.find(n => n.id === u);
            const toNode = nodes.find(n => n.id === v);
            if (fromNode && toNode) {
                setTimeout(() => {
                    narutoActiveTimer = 30;
                    const linkKey = `${u}-${v}`;
                    activeLinks.add(linkKey);
                    chakraParticles.push({
                        from: fromNode,
                        to: toNode,
                        target: v,
                        progress: 0,
                        speed: 0.015,
                        linkKey: linkKey
                    });
                }, 500 / chakraSpeed);
            }
        }
    });
    
    animate();
}

function reset() {
    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
    }
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    document.getElementById('results').style.display = 'none';
    updateDebugInfo('Reset complete');
}

// Speed slider event listener
document.getElementById('speedSlider').addEventListener('input', function() {
    chakraSpeed = parseFloat(this.value);
    document.getElementById('speedValue').textContent = chakraSpeed.toFixed(1) + 'x';
});

document.getElementById('visualizeBtn').addEventListener('click', visualize);
document.getElementById('resetBtn').addEventListener('click', reset);

document.getElementById('numNinjas').addEventListener('change', function() {
    generateNames(parseInt(this.value));
});

// Initialize
updateDebugInfo('Initializing...');
generateNames(4);
initChakraParticles();

// Reinitialize particles on resize
window.addEventListener('resize', initChakraParticles);

// Check if page loaded properly
window.addEventListener('load', () => {
    updateDebugInfo('Page loaded successfully');
});
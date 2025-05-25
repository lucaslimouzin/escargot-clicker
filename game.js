let score = 0;
let clickMultiplier = 1;
let autoClickInterval = null;
let autoClickRate = 0;
let autoClickAmount = 0;
let snails = [];

const scoreElement = document.getElementById('score');
const salad = document.getElementById('salad');
const gameContainer = document.querySelector('.game-container');

const upgrades = {
    'sticky-finger': {
        basePrice: 50,
        multiplier: 1,
        level: 0,
        priceMultiplier: 2
    },
    'gardener-hand': {
        basePrice: 300,
        multiplier: 2,
        level: 0,
        priceMultiplier: 2
    },
    'double-salad': {
        basePrice: 1000,
        multiplier: 2,
        level: 0,
        priceMultiplier: 2
    },
    'giant-salad': {
        basePrice: 10000,
        multiplier: 10,
        level: 0,
        priceMultiplier: 2
    },
    'small-garden': {
        basePrice: 100,
        rate: 1,
        amount: 1,
        level: 0,
        priceMultiplier: 2
    },
    'snail-farm': {
        basePrice: 1000,
        rate: 1,
        amount: 5,
        level: 0,
        priceMultiplier: 2
    },
    'auto-farm': {
        basePrice: 3000,
        rate: 1,
        amount: 10,
        level: 0,
        priceMultiplier: 2
    },
    'robot-picker': {
        basePrice: 10000,
        rate: 0.5,
        amount: 1,
        level: 0,
        priceMultiplier: 2
    }
};

function getUpgradePrice(upgrade) {
    return Math.floor(upgrade.basePrice * Math.pow(upgrade.priceMultiplier, upgrade.level));
}

function updateScore() {
    scoreElement.textContent = score;
    updateSnails();
}

function updateSnails() {
    const currentSnailCount = snails.length;
    const targetSnailCount = score;

    if (currentSnailCount < targetSnailCount) {
        // Ajouter des escargots
        for (let i = currentSnailCount; i < targetSnailCount; i++) {
            const x = Math.random() * (gameContainer.clientWidth - 25);
            const y = Math.random() * (gameContainer.clientHeight - 25);
            createSnail(x, y);
        }
    } else if (currentSnailCount > targetSnailCount) {
        // Supprimer des escargots
        const snailsToRemove = currentSnailCount - targetSnailCount;
        for (let i = 0; i < snailsToRemove; i++) {
            const snail = snails.pop();
            snail.remove();
        }
    }
}

function addScore(amount) {
    score += amount * clickMultiplier;
    updateScore();
    updateUpgradeButtons();
}

function getRandomDirection() {
    return (Math.random() - 0.5) * 2;
}

function moveSnail(snail) {
    const speed = 0.5;
    const maxX = gameContainer.clientWidth - 25;
    const maxY = gameContainer.clientHeight - 25;
    
    let x = parseFloat(snail.style.left) || 0;
    let y = parseFloat(snail.style.top) || 0;
    let dx = getRandomDirection() * speed;
    let dy = getRandomDirection() * speed;
    
    function animate() {
        x += dx;
        y += dy;
        
        // Rebondir sur les bords
        if (x <= 0 || x >= maxX) {
            dx = -dx;
            x = Math.max(0, Math.min(x, maxX));
        }
        if (y <= 0 || y >= maxY) {
            dy = -dy;
            y = Math.max(0, Math.min(y, maxY));
        }
        
        snail.style.left = `${x}px`;
        snail.style.top = `${y}px`;
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

function createSnail(x, y) {
    const snail = document.createElement('img');
    snail.src = 'escargot.png';
    snail.className = 'snail';
    snail.style.left = `${x}px`;
    snail.style.top = `${y}px`;
    
    gameContainer.appendChild(snail);
    snails.push(snail);
    moveSnail(snail);

    // Changer l'image après 1 seconde
    setTimeout(() => {
        snail.src = 'escargot_eat.png';
    }, 1000);
}

function updateUpgradeButtons() {
    document.querySelectorAll('.upgrade-item').forEach(item => {
        const upgradeId = item.querySelector('.upgrade-button').dataset.upgrade;
        const upgrade = upgrades[upgradeId];
        const currentPrice = getUpgradePrice(upgrade);
        const button = item.querySelector('.upgrade-button');
        const priceSpan = item.querySelector('.price span');
        
        button.disabled = score < currentPrice;
        button.textContent = `Acheter (Niveau ${upgrade.level + 1})`;
        priceSpan.textContent = currentPrice;
    });
}

function startAutoClick() {
    if (autoClickInterval) {
        clearInterval(autoClickInterval);
    }
    
    if (autoClickRate > 0 && autoClickAmount > 0) {
        autoClickInterval = setInterval(() => {
            addScore(autoClickAmount);
        }, 1000 / autoClickRate);
    }
}

function purchaseUpgrade(upgradeId) {
    const upgrade = upgrades[upgradeId];
    const currentPrice = getUpgradePrice(upgrade);
    
    if (score >= currentPrice) {
        score -= currentPrice;
        upgrade.level++;
        
        if (upgradeId.startsWith('small-garden') || upgradeId.startsWith('snail-farm') || 
            upgradeId.startsWith('auto-farm') || upgradeId === 'robot-picker') {
            autoClickRate += upgrade.rate;
            autoClickAmount += upgrade.amount;
            startAutoClick();
        } else {
            clickMultiplier += upgrade.multiplier;
        }
        
        updateScore();
        updateUpgradeButtons();
    }
}

salad.addEventListener('click', (e) => {
    addScore(1);
});

document.querySelectorAll('.upgrade-button').forEach(button => {
    button.addEventListener('click', () => {
        const upgradeId = button.dataset.upgrade;
        purchaseUpgrade(upgradeId);
    });
});

// Initialiser les boutons
updateUpgradeButtons(); 
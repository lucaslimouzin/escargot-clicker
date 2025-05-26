let score = 0;
let clickMultiplier = 1;
let autoClickInterval = null;
let autoClickRate = 0;
let autoClickAmount = 0;
let snails = [];

const scoreElement = document.getElementById('score');
const rateElement = document.getElementById('rate');
const clickRateElement = document.getElementById('click-rate');
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

const MAX_SNAILS = 1000; // Limite le nombre total d'escargots à l'écran
const CLEANUP_INTERVAL = 5000; // Nettoyage toutes les 5 secondes

function getUpgradePrice(upgrade) {
    return Math.floor(upgrade.basePrice * Math.pow(upgrade.priceMultiplier, upgrade.level));
}

function updateScore() {
    scoreElement.textContent = score;
    // Calculer le nombre d'escargots générés par seconde
    const totalRate = autoClickAmount;
    rateElement.textContent = totalRate;
    // Mettre à jour le nombre d'escargots par clic
    clickRateElement.textContent = clickMultiplier;
    updateSnails();
}

function updateSnails() {
    // Calculer le nombre d'escargots en fonction du score
    const smallSnailCount = Math.min(score % 1000, MAX_SNAILS);
    const giantSnailCount = Math.min(Math.floor(score / 1000), MAX_SNAILS);
    const megaGiantSnailCount = Math.min(Math.floor(score / 100000), MAX_SNAILS);

    // Calculer le nombre total d'escargots représentés
    const totalSmallSnails = smallSnailCount;
    const totalGiantSnails = giantSnailCount;
    const totalMegaGiantSnails = megaGiantSnailCount;

    // Mettre à jour les compteurs dans le tableau
    document.getElementById('small-snail-count').textContent = totalSmallSnails;
    document.getElementById('giant-snail-count').textContent = totalGiantSnails;
    document.getElementById('mega-giant-snail-count').textContent = totalMegaGiantSnails;

    const currentSnailCount = snails.filter(snail => !snail.classList.contains('giant-snail') && !snail.classList.contains('mega-giant-snail')).length;
    const currentGiantCount = snails.filter(snail => snail.classList.contains('giant-snail')).length;
    const currentMegaGiantCount = snails.filter(snail => snail.classList.contains('mega-giant-snail')).length;

    // Gérer les escargots méga géants
    if (score >= 100000) {
        // Supprimer tous les escargots géants et petits
        snails.forEach(snail => {
            if (snail.classList.contains('giant-snail') || !snail.classList.contains('mega-giant-snail')) {
                snail.remove();
            }
        });
        snails = snails.filter(snail => snail.classList.contains('mega-giant-snail'));

        // Gérer les escargots méga géants
        if (currentMegaGiantCount < megaGiantSnailCount) {
            // Ajouter des escargots méga géants
            for (let i = currentMegaGiantCount; i < megaGiantSnailCount; i++) {
                const x = Math.random() * (gameContainer.clientWidth - 100);
                const y = Math.random() * (gameContainer.clientHeight - 100);
                createMegaGiantSnail(x, y);
            }
        } else if (currentMegaGiantCount > megaGiantSnailCount) {
            // Supprimer des escargots méga géants en trop
            const snailsToRemove = currentMegaGiantCount - megaGiantSnailCount;
            for (let i = 0; i < snailsToRemove; i++) {
                const megaGiantSnail = snails.find(snail => snail.classList.contains('mega-giant-snail'));
                if (megaGiantSnail) {
                    const index = snails.indexOf(megaGiantSnail);
                    snails.splice(index, 1);
                    megaGiantSnail.remove();
                }
            }
        }
    } else if (score >= 1000) {
        // Supprimer tous les escargots méga géants et petits
        snails.forEach(snail => {
            if (snail.classList.contains('mega-giant-snail') || !snail.classList.contains('giant-snail')) {
                snail.remove();
            }
        });
        snails = snails.filter(snail => snail.classList.contains('giant-snail'));

        // Gérer les escargots géants
        if (currentGiantCount < giantSnailCount) {
            // Ajouter des escargots géants
            for (let i = currentGiantCount; i < giantSnailCount; i++) {
                const x = Math.random() * (gameContainer.clientWidth - 50);
                const y = Math.random() * (gameContainer.clientHeight - 50);
                createGiantSnail(x, y);
            }
        } else if (currentGiantCount > giantSnailCount) {
            // Supprimer des escargots géants en trop
            const snailsToRemove = currentGiantCount - giantSnailCount;
            for (let i = 0; i < snailsToRemove; i++) {
                const giantSnail = snails.find(snail => snail.classList.contains('giant-snail'));
                if (giantSnail) {
                    const index = snails.indexOf(giantSnail);
                    snails.splice(index, 1);
                    giantSnail.remove();
                }
            }
        }
    } else {
        // Supprimer tous les escargots géants et méga géants
        snails.forEach(snail => {
            if (snail.classList.contains('giant-snail') || snail.classList.contains('mega-giant-snail')) {
                snail.remove();
            }
        });
        snails = snails.filter(snail => !snail.classList.contains('giant-snail') && !snail.classList.contains('mega-giant-snail'));

        // Gérer les petits escargots
        if (currentSnailCount < smallSnailCount) {
            // Ajouter des petits escargots
            for (let i = currentSnailCount; i < smallSnailCount; i++) {
                const x = Math.random() * (gameContainer.clientWidth - 25);
                const y = Math.random() * (gameContainer.clientHeight - 25);
                createSnail(x, y);
            }
        } else if (currentSnailCount > smallSnailCount) {
            // Supprimer des petits escargots en trop
            const snailsToRemove = currentSnailCount - smallSnailCount;
            for (let i = 0; i < snailsToRemove; i++) {
                const smallSnail = snails.find(snail => !snail.classList.contains('giant-snail') && !snail.classList.contains('mega-giant-snail'));
                if (smallSnail) {
                    const index = snails.indexOf(smallSnail);
                    snails.splice(index, 1);
                    smallSnail.remove();
                }
            }
        }
    }
}

function addScore(amount, isAutoClick = false) {
    const pointsToAdd = isAutoClick ? amount : amount * clickMultiplier;
    score += pointsToAdd;
    updateScore();
    updateUpgradeButtons();
    return pointsToAdd;
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
        
        // Vérifier si l'escargot est toujours dans le DOM
        if (snail.parentNode) {
            requestAnimationFrame(animate);
        }
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

function createGiantSnail(x, y) {
    const snail = document.createElement('img');
    snail.src = 'escargot.png';
    snail.className = 'snail giant-snail';
    snail.style.left = `${x}px`;
    snail.style.top = `${y}px`;
    snail.style.transform = 'scale(2)';
    
    gameContainer.appendChild(snail);
    snails.push(snail);
    moveSnail(snail);

    // Changer l'image après 1 seconde
    setTimeout(() => {
        snail.src = 'escargot_eat.png';
    }, 1000);
}

function createMegaGiantSnail(x, y) {
    const snail = document.createElement('img');
    snail.src = 'escargot.png';
    snail.className = 'snail mega-giant-snail';
    snail.style.left = `${x}px`;
    snail.style.top = `${y}px`;
    snail.style.transform = 'scale(4)';
    
    gameContainer.appendChild(snail);
    snails.push(snail);
    moveSnail(snail);

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

function cleanupSnails() {
    const now = Date.now();
    snails = snails.filter(snail => {
        // Supprimer les escargots qui sont sortis de l'écran
        const rect = snail.getBoundingClientRect();
        const containerRect = gameContainer.getBoundingClientRect();
        
        if (rect.right < containerRect.left || 
            rect.left > containerRect.right || 
            rect.bottom < containerRect.top || 
            rect.top > containerRect.bottom) {
            snail.remove();
            return false;
        }
        return true;
    });
}

function startAutoClick() {
    if (autoClickInterval) {
        clearInterval(autoClickInterval);
    }
    
    if (autoClickRate > 0 && autoClickAmount > 0) {
        autoClickInterval = setInterval(() => {
            const pointsAdded = addScore(autoClickAmount, true);
            // Créer un escargot pour chaque point ajouté, mais limiter le nombre total
            const snailsToAdd = Math.min(pointsAdded, MAX_SNAILS - snails.length);
            for (let i = 0; i < snailsToAdd; i++) {
                const x = Math.random() * (gameContainer.clientWidth - 25);
                const y = Math.random() * (gameContainer.clientHeight - 25);
                createSnail(x, y);
            }
            updateSnails();
        }, 1000 / autoClickRate);
    }
}

function purchaseUpgrade(upgradeId) {
    const upgrade = upgrades[upgradeId];
    const currentPrice = getUpgradePrice(upgrade);
    
    if (score >= currentPrice) {
        // Supprimer tous les escargots existants
        snails.forEach(snail => {
            snail.remove();
        });
        snails = [];

        score -= currentPrice;
        upgrade.level++;
        
        if (upgradeId.startsWith('small-garden') || upgradeId.startsWith('snail-farm') || 
            upgradeId.startsWith('auto-farm') || upgradeId === 'robot-picker') {
            // Réinitialiser les valeurs
            autoClickRate = 0;
            autoClickAmount = 0;
            
            // Recalculer le total pour toutes les améliorations
            Object.entries(upgrades).forEach(([id, upg]) => {
                if (id.startsWith('small-garden') || id.startsWith('snail-farm') || 
                    id.startsWith('auto-farm') || id === 'robot-picker') {
                    autoClickRate += upg.rate * upg.level;
                    autoClickAmount += upg.amount * upg.level;
                }
            });
            
            startAutoClick();
        } else {
            clickMultiplier += upgrade.multiplier;
        }
        
        updateScore();
        updateUpgradeButtons();
        updateSnails();
    }
}

salad.addEventListener('click', (e) => {
    const pointsAdded = addScore(1, false);
    
    // Créer un escargot pour chaque point ajouté, mais limiter le nombre total
    const snailsToAdd = Math.min(pointsAdded, MAX_SNAILS - snails.length);
    for (let i = 0; i < snailsToAdd; i++) {
        const rect = salad.getBoundingClientRect();
        const x = e.clientX - rect.left + (Math.random() * 20 - 10);
        const y = e.clientY - rect.top + (Math.random() * 20 - 10);
        createSnail(x, y);
    }
    updateSnails();
});

document.querySelectorAll('.upgrade-button').forEach(button => {
    button.addEventListener('click', () => {
        const upgradeId = button.dataset.upgrade;
        purchaseUpgrade(upgradeId);
    });
});

// Initialiser les boutons
updateUpgradeButtons();

// Démarrer le nettoyage périodique
setInterval(cleanupSnails, CLEANUP_INTERVAL); 
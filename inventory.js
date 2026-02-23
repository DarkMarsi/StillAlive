// inventory.js - логика инвентаря

// Добавление предмета в инвентарь
function addItemToInventory(item) {
    for (let i = 0; i < window.inventory.length; i++) {
        if (window.inventory[i] === null) {
            window.inventory[i] = item;
            return true;
        }
    }
    return false;
}

// Показать меню предмета
function showItemMenu(item, index, x, y) {
    document.querySelectorAll('.item-menu-container').forEach(menu => menu.remove());
    
    let useButton = '';
    if (item.canUse) {
        useButton = '<div class="menu-item use-item">📋 Использовать</div>';
    }
    
    let dropButton = '';
    if (item.canDrop) {
        dropButton = '<div class="menu-item drop-item">🗑️ Выбросить</div>';
    }
    
    let menuHTML = `
        <div class="item-menu" style="top: ${y}px; left: ${x}px;">
            <div class="menu-header">
                <span class="menu-title">${item.icon} ${item.name}</span>
            </div>
            <div class="menu-description">${item.description || ''}</div>
            <div class="menu-divider"></div>
            ${useButton}
            ${dropButton}
        </div>
    `;
    
    const menuDiv = document.createElement('div');
    menuDiv.innerHTML = menuHTML;
    menuDiv.className = 'item-menu-container';
    document.body.appendChild(menuDiv);
    
    const menu = menuDiv.querySelector('.item-menu');
    
    const menuRect = menu.getBoundingClientRect();
    if (menuRect.right > window.innerWidth) {
        menu.style.left = (window.innerWidth - menuRect.width - 10) + 'px';
    }
    if (menuRect.bottom > window.innerHeight) {
        menu.style.top = (window.innerHeight - menuRect.height - 10) + 'px';
    }
    
    if (item.canUse) {
        menu.querySelector('.use-item').addEventListener('click', function() {
            useItem(item, index);
            menuDiv.remove();
        });
    }
    
    if (item.canDrop) {
        menu.querySelector('.drop-item').addEventListener('click', function() {
            dropItem(index);
            menuDiv.remove();
        });
    }
    
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!menuDiv.contains(e.target) && !e.target.closest('.inventory-cell')) {
                menuDiv.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 100);
}

// Использовать предмет
function useItem(item, index) {
    if (item.name === 'Металлолом') {
        // Восстанавливаем корпус
        let oldHull = window.hull;
        window.hull = Math.min(100, window.hull + 20);
        addToScreen(`🛠️ Металлолом использован: корпус восстановлен с ${oldHull}% до ${window.hull}%`);
        dropItem(index);
        updateDisplay();
        
    } else if (item.name === 'Урановый стержень') {
        window.fuel = Math.min(100, window.fuel + 50);
        addToScreen('☢️ Урановый стержень использован: +50% топлива');
        dropItem(index);
        updateDisplay();
        
    } else if (item.name === 'Огнетушитель') {
        addToScreen('🧯 Огнетушитель: пока нечего тушить (пожары появятся позже)');
        
    } else if (item.name === 'Золотой слиток') {
        addToScreen('🏆 Ценная вещь! Продать пока негде');
        
    } else if (item.type === 'quest' || item.type === 'note') {
        // Для всех записок и сюжетных предметов
        showItemText(item);
        
    } else {
        addToScreen(`📖 Вы использовали: ${item.name}`);
        if (item.text) {
            showItemText(item);
        }
    }
}

// Показать текст предмета
function showItemText(item) {
    showItemWindow(item.name, item.text || item.description || 'Пустой предмет');
}

// Показать окно с текстом предмета
function showItemWindow(title, text) {
    let itemHTML = `
        <div class="signal-message" style="min-width: 350px;">
            <div class="signal-message-header">
                <span class="signal-message-title">📦 ${title}</span>
                <span class="signal-message-close">✕</span>
            </div>
            <div class="signal-message-divider"></div>
            <div class="note-content">
                <p style="white-space: pre-wrap;">${text}</p>
            </div>
        </div>
    `;
    showModalWindow(itemHTML);
}

// Выбросить предмет
function dropItem(index) {
    if (window.inventory[index]) {
        let itemName = window.inventory[index].name;
        window.inventory[index] = null;
        addToScreen(`🗑️ Вы выбросили: ${itemName}`);
        
        if (document.getElementById('tab-inventory').classList.contains('active')) {
            renderInventory();
        }
    }
}

// Отрисовка инвентаря
function renderInventory() {
    let inventoryHTML = '<div class="inventory-grid">';
    
    for (let row = 0; row < 5; row++) {
        inventoryHTML += '<div class="inventory-row">';
        for (let col = 0; col < 8; col++) {
            let index = row * 8 + col;
            let item = window.inventory[index];
            let content = item ? item.icon : '';
            
            // Формируем title с ценой
            let title = 'Пусто';
            if (item) {
                const valueText = item.value ? ` (${item.valueText})` : '';
                title = `${item.name}${valueText} - ${item.description || ''}`;
            }
            
            inventoryHTML += `<div class="inventory-cell" data-index="${index}" title="${title}">${content}</div>`;
        }
        inventoryHTML += '</div>';
    }
    
    inventoryHTML += '</div>';
    window.screen.innerHTML = inventoryHTML;
    
    document.querySelectorAll('.inventory-cell').forEach(cell => {
        cell.addEventListener('click', function(e) {
            const index = this.dataset.index;
            const item = window.inventory[index];
            if (item) {
                showItemMenu(item, index, e.clientX, e.clientY);
            }
        });
    });
}

// Добавление стартовых предметов (теперь использует базу данных)
function addStartItems() {
    // Очищаем инвентарь
    window.inventory = new Array(40).fill(null);
    
    // Добавляем предметы по ID из базы данных
    addItemToInventory(createItem('SCRAP_METAL'));
    addItemToInventory(createItem('URANIUM_ROD'));
    addItemToInventory(createItem('TOOLS'));
    addItemToInventory(createItem('FIRE_EXTINGUISHER'));
    addItemToInventory(createItem('HULL_MODULE'));
    addItemToInventory(createItem('JOURNAL'));
    addItemToInventory(createItem('NOTE'));
    addItemToInventory(createItem('DIARY'));
    addItemToInventory(createItem('ARTIFACT'));
    addItemToInventory(createItem('MAP_FRAGMENT'));
    addItemToInventory(createItem('CREW_LIST'));
    addItemToInventory(createItem('SURVIVAL_GUIDE'));
    addItemToInventory(createItem('GOLD_BAR'));
    addItemToInventory(createItem('FOOD'));
    addItemToInventory(createItem('WATER'));
}
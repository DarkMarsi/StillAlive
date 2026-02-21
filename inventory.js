// inventory.js

// Структура предмета:
// {
//   name: string,        // название
//   icon: string,        // иконка (эмодзи)
//   type: string,        // тип: 'resource', 'tool', 'module', 'quest', 'valuable'
//   description: string, // описание
//   canDrop: boolean,    // можно ли выбросить
//   canUse: boolean,     // можно ли использовать
//   useEffect: string,   // эффект при использовании
//   value: number,       // ценность (для будущей торговли)
//   moduleHealth: number // для модулей - их прочность
// }

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
        
    } else if (item.name === 'Огнетушитель') {
        addToScreen('🧯 Огнетушитель: пока нечего тушить (пожары появятся позже)');
        // Здесь потом будет логика тушения пожара
        
    } else if (item.name === 'Инструменты') {
        addToScreen('🔧 Инструменты: используются для ремонта модулей');
        // Пока просто сообщение
        
    } else if (item.name === 'Усиленный модуль корпуса') {
        addToScreen('🛡️ Модуль корпуса: используется во вкладке "Модули" для замены');
        
    } else if (item.name === 'Записка') {
        showNote();
        
    } else if (item.name === 'Бортовой журнал') {
        showJournal();
        
    } else if (item.name === 'Урановый стержень') {
        window.fuel = Math.min(100, window.fuel + 50);
        addToScreen('☢️ Урановый стержень использован: +50% топлива');
        dropItem(index);
        updateDisplay();
        
    } else if (item.name === 'Золотой слиток') {
        addToScreen('🏆 Ценная вещь! Продать пока негде');
        
    } else if (item.name === 'Личный дневник') {
        showQuestItem('Личный дневник', 'Последняя запись: "Кажется, я не один на этой станции..."');
        
    } else if (item.name === 'Странный артефакт') {
        showQuestItem('Странный артефакт', 'Неизвестный предмет инопланетного происхождения. Он пульсирует слабым светом.');
    }
}

// Показать сюжетный предмет
function showQuestItem(title, text) {
    let questHTML = `
        <div class="signal-message" style="min-width: 350px;">
            <div class="signal-message-header">
                <span class="signal-message-title">📖 ${title}</span>
                <span class="signal-message-close">✕</span>
            </div>
            <div class="signal-message-divider"></div>
            <div class="note-content">
                <p>${text}</p>
            </div>
        </div>
    `;
    showModalWindow(questHTML);
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
            let title = item ? `${item.name} (${item.description || ''})` : 'Пусто';
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

// Добавление стартовых предметов
function addStartItems() {
    // Очищаем инвентарь
    window.inventory = new Array(40).fill(null);
    
    // Ресурсы (можно использовать, можно выбросить)
    addItemToInventory({
        name: 'Металлолом',
        icon: '🔩',
        type: 'resource',
        description: 'Восстанавливает 20% корпуса',
        canDrop: true,
        canUse: true
    });
    
    addItemToInventory({
        name: 'Урановый стержень',
        icon: '☢️',
        type: 'resource',
        description: '+50% топлива',
        canDrop: true,
        canUse: true
    });
    
    // Инструменты (не используются из инвентаря)
    addItemToInventory({
        name: 'Инструменты',
        icon: '🔧',
        type: 'tool',
        description: 'Для ремонта модулей',
        canDrop: true,
        canUse: false
    });
    
    // Расходники
    addItemToInventory({
        name: 'Огнетушитель',
        icon: '🧯',
        type: 'tool',
        description: 'Тушит пожары',
        canDrop: true,
        canUse: true
    });
    
    // Модули (не используются из инвентаря)
    addItemToInventory({
        name: 'Усиленный модуль корпуса',
        icon: '🛡️',
        type: 'module',
        description: 'Заменяет повреждённый модуль',
        canDrop: true,
        canUse: false,
        moduleHealth: 100
    });
    
    // Сюжетные предметы (нельзя выбросить)
    addItemToInventory({
        name: 'Бортовой журнал',
        icon: '📔',
        type: 'quest',
        description: 'Руководство по эксплуатации',
        canDrop: false,
        canUse: true
    });
    
    addItemToInventory({
        name: 'Записка',
        icon: '📝',
        type: 'quest',
        description: 'Чья-то записка',
        canDrop: false,
        canUse: true
    });
    
    addItemToInventory({
        name: 'Личный дневник',
        icon: '📓',
        type: 'quest',
        description: 'Дневник предыдущего капитана',
        canDrop: false,
        canUse: true
    });
    
    addItemToInventory({
        name: 'Странный артефакт',
        icon: '🔮',
        type: 'quest',
        description: 'Неизвестный предмет',
        canDrop: false,
        canUse: true
    });
    
    // Ценности (нельзя использовать, можно продать)
    addItemToInventory({
        name: 'Золотой слиток',
        icon: '🏆',
        type: 'valuable',
        description: 'Ценная вещь',
        canDrop: true,
        canUse: false,
        value: 1000
    });
    
    addItemToInventory({
        name: 'Еда',
        icon: '🍗',
        type: 'resource',
        description: 'Пока не используется',
        canDrop: true,
        canUse: false
    });
    
    addItemToInventory({
        name: 'Вода',
        icon: '💧',
        type: 'resource',
        description: 'Пока не используется',
        canDrop: true,
        canUse: false
    });
}
// inventory.js

// Структура предмета:
// {
//   name: string,        // название
//   icon: string,        // иконка (эмодзи)
//   type: string,        // тип: 'resource', 'tool', 'module', 'quest', 'valuable', 'note'
//   description: string, // описание
//   canDrop: boolean,    // можно ли выбросить
//   canUse: boolean,     // можно ли использовать
//   useEffect: string,   // эффект при использовании
//   value: number,       // ценность (для будущей торговли)
//   moduleHealth: number, // для модулей - их прочность
//   text: string         // для типа 'note' - текст записки
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
        
    } else if (item.name === 'Инструменты') {
        addToScreen('🔧 Инструменты: используются для ремонта модулей');
        
    } else if (item.name === 'Усиленный модуль корпуса') {
        addToScreen('🛡️ Модуль корпуса: используется во вкладке "Модули" для замены');
        
    } else if (item.name === 'Урановый стержень') {
        window.fuel = Math.min(100, window.fuel + 50);
        addToScreen('☢️ Урановый стержень использован: +50% топлива');
        dropItem(index);
        updateDisplay();
        
    } else if (item.name === 'Золотой слиток') {
        addToScreen('🏆 Ценная вещь! Продать пока негде');
        
    } else if (item.type === 'quest' || item.type === 'note') {
        // Для всех записок и сюжетных предметов
        showItemText(item);
        
    } else {
        addToScreen(`📖 Вы прочитали: ${item.name}`);
        if (item.text) {
            showItemText(item);
        }
    }
}

// Показать текст предмета
function showItemText(item) {
    // Если у предмета есть свой текст, используем его
    let text = item.text || '';
    
    // Если нет своего текста, используем стандартные
    if (!text) {
        switch(item.name) {
            case 'Записка':
                text = `
                    Первый день погружения. 
                    Капитан сказал, что мы ищем что-то на дне. 
                    Не знаю, что именно, но мне это не нравится.
                    
                    Вчера видел странные огни за иллюминатором.
                    Никто мне не верит.
                    
                    Если вы это читаете - значит, со мной что-то случилось.
                    Держитесь подальше от разлома на северо-западе.
                    
                    P.S. Крысы в трюме какие-то нервные...
                `;
                break;
                
            case 'Бортовой журнал':
                text = `
                    БОРТОВОЙ ЖУРНАЛ "НАУТИЛУС-МК2"
                    ===============================
                    
                    ТЕХНИЧЕСКИЕ ХАРАКТЕРИСТИКИ:
                    • Максимальная глубина: 1000м
                    • Крейсерская скорость: 20 узлов
                    • Запас топлива: 100%
                    • Запас кислорода: 100%
                    
                    ИНСТРУКЦИЯ ПО ЭКСПЛУАТАЦИИ:
                    
                    1. Двигатель (кнопка I) - включает силовую установку
                    2. Сонар (кнопка II) - сканирует окружающие секторы
                    3. Реактор (кнопка III) - заряжает батареи (тратит топливо)
                    
                    УПРАВЛЕНИЕ:
                    • Рычаг ДВИГАТЕЛЯ - регулирует скорость (▲/▼)
                    • Рычаг БАЛЛАСТА - меняет глубину погружения
                    • Кнопки ←/→ - поворот корабля
                    
                    АВАРИЙНЫЕ ПРОЦЕДУРЫ:
                    • При падении давления - используй рычаг 2
                    • При повреждениях - ищи металлолом
                    • При пожаре - огнетушитель
                    
                    ПОМНИ: океан не прощает ошибок.
                `;
                break;
                
            case 'Личный дневник':
                text = 'Последняя запись: "Кажется, я не один на этой станции..."';
                break;
                
            case 'Странный артефакт':
                text = 'Неизвестный предмет инопланетного происхождения. Он пульсирует слабым светом.';
                break;
                
            default:
                text = item.description || 'Пустая записка';
        }
    }
    
    showItemWindow(item.name, text);
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
    
    // НОВЫЙ ТИП: записки (можно выбросить, можно использовать)
    addItemToInventory({
        name: 'Обрывок карты',
        icon: '🗺️',
        type: 'note',
        description: 'Часть навигационной карты',
        canDrop: true,
        canUse: true,
        text: 'На обрывке карты видна отметка в секторе F12. Там отмечен крест и надпись: "ЗДЕСЬ БЫЛО ЧТО-ТО ВАЖНОЕ"'
    });
    
    addItemToInventory({
        name: 'Список команды',
        icon: '📋',
        type: 'note',
        description: 'Имена членов экипажа',
        canDrop: true,
        canUse: true,
        text: 'СПИСОК КОМАНДЫ "НАУТИЛУС-МК2":\n\nКапитан: Джейкоб Стоун\nСтарпом: Елена Волкова\nИнженер: Грег Хоукинс\nМеханик: Чен Вэй\nКок: Педро Санчес\n\nПримечание: все погибли при первом погружении.'
    });
    
    addItemToInventory({
        name: 'Инструкция по выживанию',
        icon: '📘',
        type: 'note',
        description: 'Памятка для новичков',
        canDrop: true,
        canUse: true,
        text: 'ИНСТРУКЦИЯ ПО ВЫЖИВАНИЮ:\n\n1. Следи за уровнем кислорода\n2. Не погружайся глубже 500м без усиленного корпуса\n3. Включай реактор для подзарядки батарей\n4. Используй сонар для разведки\n5. Если слышишь странные звуки - уходи'
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
// devMode.js - режим разработчика

// Переменные режима разработчика
window.devMode = {
    enabled: false,
    infiniteFuel: false,
    infiniteOxygen: false,
    infiniteBattery: false,
    invincibleHull: false,
    noModuleDamage: false
};

// Функция переключения режима разработчика
function toggleDevMode() {
    window.devMode.enabled = !window.devMode.enabled;
    
    if (window.devMode.enabled) {
        // При включении включаем все опции по умолчанию
        window.devMode.infiniteFuel = true;
        window.devMode.infiniteOxygen = true;
        window.devMode.infiniteBattery = true;
        window.devMode.invincibleHull = true;
        window.devMode.noModuleDamage = true;
        
        addToScreen('🛠️ РЕЖИМ РАЗРАБОТЧИКА АКТИВИРОВАН');
        addToScreen('    • Бесконечное топливо');
        addToScreen('    • Бесконечный кислород');
        addToScreen('    • Бесконечная батарея');
        addToScreen('    • Неуязвимый корпус');
        addToScreen('    • Модули не повреждаются');
        
        // Автоматически создаём тестовые локации
        setTimeout(() => {
            if (typeof generateTestLocations === 'function') {
                generateTestLocations();
            }
        }, 500);
    } else {
        // При выключении отключаем все опции
        window.devMode.infiniteFuel = false;
        window.devMode.infiniteOxygen = false;
        window.devMode.infiniteBattery = false;
        window.devMode.invincibleHull = false;
        window.devMode.noModuleDamage = false;
        
        addToScreen('🛠️ РЕЖИМ РАЗРАБОТЧИКА ОТКЛЮЧЕН');
    }
    
    // Обновляем отображение кнопки
    updateDevModeButton();
}

// Функция для создания тестовых локаций вокруг игрока
function generateTestLocations() {
    if (!window.gameMap) {
        console.error('Карта не инициализирована');
        return;
    }
    
    // Координаты тестовых клеток (M20, L20, J20, K20)
    const testCells = [
        { 
            row: 19, col: 12, 
            name: 'Аванпост жилой', 
            type: window.LOCATION_TYPES.DOCK
        },
        { 
            row: 19, col: 11, 
            name: 'Морское чудовище', 
            type: window.LOCATION_TYPES.HAZARDOUS
        },
        { 
            row: 19, col: 9, 
            name: 'Обломки', 
            type: window.LOCATION_TYPES.DRONE
        },
        { 
            row: 19, col: 10, 
            name: 'Коралловый риф', 
            type: window.LOCATION_TYPES.EMPTY
        }
    ];
    
    testCells.forEach(cell => {
        const { row, col, name, type } = cell;
        
        // Проверяем, что клетка существует
        if (!window.gameMap[row] || !window.gameMap[row][col]) return;
        
        const tile = window.gameMap[row][col];
        
        // Создаём тестовую локацию
        tile.isEmpty = false;
        tile.discovered = true; // Сразу открываем
        tile.visited = false; // Но не посещена
        tile.type = 'normal'; // Тип клетки для карты
        
        // Создаём точки в клетке
        const points = [];
        const cellSize = window.cellSize || 1000;
        const step = cellSize / 3;
        const maxOffset = 100;
        
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                let baseX = step/2 + i * step;
                let baseY = step/2 + j * step;
                
                let offsetX = (Math.random() * 2 - 1) * maxOffset;
                let offsetY = (Math.random() * 2 - 1) * maxOffset;
                
                let x = Math.round(Math.min(950, Math.max(50, baseX + offsetX)));
                let y = Math.round(Math.min(950, Math.max(50, baseY + offsetY)));
                
                points.push({ x, y, visited: false });
            }
        }
        
        // Активная точка в центре
        const activePointIndex = 4; // центр сетки 3x3
        
        tile.locations = {
            points: points,
            activePointIndex: activePointIndex,
            name: name,
            type: type,
            discovered: true
        };
        
        tile.locationCoords = {
            x: points[activePointIndex].x,
            y: points[activePointIndex].y
        };
        
        console.log(`Тестовая локация создана: ${name} в секторе ${String.fromCharCode(65 + col)}${row + 1}`);
    });
    
    // Добавляем NPC для Аванпоста жилой
    if (!window.NPCS_DB) window.NPCS_DB = {};
    
    // Очищаем старые тестовые NPC
    delete window.NPCS_DB['marcus_test'];
    delete window.NPCS_DB['stranger_test'];
    
    // Добавляем Маркуса (торговца)
    window.NPCS_DB['marcus_test'] = {
        id: 'marcus_test',
        name: 'Маркус',
        type: window.NPC_TYPES.TRADER,
        location: 'Аванпост жилой',
        sprite: '👨‍💼',
        description: 'Бывший торговый представитель, теперь торгует запчастями и ресурсами.',
        dialogue: {
            greeting: 'О, свежая кровь! Нужны запчасти? У меня есть всё, кроме совести.',
            bye: 'Возвращайся, если найдешь что-то ценное.'
        }
    };
    
    // Добавляем Таинственного незнакомца (квестодателя)
    window.NPCS_DB['stranger_test'] = {
        id: 'stranger_test',
        name: 'Таинственный незнакомец',
        type: window.NPC_TYPES.MISSION_GIVER,
        location: 'Аванпост жилой',
        sprite: '🥷',
        description: 'Человек в плаще, лица не видно.',
        dialogue: {
            greeting: 'Я слежу за тобой. У меня есть предложение...',
            bye: 'Подумай. Я найду тебя сам.'
        }
    };
    
    // Обновляем карту, если она открыта
    if (document.getElementById('tab-map').classList.contains('active')) {
        renderMap();
    }
    
    addToScreen('🛠️ Тестовые локации созданы в секторах M20, L20, J20, K20');
}

// Функция показа меню разработчика
function showDevMenu() {
    // Удаляем старые меню
    document.querySelectorAll('.dev-menu-container').forEach(menu => menu.remove());
    
    const menuHTML = `
        <div class="dev-menu">
            <div class="dev-menu-header">
                <span class="dev-menu-title">🛠️ РЕЖИМ РАЗРАБОТЧИКА</span>
                <span class="dev-menu-close">✕</span>
            </div>
            <div class="dev-menu-content">
                <div class="dev-menu-item" id="dev-infinite-fuel">
                    <span class="dev-item-label">Бесконечное топливо</span>
                    <span class="dev-item-status ${window.devMode.infiniteFuel ? 'enabled' : 'disabled'}">${window.devMode.infiniteFuel ? 'ВКЛ' : 'ВЫКЛ'}</span>
                </div>
                <div class="dev-menu-item" id="dev-infinite-oxygen">
                    <span class="dev-item-label">Бесконечный кислород</span>
                    <span class="dev-item-status ${window.devMode.infiniteOxygen ? 'enabled' : 'disabled'}">${window.devMode.infiniteOxygen ? 'ВКЛ' : 'ВЫКЛ'}</span>
                </div>
                <div class="dev-menu-item" id="dev-infinite-battery">
                    <span class="dev-item-label">Бесконечная батарея</span>
                    <span class="dev-item-status ${window.devMode.infiniteBattery ? 'enabled' : 'disabled'}">${window.devMode.infiniteBattery ? 'ВКЛ' : 'ВЫКЛ'}</span>
                </div>
                <div class="dev-menu-item" id="dev-invincible-hull">
                    <span class="dev-item-label">Неуязвимый корпус</span>
                    <span class="dev-item-status ${window.devMode.invincibleHull ? 'enabled' : 'disabled'}">${window.devMode.invincibleHull ? 'ВКЛ' : 'ВЫКЛ'}</span>
                </div>
                <div class="dev-menu-item" id="dev-no-module-damage">
                    <span class="dev-item-label">Модули не повреждаются</span>
                    <span class="dev-item-status ${window.devMode.noModuleDamage ? 'enabled' : 'disabled'}">${window.devMode.noModuleDamage ? 'ВКЛ' : 'ВЫКЛ'}</span>
                </div>
                <div class="dev-menu-divider"></div>
                <div class="dev-menu-item" id="dev-repair-all">
                    <span class="dev-item-label">🔧 Полный ремонт</span>
                </div>
                <div class="dev-menu-item" id="dev-refill-all">
                    <span class="dev-item-label">⛽ Заправить всё</span>
                </div>
                <div class="dev-menu-item" id="dev-reveal-map">
                    <span class="dev-item-label">🗺️ Открыть всю карту</span>
                </div>
                <div class="dev-menu-item" id="dev-test-locations">
                    <span class="dev-item-label">🧪 Создать тестовые локации</span>
                </div>
            </div>
        </div>
    `;
    
    const menuDiv = document.createElement('div');
    menuDiv.innerHTML = menuHTML;
    menuDiv.className = 'dev-menu-container';
    document.body.appendChild(menuDiv);
    
    const menu = menuDiv.querySelector('.dev-menu');
    
    // Обработчики
    menuDiv.querySelector('.dev-menu-close').addEventListener('click', () => menuDiv.remove());
    
    // Переключение опций
    menuDiv.querySelector('#dev-infinite-fuel').addEventListener('click', () => {
        window.devMode.infiniteFuel = !window.devMode.infiniteFuel;
        updateDevMenuItem(menuDiv, '#dev-infinite-fuel', window.devMode.infiniteFuel);
        addToScreen(`🛠️ Бесконечное топливо: ${window.devMode.infiniteFuel ? 'ВКЛ' : 'ВЫКЛ'}`);
    });
    
    menuDiv.querySelector('#dev-infinite-oxygen').addEventListener('click', () => {
        window.devMode.infiniteOxygen = !window.devMode.infiniteOxygen;
        updateDevMenuItem(menuDiv, '#dev-infinite-oxygen', window.devMode.infiniteOxygen);
        addToScreen(`🛠️ Бесконечный кислород: ${window.devMode.infiniteOxygen ? 'ВКЛ' : 'ВЫКЛ'}`);
    });
    
    menuDiv.querySelector('#dev-infinite-battery').addEventListener('click', () => {
        window.devMode.infiniteBattery = !window.devMode.infiniteBattery;
        updateDevMenuItem(menuDiv, '#dev-infinite-battery', window.devMode.infiniteBattery);
        addToScreen(`🛠️ Бесконечная батарея: ${window.devMode.infiniteBattery ? 'ВКЛ' : 'ВЫКЛ'}`);
    });
    
    menuDiv.querySelector('#dev-invincible-hull').addEventListener('click', () => {
        window.devMode.invincibleHull = !window.devMode.invincibleHull;
        updateDevMenuItem(menuDiv, '#dev-invincible-hull', window.devMode.invincibleHull);
        addToScreen(`🛠️ Неуязвимый корпус: ${window.devMode.invincibleHull ? 'ВКЛ' : 'ВЫКЛ'}`);
    });
    
    menuDiv.querySelector('#dev-no-module-damage').addEventListener('click', () => {
        window.devMode.noModuleDamage = !window.devMode.noModuleDamage;
        updateDevMenuItem(menuDiv, '#dev-no-module-damage', window.devMode.noModuleDamage);
        addToScreen(`🛠️ Модули не повреждаются: ${window.devMode.noModuleDamage ? 'ВКЛ' : 'ВЫКЛ'}`);
    });
    
    // Действия
    menuDiv.querySelector('#dev-repair-all').addEventListener('click', () => {
        window.hull = 100;
        window.moduleEngine = 100;
        window.moduleReactor = 100;
        window.moduleBattery = 100;
        window.moduleBallast = 100;
        window.moduleLifeSupport = 100;
        window.moduleSonar = 100;
        window.modulePumps = 100;
        window.moduleRudders = 100;
        window.moduleRadio = 100;
        window.moduleCooling = 100;
        updateDisplay();
        addToScreen('🛠️ Все модули восстановлены');
        menuDiv.remove();
    });
    
    menuDiv.querySelector('#dev-refill-all').addEventListener('click', () => {
        window.fuel = 100;
        window.oxygen = 100;
        window.battery = 100;
        updateDisplay();
        addToScreen('🛠️ Ресурсы пополнены');
        menuDiv.remove();
    });
    
    menuDiv.querySelector('#dev-reveal-map').addEventListener('click', () => {
        for (let row = 0; row < window.MAP_ROWS; row++) {
            for (let col = 0; col < window.MAP_COLS; col++) {
                if (window.gameMap[row][col]) {
                    window.gameMap[row][col].discovered = true;
                }
            }
        }
        if (document.getElementById('tab-map').classList.contains('active')) {
            renderMap();
        }
        addToScreen('🛠️ Вся карта открыта');
        menuDiv.remove();
    });
    
    // Обработчик для тестовых локаций
    menuDiv.querySelector('#dev-test-locations').addEventListener('click', () => {
        if (typeof generateTestLocations === 'function') {
            generateTestLocations();
        }
        menuDiv.remove();
    });
    
    // Закрытие по клику вне меню
    setTimeout(() => {
        document.addEventListener('click', function closeDevMenu(e) {
            if (!menuDiv.contains(e.target) && !e.target.closest('#lever3')) {
                menuDiv.remove();
                document.removeEventListener('click', closeDevMenu);
            }
        });
    }, 100);
}

// Вспомогательная функция обновления статуса пункта меню
function updateDevMenuItem(menuDiv, selector, enabled) {
    const item = menuDiv.querySelector(selector);
    const status = item.querySelector('.dev-item-status');
    status.textContent = enabled ? 'ВКЛ' : 'ВЫКЛ';
    status.className = `dev-item-status ${enabled ? 'enabled' : 'disabled'}`;
}

// Обновление внешнего вида кнопки разработчика
function updateDevModeButton() {
    const lever3 = document.getElementById('lever3');
    if (lever3) {
        if (window.devMode.enabled) {
            lever3.style.backgroundColor = '#5f874a';
            lever3.style.color = 'black';
            lever3.style.boxShadow = '0 0 15px #5f874a';
        } else {
            lever3.style.backgroundColor = '#1a1a1a';
            lever3.style.color = '#5f874a';
            lever3.style.boxShadow = 'none';
        }
    }
}

// Общий обработчик для кнопки 3
function handleLever3Click(e) {
    playSound('click');
    
    // Если зажат Shift - открываем меню разработчика
    if (e.shiftKey) {
        if (!window.devMode.enabled) {
            toggleDevMode();
        }
        showDevMenu();
    } else {
        // Обычное поведение кнопки 3
        addToScreen('🔘 Рычаг 3 нажат');
        addItemToInventory({ 
            name: 'Металлолом', 
            icon: '🔩', 
            description: 'Восстанавливает 20% корпуса', 
            canDrop: true, 
            canUse: true 
        });
    }
}

// Подключаем обработчик после загрузки страницы
document.addEventListener('DOMContentLoaded', function() {
    const lever3 = document.getElementById('lever3');
    if (lever3) {
        // Удаляем старый обработчик (если есть)
        lever3.removeEventListener('click', lever3.onclick);
        // Добавляем новый
        lever3.addEventListener('click', handleLever3Click);
    }
});
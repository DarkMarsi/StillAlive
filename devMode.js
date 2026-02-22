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
            </div>
        </div>
    `;
    
    const menuDiv = document.createElement('div');
    menuDiv.innerHTML = menuHTML;
    menuDiv.className = 'dev-menu-container';
    document.body.appendChild(menuDiv);
    
    const menu = menuDiv.querySelector('.dev-menu');
    menu.style.position = 'fixed';
    menu.style.top = '50%';
    menu.style.left = '50%';
    menu.style.transform = 'translate(-50%, -50%)';
    menu.style.backgroundColor = '#0a0a0a';
    menu.style.border = '3px solid #5f874a';
    menu.style.padding = '20px';
    menu.style.zIndex = '100000';
    menu.style.minWidth = '300px';
    menu.style.boxShadow = '0 0 30px rgba(95,135,74,0.7)';
    
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

// Подключаем обработчик к кнопке 3
document.addEventListener('DOMContentLoaded', function() {
    const lever3 = document.getElementById('lever3');
    if (lever3) {
        // Сохраняем оригинальный обработчик
        const originalClick = lever3.onclick;
        
        // Добавляем новый обработчик
        lever3.addEventListener('click', function(e) {
            // Если зажат Shift - открываем меню разработчика
            if (e.shiftKey) {
                if (!window.devMode.enabled) {
                    toggleDevMode();
                }
                showDevMenu();
            } else {
                // Обычное поведение кнопки 3
                playSound('click');
                addToScreen('🔘 Рычаг 3 нажат');
                addItemToInventory({ 
                    name: 'Металлолом', 
                    icon: '🔩', 
                    description: 'Восстанавливает 20% корпуса', 
                    canDrop: true, 
                    canUse: true 
                });
            }
        });
    }
});
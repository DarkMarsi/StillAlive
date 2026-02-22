// map.js
function renderMap() {
    let mapHTML = '<div class="map-container">';
    
    // Верхний ряд с буквами (A-U)
    mapHTML += '<div class="map-row header-row">';
    mapHTML += '<div class="map-corner"></div>';
    for (let col = 0; col < window.MAP_COLS; col++) {
        let letter;
        if (col < 26) {
            // Для первых 26 колонок используем A-Z
            letter = String.fromCharCode(65 + col);
        } else {
            // Для колонок больше 26 (не понадобится для 21)
            letter = String.fromCharCode(65 + (col % 26)) + Math.floor(col / 26);
        }
        mapHTML += `<div class="map-header">${letter}</div>`;
    }
    mapHTML += '</div>'; // Закрываем header-row
        
    // Ряды карты
    for (let row = 0; row < window.MAP_ROWS; row++) {
        mapHTML += '<div class="map-row">';
        // Номер строки (1-9)
        mapHTML += `<div class="map-row-label">${row + 1}</div>`;
        
        for (let col = 0; col < window.MAP_COLS; col++) {
            let tile = window.gameMap[row][col];
            let displayChar = ' ';
            let tileClass = 'map-tile';
            
            if (row === window.playerRow && col === window.playerCol) {
                displayChar = '⏺'; // Текущая позиция корабля
                tileClass += ' current';
            } else if (tile.type === 'exit' && tile.discovered) {
                displayChar = '🚪'; // Выход в другой регион
                tileClass += ' exit';
            } else if (tile.visited) {
                displayChar = '•'; // Посещенная клетка
                tileClass += ' visited';
            } else if (tile.discovered) {
                displayChar = '?'; // Обнаруженная, но не посещенная
                tileClass += ' discovered';
            } else {
                displayChar = '?'; // Неизвестная
                tileClass += ' undiscovered';
            }
            
            mapHTML += `<div class="${tileClass}" data-row="${row}" data-col="${col}">${displayChar}</div>`;
        }
        mapHTML += '</div>'; // Закрываем map-row
    }
    
    // Определяем направление движения для отображения
    let directionText = '';
    if (window.engineOn && window.throttleEngine !== 0) {
        if (window.shipHeading >= 315 || window.shipHeading < 45) directionText = 'СЕВЕР';
        else if (window.shipHeading >= 45 && window.shipHeading < 135) directionText = 'ВОСТОК';
        else if (window.shipHeading >= 135 && window.shipHeading < 225) directionText = 'ЮГ';
        else if (window.shipHeading >= 225 && window.shipHeading < 315) directionText = 'ЗАПАД';
    } else {
        directionText = 'СТОЯНКА';
    }
    
    // Добавляем информацию о позиции
    mapHTML += `
        <div class="map-info">
            <div class="map-coordinates">
                <div>Клетка: ${String.fromCharCode(65 + window.playerCol)}${window.playerRow + 1}</div>
                <div>Позиция в клетке: X: ${Math.round(window.positionX)} м, Y: ${Math.round(window.positionY)} м</div>
                <div>Курс: ${window.shipHeading}° (${directionText})</div>
                <div>Скорость: ${window.speed} узлов</div>
            </div>
            <div class="map-legend">
                <div class="legend-item"><span class="current">⏺</span> - Корабль</div>
                <div class="legend-item"><span class="visited">•</span> - Посещено</div>
                <div class="legend-item"><span class="discovered">?</span> - Обнаружено</div>
                <div class="legend-item"><span class="undiscovered">?</span> - Неизвестно</div>
            </div>
        </div>
    `;
    
    window.screen.innerHTML = mapHTML;
}

function enterTile(row, col) {
    let tile = window.gameMap[row][col];
    
    if (!tile.visited) {
        tile.visited = true;
        tile.discovered = true;
        
        // Формируем координаты в формате A1, B2 и т.д.
        let colLetter = String.fromCharCode(65 + col); // A, B, C...
        let rowNumber = row + 1; // 1, 2, 3...
        addToScreen(`🗺️ Вы вошли в сектор ${colLetter}${rowNumber}`);
        
        // Случайное событие при входе в новый сектор
        let eventRoll = Math.random();
        
        if (eventRoll < 0.2) { // 20% - хорошее событие
            addToScreen('    ➕ Найдены припасы!');
            window.fuel = Math.min(100, window.fuel + 5);
            window.oxygen = Math.min(100, window.oxygen + 5);
            window.battery = Math.min(100, window.battery + 5);
            updateDisplay();
            
        } else if (eventRoll < 0.4) { // 20% - ресурсы
            addToScreen('    ⛏️ Найден металлолом');
            addItemToInventory({ 
                name: 'Металлолом', 
                icon: '🔩', 
                description: 'Восстанавливает 20% корпуса', 
                canDrop: true, 
                canUse: true 
            });
            
        } else if (eventRoll < 0.6) { // 20% - опасность
            addToScreen('    💥 Обнаружена опасность!');
            // Случайное повреждение
            let damage = Math.floor(Math.random() * 10) + 5;
            let modules = ['moduleEngine', 'moduleReactor', 'moduleBattery', 'moduleBallast', 'moduleLifeSupport'];
            let randomModule = modules[Math.floor(Math.random() * modules.length)];
            window[randomModule] = Math.max(0, window[randomModule] - damage);
            addToScreen(`    ⚙️ Повреждён модуль ${randomModule.replace('module', '')}`);
            
        } else { // 40% - ничего особенного
            let emptyEvents = [
                '    🌊 Тишина...',
                '    🐟 Стая рыб проплыла мимо',
                '    💧 Капает вода где-то вдалеке',
                '    🔊 Странный звук... или показалось?'
            ];
            addToScreen(emptyEvents[Math.floor(Math.random() * emptyEvents.length)]);
        }
    }
    
    // Открываем соседние клетки
    discoverAdjacent(row, col);
}


function discoverAdjacent(row, col) {
    if (col + 1 < window.MAP_COLS) window.gameMap[row][col + 1].discovered = true;
    if (col - 1 >= 0) window.gameMap[row][col - 1].discovered = true;
    if (row - 1 >= 0) window.gameMap[row - 1][col].discovered = true;
    if (row + 1 < window.MAP_ROWS) window.gameMap[row + 1][col].discovered = true;
}

// Функция для обновления только данных карты (без полной перерисовки)
function updateMapData() {
    // Если карта открыта, обновляем отображение
    if (document.getElementById('tab-map').classList.contains('active')) {
        renderMap();
    }
}

// Функция для обновления только текстовой информации под картой
function updateMapDisplay() {
    // Находим контейнер с информацией
    const mapInfo = document.querySelector('.map-info');
    if (!mapInfo) return;
    
    // Определяем направление движения
    let directionText = '';
    if (window.engineOn && window.throttleEngine !== 0) {
        if (window.shipHeading >= 315 || window.shipHeading < 45) directionText = 'СЕВЕР';
        else if (window.shipHeading >= 45 && window.shipHeading < 135) directionText = 'ВОСТОК';
        else if (window.shipHeading >= 135 && window.shipHeading < 225) directionText = 'ЮГ';
        else if (window.shipHeading >= 225 && window.shipHeading < 315) directionText = 'ЗАПАД';
    } else {
        directionText = 'СТОЯНКА';
    }
    
    // Обновляем текст в существующих элементах
    const coordsDivs = mapInfo.querySelectorAll('.map-coordinates div');
    if (coordsDivs.length >= 4) {
        // Клетка
        coordsDivs[0].textContent = `Клетка: ${String.fromCharCode(65 + window.playerCol)}${window.playerRow + 1}`;
        // Позиция
        coordsDivs[1].textContent = `Позиция в клетке: X: ${Math.round(window.positionX)} м, Y: ${Math.round(window.positionY)} м`;
        // Курс
        coordsDivs[2].textContent = `Курс: ${window.shipHeading}° (${directionText})`;
        // Скорость
        coordsDivs[3].textContent = `Скорость: ${window.speed} узлов`;
    }
}
// map.js - добавить новую функцию

// Показать информацию о клетке
function showTileInfo(row, col, event) {
    // Удаляем старую подсказку если есть
    const oldTooltip = document.getElementById('tile-tooltip');
    if (oldTooltip) oldTooltip.remove();
    
    const tile = window.gameMap[row][col];
    if (!tile) return;
    
    // Формируем координаты
    const colLetter = String.fromCharCode(65 + col);
    const rowNumber = row + 1;
    
    // Определяем статус клетки
    let status = '';
    if (row === window.playerRow && col === window.playerCol) {
        status = 'Текущая позиция';
    } else if (tile.visited) {
        status = 'Посещена';
    } else if (tile.discovered) {
        status = 'Обнаружена';
    } else {
        status = 'Неизвестна';
    }
    
    // Получаем тип клетки (только если обнаружена)
    let typeInfo = '???';
    if (tile.discovered) {
        typeInfo = getTileScanInfo(tile);
    }
    
    // Создаем подсказку
    const tooltip = document.createElement('div');
    tooltip.id = 'tile-tooltip';
    tooltip.className = 'tile-tooltip';
    tooltip.style.position = 'fixed';
    tooltip.style.left = (event.clientX + 20) + 'px';
    tooltip.style.top = (event.clientY + 20) + 'px';
    tooltip.style.backgroundColor = '#0a0a0a';
    tooltip.style.border = '2px solid #5f874a';
    tooltip.style.padding = '10px';
    tooltip.style.zIndex = '10000';
    tooltip.style.minWidth = '200px';
    tooltip.style.boxShadow = '0 0 20px rgba(95,135,74,0.5)';
    
    tooltip.innerHTML = `
        <div style="border-bottom: 1px solid #5f874a; margin-bottom: 5px; padding-bottom: 5px;">
            <strong>Сектор ${colLetter}${rowNumber}</strong>
        </div>
        <div>Статус: ${status}</div>
        <div>Тип: ${typeInfo}</div>
        ${tile.visited ? '<div style="color: #5f874a; margin-top: 5px;">✓ Исследовано</div>' : ''}
    `;
    
    document.body.appendChild(tooltip);
    
    // Убираем подсказку через 3 секунды или при движении мыши
    setTimeout(() => {
        if (tooltip) tooltip.remove();
    }, 3000);
}

// Обновляем функцию renderMap - добавляем обработчик mouseenter
function renderMap() {
    let mapHTML = '<div class="map-container">';
    
    // Верхний ряд с буквами (A-U)
    mapHTML += '<div class="map-row header-row">';
    mapHTML += '<div class="map-corner"></div>';
    for (let col = 0; col < window.MAP_COLS; col++) {
        let letter;
        if (col < 26) {
            letter = String.fromCharCode(65 + col);
        } else {
            letter = String.fromCharCode(65 + (col % 26)) + Math.floor(col / 26);
        }
        mapHTML += `<div class="map-header">${letter}</div>`;
    }
    mapHTML += '</div>';
        
    // Ряды карты
    for (let row = 0; row < window.MAP_ROWS; row++) {
        mapHTML += '<div class="map-row">';
        mapHTML += `<div class="map-row-label">${row + 1}</div>`;
        
        for (let col = 0; col < window.MAP_COLS; col++) {
            let tile = window.gameMap[row][col];
            let displayChar = ' ';
            let tileClass = 'map-tile';
            
            if (row === window.playerRow && col === window.playerCol) {
                displayChar = '⏺';
                tileClass += ' current';
            } else if (tile.type === 'exit' && tile.discovered) {
                displayChar = '🚪';
                tileClass += ' exit';
            } else if (tile.visited) {
                // Для посещенных клеток показываем иконку типа
                displayChar = window.TILE_ICONS[tile.type] || '•';
                tileClass += ' visited';
            } else if (tile.discovered) {
                // Для обнаруженных показываем иконку типа
                displayChar = window.TILE_ICONS[tile.type] || '?';
                tileClass += ' discovered';
            } else {
                displayChar = '?';
                tileClass += ' undiscovered';
            }
            
            mapHTML += `<div class="${tileClass}" data-row="${row}" data-col="${col}">${displayChar}</div>`;
        }
        mapHTML += '</div>';
    }
    
    // ... остальная часть renderMap (информация о позиции) остается без изменений ...
    
    window.screen.innerHTML = mapHTML;
    
    // Добавляем обработчики наведения
    document.querySelectorAll('.map-tile').forEach(tile => {
        tile.addEventListener('mouseenter', function(e) {
            const row = parseInt(this.dataset.row);
            const col = parseInt(this.dataset.col);
            showTileInfo(row, col, e);
        });
    });
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
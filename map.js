// Показать информацию о клетке
function showTileInfo(row, col, event) {
    const oldTooltip = document.getElementById('tile-tooltip');
    if (oldTooltip) oldTooltip.remove();
    
    const tile = window.gameMap[row][col];
    if (!tile) return;
    
    const colLetter = String.fromCharCode(65 + col);
    const rowNumber = row + 1;
    
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
    
    let typeInfo = '???';
    if (tile.discovered) {
        typeInfo = getTileScanInfo(tile);
    }

    let locationInfo = '';
    let coordsInfo = '';
    
    if (tile.discovered && tile.locations) {
        if (tile.visited) {
            // Если посетили клетку - показываем точное название и координаты
            locationInfo = `<div>Локация: ${tile.locations.name}</div>`;
            
            // ДОБАВЛЯЕМ КООРДИНАТЫ ЛОКАЦИИ
            if (tile.locationCoords) {
                coordsInfo = `<div style="color: #d4af37; margin-top: 5px;">📍 Координаты локации: X: ${tile.locationCoords.x}м, Y: ${tile.locationCoords.y}м</div>`;
            }
            
            if (!tile.locations.isEmpty) {
                locationInfo += `<div style="color: #d4af37;">⚡ Активная зона</div>`;
            }
        } else {
            // Если только обнаружили - показываем тип
            locationInfo = `<div>Тип: ${tile.locations.isEmpty ? 'Пустая' : 'Населенная'}</div>`;
        }
    }

        // Информация о заданиях в этой клетке
        let missionsInfo = '';
        const key = `${row}_${col}`;
        const missionIds = window.missionCells?.[key] || [];

        if (missionIds.length > 0) {
            missionsInfo = '<div style="margin-top: 8px; border-top: 1px solid #e1d882; padding-top: 5px;">';
            missionsInfo += '<div style="color: #e1d882; font-weight: bold;">📋 ЗАДАНИЯ:</div>';
            
            missionIds.forEach(id => {
                const mission = window.activeMissions.find(m => m.id === id);
                if (mission) {
                    let statusText = '';
                    if (mission.status === window.MISSION_STATUS.COMPLETED_CONDITIONS) {
                        statusText = '✅ ГОТОВО К СДАЧЕ';
                    } else {
                        statusText = '⚡ АКТИВНО';
                    }
                    
                    missionsInfo += `
                        <div style="margin-top: 5px; padding: 5px; background-color: #1a1a1a; border-radius: 4px;">
                            <div style="display: flex; justify-content: space-between;">
                                <span style="color: #e1d882;">${mission.title}</span>
                                <span style="color: ${mission.status === window.MISSION_STATUS.COMPLETED_CONDITIONS ? '#4a9e5a' : '#d4af37'};">${statusText}</span>
                            </div>
                            <div style="font-size: 11px; color: #5f874a;">${mission.description}</div>
                        </div>
                    `;
                }
            });
            
            missionsInfo += '</div>';
        }


    const tooltip = document.createElement('div');
    tooltip.id = 'tile-tooltip';
    tooltip.className = 'tile-tooltip';
    tooltip.style.cssText = `
        position: fixed;
        left: ${event.clientX + 20}px;
        top: ${event.clientY + 20}px;
        background-color: #0a0a0a;
        border: 2px solid #5f874a;
        padding: 10px;
        z-index: 10000;
        min-width: 200px;
        box-shadow: 0 0 20px rgba(95,135,74,0.5);
        font-family: 'Courier New', monospace;
        font-size: 12px;
        color: #5f874a;
    `;
    
    tooltip.innerHTML = `
        <div style="border-bottom: 1px solid #5f874a; margin-bottom: 5px; padding-bottom: 5px;">
            <strong>Сектор ${colLetter}${rowNumber}</strong>
        </div>
        <div>Статус: ${status}</div>
        <div>Тип: ${typeInfo}</div>
        ${locationInfo}
        ${coordsInfo}
        ${tile.visited ? '<div style="color: #5f874a; margin-top: 5px;">✓ Исследовано</div>' : ''}
    `;
    
    document.body.appendChild(tooltip);
    
    setTimeout(() => {
        if (tooltip) tooltip.remove();
    }, 3000);
}

function renderMap() {
    // Сохраняем текущую позицию скролла
    const mapContainer = document.querySelector('.map-container');
    let scrollTop = 0;
    if (mapContainer) {
        scrollTop = mapContainer.scrollTop;
    }
    
    let mapHTML = '<div class="map-container">';
    
    // Верхний ряд с буквами (A-U)
    mapHTML += '<div class="map-row header-row">';
    mapHTML += '<div class="map-corner"></div>';
    for (let col = 0; col < window.MAP_COLS; col++) {
        let letter = String.fromCharCode(65 + col);
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
                displayChar = window.TILE_ICONS[tile.type] || '•';
                tileClass += ' visited';
                tileClass += ` type-${tile.type}`;
            } else if (tile.discovered) {
                displayChar = window.TILE_ICONS[tile.type] || '?';
                tileClass += ' discovered';
                tileClass += ` type-${tile.type}`;
            } else {
                displayChar = '?';
                tileClass += ' undiscovered';
            }

            // Проверяем статус задания для этой клетки
            const missionStatus = getCellMissionStatus ? getCellMissionStatus(row, col) : null;
            if (missionStatus === 'active') {
                tileClass += ' mission-active';
            } else if (missionStatus === 'completed') {
                tileClass += ' mission-completed';
            }
            
            mapHTML += `<div class="${tileClass}" data-row="${row}" data-col="${col}" data-type="${tile.type}">${displayChar}</div>`;
        }
        mapHTML += '</div>';
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
                <div>Глобальные: X: ${Math.round(window.globalX)} м, Y: ${Math.round(window.globalY)} м</div>
                <div>В клетке: X: ${Math.round(window.positionX)} м, Y: ${Math.round(window.positionY)} м</div>
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
    
    // Восстанавливаем позицию скролла
    const newMapContainer = document.querySelector('.map-container');
    if (newMapContainer) {
        newMapContainer.scrollTop = scrollTop;
    }
    
    // Добавляем обработчики наведения
    document.querySelectorAll('.map-tile').forEach(tile => {
        tile.addEventListener('mouseenter', function(e) {
            const row = parseInt(this.dataset.row);
            const col = parseInt(this.dataset.col);
            showTileInfo(row, col, e);
        });
    });
}

function enterTile(row, col, direction) {
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

        // Если в клетке есть локация и она еще не была обнаружена
        if (tile.locations && !tile.locations.discovered) {
            tile.locations.discovered = true;
            const coords = tile.locationCoords || tile.locations.points[tile.locations.activePointIndex];
            addToScreen(`📡 ОБНАРУЖЕН НЕИЗВЕСТНЫЙ ОБЪЕКТ`);
            addToScreen(`    📍 Название: ${tile.locations.name}`);
            addToScreen(`    📍 Координаты: X: ${coords.x} м, Y: ${coords.y} м`);
            addToScreen(`    📍 Тип: ${tile.locations.isEmpty ? 'Атмосферный' : 'Населенный'}`);
        }    
    }
    
    // Открываем соседние клетки
    discoverAdjacent(row, col);

    // Проверяем выполнение заданий при входе в новую клетку
    if (typeof checkMissionCompletion === 'function') {
        checkMissionCompletion();
    }
    
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
    if (coordsDivs.length >= 5) { // теперь 5 элементов
        // Клетка
        coordsDivs[0].textContent = `Клетка: ${String.fromCharCode(65 + window.playerCol)}${window.playerRow + 1}`;
        // Глобальные координаты
        coordsDivs[1].textContent = `Глобальные: X: ${Math.round(window.globalX)} м, Y: ${Math.round(window.globalY)} м`;
        // Локальные координаты
        coordsDivs[2].textContent = `В клетке: X: ${Math.round(window.positionX)} м, Y: ${Math.round(window.positionY)} м`;
        // Курс
        coordsDivs[3].textContent = `Курс: ${window.shipHeading}° (${directionText})`;
        // Скорость
        coordsDivs[4].textContent = `Скорость: ${window.speed} узлов`;
    }
}
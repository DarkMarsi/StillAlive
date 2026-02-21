// radar.js - управление разведкой карты

// Радиус разведки радаром (когда включен)
const RADAR_RANGE = 1;

// Функция для разведки клеток вокруг корабля
function scanSurroundings() {
    if (!window.sonarOn) {
        // Если радар выключен - не разведываем
        return;
    }
    
    let scanned = false;
    
    // Проверяем все клетки в радиусе RADAR_RANGE
    for (let dRow = -RADAR_RANGE; dRow <= RADAR_RANGE; dRow++) {
        for (let dCol = -RADAR_RANGE; dCol <= RADAR_RANGE; dCol++) {
            // Пропускаем саму клетку корабля (она уже открыта)
            if (dRow === 0 && dCol === 0) continue;
            
            let newRow = window.playerRow + dRow;
            let newCol = window.playerCol + dCol;
            
            // Проверяем, не выходит ли за границы карты
            if (newRow >= 0 && newRow < window.MAP_ROWS && newCol >= 0 && newCol < window.MAP_COLS) {
                let tile = window.gameMap[newRow][newCol];
                
                // Если клетка еще не была обнаружена
                if (!tile.discovered) {
                    tile.discovered = true;
                    scanned = true;
                    
                    // С вероятностью 10% добавляем сообщение об обнаружении
                    if (Math.random() < 0.1) {
                        let direction = '';
                        if (dRow < 0) direction += 'север';
                        else if (dRow > 0) direction += 'юг';
                        
                        if (dCol < 0) direction += 'запад';
                        else if (dCol > 0) direction += 'восток';
                        
                        addToScreen(`📡 Радар обнаружил сектор к ${direction}`);
                    }
                }
            }
        }
    }
    
    // Если карта открыта, обновляем отображение
    if (scanned && document.getElementById('tab-map').classList.contains('active')) {
        renderMap();
    }
}

// Функция для проверки, видит ли радар врагов (для будущего использования)
function isEnemyDetected() {
    if (!window.sonarOn) return false;
    
    // Здесь потом будет логика обнаружения врагов
    return false;
}

// Функция для получения статуса невидимости
function isStealthMode() {
    return !window.sonarOn;
}
// navigation.js - управление движением по карте с глобальными координатами

// Функция обновления позиции (вызывается из главного таймера)
function updatePosition() {
    // Проверяем, можно ли двигаться
    if (!window.engineOn) {
        return false;
    }
    
    if (window.throttleEngine === 0) {
        return false;
    }
    
    if (!isEngineWorking()) {
        addToScreen('⛔ Двигатель повреждён! Движение невозможно');
        return false;
    }
    
    if (window.fuel <= 0) {
        addToScreen('⛽ Нет топлива! Движение невозможно');
        return false;
    }
    
    if (window.gameOver) {
        return false;
    }
    
    // Получаем текущую скорость из throttleEngine
    let speedIndex = Math.abs(window.throttleEngine);
    let currentSpeed = window.ENGINE_SPEEDS[speedIndex] || 0;
    
    // Если скорость 0, не двигаемся
    if (currentSpeed === 0) {
        return false;
    }
    
    // Расход топлива (чем выше скорость, тем больше расход)
    let fuelConsumption = currentSpeed / 100; // 10 узлов = 0.1, 20 узлов = 0.2 и т.д.
    
    if (window.fuel < fuelConsumption) {
        addToScreen('⛽ Топливо на исходе! Движение замедляется...');
        return false;
    }
    
    window.fuel = Math.max(0, window.fuel - fuelConsumption);
    
    // Скорость в метрах за тик
    let speedFactor = currentSpeed * 2; // 10 узлов = 20 метров за тик
    
    // Определяем направление движения по компасу
    let headingRad = (window.shipHeading * Math.PI) / 180;
    
    // Движение по глобальным X и Y
    let moveX = Math.sin(headingRad) * speedFactor;
    let moveY = -Math.cos(headingRad) * speedFactor;
    
    // Обновляем глобальную позицию
    window.globalX += moveX;
    window.globalY += moveY;
    
    // Обновляем локальные координаты в текущей клетке
    updateLocalCoordinates();
    
    // Для отладки
    console.log('Движение:', {speed: currentSpeed, heading: window.shipHeading, moveX, moveY, fuel: window.fuel});
    console.log('Глобальные координаты:', {x: Math.round(window.globalX), y: Math.round(window.globalY)});
    console.log('Клетка:', getCurrentCell());

    // Проверяем приближение к активной точке локации
    if (typeof checkLocationProximity === 'function') {
        checkLocationProximity();
    }
    
    // ВАЖНО: здесь НЕ вызываем renderMap(), потому что это слишком тяжело
    // Вместо этого обновляем только текст, если карта открыта
    if (document.getElementById('tab-map').classList.contains('active')) {
        updateMapDisplay();
    }
    
    return true;
}

// Функция для получения текущей клетки по глобальным координатам
function getCurrentCell() {
    const col = Math.floor(window.globalX / window.cellSize);
    const row = Math.floor(window.globalY / window.cellSize);
    
    return {
        row: Math.min(window.MAP_ROWS - 1, Math.max(0, row)),
        col: Math.min(window.MAP_COLS - 1, Math.max(0, col))
    };
}

// Функция для обновления локальных координат и проверки перехода между клетками
function updateLocalCoordinates() {
    // Вычисляем текущую клетку по глобальным координатам
    let newCol = Math.floor(window.globalX / window.cellSize);
    let newRow = Math.floor(window.globalY / window.cellSize);
    
    // Проверяем, не вышли ли за границы карты
    if (newCol < 0 || newCol >= window.MAP_COLS || 
        newRow < 0 || newRow >= window.MAP_ROWS) {
        
        // Возвращаем в пределы карты
        window.globalX = Math.min(window.MAP_COLS * window.cellSize - 1, 
                                   Math.max(0, window.globalX));
        window.globalY = Math.min(window.MAP_ROWS * window.cellSize - 1, 
                                   Math.max(0, window.globalY));
        
        newCol = Math.floor(window.globalX / window.cellSize);
        newRow = Math.floor(window.globalY / window.cellSize);
        
        addToScreen('🌊 Достигнут край карты!');
    }
    
    // Если клетка изменилась
    if (newRow !== window.playerRow || newCol !== window.playerCol) {
        // Сохраняем старую клетку
        const oldRow = window.playerRow;
        const oldCol = window.playerCol;
        
        // Переходим в новую клетку
        window.playerRow = newRow;
        window.playerCol = newCol;
        
        // Определяем направление перехода
        let direction = null;
        if (newRow > oldRow) direction = 'south';
        else if (newRow < oldRow) direction = 'north';
        else if (newCol > oldCol) direction = 'east';
        else if (newCol < oldCol) direction = 'west';
        
        // Вызываем событие входа в клетку
        enterTile(window.playerRow, window.playerCol, direction);
    }
    
    // Обновляем локальные координаты внутри клетки (0-1000)
    window.positionX = window.globalX - (window.playerCol * window.cellSize);
    window.positionY = window.globalY - (window.playerRow * window.cellSize);
}

// Функция для сброса навигации (вызывается при ресете)
function resetNavigation() {
    // Начальная позиция в центре региона
    window.globalX = Math.floor(window.MAP_COLS * window.cellSize / 2);
    window.globalY = Math.floor(window.MAP_ROWS * window.cellSize / 2);
    
    window.playerRow = Math.floor(window.MAP_ROWS / 2);
    window.playerCol = Math.floor(window.MAP_COLS / 2);
    
    window.positionX = 500;
    window.positionY = 500;
}
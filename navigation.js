// navigation.js - управление движением по карте с накоплением расстояния

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
    
    // Движение по X и Y
    let moveX = Math.sin(headingRad) * speedFactor;
    let moveY = -Math.cos(headingRad) * speedFactor;
    
    // Обновляем позицию
    window.positionX += moveX;
    window.positionY += moveY;
    
    // Для отладки
    console.log('Движение:', {speed: currentSpeed, heading: window.shipHeading, moveX, moveY, fuel: window.fuel});
    
    // Проверяем, не пора ли перейти в другую клетку
    checkCellTransition();

    // Проверяем приближение к активной точке локации
    if (typeof checkLocationProximity === 'function') {
        checkLocationProximity();
    }
    
    // ВАЖНО: здесь НЕ вызываем renderMap(), потому что это слишком тяжело
    // Вместо этого обновляем только текст, если карта открыта
    if (document.getElementById('tab-map').classList.contains('active')) {
        updateMapDisplay(); // Вызовем новую функцию для обновления текста
    }
    
    return true;
}

// Функция проверки перехода между клетками
function checkCellTransition() {
    let moved = false;
    let direction = null;
    
    // Проверка перехода по X (восток-запад)
    while (window.positionX >= window.cellSize / 2) {
        // Движение на восток (вправо)
        if (window.playerCol < window.MAP_COLS - 1) {
            window.playerCol++;
            // Сохраняем позицию по Y перед переходом
            const oldY = window.positionY;
            window.positionX -= window.cellSize;
            // Устанавливаем новую позицию: появляемся на западном краю новой клетки
            window.positionX = -window.cellSize / 2 + 1;
            // Сохраняем Y координату
            window.positionY = oldY;
            direction = 'east';
            enterTile(window.playerRow, window.playerCol, direction);
            moved = true;
        } else {
            // Уперлись в край карты
            window.positionX = window.cellSize / 2 - 1;
            addToScreen('🌊 Дальше на восток нет земли!');
            break;
        }
    }
    
    while (window.positionX <= -window.cellSize / 2) {
        // Движение на запад (влево)
        if (window.playerCol > 0) {
            window.playerCol--;
            const oldY = window.positionY;
            window.positionX += window.cellSize;
            window.positionX = window.cellSize / 2 - 1;
            window.positionY = oldY;
            direction = 'west';
            enterTile(window.playerRow, window.playerCol, direction);
            moved = true;
        } else {
            // Уперлись в край карты
            window.positionX = -window.cellSize / 2 + 1;
            addToScreen('🌊 Дальше на запад нет земли!');
            break;
        }
    }
    
    // Проверка перехода по Y (север-юг)
    while (window.positionY >= window.cellSize / 2) {
        // Движение на юг (вниз)
        if (window.playerRow < window.MAP_ROWS - 1) {
            window.playerRow++;
            const oldX = window.positionX;
            window.positionY -= window.cellSize;
            window.positionY = -window.cellSize / 2 + 1;
            window.positionX = oldX;
            direction = 'south';
            enterTile(window.playerRow, window.playerCol, direction);
            moved = true;
        } else {
            // Уперлись в край карты
            window.positionY = window.cellSize / 2 - 1;
            addToScreen('🌊 Дальше на юг нет земли!');
            break;
        }
    }
    
    while (window.positionY <= -window.cellSize / 2) {
        // Движение на север (вверх)
        if (window.playerRow > 0) {
            window.playerRow--;
            const oldX = window.positionX;
            window.positionY += window.cellSize;
            window.positionY = window.cellSize / 2 - 1;
            window.positionX = oldX;
            direction = 'north';
            enterTile(window.playerRow, window.playerCol, direction);
            moved = true;
        } else {
            // Уперлись в край карты
            window.positionY = -window.cellSize / 2 + 1;
            addToScreen('🌊 Дальше на север нет земли!');
            break;
        }
    }
    
    // Обновляем отображение карты, если она открыта и было движение
    if (moved && document.getElementById('tab-map').classList.contains('active')) {
        renderMap();
    }
}

// Функция для сброса навигации (вызывается при ресете)
function resetNavigation() {
    window.positionX = 0;
    window.positionY = 0;
    // Не устанавливаем playerRow и playerCol здесь, 
    // потому что initMap() уже делает это
}
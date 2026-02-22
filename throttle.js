// throttle.js - управление тумблерами

// Состояния тумблеров
window.throttleEngine = 0;        // для двигателя: -4,-3,-2,-1,0,1,2,3,4
window.throttleBallast = 0;       // для балласта: -2,-1,0,1,2
window.ballastSpeed = 0;          // текущая скорость изменения глубины

// Максимальная глубина без повреждений
window.MAX_SAFE_DEPTH = 500;

// Базовая скорость изменения глубины
window.BALLAST_BASE_SPEED = 5;

// Скорости двигателя
window.ENGINE_SPEEDS = [0, 10, 20, 30, 40];

// Функция обновления отображения тумблеров
function updateThrottleDisplay() {
    // Обновляем позицию двигателя
    const enginePos = document.getElementById('throttle-engine-pos');
    const engineValue = document.getElementById('throttle-engine-value');
    
    if (enginePos) {
        if (window.throttleEngine > 0) enginePos.textContent = '▲';
        else if (window.throttleEngine < 0) enginePos.textContent = '▼';
        else enginePos.textContent = '⏺';
    }
    
    if (engineValue) {
        // Получаем скорость из массива, используя абсолютное значение throttleEngine
        let speedIndex = Math.abs(window.throttleEngine);
        let speed = window.ENGINE_SPEEDS[speedIndex] || 0;
        window.speed = speed;
        engineValue.textContent = speed + ' узл';
    }
    
    // Обновляем позицию балласта
    const ballastPos = document.getElementById('throttle-ballast-pos');
    const ballastEffect = document.getElementById('throttle-ballast-effect');

    if (ballastPos) {
        // throttleBallast < 0 = погружение (стрелка вниз)
        // throttleBallast > 0 = всплытие (стрелка вверх)
        if (window.throttleBallast < 0) ballastPos.textContent = '▼'; // Погружение
        else if (window.throttleBallast > 0) ballastPos.textContent = '▲'; // Всплытие
        else ballastPos.textContent = '⏺'; // Нейтраль
    }
    
    if (ballastEffect) {
        let status = '';
        // Исправляем: отрицательная скорость = погружение, положительная = всплытие
        if (window.ballastSpeed < 0) status = 'погр ' + Math.abs(Math.floor(window.ballastSpeed));
        else if (window.ballastSpeed > 0) status = 'вспл ' + Math.abs(Math.floor(window.ballastSpeed));
        else status = 'удерж';
        ballastEffect.textContent = status;
    }
    
    // Обновляем приборы
    updateMiniInstruments();
}

// Функция для двигателя - вверх
function throttleEngineUp() {
    if (!window.engineOn) {
        addToScreen('⛔ Двигатель выключен!');
        return;
    }
    
    if (!isEngineWorking()) {
        addToScreen('⛔ Двигатель повреждён!');
        return;
    }
    
    // Увеличиваем скорость вперед
    if (window.throttleEngine < 4) {
        window.throttleEngine++;
        addToScreen('⚙️ Скорость: ' + window.ENGINE_SPEEDS[Math.abs(window.throttleEngine)] + ' узлов');
    } else {
        addToScreen('⚙️ Максимальная скорость');
    }
    
    updateThrottleDisplay();
    updateEngineSound();
}

// Функция для двигателя - вниз
function throttleEngineDown() {
    if (!window.engineOn) {
        addToScreen('⛔ Двигатель выключен!');
        return;
    }
    
    if (!isEngineWorking()) {
        addToScreen('⛔ Двигатель повреждён!');
        return;
    }
    
    // Уменьшаем скорость или переключаем на задний ход
    if (window.throttleEngine > -4) {
        window.throttleEngine--;
        if (window.throttleEngine >= 0) {
            addToScreen('⚙️ Скорость: ' + window.ENGINE_SPEEDS[Math.abs(window.throttleEngine)] + ' узлов');
        } else {
            addToScreen('⚙️ Скорость назад: ' + window.ENGINE_SPEEDS[Math.abs(window.throttleEngine)] + ' узлов');
        }
    } else {
        addToScreen('⚙️ Максимальная скорость назад');
    }
    
    updateThrottleDisplay();
    updateBallastSound();
}

// Функция для балласта - вверх (погружение)
function throttleBallastUp() {
    if (!isBallastWorking()) {
        addToScreen('⛔ Балласт повреждён!');
        return;
    }
    
    if (window.battery <= 0) {
        addToScreen('⚡ Нет заряда батареи для работы балласта!');
        return;
    }
    
    // Увеличиваем скорость погружения (нажатие вверх = погружение)
    if (window.throttleBallast > -2) {
        window.throttleBallast--;
    }
    
    // Скорость изменения глубины
    window.ballastSpeed = window.throttleBallast * window.BALLAST_BASE_SPEED;
    
    let message = '';
    if (window.ballastSpeed < 0) message = '💧 Погружение, скорость ' + Math.abs(window.ballastSpeed);
    else if (window.ballastSpeed > 0) message = '💧 Всплытие, скорость ' + Math.abs(window.ballastSpeed);
    else message = '💧 Удержание глубины';
    addToScreen(message);
    
    updateThrottleDisplay();
    startBallastSound()
}

// Функция для балласта - вниз (всплытие)
function throttleBallastDown() {
    if (!isBallastWorking()) {
        addToScreen('⛔ Балласт повреждён!');
        return;
    }
    
    if (window.battery <= 0) {
        addToScreen('⚡ Нет заряда батареи для работы балласта!');
        return;
    }
    
    // Увеличиваем скорость всплытия (нажатие вниз = всплытие)
    if (window.throttleBallast < 2) {
        window.throttleBallast++;
    }
    
    // Скорость изменения глубины
    window.ballastSpeed = window.throttleBallast * window.BALLAST_BASE_SPEED;
    
    let message = '';
    if (window.ballastSpeed > 0) message = '💧 Всплытие, скорость ' + Math.abs(window.ballastSpeed);
    else if (window.ballastSpeed < 0) message = '💧 Погружение, скорость ' + Math.abs(window.ballastSpeed);
    else message = '💧 Удержание глубины';
    addToScreen(message);
    
    updateThrottleDisplay();
    startBallastSound()
}

// Функция проверки работы балласта
function isBallastWorking() {
    return window.moduleBallast > 0;
}

// При выключении двигателя - сбрасываем в нейтраль
function onEngineToggle() {
    if (!window.engineOn) {
        // Если двигатель выключили, начинаем плавную остановку
        addToScreen('🔧 Двигатель останавливается...');
    } else if (!isEngineWorking()) {
        window.engineOn = false;
        updateEngineIndicator();
        addToScreen('⛔ Двигатель повреждён, запуск невозможен');
    } else if (window.fuel <= 0) {
        window.engineOn = false;
        updateEngineIndicator();
        addToScreen('⛽ Нет топлива для запуска');
    } else if (window.battery <= 0) {
        window.engineOn = false;
        updateEngineIndicator();
        addToScreen('⚡ Нет заряда батареи для запуска');
    }
    
    updateEngineSound();
}

// Функция полного сброса всех рычагов
function resetThrottles() {
    window.throttleEngine = 0;
    window.throttleBallast = 0;
    window.ballastSpeed = 0;
    window.speed = 0;
    window.depth = 0;
    window.pressure = 0;
    window.shipHeading = 0;

    // Добавляем сброс навигации
    if (typeof resetNavigation === 'function') {
        resetNavigation();
    }

    updateThrottleDisplay();
    updateMiniInstruments();
    drawMiniCompass();
}

// Подключаем обработчики к кнопкам
document.addEventListener('DOMContentLoaded', function() {
    // Находим кнопки тумблеров
    const engineUp = document.getElementById('throttle-engine-up');
    const engineDown = document.getElementById('throttle-engine-down');
    const ballastUp = document.getElementById('throttle-ballast-up');
    const ballastDown = document.getElementById('throttle-ballast-down');
    
    // Добавляем обработчики
    if (engineUp) engineUp.addEventListener('click', throttleEngineUp);
    if (engineDown) engineDown.addEventListener('click', throttleEngineDown);
    if (ballastUp) ballastUp.addEventListener('click', throttleBallastUp);
    if (ballastDown) ballastDown.addEventListener('click', throttleBallastDown);
    
    // Обработчик для кнопки двигателя (lever4)
    document.getElementById('lever4').addEventListener('click', function() {
        setTimeout(onEngineToggle, 50);
    });
});
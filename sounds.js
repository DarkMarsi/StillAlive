// sounds.js - управление звуками

// Создаем объект для хранения всех звуков
window.gameSounds = {};

// Функция для загрузки и настройки звуков
function initSounds() {
    // Проверяем, поддерживает ли браузер аудио
    if (!window.Audio) {
        console.warn("Аудио не поддерживается");
        return;
    }

    // Фоновый звук воды (зацикленный)
    try {
        // Звук воды (появится после контракта)
        window.gameSounds.water = new Audio('sounds/water-ambient.ogg');
        window.gameSounds.water.loop = true;
        window.gameSounds.water.volume = 0.2;
        
        window.gameSounds.click = new Audio('sounds/click.wav');
        window.gameSounds.click.volume = 0.4;
        
        window.gameSounds.alarm = new Audio('sounds/alarm.wav');
        window.gameSounds.alarm.loop = false;
        window.gameSounds.alarm.volume = 0.7;
        
        // Звук всплытия/погружения (для балласта)
        window.gameSounds.ballast = new Audio('sounds/ballast.mp3');
        window.gameSounds.ballast.loop = true;
        window.gameSounds.ballast.volume = 0.3;
        
        // Звук двигателя
        window.gameSounds.engine = new Audio('sounds/engine-hum.ogg');
        window.gameSounds.engine.loop = true;
        window.gameSounds.engine.volume = 0.3;
        
        console.log("Звуки загружены:", window.gameSounds);
        
    } catch (e) {
        console.error("Ошибка загрузки звуков:", e);
    }
    
    console.log("Звуки инициализированы. Ожидание подписания контракта...");
}

// Функция для запуска воды (вызывается после подписания контракта)
function startWaterAmbient() {
    if (window.gameSounds.water) {
        window.gameSounds.water.play().catch(e => {
            console.warn("Не удалось запустить воду:", e);
        });
    }
}

// Функция для запуска звука двигателя
function startEngineSound() {
    if (window.gameSounds.engine) {
        if (window.engineOn && window.throttleEngine !== 0) {
            window.gameSounds.engine.play().catch(e => {});
        } else {
            window.gameSounds.engine.pause();
            window.gameSounds.engine.currentTime = 0;
        }
    }
}

// Функция для запуска звука балласта
function startBallastSound() {
    if (window.gameSounds.ballast) {
        if (window.throttleBallast !== 0) {
            window.gameSounds.ballast.play().catch(e => {});
        } else {
            window.gameSounds.ballast.pause();
            window.gameSounds.ballast.currentTime = 0;
        }
    }
}

// Функция для воспроизведения звука по имени
function playSound(soundName) {
    if (window.gameSounds && window.gameSounds[soundName]) {
        // Для кликов нужно создавать копию
        if (soundName === 'click') {
            let clickSound = window.gameSounds.click.cloneNode();
            clickSound.volume = window.gameSounds.click.volume;
            clickSound.play().catch(e => {
                console.warn("Не удалось воспроизвести клик");
            });
        } else {
            window.gameSounds[soundName].play().catch(e => { 
                console.warn("Не удалось воспроизвести звук:", soundName);
            });
        }
    } else {
        console.warn("Звук не найден:", soundName);
    }
}

// Загружаем звуки при загрузке страницы
initSounds();
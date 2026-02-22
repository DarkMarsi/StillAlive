// sounds.js - управление звуками

// Создаем объект для хранения всех звуков
window.gameSounds = {};

// Переменные для плавного изменения громкости
window.targetEngineVolume = 0;
window.targetBallastVolume = 0;
window.targetWaterVolume = 0.2; // начальная громкость воды

// Функция для загрузки и настройки звуков
function initSounds() {
    // Проверяем, поддерживает ли браузер аудио
    if (!window.Audio) {
        console.warn("Аудио не поддерживается");
        return;
    }

    try {
        // Звук воды (фоновый)
        window.gameSounds.water = new Audio('sounds/water-ambient.ogg');
        window.gameSounds.water.loop = true;
        window.gameSounds.water.volume = 0;
        
        // Звук клика
        window.gameSounds.click = new Audio('sounds/click.wav');
        window.gameSounds.click.volume = 0.4;
        
        // Звук тревоги (всегда создаем новый при воспроизведении)
        window.gameSounds.alarm = new Audio('sounds/alarm.wav');
        window.gameSounds.alarm.volume = 0.7;
        
        // Звук балласта
        window.gameSounds.ballast = new Audio('sounds/ballast.mp3');
        window.gameSounds.ballast.loop = true;
        window.gameSounds.ballast.volume = 0;
        
        // Звук двигателя
        window.gameSounds.engine = new Audio('sounds/engine-hum.ogg');
        window.gameSounds.engine.loop = true;
        window.gameSounds.engine.volume = 0;
        
        console.log("Звуки загружены");
        
    } catch (e) {
        console.error("Ошибка загрузки звуков:", e);
    }
}

// Функция для плавного изменения громкости
function fadeSound(soundName, targetVolume, duration = 1000) {
    if (!window.gameSounds[soundName]) return;
    
    const sound = window.gameSounds[soundName];
    const startVolume = sound.volume;
    const steps = 20; // количество шагов
    const stepTime = duration / steps;
    const volumeStep = (targetVolume - startVolume) / steps;
    let currentStep = 0;
    
    // Если звук не играет и targetVolume > 0, запускаем его
    if (targetVolume > 0 && sound.paused) {
        sound.play().catch(e => console.warn("Не удалось запустить звук:", soundName));
    }
    
    const interval = setInterval(() => {
        currentStep++;
        const newVolume = startVolume + (volumeStep * currentStep);
        sound.volume = Math.max(0, Math.min(1, newVolume));
        
        if (currentStep >= steps) {
            clearInterval(interval);
            // Если целевая громкость 0, останавливаем звук
            if (targetVolume === 0) {
                sound.pause();
                sound.currentTime = 0;
            }
        }
    }, stepTime);
}

// Функция для запуска воды
function startWaterAmbient() {
    window.targetWaterVolume = 0.2;
    fadeSound('water', 0.2, 2000); // плавно включаем за 2 секунды
}

// Функция для обновления звука двигателя
function updateEngineSound() {
    // Проверяем, должен ли двигатель работать
    const shouldBeOn = window.engineOn && 
                      window.throttleEngine !== 0 && 
                      window.fuel > 0 && 
                      window.battery > 0 &&
                      isEngineWorking();
    
    window.targetEngineVolume = shouldBeOn ? 0.3 : 0;
    fadeSound('engine', window.targetEngineVolume, 1500);
}

// Функция для обновления звука балласта
function updateBallastSound() {
    const shouldBeOn = window.throttleBallast !== 0 && 
                      window.battery > 0 &&
                      isBallastWorking();
    
    window.targetBallastVolume = shouldBeOn ? 0.3 : 0;
    fadeSound('ballast', window.targetBallastVolume, 1500);
}

// Функция для воспроизведения звука по имени
function playSound(soundName) {
    if (soundName === 'alarm') {
        // Для тревоги всегда создаем новую копию
        let alarmSound = new Audio('sounds/alarm.wav');
        alarmSound.volume = 0.7;
        alarmSound.play().catch(e => console.warn("Не удалось воспроизвести тревогу"));
        
    } else if (soundName === 'click') {
        // Для клика тоже создаем копию
        let clickSound = new Audio('sounds/click.wav');
        clickSound.volume = 0.4;
        clickSound.play().catch(e => {});
        
    } else if (window.gameSounds && window.gameSounds[soundName]) {
        window.gameSounds[soundName].play().catch(e => {});
    }
}

// Загружаем звуки
initSounds();

// Запускаем фоновую воду при загрузке (но с нулевой громкостью)
setTimeout(() => {
    if (window.gameSounds.water) {
        window.gameSounds.water.play().catch(e => {});
    }
}, 1000);
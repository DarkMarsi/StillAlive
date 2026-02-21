function updateEngineIndicator() {
    const indicator = document.getElementById('engine-indicator');
    const light = indicator.querySelector('.indicator-light');
    if (window.engineOn) {
        light.textContent = '🟢';
        light.style.color = '#5f874a';
    } else {
        light.textContent = '🔴';
        light.style.color = '#b84a4a';
    }
}

function updateSonarIndicator() {
    const indicator = document.getElementById('sonar-indicator');
    const light = indicator.querySelector('.indicator-light');
    if (window.sonarOn) {
        light.textContent = '🟢';
        light.style.color = '#5f874a';
    } else {
        light.textContent = '🔴';
        light.style.color = '#b84a4a';
    }
    // Добавляем обновление индикатора стелс
    updateStealthIndicator();
}

function updateReactorIndicator() {
    const indicator = document.getElementById('reactor-indicator');
    const light = indicator.querySelector('.indicator-light');
    if (window.reactorOn) {
        light.textContent = '🟢';
        light.style.color = '#5f874a';
    } else {
        light.textContent = '🔴';
        light.style.color = '#b84a4a';
    }
}

// Функция обновления индикатора стелс
function updateStealthIndicator() {
    const indicator = document.getElementById('stealth-indicator');
    if (!indicator) return;
    
    const light = indicator.querySelector('.indicator-light');
    if (!window.sonarOn) {
        // Режим стелс активен (радар выключен)
        light.textContent = '🟢';
        light.style.color = '#5f874a';
        indicator.querySelector('.indicator-label').textContent = 'СТЕЛС';
    } else {
        // Радар включен - невидимость отключена
        light.textContent = '🔴';
        light.style.color = '#b84a4a';
        indicator.querySelector('.indicator-label').textContent = 'РАДАР';
    }
}

function addToScreen(message) {
    window.messageHistory.push(message);
    if (document.getElementById('tab-terminal').classList.contains('active')) {
        window.screen.innerHTML = window.screen.innerHTML + '<br>> ' + message;
        window.screen.scrollTop = window.screen.scrollHeight;
    }
}

function updateDisplay() {
    console.log('updateDisplay called', window.fuel, window.oxygen, window.battery);
    
    // Обновляем текст ресурсов
    if (window.fuelDisplay) {
        window.fuelDisplay.textContent = Math.floor(window.fuel) + '%';
    }
    if (window.oxygenDisplay) {
        window.oxygenDisplay.textContent = Math.floor(window.oxygen) + '%';
    }
    if (window.batteryDisplay) {
        window.batteryDisplay.textContent = Math.floor(window.battery) + '%';
    }
    
    // Обновляем шкалы
    const fuelGauge = document.getElementById('fuel-gauge');
    if (fuelGauge) {
        fuelGauge.style.width = window.fuel + '%';
    }
    
    const oxygenGauge = document.getElementById('oxygen-gauge');
    if (oxygenGauge) {
        oxygenGauge.style.width = window.oxygen + '%';
    }
    
    const batteryGauge = document.getElementById('battery-gauge');
    if (batteryGauge) {
        batteryGauge.style.width = window.battery + '%';
    }
    
    // Шкала корпуса
    const hullGauge = document.getElementById('hull-gauge');
    if (hullGauge) {
        hullGauge.style.width = window.hull + '%';
    }
    
    const hullValue = document.getElementById('hull-value');
    if (hullValue) {
        hullValue.textContent = Math.floor(window.hull) + '%';
    }
    
    // Обновляем время
    let minutes = window.time % 60;
    let hours = Math.floor(window.time / 60);
    if (window.timeDisplay) {
        window.timeDisplay.textContent = `ВРЕМЯ: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} | ДЕНЬ ${window.day}`;
    }
}

function showModalWindow(html) {
    const modalDiv = document.createElement('div');
    modalDiv.innerHTML = html;
    modalDiv.className = 'signal-message-container';
    document.body.appendChild(modalDiv);
    
    const modal = modalDiv.querySelector('.signal-message');
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    
    modalDiv.querySelector('.signal-message-close').addEventListener('click', function() {
        modalDiv.remove();
    });
    
    setTimeout(() => {
        document.addEventListener('click', function closeModal(e) {
            if (!modalDiv.contains(e.target)) {
                modalDiv.remove();
                document.removeEventListener('click', closeModal);
            }
        });
    }, 100);
}

// Функция рисования круглого прибора (универсальная для маленьких)
function drawMiniInstrument(canvasId, value, min = 0, max = 100, unit = '') {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 3;
    
    // Внешний круг
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = '#5f874a';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Рисуем стрелку
    const startAngle = -Math.PI * 0.8;
    const endAngle = Math.PI * 0.8;
    const angleRange = endAngle - startAngle;
    const valueAngle = startAngle + (value / max) * angleRange;
    
    let color = '#5f874a';
    if (value < 30) color = '#b84a4a';
    else if (value < 60) color = '#d4af37';
    
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    const arrowX = centerX + Math.sin(valueAngle) * (radius - 2);
    const arrowY = centerY - Math.cos(valueAngle) * (radius - 2);
    ctx.lineTo(arrowX, arrowY);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    
    // Центральная точка
    ctx.fillStyle = '#5f874a';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 2, 0, Math.PI * 2);
    ctx.fill();
}

// Функция рисования компаса (в стиле других мини-приборов)
function drawMiniCompass() {
    const canvas = document.getElementById('compass-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 3;
    
    // Внешний круг (как у других приборов)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = '#5f874a';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Рисуем стрелку (как у других приборов)
    const angleRad = (window.shipHeading * Math.PI) / 180;
    
    // Используем ту же логику углов, что и в drawMiniInstrument
    const startAngle = -Math.PI * 0.8;
    const endAngle = Math.PI * 0.8;
    const angleRange = endAngle - startAngle;
    const valueAngle = startAngle + (window.shipHeading / 360) * angleRange;
    
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    const arrowX = centerX + Math.sin(valueAngle) * (radius - 2);
    const arrowY = centerY - Math.cos(valueAngle) * (radius - 2);
    ctx.lineTo(arrowX, arrowY);
    ctx.strokeStyle = '#b84a4a';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    
    // Маленькие метки сторон света
    ctx.fillStyle = '#5f874a';
    ctx.font = '5px Courier New';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Север (0°)
    ctx.fillText('N', centerX, centerY - radius + 5);
    // Юг (180°)
    ctx.fillText('S', centerX, centerY + radius - 5);
    // Запад (270°)
    ctx.fillText('W', centerX - radius + 5, centerY);
    // Восток (90°)
    ctx.fillText('E', centerX + radius - 5, centerY);
    
    // Центральная точка (как у других приборов)
    ctx.fillStyle = '#5f874a';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 2, 0, Math.PI * 2);
    ctx.fill();
}

// Обновляем все мини-приборы
function updateMiniInstruments() {
    drawMiniCompass();
    drawMiniInstrument('speed-canvas', window.speed, 0, 30);
    drawMiniInstrument('depth-canvas', window.depth, 0, 500);
    drawMiniInstrument('pressure-instrument-canvas', window.pressure, 0, 100);
    
    // Обновляем значения
    document.getElementById('speed-value').textContent = Math.floor(window.speed);
    document.getElementById('depth-value').textContent = Math.floor(window.depth);
    document.getElementById('pressure-instrument-value').textContent = Math.floor(window.pressure);
}

// Запускаем обновление
setInterval(updateMiniInstruments, 100);
// Функция поворота налево
function turnLeft() {
    if (!window.engineOn) {
        addToScreen('⛔ Двигатель выключен, поворот невозможен');
        return;
    }
    if (!isEngineWorking()) {
        addToScreen('⛔ Двигатель повреждён, поворот невозможен');
        return;
    }
    
    window.shipHeading = (window.shipHeading - 15 + 360) % 360;
    drawMiniCompass();
    addToScreen(`🧭 Курс изменён: ${window.shipHeading}°`);
}

// Функция поворота направо
function turnRight() {
    if (!window.engineOn) {
        addToScreen('⛔ Двигатель выключен, поворот невозможен');
        return;
    }
    if (!isEngineWorking()) {
        addToScreen('⛔ Двигатель повреждён, поворот невозможен');
        return;
    }
    
    window.shipHeading = (window.shipHeading + 15) % 360;
    drawMiniCompass();
    addToScreen(`🧭 Курс изменён: ${window.shipHeading}°`);
}

// Создание кнопки перехода
let transitionButton = null;

function updateTransitionButton() {
    // Проверяем, находится ли игрок на клетке перехода
    checkTransitionCell();
    
    if (window.showTransitionButton) {
        // Если кнопки еще нет, создаем
        if (!transitionButton) {
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'transition-button-container';
            buttonContainer.id = 'transition-button-container';
            buttonContainer.innerHTML = `
                <button class="transition-button" id="transition-button">
                    🚪 ПЕРЕЙТИ В РЕГИОН ${window.currentRegion + 1}
                </button>
            `;
            document.body.appendChild(buttonContainer);
            
            transitionButton = document.getElementById('transition-button');
            transitionButton.addEventListener('click', showTransitionDialog);
        }
    } else {
        // Если кнопка есть, удаляем
        if (transitionButton) {
            const container = document.getElementById('transition-button-container');
            if (container) container.remove();
            transitionButton = null;
        }
    }
}
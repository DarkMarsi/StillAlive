// script.js
document.addEventListener('DOMContentLoaded', function() {
    
    // === СОЗДАЕМ ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ===
    window.deathScreenShown = false; // чтобы экран смерти не показывался дважды
    window.gamePaused = true;

    window.fuel = 100;
    window.oxygen = 100;
    window.pressure = 0;
    window.battery = 100;
    window.hull = 100;  // целостность корпуса
    window.day = 1;
    window.time = 0;
    window.gameOver = false;
    window.fuelWarningShown = false;
    window.generatorWorking = true;
    window.oxygenGeneratorWorking = true;
    window.batteryDrainRate = 0.5;
    window.oxygenDrainRate = 0.3;
    window.lowBatteryWarning = false;
    window.pressureWarning = false;
    window.noBatteryPressureWarning = false;
    window.messageHistory = [];
    
    // === РЕГИОНЫ ===
    window.currentRegion = 1;
    window.showTransitionButton = false;
    window.transitionCells = [];
    window.TOTAL_REGIONS = 5; // сделаем глобальной

    window.signalsList = [];
    window.signalIdCounter = 0;
    
    window.inventory = new Array(40).fill(null);
    
    window.engineOn = false;
    window.sonarOn = false;
    window.reactorOn = false;
    // Курс корабля (в градусах, 0 = север)
    window.shipHeading = 0;
        // Новые параметры
    window.speed = 0;      // скорость в узлах
    window.depth = 0;      // глубина в метрах

        // НОВЫЕ ПЕРЕМЕННЫЕ ДЛЯ НАВИГАЦИИ
    window.positionX = 0;  // текущая позиция по X (-1000 до 1000, 0 = центр клетки)
    window.positionY = 0;  // текущая позиция по Y (-1000 до 1000, 0 = центр клетки)
    window.cellSize = 1000; // размер клетки в метрах

    window.moduleEngine = 100;
    window.moduleReactor = 100;
    window.moduleBattery = 100;
    window.moduleBallast = 100;
    window.moduleLifeSupport = 100;
    window.moduleHull = 100;
    window.moduleSonar = 100;
    window.modulePumps = 100;
    window.moduleRudders = 100;
    window.moduleRadio = 100;
    window.moduleCooling = 100;

    // === КАРТА ===
    window.MAP_ROWS = 21;
    window.MAP_COLS = 21;
    
    window.TILE_TYPES = {
        UNDISCOVERED: '?',
        EMPTY: ' ',
        VISITED: '•',
        CURRENT: '⏺'
    };
    
    window.gameMap = [];
    window.playerRow = 10;
    window.playerCol = 10;

    // === НАХОДИМ ВСЕ ЭЛЕМЕНТЫ ===
    window.fuelDisplay = document.getElementById('fuel-value');
    window.oxygenDisplay = document.getElementById('oxygen-value');
    window.batteryDisplay = document.getElementById('battery-value');
    window.screen = document.getElementById('screen');
    window.timeDisplay = document.querySelector('.time-display');
    
    window.lever1 = document.getElementById('lever1');
    window.lever2 = document.getElementById('lever2');
    window.lever3 = document.getElementById('lever3');
    window.lever4 = document.getElementById('lever4');
    window.lever5 = document.getElementById('lever5');
    window.lever6 = document.getElementById('lever6');
    window.leverA = document.getElementById('leverA');
    window.leverB = document.getElementById('leverB');
    window.leverC = document.getElementById('leverC');
    window.resetBtn = document.getElementById('reset-btn');
    
    // === СОНАР ===
    window.canvas = document.getElementById('sonar-canvas');
    window.ctx = canvas.getContext('2d');
    window.sonarAngle = 0;

    window.messageInput = document.getElementById('message-input');
    window.sendBtn = document.getElementById('send-btn');

    window.tabTerminal = document.getElementById('tab-terminal');
    window.tabInventory = document.getElementById('tab-inventory');
    window.tabModules = document.getElementById('tab-modules');
    window.tabSignals = document.getElementById('tab-signals');
    window.tabMap = document.getElementById('tab-map');


    // === ФУНКЦИИ ===
    window.formatGameTime = function(minutes) {
        let hours = Math.floor(minutes / 60) % 24;
        let mins = minutes % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    }

    function switchTab(tabName) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        if (tabName === 'terminal') tabTerminal.classList.add('active');
        if (tabName === 'inventory') tabInventory.classList.add('active');
        if (tabName === 'modules') tabModules.classList.add('active');
        if (tabName === 'signals') tabSignals.classList.add('active');
        if (tabName === 'map') tabMap.classList.add('active');
        
        if (tabName === 'terminal') {
            screen.innerHTML = '> СИСТЕМА ЗАПУЩЕНА...';
            for (let msg of messageHistory) {
                screen.innerHTML = screen.innerHTML + '<br>> ' + msg;
            }
            screen.scrollTop = screen.scrollHeight;
        } else if (tabName === 'inventory') {
            renderInventory();       
        } else if (tabName === 'modules') {
            let modulesHTML = `
                <div class="modules-scheme">
                    <svg class="modules-lines" width="100%" height="100%" style="position: absolute; top: 0; left: 0; pointer-events: none;">
                        <line x1="15%" y1="15%" x2="35%" y2="15%" stroke="#8bc34a" stroke-width="1.5" stroke-dasharray="5,3"/>
                        <line x1="35%" y1="15%" x2="55%" y2="15%" stroke="#8bc34a" stroke-width="1.5" stroke-dasharray="5,3"/>
                        <line x1="55%" y1="15%" x2="75%" y2="15%" stroke="#8bc34a" stroke-width="1.5" stroke-dasharray="5,3"/>
                        
                        <line x1="15%" y1="45%" x2="35%" y2="45%" stroke="#8bc34a" stroke-width="1.5" stroke-dasharray="5,3"/>
                        <line x1="35%" y1="45%" x2="55%" y2="45%" stroke="#8bc34a" stroke-width="1.5" stroke-dasharray="5,3"/>
                        <line x1="55%" y1="45%" x2="75%" y2="45%" stroke="#8bc34a" stroke-width="1.5" stroke-dasharray="5,3"/>
                        
                        <line x1="15%" y1="75%" x2="35%" y2="75%" stroke="#8bc34a" stroke-width="1.5" stroke-dasharray="5,3"/>
                        <line x1="35%" y1="75%" x2="55%" y2="75%" stroke="#8bc34a" stroke-width="1.5" stroke-dasharray="5,3"/>
                        <line x1="55%" y1="75%" x2="75%" y2="75%" stroke="#8bc34a" stroke-width="1.5" stroke-dasharray="5,3"/>
                        
                        <line x1="15%" y1="15%" x2="15%" y2="45%" stroke="#8bc34a" stroke-width="1.5" stroke-dasharray="5,3"/>
                        <line x1="15%" y1="45%" x2="15%" y2="75%" stroke="#8bc34a" stroke-width="1.5" stroke-dasharray="5,3"/>
                        
                        <line x1="35%" y1="15%" x2="35%" y2="45%" stroke="#8bc34a" stroke-width="1.5" stroke-dasharray="5,3"/>
                        <line x1="35%" y1="45%" x2="35%" y2="75%" stroke="#8bc34a" stroke-width="1.5" stroke-dasharray="5,3"/>
                        
                        <line x1="55%" y1="15%" x2="55%" y2="45%" stroke="#8bc34a" stroke-width="1.5" stroke-dasharray="5,3"/>
                        <line x1="55%" y1="45%" x2="55%" y2="75%" stroke="#8bc34a" stroke-width="1.5" stroke-dasharray="5,3"/>
                        
                        <line x1="75%" y1="15%" x2="75%" y2="45%" stroke="#8bc34a" stroke-width="1.5" stroke-dasharray="5,3"/>
                        <line x1="75%" y1="45%" x2="75%" y2="75%" stroke="#8bc34a" stroke-width="1.5" stroke-dasharray="5,3"/>
                    </svg>
                    
                    <div class="module-card" style="top: 8%; left: 12%;">
                        <div class="module-name">⚙️ ДВИГАТЕЛЬ</div>
                        <div class="module-health" id="module-engine">100%</div>
                    </div>
                    
                    <div class="module-card" style="top: 8%; left: 32%;">
                        <div class="module-name">☢️ РЕАКТОР</div>
                        <div class="module-health" id="module-reactor">100%</div>
                    </div>
                    
                    <div class="module-card" style="top: 8%; left: 52%;">
                        <div class="module-name">🔋 БАТАРЕЯ</div>
                        <div class="module-health" id="module-battery">100%</div>
                    </div>
                    
                    <div class="module-card" style="top: 8%; left: 72%;">
                        <div class="module-name">💧 БАЛЛАСТ</div>
                        <div class="module-health" id="module-ballast">100%</div>
                    </div>
                    
                    <div class="module-card" style="top: 38%; left: 12%;">
                        <div class="module-name">💔 ЖИЗНЕОБЕСП</div>
                        <div class="module-health" id="module-life">100%</div>
                    </div>
                    
                    <div class="module-card" style="top: 38%; left: 32%;">
                        <div class="module-name">🛡️ КОРПУС</div>
                        <div class="module-health" id="module-hull">100%</div>
                    </div>
                    
                    <div class="module-card" style="top: 38%; left: 52%;">
                        <div class="module-name">📡 ГИДРОАКУСТ</div>
                        <div class="module-health" id="module-sonar">100%</div>
                    </div>
                    
                    <div class="module-card" style="top: 38%; left: 72%;">
                        <div class="module-name">💦 НАСОСЫ</div>
                        <div class="module-health" id="module-pumps">100%</div>
                    </div>
                    
                    <div class="module-card" style="top: 68%; left: 12%;">
                        <div class="module-name">🧭 КАНТЫ</div>
                        <div class="module-health" id="module-rudders">100%</div>
                    </div>
                    
                    <div class="module-card" style="top: 68%; left: 32%;">
                        <div class="module-name">📻 СВЯЗЬ</div>
                        <div class="module-health" id="module-radio">100%</div>
                    </div>
                    
                    <div class="module-card" style="top: 68%; left: 52%;">
                        <div class="module-name">❄️ ОХЛАЖД</div>
                        <div class="module-health" id="module-cooling">100%</div>
                    </div>
                    
                    <div class="module-card" style="top: 68%; left: 72%;">
                        <div class="module-name">⚡ ДОП</div>
                        <div class="module-health" id="module-aux">100%</div>
                    </div>
                </div>
            `;
            
            screen.innerHTML = modulesHTML;
            
            setTimeout(() => {
                document.getElementById('module-engine').parentElement.addEventListener('click', () => 
                    showModuleMenu('ДВИГАТЕЛЬ', 'engine', moduleEngine));
                document.getElementById('module-reactor').parentElement.addEventListener('click', () => 
                    showModuleMenu('РЕАКТОР', 'reactor', moduleReactor));
                document.getElementById('module-battery').parentElement.addEventListener('click', () => 
                    showModuleMenu('БАТАРЕЯ', 'battery', moduleBattery));
                document.getElementById('module-ballast').parentElement.addEventListener('click', () => 
                    showModuleMenu('БАЛЛАСТ', 'ballast', moduleBallast));
                document.getElementById('module-life').parentElement.addEventListener('click', () => 
                    showModuleMenu('ЖИЗНЕОБЕСП', 'life', moduleLifeSupport));
                document.getElementById('module-hull').parentElement.addEventListener('click', () => 
                    showModuleMenu('КОРПУС', 'hull', moduleHull));
                document.getElementById('module-sonar').parentElement.addEventListener('click', () => 
                    showModuleMenu('ГИДРОАКУСТИКА', 'sonar', moduleSonar));
                document.getElementById('module-pumps').parentElement.addEventListener('click', () => 
                    showModuleMenu('НАСОСЫ', 'pumps', modulePumps));
                document.getElementById('module-rudders').parentElement.addEventListener('click', () => 
                    showModuleMenu('РУЛИ', 'rudders', moduleRudders));
                document.getElementById('module-radio').parentElement.addEventListener('click', () => 
                    showModuleMenu('СВЯЗЬ', 'radio', moduleRadio));
                document.getElementById('module-cooling').parentElement.addEventListener('click', () => 
                    showModuleMenu('ОХЛАЖДЕНИЕ', 'cooling', moduleCooling));
                document.getElementById('module-aux').parentElement.addEventListener('click', () => 
                    showModuleMenu('ДОП. СИСТЕМЫ', 'aux', 100));
            }, 100);
        } else if (tabName === 'signals') {
            showSignalsTab();
        } else if (tabName === 'map') {
            renderMap();
        }
    }

    tabTerminal.addEventListener('click', () => switchTab('terminal'));
    tabInventory.addEventListener('click', () => switchTab('inventory'));
    tabModules.addEventListener('click', () => switchTab('modules'));
    tabSignals.addEventListener('click', () => switchTab('signals'));
    tabMap.addEventListener('click', () => switchTab('map'));

    switchTab('terminal');

    // === ФУНКЦИЯ РИСОВАНИЯ СОНАРА ===
    function drawSonar() {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        let centerX = canvas.width / 2;
        let centerY = canvas.height / 2;
        let maxRadius = Math.min(centerX, centerY) - 5;

        ctx.beginPath();
        ctx.arc(centerX, centerY, maxRadius, 0, Math.PI * 2);
        ctx.strokeStyle = '#5f874a';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.lineWidth = 0.5;
        for (let i = 1; i <= 3; i++) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, (maxRadius / 4) * i, 0, Math.PI * 2);
            ctx.strokeStyle = '#5f874a';
            ctx.stroke();
        }

        ctx.beginPath();
        ctx.moveTo(centerX - maxRadius, centerY);
        ctx.lineTo(centerX + maxRadius, centerY);
        ctx.moveTo(centerX, centerY - maxRadius);
        ctx.lineTo(centerX, centerY + maxRadius);
        ctx.strokeStyle = '#5f874a';
        ctx.stroke();

        sonarAngle -= 0.12;
        if (sonarAngle < 0) sonarAngle += Math.PI * 2;

        let arrowX = centerX + Math.sin(sonarAngle) * maxRadius;
        let arrowY = centerY + Math.cos(sonarAngle) * maxRadius;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(arrowX, arrowY);
        ctx.strokeStyle = '#5f874a';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#5f874a';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 2, 0, Math.PI * 2);
        ctx.fill();
    }

    setInterval(drawSonar, 50);

    // === ОБРАБОТЧИКИ КНОПОК ===
    lever1.addEventListener('click', function() {
        playSound('click');
        if (fuel >= 10) {
            fuel = fuel - 10;
            pressure = pressure + 5;
            battery = Math.max(0, battery - 2);
            addToScreen('⚙️ Рычаг 1 активирован: давление растет...');
            if (Math.random() < 0.1) {
                addToScreen('💧 СТРАННЫЙ ЗВУК ИЗ ПЕРЕБОРОК...');
                oxygen = oxygen - 5;
            }
        } else {
            addToScreen('⛔ НЕТ ТОПЛИВА! Рычаг бесполезен');
        }
        updateDisplay();
        checkGameOver();
    });

    lever2.addEventListener('click', function() {
        playSound('click');
        if (battery >= 10) {
            pressure = Math.max(0, pressure - 15);
            battery = Math.max(0, battery - 10);
            oxygen = Math.max(0, oxygen - 3);
            addToScreen('🔧 Аварийный сброс давления! Батарея падает...');
        } else {
            addToScreen('⚡ НЕДОСТАТОЧНО ЗАРЯДА ДЛЯ АВАРИЙНОГО ТУМБЛЕРА');
        }
        updateDisplay();
        checkGameOver();
    });

    lever3.addEventListener('click', function() {
        playSound('click');
        addToScreen('🔘 Рычаг 3 нажат');
        addItemToInventory({ name: 'Металлолом', icon: '🔩', description: 'Восстанавливает 20% корпуса', canDrop: true, canUse: true });
    });

    lever4.addEventListener('click', function() {
        playSound('click');
        engineOn = !engineOn;
        updateEngineIndicator();
        addToScreen(engineOn ? '🔧 Двигатель включён' : '🔧 Двигатель выключен');
    });

    lever5.addEventListener('click', function() {
        playSound('click');
        sonarOn = !sonarOn;
        updateSonarIndicator();
        addToScreen(sonarOn ? '📡 Сонар включён' : '📡 Сонар выключен');
    });

    lever6.addEventListener('click', function() {
        playSound('click');
        reactorOn = !reactorOn;
        updateReactorIndicator();
        addToScreen(reactorOn ? '☢️ Реактор включён' : '☢️ Реактор выключен');
    });

    leverA.addEventListener('click', () => addToScreen('🔘 Кнопка A нажата'));
    leverB.addEventListener('click', () => addToScreen('🔘 Кнопка B нажата'));
    leverC.addEventListener('click', () => addToScreen('🔘 Кнопка C нажата'));

    resetBtn.addEventListener('click', function() {
        playSound('click');
        window.gamePaused = true;

        fuel = 100;
        oxygen = 100;
        pressure = 0;
        battery = 100;
        hull = 100;
        day = 1;
        time = 0;
        
        resetThrottles(); // сброс рычагов
        
        generatorWorking = true;
        oxygenGeneratorWorking = true;
        lowBatteryWarning = false;
        pressureWarning = false;
        noBatteryPressureWarning = false;
        
        messageHistory = [];
        signalsList = [];
        signalIdCounter = 0;
        inventory = new Array(40).fill(null);
        
        addStartItems();
        
        // Сброс региона
        window.currentRegion = 1;
        if (typeof generateRegion === 'function') {
            generateRegion(window.currentRegion);
        }
        
        engineOn = false;
        sonarOn = false;
        reactorOn = false;
        updateEngineIndicator();
        updateSonarIndicator();
        updateReactorIndicator();
        
        screen.innerHTML = '> СИСТЕМА ПЕРЕЗАПУЩЕНА...';
        addToScreen('НОВАЯ МИССИЯ НАЧАТА');
        
        updateDisplay();
        
        if (document.getElementById('tab-map').classList.contains('active')) {
            renderMap();
        }

        // Показываем контракт заново
        if (typeof showStartMenu === 'function') {
            showStartMenu();
        }
    });

        // Кнопки управления курсом
        const headingLeft = document.getElementById('heading-left');
        const headingRight = document.getElementById('heading-right');

        if (headingLeft) {
            headingLeft.addEventListener('click', function() {
                playSound('click');
                turnLeft();
            });
        }

        if (headingRight) {
            headingRight.addEventListener('click', function() {
                playSound('click');
                turnRight();
            });
        }

    sendBtn.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendMessage();
    });

    function sendMessage() {
        let message = messageInput.value.trim();
        if (message !== '') {
            addToScreen('📝 ' + message);
            messageInput.value = '';
        }
    }

    // === ГЛАВНЫЙ ТАЙМЕР ===
    setInterval(function() {
        if (gameOver) return;
        if (window.gamePaused) return; // Если игра на паузе - ничего не делаем

        generatorWorking = fuel > 0;
        oxygenGeneratorWorking = battery > 10;

        if (reactorOn) {
            if (fuel > 0) {
                battery = Math.min(100, battery + 0.3);
                fuel = Math.max(0, fuel - 0.2);
                generatorWorking = true;
                
                // Сбрасываем предупреждение о топливе, если оно появилось, но теперь топливо есть
                if (fuelWarningShown && fuel > 0) {
                    fuelWarningShown = false;
                }
            } else {
                battery = Math.max(0, battery - batteryDrainRate);
                generatorWorking = false;
                if (!fuelWarningShown) {
                    fuelWarningShown = true;
                    playSound('alarm');
                    addToScreen('⛽ ТОПЛИВО ЗАКОНЧИЛОСЬ! РЕАКТОР ОСТАНОВЛЕН');
                }
            }
        } else {
            battery = Math.max(0, battery - batteryDrainRate);
            generatorWorking = false;
        }

        if (oxygenGeneratorWorking) {
            oxygen = Math.max(0, oxygen - 0.2);
            // Сбрасываем предупреждение о батарее, если батарея восстановилась
            if (battery > 10 && lowBatteryWarning) {
                lowBatteryWarning = false;
            }
        } else {
            oxygen = Math.max(0, oxygen - oxygenDrainRate * 2);
            if (battery <= 10 && !lowBatteryWarning) {
                lowBatteryWarning = true;
                playSound('alarm');
                addToScreen('⚠️ НИЗКИЙ ЗАРЯД БАТАРЕИ! СИСТЕМА ОЧИСТКИ ВОЗДУХА ОТКЛЮЧЕНА');
            }
        }

        if (fuel <= 0 && pressure < 100) {
            pressure = Math.min(100, pressure + 0.2);
            if (pressure > 80 && !pressureWarning) {
                pressureWarning = true;
                playSound('alarm');
                addToScreen('💢 КРИТИЧЕСКОЕ ДАВЛЕНИЕ! КОРПУС СКРИПИТ');
            }
        } else if (fuel > 0 && pressure > 0) {
            pressure = Math.max(0, pressure - 0.1);
            // Сбрасываем предупреждение о давлении, если давление упало
            if (pressure <= 80 && pressureWarning) {
                pressureWarning = false;
            }
        }

        // Логика глубины и давления

        // Работа балласта с плавным изменением скорости
        if (isBallastWorking() && window.battery > 0) {
            // Если балласт в нейтрали (throttleBallast = 0), скорость стремится к 0
            if (window.throttleBallast === 0) {
                if (window.ballastSpeed > 0) {
                    window.ballastSpeed = Math.max(0, window.ballastSpeed - 0.5);
                } else if (window.ballastSpeed < 0) {
                    window.ballastSpeed = Math.min(0, window.ballastSpeed + 0.5);
                }
            }
            
            // Применяем скорость к глубине
            if (Math.abs(window.ballastSpeed) > 0.1) {
                window.depth = Math.max(0, Math.min(1000, window.depth + window.ballastSpeed));
                
                // Расход батареи от работы балласта
                window.battery = Math.max(0, window.battery - Math.abs(window.ballastSpeed) / 20);
            }
        } else {
            // Если балласт сломан или нет батареи, скорость падает до 0
            if (window.ballastSpeed > 0) {
                window.ballastSpeed = Math.max(0, window.ballastSpeed - 0.5);
            } else if (window.ballastSpeed < 0) {
                window.ballastSpeed = Math.min(0, window.ballastSpeed + 0.5);
            }
            
            if (!isBallastWorking() && Math.abs(window.ballastSpeed) > 0.1) {
                addToScreen('💧 БАЛЛАСТ НЕ РАБОТАЕТ!');
            }
            if (window.battery <= 0 && Math.abs(window.ballastSpeed) > 0.1) {
                addToScreen('⚡ НЕТ БАТАРЕИ ДЛЯ БАЛЛАСТА!');
            }
        }
        // Округляем глубину для отображения
        window.depth = Math.round(window.depth);

        // Расчёт давления (глубина влияет на давление)
        let targetPressure = Math.floor(window.depth / 10);
        targetPressure = Math.min(100, targetPressure);

        if (window.pressure < targetPressure) {
            window.pressure = Math.min(targetPressure, window.pressure + 0.5);
        } else if (window.pressure > targetPressure) {
            window.pressure = Math.max(targetPressure, window.pressure - 0.5);
        }

        // Проверка глубины и повреждение корпуса
        if (window.depth > window.MAX_SAFE_DEPTH) {
            let damage = (window.depth - window.MAX_SAFE_DEPTH) / 30;
            window.hull = Math.max(0, window.hull - damage);
            
            if (window.hull <= 0 && !window.gameOver) {
                window.gameOver = true;
                addToScreen('💀 КОРПУС РАЗРУШЕН ДАВЛЕНИЕМ');
            }
            
            if (window.hull < 30 && !window.pressureWarning) {
                window.pressureWarning = true;
                playSound('alarm');
                addToScreen('⚠️ КРИТИЧЕСКОЕ СОСТОЯНИЕ КОРПУСА!');
            }
        } else {
            // Сбрасываем предупреждение о корпусе, если глубина безопасная
            if (window.hull >= 30 && window.pressureWarning) {
                window.pressureWarning = false;
            }
        }

                if (window.gameOver && !window.deathScreenShown) {
            window.deathScreenShown = true;
            showDeathScreen();
        }

        // Автоматическое отключение двигателя при отсутствии топлива или батареи
if (window.engineOn) {
    if (window.fuel <= 0) {
        window.engineOn = false;
        updateEngineIndicator();
        updateEngineSound();
        addToScreen('⛽ Топливо кончилось! Двигатель отключён');
    } else if (window.battery <= 0) {
        window.engineOn = false;
        updateEngineIndicator();
        updateEngineSound();
        addToScreen('⚡ Батарея разряжена! Двигатель отключён');
    } else if (!isEngineWorking()) {
        window.engineOn = false;
        updateEngineIndicator();
        updateEngineSound();
        addToScreen('💔 Двигатель повреждён!');
    }
}

        // Если двигатель выключен, но рычаг не в нуле - плавно сбрасываем скорость
        if (!window.engineOn && window.throttleEngine !== 0) {
            // Плавно уменьшаем скорость до 0
            if (window.throttleEngine > 0) {
                window.throttleEngine = Math.max(0, window.throttleEngine - 0.1);
            } else if (window.throttleEngine < 0) {
                window.throttleEngine = Math.min(0, window.throttleEngine + 0.1);
            }
            
            // Округляем до целого числа для отображения
            if (Math.abs(window.throttleEngine) < 0.2) {
                window.throttleEngine = 0;
            }
            
            updateThrottleDisplay();
        }

        // Обновляем звук двигателя (вызывается каждый тик для плавности)
        updateEngineSound();
        updateBallastSound();

        if (window.engineOn && window.throttleEngine !== 0 && isEngineWorking() && window.fuel > 0) {
            updatePosition();
        }
        
        //сканирование радаром после каждого движения
        if (typeof scanSurroundings === 'function') {
            scanSurroundings();
        }

        // Проверка нахождения на клетке перехода
        if (typeof updateTransitionButton === 'function') {
            updateTransitionButton();
        }

        time++;

        if (time % 30 === 0) {
            day++;
            addToScreen(`📅 НАСТУПИЛ ДЕНЬ ${day}`);
        }

        if (time % 10 === 0 && time > 0) {
            let events = [
                "📡 ПЕРЕХВАТЧЕН СТРАННЫЙ СИГНАЛ...",
                "🌊 ШУМ ВОДЫ УСИЛИВАЕТСЯ",
                "⚡ СКАЧОК НАПРЯЖЕНИЯ",
                "👻 ТЕНЬ ЗА ИЛЛЮМИНАТОРОМ?"
            ];
            let randomEvent = events[Math.floor(Math.random() * events.length)];
            addToScreen(randomEvent);

            if (randomEvent.includes("СИГНАЛ")) {
                //playSound('signal');
                addSignal('ПЕРЕХВАТЧЕННЫЙ СИГНАЛ', 'Неопознанный сигнал на частоте 47.3 МГц\nИсточник: неизвестен\nСодержание: [ЗАШУМЛЕНО]');
            }
        }

        updateDisplay();

        if (oxygen <= 0 && !gameOver) {
            gameOver = true;
            addToScreen('💀❌❌❌❌❌❌❌❌❌❌');
            addToScreen('КИСЛОРОД ЗАКОНЧИЛСЯ. ВЫ ЗАДОХНУЛИСЬ.');
        }
    }, 2000);

    addToScreen('ВСЕ СИСТЕМЫ В НОМИНАЛЕ. УДАЧИ.');
    
    setTimeout(() => {
        if (typeof addStartItems === 'function') {
            addStartItems();
        }
    }, 1000);
    
    setTimeout(() => addSignal('АВАРИЙНЫЙ СИГНАЛ', 'Обнаружен неопознанный объект по курсу 47\nГлубина 320м\nДистанция 5.7км'), 5000);
    setTimeout(() => addSignal('СООБЩЕНИЕ ОТ БАЗЫ', 'Внимание! В вашем районе зафиксирована повышенная активность.\nБудьте осторожны.'), 10000);

    updateDisplay();

        // Добавь это в script.js, например после updateDisplay()
    function checkGameOver() {
        if (window.oxygen <= 0) {
            window.gameOver = true;
            addToScreen('💀❌❌❌❌❌❌❌❌❌❌');
            addToScreen('КИСЛОРОД ЗАКОНЧИЛСЯ. ВЫ ЗАДОХНУЛИСЬ.');
        }
        if (window.hull <= 0) {
            window.gameOver = true;
            addToScreen('💀❌❌❌❌❌❌❌❌❌❌');
            addToScreen('КОРПУС РАЗРУШЕН. ВЫ ПОГИБЛИ.');
        }
    }
    
    updateEngineIndicator();
    updateSonarIndicator();
    updateReactorIndicator();
        // Инициализация компаса
    setTimeout(() => {
        updateMiniInstruments();
    }, 100);
    
    // Инициализация карты после загрузки всех функций
    setTimeout(() => {
        if (typeof generateRegion === 'function') {
            generateRegion(window.currentRegion);
        }
    }, 200);
    
    function showFinalMessage() {
        if (!gameOver) {
            gameOver = true;
            addToScreen('══════════════════════════════');
            addToScreen(`✨ ВЫ ВЫЖИЛИ ${day} ДНЕЙ ✨`);
            addToScreen('══════════════════════════════');
        }
    }
});
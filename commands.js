// commands.js - система команд терминала

// База данных команд
window.COMMANDS = {
    'help': {
        name: 'help',
        description: 'Показать все команды',
        usage: 'help [команда]',
        action: function(args) {
            if (args.length > 0) {
                // Показать справку по конкретной команде
                const cmd = args[0].toLowerCase();
                if (window.COMMANDS[cmd]) {
                    const c = window.COMMANDS[cmd];
                    addToScreen(`╔════════════════════════════════╗`);
                    addToScreen(`  КОМАНДА: ${c.name}`);
                    addToScreen(`  ОПИСАНИЕ: ${c.description}`);
                    addToScreen(`  ИСПОЛЬЗОВАНИЕ: ${c.usage}`);
                    addToScreen(`╚════════════════════════════════╝`);
                } else {
                    addToScreen(`❌ Неизвестная команда: ${cmd}`);
                }
            } else {
                // Показать список всех команд
                addToScreen(`╔════════════════════════════════╗`);
                addToScreen(`  ДОСТУПНЫЕ КОМАНДЫ:`);
                addToScreen(`  ════════════════════════`);
                
                const commandList = Object.keys(window.COMMANDS).sort();
                commandList.forEach(cmd => {
                    const c = window.COMMANDS[cmd];
                    addToScreen(`  ${cmd.padEnd(12)} - ${c.description}`);
                });
                
                addToScreen(`╚════════════════════════════════╝`);
                addToScreen(`Введите 'help [команда]' для подробностей`);
            }
        }
    },
    
    'dock': {
        name: 'dock',
        description: 'Пристыковаться к ближайшей станции',
        usage: 'dock',
        action: function() {
            if (window.showLocationButton && window.currentLocation) {
                showLocationDialog(window.currentLocation);
                addToScreen(`✅ Стыковка с: ${window.currentLocation.name}`);
            } else {
                addToScreen(`❌ В этом районе нет доступных мест для стыковки`);
            }
        }
    },
    
    'scan': {
        name: 'scan',
        description: 'Запустить сканирование',
        usage: 'scan',
        action: function() {
            if (window.sonarOn) {
                if (typeof scanSurroundings === 'function') {
                    scanSurroundings();
                    addToScreen(`📡 Сканирование завершено`);
                }
            } else {
                addToScreen(`❌ Сонар выключен. Используйте рычаг II для активации`);
            }
        }
    },
    
    'status': {
        name: 'status',
        description: 'Показать статус корабля',
        usage: 'status',
        action: function() {
            addToScreen(`╔════════════════════════════════╗`);
            addToScreen(`  СТАТУС КОРАБЛЯ:`);
            addToScreen(`  ════════════════════════`);
            addToScreen(`  ТОПЛИВО:   ${Math.floor(window.fuel)}%`);
            addToScreen(`  КИСЛОРОД:  ${Math.floor(window.oxygen)}%`);
            addToScreen(`  БАТАРЕЯ:   ${Math.floor(window.battery)}%`);
            addToScreen(`  КОРПУС:    ${Math.floor(window.hull)}%`);
            addToScreen(`  ГЛУБИНА:   ${Math.floor(window.depth)}м`);
            addToScreen(`  СКОРОСТЬ:  ${window.speed} узлов`);
            addToScreen(`  КУРС:      ${window.shipHeading}°`);
            addToScreen(`  ПОЗИЦИЯ:   ${String.fromCharCode(65 + window.playerCol)}${window.playerRow + 1}`);
            addToScreen(`╚════════════════════════════════╝`);
        }
    },
    
    'modules': {
        name: 'modules',
        description: 'Показать состояние модулей',
        usage: 'modules',
        action: function() {
            addToScreen(`╔════════════════════════════════╗`);
            addToScreen(`  СОСТОЯНИЕ МОДУЛЕЙ:`);
            addToScreen(`  ════════════════════════`);
            addToScreen(`  ДВИГАТЕЛЬ:     ${window.moduleEngine}%`);
            addToScreen(`  РЕАКТОР:       ${window.moduleReactor}%`);
            addToScreen(`  БАТАРЕЯ:       ${window.moduleBattery}%`);
            addToScreen(`  БАЛЛАСТ:       ${window.moduleBallast}%`);
            addToScreen(`  ЖИЗНЕОБЕСП:    ${window.moduleLifeSupport}%`);
            addToScreen(`  СОНАР:         ${window.moduleSonar}%`);
            addToScreen(`  КОРПУС:        ${window.moduleHull}%`);
            addToScreen(`  НАСОСЫ:        ${window.modulePumps}%`);
            addToScreen(`  СВЯЗЬ:         ${window.moduleRadio}%`);
            addToScreen(`╚════════════════════════════════╝`);
        }
    },
    
    'time': {
        name: 'time',
        description: 'Показать текущее время',
        usage: 'time',
        action: function() {
            const hours = Math.floor(window.time / 60);
            const minutes = window.time % 60;
            addToScreen(`📅 ДЕНЬ ${window.day} | ВРЕМЯ: ${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}`);
        }
    },
    
    'clear': {
        name: 'clear',
        description: 'Очистить терминал',
        usage: 'clear',
        action: function() {
            window.screen.innerHTML = '> ТЕРМИНАЛ ОЧИЩЕН';
            window.messageHistory = [];
        }
    },
    
    'coords': {
        name: 'coords',
        description: 'Показать текущие координаты',
        usage: 'coords',
        action: function() {
            addToScreen(`📍 ГЛОБАЛЬНЫЕ: X=${Math.round(window.globalX)}м, Y=${Math.round(window.globalY)}м`);
            addToScreen(`📍 ЛОКАЛЬНЫЕ:  X=${Math.round(window.positionX)}м, Y=${Math.round(window.positionY)}м`);
            addToScreen(`📍 КЛЕТКА:   ${String.fromCharCode(65 + window.playerCol)}${window.playerRow + 1}`);
        }
    },
    
    'engine': {
        name: 'engine',
        description: 'Включить/выключить двигатель',
        usage: 'engine [on/off]',
        action: function(args) {
            if (args.length === 0) {
                addToScreen(`⚙️ Двигатель ${window.engineOn ? 'ВКЛЮЧЕН' : 'ВЫКЛЮЧЕН'}`);
                return;
            }
            
            const state = args[0].toLowerCase();
            if (state === 'on') {
                if (!window.engineOn) {
                    window.engineOn = true;
                    updateEngineIndicator();
                    addToScreen('⚙️ Двигатель запущен');
                } else {
                    addToScreen('⚙️ Двигатель уже работает');
                }
            } else if (state === 'off') {
                if (window.engineOn) {
                    window.engineOn = false;
                    updateEngineIndicator();
                    addToScreen('⚙️ Двигатель остановлен');
                } else {
                    addToScreen('⚙️ Двигатель уже остановлен');
                }
            } else {
                addToScreen(`❌ Использование: engine [on/off]`);
            }
        }
    },
    
    'sonar': {
        name: 'sonar',
        description: 'Включить/выключить сонар',
        usage: 'sonar [on/off]',
        action: function(args) {
            if (args.length === 0) {
                addToScreen(`📡 Сонар ${window.sonarOn ? 'ВКЛЮЧЕН' : 'ВЫКЛЮЧЕН'}`);
                return;
            }
            
            const state = args[0].toLowerCase();
            if (state === 'on') {
                if (!window.sonarOn) {
                    window.sonarOn = true;
                    updateSonarIndicator();
                    addToScreen('📡 Сонар активирован');
                } else {
                    addToScreen('📡 Сонар уже активен');
                }
            } else if (state === 'off') {
                if (window.sonarOn) {
                    window.sonarOn = false;
                    updateSonarIndicator();
                    addToScreen('📡 Сонар деактивирован');
                } else {
                    addToScreen('📡 Сонар уже выключен');
                }
            } else {
                addToScreen(`❌ Использование: sonar [on/off]`);
            }
        }
    },
    
    'heading': {
        name: 'heading',
        description: 'Установить или показать текущий курс',
        usage: 'heading [градусы]',
        action: function(args) {
            if (args.length === 0) {
                addToScreen(`🧭 Текущий курс: ${window.shipHeading}°`);
                return;
            }
            
            if (!window.engineOn) {
                addToScreen('❌ Двигатель должен быть включен для изменения курса');
                return;
            }
            
            const degrees = parseInt(args[0]);
            if (isNaN(degrees) || degrees < 0 || degrees > 359) {
                addToScreen('❌ Курс должен быть от 0 до 359 градусов');
                return;
            }
            
            window.shipHeading = degrees;
            drawMiniCompass();
            addToScreen(`🧭 Курс установлен на ${window.shipHeading}°`);
        }
    },
    
    'speed': {
        name: 'speed',
        description: 'Установить или показать текущую скорость',
        usage: 'speed [0-4]',
        action: function(args) {
            if (args.length === 0) {
                addToScreen(`⚙️ Текущая скорость: ${window.speed} узлов (положение: ${window.throttleEngine})`);
                return;
            }
            
            if (!window.engineOn) {
                addToScreen('❌ Двигатель должен быть включен для изменения скорости');
                return;
            }
            
            const level = parseInt(args[0]);
            if (isNaN(level) || level < 0 || level > 4) {
                addToScreen('❌ Уровень скорости должен быть от 0 до 4');
                return;
            }
            
            window.throttleEngine = level;
            window.speed = window.ENGINE_SPEEDS[level];
            updateThrottleDisplay();
            addToScreen(`⚙️ Скорость установлена на ${window.speed} узлов`);
        }
    },
    
    'depth': {
        name: 'depth',
        description: 'Показать текущую глубину',
        usage: 'depth',
        action: function() {
            addToScreen(`🌊 Текущая глубина: ${Math.floor(window.depth)}м`);
            if (window.depth > window.MAX_SAFE_DEPTH) {
                addToScreen(`⚠️ ВНИМАНИЕ: Превышена безопасная глубина!`);
            }
        }
    },
    
    'inventory': {
        name: 'inventory',
        description: 'Показать инвентарь',
        usage: 'inventory',
        action: function() {
            switchTab('inventory');
        }
    },
    
    'map': {
        name: 'map',
        description: 'Показать карту',
        usage: 'map',
        action: function() {
            switchTab('map');
        }
    },
    
    'signals': {
        name: 'signals',
        description: 'Показать входящие сигналы',
        usage: 'signals',
        action: function() {
            switchTab('signals');
        }
    },

    'drone': {
        name: 'drone',
        description: 'Отправить дрон для сбора ресурсов',
        usage: 'drone',
        action: function() {
            if (window.showLocationButton && window.currentLocation) {
                if (window.currentLocation.type === window.LOCATION_TYPES.DRONE) {
                    showLocationDialog(window.currentLocation);
                } else {
                    addToScreen('❌ В этой локации нельзя использовать дрон');
                }
            } else {
                addToScreen('❌ Нет доступных локаций для дрона');
            }
        }
    },

    'examine': {
        name: 'examine',
        description: 'Осмотреть текущую локацию',
        usage: 'examine',
        action: function() {
            if (window.showLocationButton && window.currentLocation) {
                let typeText = '';
                switch(window.currentLocation.type) {
                    case window.LOCATION_TYPES.DOCK:
                        typeText = '🟢 Стыковочная станция';
                        break;
                    case window.LOCATION_TYPES.DRONE:
                        typeText = '🟡 Ресурсная зона';
                        break;
                    case window.LOCATION_TYPES.HAZARDOUS:
                        typeText = '🔴 Опасная зона';
                        break;
                    default:
                        typeText = '⚪ Пустая зона';
                }
                addToScreen(`📍 Локация: ${window.currentLocation.name}`);
                addToScreen(`📋 Тип: ${typeText}`);
                addToScreen(`📏 Расстояние: ${Math.round(getDistanceToLocation())}м`);
            } else {
                addToScreen('❌ Рядом нет локаций');
            }
        }
    },
    
    'quit': {
        name: 'quit',
        description: 'Выйти в главное меню',
        usage: 'quit',
        action: function() {
            if (confirm('Вернуться в главное меню? Весь прогресс будет потерян.')) {
                window.gamePaused = true;
                showStartMenu();
            }
        }
    }
};

// Функция обработки команд
function processCommand(input) {
    if (!input || input.trim() === '') return;
    
    // Разбираем ввод на команду и аргументы
    const parts = input.trim().split(' ');
    const cmdName = parts[0].toLowerCase();
    const args = parts.slice(1);
    
    // Ищем команду
    const command = window.COMMANDS[cmdName];
    
    if (command) {
        // Выполняем команду
        command.action(args);
    } else {
        // Неизвестная команда
        addToScreen(`❌ Команда не найдена: '${cmdName}'. Введите /help для списка команд.`);
    }
}


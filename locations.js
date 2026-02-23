// locations.js - система точек интереса внутри клеток

// Типы локаций
window.LOCATION_TYPES = {
    EMPTY: 'empty',              // Пустая, без взаимодействия
    DOCK: 'dock',                // Можно пристыковаться
    DRONE: 'drone',              // Можно отправить дрон
    HAZARDOUS: 'hazardous'       // Опасно, требует осторожности
};

// Список пустых локаций (без взаимодействия)
const EMPTY_LOCATIONS = [
    // Природные образования
    "Коралловый риф",
    "Каменный риф",
    "Мертвый риф",
    "Коралловое поле",
    "Подводный лес",
    "Грязевые холмы",
    "Скалистый гребень",
    "Песчаная равнина",
    "Илистое дно",
    "Поле валунов",
    "Впадина",
    "Глубоководный желоб",
    "Подводный каньон",
    "Подводная долина",
    "Соляной купол",
    "Ледяной шельф",
    "Термальное поле",
    "Грязевые гейзеры",
    "Подводный вулкан (спящий)",
    
    // Флора и фауна
    "Лес водорослей",
    "Биолюминесцентное поле",
    "Кладбище морских животных",
    "Кости гиганта",
    "Труп левиафана",
    
    // Пустые и атмосферные
    "Зона тишины",
    "Мираж",
    "Пустой туннель"
];

// Список локаций для стыковки (жилые, безопасные сооружения)
const DOCK_LOCATIONS = [
    "Аванпост жилой",
    "Охранный пост",
    "Рыболовный пост",
    "Верфь",
    "Работающая исследовательская база",
    "Маяк",
    "Механик (мастерская)",
    "Шлюз-бункер"
];

// Список локаций для сбора дроном (ресурсные точки, обломки)
const DRONE_LOCATIONS = [
    "Заброшенная исследовательская база (затоплена)",
    "Аванпост затонувший",
    "Старое хранилище",
    "Кораблекрушение крупное",
    "Сбежавшие заключенные (корабль)",
    "Обломки",
    "Выпавший груз",
    "Контрабанда (схрон)",
    "Свалка старого оборудования",
    "Кладбище кораблей",
    "Затопленная вышка",
    "Покинутая буровая",
    "Сломанный буй",
    "Тросы и якоря",
    "Ржавая ферма",
    "Обломки спутника"
];

// Список опасных локаций (нужно быть осторожным)
const HAZARDOUS_LOCATIONS = [
    "Отшельник (жилище) - может быть опасно",
    "Таинственный незнакомец (убежище)",
    "Наркоманы и безумцы (лагерь)",
    "Затонувший город",
    "Неизвестное сооружение",
    "Древние руины",
    "Храм бездны",
    "Затопленная лаборатория",
    "Криокамера",
    "Подводные мины",
    "Морское чудовище (спящее)",
    "Сильное течение",
    "Подводный оползень",
    "Сероводородный источник",
    "Кислотное облако",
    "Магнитная аномалия",
    "Разлом коры",
    "Охота (стая)"
];

// Функция для определения типа локации по названию
function getLocationType(name) {
    if (DOCK_LOCATIONS.includes(name)) return window.LOCATION_TYPES.DOCK;
    if (DRONE_LOCATIONS.includes(name)) return window.LOCATION_TYPES.DRONE;
    if (HAZARDOUS_LOCATIONS.includes(name)) return window.LOCATION_TYPES.HAZARDOUS;
    return window.LOCATION_TYPES.EMPTY;
}

// Генерация точек интереса для клетки
function generateLocationsForTile(tile, row, col) {
    // Определяем, будет ли клетка иметь локацию (70% шанс)
    const hasLocation = Math.random() < 0.7;
    
    if (!hasLocation) {
        tile.isEmpty = true;
        tile.locations = null;
        return tile;
    }
    
    // Выбираем тип локации с вероятностями
    const rand = Math.random();
    let locationList;
    let locationType;
    
    if (rand < 0.4) { // 40% - пустые
        locationList = EMPTY_LOCATIONS;
        locationType = window.LOCATION_TYPES.EMPTY;
    } else if (rand < 0.6) { // 20% - стыковка
        locationList = DOCK_LOCATIONS;
        locationType = window.LOCATION_TYPES.DOCK;
    } else if (rand < 0.85) { // 25% - дрон
        locationList = DRONE_LOCATIONS;
        locationType = window.LOCATION_TYPES.DRONE;
    } else { // 15% - опасные
        locationList = HAZARDOUS_LOCATIONS;
        locationType = window.LOCATION_TYPES.HAZARDOUS;
    }
    
    // Выбираем название локации
    let locationName = locationList[Math.floor(Math.random() * locationList.length)];
    
    // Генерируем 9 точек в клетке (сетка 3x3) с случайным смещением
    const points = [];
    const cellSize = window.cellSize || 1000;
    const step = cellSize / 3;
    const maxOffset = 100;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            let baseX = step/2 + i * step;
            let baseY = step/2 + j * step;
            
            let offsetX = (Math.random() * 2 - 1) * maxOffset;
            let offsetY = (Math.random() * 2 - 1) * maxOffset;
            
            let x = Math.round(Math.min(950, Math.max(50, baseX + offsetX)));
            let y = Math.round(Math.min(950, Math.max(50, baseY + offsetY)));
            
            points.push({ x, y, visited: false });
        }
    }

    // Сортируем точки по расстоянию от центра
    points.sort((a, b) => {
        const distA = Math.sqrt(Math.pow(a.x - 500, 2) + Math.pow(a.y - 500, 2));
        const distB = Math.sqrt(Math.pow(b.x - 500, 2) + Math.pow(b.y - 500, 2));
        return distA - distB;
    });
    
    // Выбираем активную точку
    let activePointIndex;
    const randPoint = Math.random();
    
    if (randPoint < 0.4) activePointIndex = Math.floor(Math.random() * 3);
    else if (randPoint < 0.7) activePointIndex = 3 + Math.floor(Math.random() * 3);
    else activePointIndex = 6 + Math.floor(Math.random() * 3);
    
    // Сохраняем данные в клетке
    tile.isEmpty = false;
    tile.locations = {
        points: points,
        activePointIndex: activePointIndex,
        name: locationName,
        type: locationType,
        discovered: false
    };

    tile.locationCoords = {
        x: points[activePointIndex].x,
        y: points[activePointIndex].y
    };
    
    return tile;
}

// Проверка, находится ли игрок в зоне активной точки
function checkLocationProximity() {
    if (!window.gameMap || window.playerRow === undefined) return false;
    
    const currentTile = window.gameMap[window.playerRow][window.playerCol];
    if (!currentTile.locations || !currentTile.locations.discovered) return false;
    
    const activePoint = currentTile.locations.points[currentTile.locations.activePointIndex];
    
    const pointGlobalX = window.playerCol * window.cellSize + activePoint.x;
    const pointGlobalY = window.playerRow * window.cellSize + activePoint.y;
    
    const distance = Math.sqrt(
        Math.pow(window.globalX - pointGlobalX, 2) + 
        Math.pow(window.globalY - pointGlobalY, 2)
    );
    
    const inRange = distance < 100;
    
    if (inRange && !window.showLocationButton) {
        window.showLocationButton = true;
        window.currentLocation = currentTile.locations;
        updateLocationButton();
    } else if (!inRange && window.showLocationButton) {
        window.showLocationButton = false;
        window.currentLocation = null;
        updateLocationButton();
    }
    
    return inRange;
}

// Обновление кнопки локации
function updateLocationButton() {
    const existingButton = document.getElementById('location-button-container');
    
    if (window.showLocationButton && window.currentLocation) {
        if (!existingButton) {
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'location-button-container';
            buttonContainer.id = 'location-button-container';
            
            // Определяем цвет кнопки в зависимости от типа локации
            let buttonColor = '#5f874a'; // зеленый по умолчанию
            let buttonText = '';
            
            switch(window.currentLocation.type) {
                case window.LOCATION_TYPES.DOCK:
                    buttonColor = '#4a9e5a'; // ярко-зеленый
                    buttonText = '🚀 ДОСТУПНА СТЫКОВКА';
                    break;
                case window.LOCATION_TYPES.DRONE:
                    buttonColor = '#d4af37'; // золотой
                    buttonText = '🎮 ДОСТУПЕН СБОР ДРОНОМ';
                    break;
                case window.LOCATION_TYPES.HAZARDOUS:
                    buttonColor = '#d06b6b'; // красный
                    buttonText = '⚠️ ОПАСНАЯ ЗОНА';
                    break;
                default:
                    buttonColor = '#5f874a';
                    buttonText = '👁️ ЗОНА НАБЛЮДЕНИЯ';
            }
            
            buttonContainer.innerHTML = `
                <button class="location-button" id="location-button" style="
                    background-color: #1a1a1a;
                    border: 2px solid ${buttonColor};
                    color: ${buttonColor};
                    font-family: 'Courier New', monospace;
                    font-size: 12px;
                    font-weight: bold;
                    padding: 6px 12px;
                    cursor: pointer;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    box-shadow: 0 0 15px ${buttonColor}80;
                ">
                    ${buttonText}: ${window.currentLocation.name}
                </button>
            `;
            
            document.body.appendChild(buttonContainer);
            
            document.getElementById('location-button').addEventListener('click', function() {
                showLocationDialog(window.currentLocation);
            });
        }
    } else if (existingButton) {
        existingButton.remove();
    }
}

// Показать диалог локации
function showLocationDialog(location) {
    let actionButton = '';
    let dialogText = '';
    
    switch(location.type) {
        case window.LOCATION_TYPES.DOCK:
            dialogText = 'Безопасная зона. Можно пристыковаться и отдохнуть.';
            actionButton = '<button class="location-btn" id="location-action">🚀 ПРИСТЫКОВАТЬСЯ</button>';
            break;
            
        case window.LOCATION_TYPES.DRONE:
            dialogText = 'Обнаружены ресурсы. Можно отправить дрон для сбора.';
            actionButton = '<button class="location-btn" id="location-action">🎮 ОТПРАВИТЬ ДРОН</button>';
            break;
            
        case window.LOCATION_TYPES.HAZARDOUS:
            dialogText = '⚠️ ОПАСНО! Рекомендуется соблюдать осторожность.';
            actionButton = '<button class="location-btn" id="location-action" style="border-color: #d06b6b; color: #d06b6b;">⚠️ ОСТОРОЖНО</button>';
            break;
            
        default:
            dialogText = 'Атмосферная зона. Наблюдение...';
    }
    
    const dialogHTML = `
        <div class="location-dialog">
            <div class="location-dialog-content">
                <div class="location-dialog-title">${location.name}</div>
                <div class="location-dialog-text">${dialogText}</div>
                <div class="location-dialog-buttons">
                    ${actionButton}
                    <button class="location-btn" id="location-close">ЗАКРЫТЬ</button>
                </div>
            </div>
        </div>
    `;
    
    const dialogDiv = document.createElement('div');
    dialogDiv.innerHTML = dialogHTML;
    dialogDiv.className = 'location-dialog-container';
    document.body.appendChild(dialogDiv);
    
    if (location.type === window.LOCATION_TYPES.DOCK) {
        document.getElementById('location-action').addEventListener('click', function() {
            dialogDiv.remove();
            addToScreen(`🚀 Стыковка с ${location.name}...`);
            // Здесь будет логика стыковки
            setTimeout(() => {
                addToScreen('✅ Стыковка завершена. Можно пополнить запасы.');
                // Восстанавливаем ресурсы
                window.fuel = Math.min(100, window.fuel + 20);
                window.oxygen = Math.min(100, window.oxygen + 20);
                window.battery = Math.min(100, window.battery + 20);
                updateDisplay();
            }, 2000);
        });
    }
    
    if (location.type === window.LOCATION_TYPES.DRONE) {
        document.getElementById('location-action').addEventListener('click', function() {
            dialogDiv.remove();
            addToScreen(`🎮 Отправляем дрон для сбора ресурсов в ${location.name}...`);
            // Здесь будет логика отправки дрона
            setTimeout(() => {
                const resources = ['Металлолом', 'Урановый стержень', 'Инструменты', 'Еда', 'Вода'];
                const randomResource = resources[Math.floor(Math.random() * resources.length)];
                let itemId = '';
                
                switch(randomResource) {
                    case 'Металлолом': itemId = 'SCRAP_METAL'; break;
                    case 'Урановый стержень': itemId = 'URANIUM_ROD'; break;
                    case 'Инструменты': itemId = 'TOOLS'; break;
                    case 'Еда': itemId = 'FOOD'; break;
                    case 'Вода': itemId = 'WATER'; break;
                }
                
                if (itemId && typeof createItem === 'function') {
                    addItemToInventory(createItem(itemId));
                    addToScreen(`✅ Дрон доставил: ${randomResource}`);
                }
            }, 3000);
        });
    }
    
    if (location.type === window.LOCATION_TYPES.HAZARDOUS) {
        document.getElementById('location-action').addEventListener('click', function() {
            dialogDiv.remove();
            addToScreen(`⚠️ Вы входите в опасную зону: ${location.name}`);
            // Здесь будет логика для опасных зон
            const damage = Math.floor(Math.random() * 10) + 5;
            window.hull = Math.max(0, window.hull - damage);
            addToScreen(`💥 Корпус повреждён на ${damage}%`);
            updateDisplay();
        });
    }
    
    document.getElementById('location-close').addEventListener('click', function() {
        dialogDiv.remove();
    });
}

// Получить расстояние до текущей локации
function getDistanceToLocation() {
    if (!window.currentLocation) return Infinity;
    
    const currentTile = window.gameMap[window.playerRow][window.playerCol];
    const activePoint = currentTile.locations.points[currentTile.locations.activePointIndex];
    
    const pointGlobalX = window.playerCol * window.cellSize + activePoint.x;
    const pointGlobalY = window.playerRow * window.cellSize + activePoint.y;
    
    return Math.sqrt(
        Math.pow(window.globalX - pointGlobalX, 2) + 
        Math.pow(window.globalY - pointGlobalY, 2)
    );
}
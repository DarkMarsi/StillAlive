// locations.js - система точек интереса внутри клеток

// Список пустых локаций (атмосферные, без интерактива)
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
    "Охота (стая)",
    "Кладбище морских животных",
    "Кости гиганта",
    "Труп левиафана",
    "Подводные мины",
    "Морское чудовище (спящее)",
    "Сильное течение",
    "Подводный оползень",
    "Сероводородный источник",
    "Кислотное облако",
    "Магнитная аномалия",
    "Разлом коры",
    "Зона тишины",
    "Мираж",
    
    // Техногенные и пустые
    "Покинутая буровая",
    "Сломанный буй",
    "Тросы и якоря",
    "Ржавая ферма",
    "Обломки спутника",
    "Свалка старого оборудования",
    "Кладбище кораблей",
    "Затопленная вышка",
    "Пустой туннель"
];

// Список непустых локаций (интерактивные)
const POPULATED_LOCATIONS = [
    "Аванпост жилой",
    "Аванпост затонувший",
    "Охранный пост",
    "Рыболовный пост",
    "Верфь",
    "Шлюз-бункер",
    "Работающая исследовательская база",
    "Заброшенная исследовательская база",
    "Старое хранилище",
    "Маяк",
    "Кораблекрушение крупное",
    "Сбежавшие заключенные (корабль)",
    "Обломки",
    "Выпавший груз",
    "Контрабанда (схрон)",
    "Отшельник (жилище)",
    "Механик (мастерская)",
    "Таинственный незнакомец (убежище)",
    "Наркоманы и безумцы (лагерь)",
    "Затонувший город",
    "Неизвестное сооружение",
    "Древние руины",
    "Храм бездны",
    "Затопленная лаборатория",
    "Криокамера"
];

// Генерация точек интереса для клетки
function generateLocationsForTile(tile, row, col) {
    // Определяем, пустая ли клетка
    // 50% шанс на пустую клетку, но не больше 5 подряд
    // 50% шанс на непустую, но не больше 2 подряд
    
    // Проверяем историю последних клеток
    const lastTileTypes = window.lastTileTypes || [];
    
    let isEmpty;
    
    if (lastTileTypes.filter(t => t === 'empty').length >= 5) {
        // Слишком много пустых подряд - делаем непустую
        isEmpty = false;
    } else if (lastTileTypes.filter(t => t === 'populated').length >= 2) {
        // Слишком много непустых подряд - делаем пустую
        isEmpty = true;
    } else {
        // Случайный выбор
        isEmpty = Math.random() < 0.5;
    }
    
    // Обновляем историю
    if (!window.lastTileTypes) window.lastTileTypes = [];
    window.lastTileTypes.push(isEmpty ? 'empty' : 'populated');
    if (window.lastTileTypes.length > 10) window.lastTileTypes.shift(); // храним последние 10
    
    // Запоминаем тип клетки для генерации следующей
    tile.isEmpty = isEmpty;
    
    // Генерируем 9 точек в клетке (сетка 3x3) с случайным смещением
    const points = [];
    const cellSize = window.cellSize || 1000; // размер клетки 1000 метров
    const step = cellSize / 3; // ~333.33 метра между точками

    // Добавляем случайное смещение для более естественного расположения
    // Максимальное смещение - 100 метров в любую сторону
    const maxOffset = 100;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            // Базовая позиция в узле сетки
            let baseX = step/2 + i * step;
            let baseY = step/2 + j * step;
            
            // Случайное смещение
            let offsetX = (Math.random() * 2 - 1) * maxOffset;
            let offsetY = (Math.random() * 2 - 1) * maxOffset;
            
            // Вычисляем финальные координаты с ограничением от 50 до 950
            // (чтобы точки не были слишком близко к краям)
            let x = Math.round(Math.min(950, Math.max(50, baseX + offsetX)));
            let y = Math.round(Math.min(950, Math.max(50, baseY + offsetY)));
            
            points.push({
                x: x,
                y: y,
                visited: false
            });
        }
    }

    // Сортируем точки по расстоянию от центра клетки (500,500)
    points.sort((a, b) => {
        const distA = Math.sqrt(Math.pow(a.x - 500, 2) + Math.pow(a.y - 500, 2));
        const distB = Math.sqrt(Math.pow(b.x - 500, 2) + Math.pow(b.y - 500, 2));
        return distA - distB;
    });
    
    // Выбираем активную точку не совсем случайно, а с приоритетом на центральные
    // Но с некоторой вариативностью
    let activePointIndex;
    const rand = Math.random();
    
    if (rand < 0.4) {
        // 40% - центральная зона (первые 3 точки)
        activePointIndex = Math.floor(Math.random() * 3);
    } else if (rand < 0.7) {
        // 30% - средняя зона (следующие 3 точки)
        activePointIndex = 3 + Math.floor(Math.random() * 3);
    } else {
        // 30% - дальняя зона (последние 3 точки)
        activePointIndex = 6 + Math.floor(Math.random() * 3);
    }
    
    // Выбираем название локации
    let locationName;
    let lastLocation = window.lastLocation || '';
    
    if (isEmpty) {
        // Пустая клетка - выбираем из списка пустых локаций
        // Но не больше 1 раза подряд одинаковую
        do {
            locationName = EMPTY_LOCATIONS[Math.floor(Math.random() * EMPTY_LOCATIONS.length)];
        } while (locationName === lastLocation && EMPTY_LOCATIONS.length > 1);
    } else {
        // Непустая клетка - выбираем из списка населенных
        do {
            locationName = POPULATED_LOCATIONS[Math.floor(Math.random() * POPULATED_LOCATIONS.length)];
        } while (locationName === lastLocation && POPULATED_LOCATIONS.length > 1);
    }
    
    window.lastLocation = locationName;
    
    // Сохраняем данные в клетке
    tile.locations = {
        points: points,
        activePointIndex: activePointIndex,
        name: locationName,
        isEmpty: isEmpty,
        discovered: false
    };

    // Сохраняем координаты активной точки для сообщения
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
    
    // Вычисляем глобальные координаты активной точки
    const pointGlobalX = window.playerCol * window.cellSize + activePoint.x;
    const pointGlobalY = window.playerRow * window.cellSize + activePoint.y;
    
    // Вычисляем расстояние до активной точки
    const distance = Math.sqrt(
        Math.pow(window.globalX - pointGlobalX, 2) + 
        Math.pow(window.globalY - pointGlobalY, 2)
    );
    
    // Если расстояние меньше 100 метров - показываем кнопку взаимодействия
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
            buttonContainer.style.cssText = `
                position: fixed;
                top: 20px;
                left: 20px;
                z-index: 2000;
                animation: locationPulse 1.5s infinite;
            `;
            
            buttonContainer.innerHTML = `
                <button class="location-button" id="location-button" style="
                    background-color: #1a1a1a;
                    border: 2px solid #5f874a;
                    color: #5f874a;
                    font-family: 'Courier New', monospace;
                    font-size: 12px;
                    font-weight: bold;
                    padding: 6px 12px;
                    cursor: pointer;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    box-shadow: 0 0 15px rgba(95,135,74,0.5);
                ">
                    🚀 ДОСТУПНА СТЫКОВКА: ${window.currentLocation.name}
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

// Показать диалог локации (заглушка, потом добавим интерактив)
function showLocationDialog(location) {
    const dialogHTML = `
        <div class="location-dialog">
            <div class="location-dialog-content">
                <div class="location-dialog-title">${location.isEmpty ? '🌊' : '🏭'} ${location.name}</div>
                <div class="location-dialog-text">
                    ${location.isEmpty ? 'Атмосферная зона. Наблюдение...' : 'Обнаружено поселение. Взаимодействие пока в разработке.'}
                </div>
                <div class="location-dialog-buttons">
                    <button class="location-btn" id="location-close">ЗАКРЫТЬ</button>
                </div>
            </div>
        </div>
    `;
    
    const dialogDiv = document.createElement('div');
    dialogDiv.innerHTML = dialogHTML;
    dialogDiv.className = 'location-dialog-container';
    dialogDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 3000;
    `;
    
    document.body.appendChild(dialogDiv);
    
    document.getElementById('location-close').addEventListener('click', function() {
        dialogDiv.remove();
    });
}

// Добавляем анимацию пульсации
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { opacity: 1; transform: translateX(-50%) scale(1); }
        50% { opacity: 0.8; transform: translateX(-50%) scale(1.05); }
        100% { opacity: 1; transform: translateX(-50%) scale(1); }
    }
`;
document.head.appendChild(style);
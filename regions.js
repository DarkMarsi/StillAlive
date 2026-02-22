// Количество регионов
const TOTAL_REGIONS = 5;

// Функция для генерации карты региона
function generateRegion(regionNumber) {
    // Проверяем, что MAP_ROWS и MAP_COLS существуют
    if (!window.MAP_ROWS || !window.MAP_COLS) {
        console.error('MAP_ROWS или MAP_COLS не определены');
        return;
    }
    
    // Очищаем карту
    window.gameMap = [];
    
    // Создаем карту со случайными типами клеток и локациями (ОДИН РАЗ!)
    for (let row = 0; row < window.MAP_ROWS; row++) {
        window.gameMap[row] = [];
        for (let col = 0; col < window.MAP_COLS; col++) {
            window.gameMap[row][col] = {
                discovered: false,
                visited: false,
                type: getRandomTileType(),
                event: null,
                resources: null,
                dangerLevel: 0
            };
            
            // Генерируем локации для клетки
            if (typeof generateLocationsForTile === 'function') {
                generateLocationsForTile(window.gameMap[row][col], row, col);
            }
        }
    }

    // Если это не последний регион, добавляем переходы (они перезаписывают тип клетки)
    if (regionNumber < TOTAL_REGIONS) {
        // Создаем 2 перехода в ВЕРХНЕМ ряду (самая верхняя строка)
        let exit1Col = Math.floor(Math.random() * (window.MAP_COLS / 2 - 2)) + 1;
        let exit2Col = Math.floor(Math.random() * (window.MAP_COLS / 2 - 2)) + Math.floor(window.MAP_COLS / 2);
        
        // Верхний ряд = первая строка (row = 0)
        window.gameMap[0][exit1Col].type = 'exit';
        window.gameMap[0][exit2Col].type = 'exit';
        
        window.transitionCells = [
            { row: 0, col: exit1Col },
            { row: 0, col: exit2Col }
        ];
    }
    
    // === ИСПРАВЛЕНО: начальная позиция ===
    // Строка MAP_ROWS - 1 = САМАЯ НИЖНЯЯ
    // Строка 0 = САМАЯ ВЕРХНЯЯ
    window.playerRow = window.MAP_ROWS - 1; // Ставим в самый низ
    window.playerCol = Math.floor(window.MAP_COLS / 2); // Центр по горизонтали

    // Глобальные координаты в центре этой клетки
    window.globalX = window.playerCol * window.cellSize + window.cellSize / 2;
    // ВНИЗУ (row = MAP_ROWS-1) -> Y должен быть БОЛЬШИМ
    window.globalY = window.playerRow * window.cellSize + window.cellSize / 2;

    // Локальные координаты в центре клетки
    window.positionX = window.cellSize / 2;
    window.positionY = window.cellSize / 2;

    // Открываем текущую клетку
    if (window.gameMap[window.playerRow] && window.gameMap[window.playerRow][window.playerCol]) {
        window.gameMap[window.playerRow][window.playerCol].discovered = true;
        window.gameMap[window.playerRow][window.playerCol].visited = true;
    }
    
    console.log('Регион сгенерирован:', regionNumber);
    console.log('Начальная позиция:', {row: window.playerRow, col: window.playerCol, globalY: window.globalY});
}

// Функция для проверки, находится ли игрок на клетке перехода
function checkTransitionCell() {
    if (!window.gameMap) return false;
    if (window.playerRow === undefined || window.playerCol === undefined) return false;
    
    let currentTile = window.gameMap[window.playerRow][window.playerCol];
    window.showTransitionButton = (currentTile && currentTile.type === 'exit');
    
    return window.showTransitionButton;
}

// Функция для отображения диалога перехода
function showTransitionDialog() {
    // Создаем диалоговое окно
    const dialogHTML = `
        <div class="transition-dialog">
            <div class="transition-dialog-content">
                <div class="transition-dialog-title">⚠️ ПЕРЕХОД В ДРУГОЙ РЕГИОН</div>
                <div class="transition-dialog-text">Вы уверены, что хотите перейти в регион ${window.currentRegion + 1}?</div>
                <div class="transition-dialog-text warning">Вернуться обратно будет нельзя!</div>
                <div class="transition-dialog-buttons">
                    <button class="transition-btn transition-btn-yes" id="transition-yes">ДА</button>
                    <button class="transition-btn transition-btn-no" id="transition-no">НЕТ</button>
                </div>
            </div>
        </div>
    `;
    
    const dialogDiv = document.createElement('div');
    dialogDiv.innerHTML = dialogHTML;
    dialogDiv.className = 'transition-dialog-container';
    document.body.appendChild(dialogDiv);
    
    // Обработчики кнопок
    document.getElementById('transition-yes').addEventListener('click', function() {
        dialogDiv.remove();
        goToNextRegion();
    });
    
    document.getElementById('transition-no').addEventListener('click', function() {
        dialogDiv.remove();
    });
}

// Функция перехода в следующий регион
function goToNextRegion() {
    if (window.currentRegion >= TOTAL_REGIONS) {
        addToScreen('✨ Это был последний регион! Вы победили!');
        return;
    }
    
    window.currentRegion++;
    addToScreen(`🌍 Переход в регион ${window.currentRegion}...`);
    
    // Генерируем новый регион
    generateRegion(window.currentRegion);
    
    // Обновляем карту
    if (document.getElementById('tab-map').classList.contains('active')) {
        renderMap();
    }
}
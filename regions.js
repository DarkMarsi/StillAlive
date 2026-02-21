// regions.js - управление регионами и переходами

// Текущий регион
window.currentRegion = 1;

// Количество регионов
const TOTAL_REGIONS = 5;

// Флаг для отображения кнопки перехода
window.showTransitionButton = false;

// Координаты переходов в текущем регионе
window.transitionCells = [];

// Функция для генерации карты региона
function generateRegion(regionNumber) {
    // Очищаем карту
    window.gameMap = [];
    
    // Создаем пустую карту
    for (let row = 0; row < window.MAP_ROWS; row++) {
        window.gameMap[row] = [];
        for (let col = 0; col < window.MAP_COLS; col++) {
            window.gameMap[row][col] = {
                discovered: false,
                visited: false,
                type: 'normal',
                event: null
            };
        }
    }
    
    // Если это не последний регион, добавляем переходы
    if (regionNumber < TOTAL_REGIONS) {
        // Создаем 2 перехода в верхнем ряду
        // Первый переход где-то в левой половине
        let exit1Col = Math.floor(Math.random() * (window.MAP_COLS / 2 - 2)) + 1;
        // Второй переход где-то в правой половине
        let exit2Col = Math.floor(Math.random() * (window.MAP_COLS / 2 - 2)) + window.MAP_COLS / 2;
        
        window.gameMap[0][exit1Col].type = 'exit';
        window.gameMap[0][exit2Col].type = 'exit';
        
        // Сохраняем координаты переходов
        window.transitionCells = [
            { row: 0, col: exit1Col },
            { row: 0, col: exit2Col }
        ];
    }
    
    // Устанавливаем начальную позицию внизу по центру
    window.playerRow = window.MAP_ROWS - 1;
    window.playerCol = Math.floor(window.MAP_COLS / 2);
    
    // Открываем текущую клетку
    window.gameMap[window.playerRow][window.playerCol].discovered = true;
    window.gameMap[window.playerRow][window.playerCol].visited = true;
    
    // Сбрасываем позицию в клетке
    window.positionX = 0;
    window.positionY = 0;
}

// Функция для проверки, находится ли игрок на клетке перехода
function checkTransitionCell() {
    if (!window.gameMap) return false;
    
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
    
    // Сбрасываем навигацию
    window.positionX = 0;
    window.positionY = 0;
    
    // Обновляем карту
    if (document.getElementById('tab-map').classList.contains('active')) {
        renderMap();
    }
}
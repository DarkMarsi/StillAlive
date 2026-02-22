// tileTypes.js - типы клеток и их свойства

// Типы клеток
window.TILE_TYPES = {
    NORMAL: 'normal',           // обычная клетка
    RESOURCE: 'resource',        // ресурсная клетка
    DANGEROUS: 'dangerous',      // опасная клетка
    ANOMALY: 'anomaly',          // аномалия
    EXIT: 'exit',                // выход в другой регион
    QUEST: 'quest'               // сюжетная клетка
};

// Описания для отображения
window.TILE_DESCRIPTIONS = {
    [window.TILE_TYPES.NORMAL]: 'Обычный сектор',
    [window.TILE_TYPES.RESOURCE]: 'Ресурсный сектор',
    [window.TILE_TYPES.DANGEROUS]: 'Опасный сектор',
    [window.TILE_TYPES.ANOMALY]: 'Аномальный сектор',
    [window.TILE_TYPES.EXIT]: 'Переход в следующий регион',
    [window.TILE_TYPES.QUEST]: 'Сюжетный сектор'
};

// Иконки для карты
window.TILE_ICONS = {
    [window.TILE_TYPES.NORMAL]: '•',
    [window.TILE_TYPES.RESOURCE]: '⛏️',
    [window.TILE_TYPES.DANGEROUS]: '⚡',
    [window.TILE_TYPES.ANOMALY]: '👁️',
    [window.TILE_TYPES.EXIT]: '🚪',
    [window.TILE_TYPES.QUEST]: '❓'
};

// Цвета для отображения (будут использоваться в CSS)
window.TILE_COLORS = {
    [window.TILE_TYPES.NORMAL]: '#5f874a',
    [window.TILE_TYPES.RESOURCE]: '#d4af37',
    [window.TILE_TYPES.DANGEROUS]: '#d06b6b',
    [window.TILE_TYPES.ANOMALY]: '#b84a9e',
    [window.TILE_TYPES.EXIT]: '#d06b6b',
    [window.TILE_TYPES.QUEST]: '#8bc34a'
};

// Функция для генерации случайного типа клетки (кроме exit)
function getRandomTileType() {
    const rand = Math.random();
    if (rand < 0.6) return window.TILE_TYPES.NORMAL;      // 60% обычные
    else if (rand < 0.8) return window.TILE_TYPES.RESOURCE; // 20% ресурсные
    else if (rand < 0.95) return window.TILE_TYPES.DANGEROUS; // 15% опасные
    else return window.TILE_TYPES.ANOMALY;                 // 5% аномалии
}

// Функция для получения информации о клетке при сканировании
function getTileScanInfo(tile) {
    if (!tile.discovered) return 'Неизвестный сектор';
    
    let info = window.TILE_DESCRIPTIONS[tile.type] || 'Неизвестный тип';
    
    // Добавляем дополнительную информацию в зависимости от типа
    switch(tile.type) {
        case window.TILE_TYPES.RESOURCE:
            info += ' (возможна находка)';
            break;
        case window.TILE_TYPES.DANGEROUS:
            info += ' (высокий риск)';
            break;
        case window.TILE_TYPES.ANOMALY:
            info += ' (показания приборов нестабильны)';
            break;
    }
    
    return info;
}
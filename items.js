// items.js - база данных предметов

// База всех предметов в игре
window.ITEMS_DB = {
    // РЕСУРСЫ (можно использовать, можно выбросить, можно продать)
    SCRAP_METAL: {
        id: 'scrap_metal',
        name: 'Металлолом',
        icon: '🔩',
        type: 'resource',
        description: 'Восстанавливает 20% корпуса',
        canDrop: true,
        canUse: true,
        value: 25,
        valueText: '25к'
    },
    
    URANIUM_ROD: {
        id: 'uranium_rod',
        name: 'Урановый стержень',
        icon: '☢️',
        type: 'resource',
        description: '+50% топлива',
        canDrop: true,
        canUse: true,
        value: 150,
        valueText: '150к'
    },
    
    FOOD: {
        id: 'food',
        name: 'Еда',
        icon: '🍗',
        type: 'resource',
        description: 'Пока не используется',
        canDrop: true,
        canUse: false,
        value: 10,
        valueText: '10к'
    },
    
    WATER: {
        id: 'water',
        name: 'Вода',
        icon: '💧',
        type: 'resource',
        description: 'Пока не используется',
        canDrop: true,
        canUse: false,
        value: 8,
        valueText: '8к'
    },
    
    // ИНСТРУМЕНТЫ
    TOOLS: {
        id: 'tools',
        name: 'Инструменты',
        icon: '🔧',
        type: 'tool',
        description: 'Для ремонта модулей',
        canDrop: true,
        canUse: false,
        value: 75,
        valueText: '75к'
    },
    
    FIRE_EXTINGUISHER: {
        id: 'fire_extinguisher',
        name: 'Огнетушитель',
        icon: '🧯',
        type: 'tool',
        description: 'Тушит пожары',
        canDrop: true,
        canUse: true,
        value: 45,
        valueText: '45к'
    },
    
    // МОДУЛИ (дорогие)
    HULL_MODULE: {
        id: 'hull_module',
        name: 'Усиленный модуль корпуса',
        icon: '🛡️',
        type: 'module',
        description: 'Заменяет повреждённый модуль',
        canDrop: true,
        canUse: false,
        moduleHealth: 100,
        value: 500,
        valueText: '500к'
    },
    
    // СЮЖЕТНЫЕ ПРЕДМЕТЫ (бесценные, нельзя продать)
    JOURNAL: {
        id: 'journal',
        name: 'Бортовой журнал',
        icon: '📔',
        type: 'quest',
        description: 'Руководство по эксплуатации',
        canDrop: false,
        canUse: true,
        value: 0,
        valueText: 'бесценно'
    },
    
    NOTE: {
        id: 'note',
        name: 'Записка',
        icon: '📝',
        type: 'quest',
        description: 'Чья-то записка',
        canDrop: false,
        canUse: true,
        value: 0,
        valueText: 'бесценно'
    },
    
    DIARY: {
        id: 'diary',
        name: 'Личный дневник',
        icon: '📓',
        type: 'quest',
        description: 'Дневник предыдущего капитана',
        canDrop: false,
        canUse: true,
        value: 0,
        valueText: 'бесценно'
    },
    
    ARTIFACT: {
        id: 'artifact',
        name: 'Странный артефакт',
        icon: '🔮',
        type: 'quest',
        description: 'Неизвестный предмет',
        canDrop: false,
        canUse: true,
        value: 0,
        valueText: 'бесценно'
    },
    
    // ЗАПИСКИ (обычные, можно продать)
    MAP_FRAGMENT: {
        id: 'map_fragment',
        name: 'Обрывок карты',
        icon: '🗺️',
        type: 'note',
        description: 'Часть навигационной карты',
        canDrop: true,
        canUse: true,
        value: 30,
        valueText: '30к',
        text: 'На обрывке карты видна отметка в секторе F12. Там отмечен крест и надпись: "ЗДЕСЬ БЫЛО ЧТО-ТО ВАЖНОЕ"'
    },
    
    CREW_LIST: {
        id: 'crew_list',
        name: 'Список команды',
        icon: '📋',
        type: 'note',
        description: 'Имена членов экипажа',
        canDrop: true,
        canUse: true,
        value: 20,
        valueText: '20к',
        text: `
СПИСОК КОМАНДЫ "НАУТИЛУС-МК2":

Капитан: Джейкоб Стоун
Старпом: Елена Волкова
Инженер: Грег Хоукинс
Механик: Чен Вэй
Кок: Педро Санчес

Примечание: все погибли при первом погружении.
        `
    },
    
    SURVIVAL_GUIDE: {
        id: 'survival_guide',
        name: 'Инструкция по выживанию',
        icon: '📘',
        type: 'note',
        description: 'Памятка для новичков',
        canDrop: true,
        canUse: true,
        value: 15,
        valueText: '15к',
        text: `
ИНСТРУКЦИЯ ПО ВЫЖИВАНИЮ:

1. Следи за уровнем кислорода
2. Не погружайся глубже 500м без усиленного корпуса
3. Включай реактор для подзарядки батарей
4. Используй сонар для разведки
5. Если слышишь странные звуки - уходи
6. Собирай металлолом для ремонта
7. Следи за давлением - используй рычаг 2 для сброса
        `
    },
    
    // ЦЕННОСТИ (дорогие)
    GOLD_BAR: {
        id: 'gold_bar',
        name: 'Золотой слиток',
        icon: '🏆',
        type: 'valuable',
        description: 'Ценная вещь',
        canDrop: true,
        canUse: false,
        value: 1000,
        valueText: '1000к'
    }
};

// Вспомогательная функция для создания копии предмета
function createItem(itemId) {
    const source = window.ITEMS_DB[itemId];
    if (!source) {
        console.error('Предмет не найден:', itemId);
        return null;
    }
    
    // Создаём глубокую копию объекта
    return JSON.parse(JSON.stringify(source));
}

// Функция для добавления случайного предмета
function addRandomItem() {
    const items = Object.keys(window.ITEMS_DB);
    const randomId = items[Math.floor(Math.random() * items.length)];
    const item = createItem(randomId);
    return addItemToInventory(item);
}
// missions.js - система заданий

// Типы заданий
window.MISSION_TYPES = {
    DELIVERY: 'delivery',      // Доставить предмет (тип 1)
    COLLECT: 'collect',        // Собрать ресурсы (тип 1)
    KILL: 'kill',              // Убить цель (тип 1)
    TRANSPORT: 'transport',    // Перевезти груз (тип 2)
    MESSAGE: 'message',        // Доставить сообщение (тип 2)
    EXPLORE: 'explore',        // Разведать сектор (тип 3)
    SCAN: 'scan',              // Просканировать (тип 3)
    ACTIVATE: 'activate'       // Активировать маяк (тип 3)
};

// Статусы заданий
window.MISSION_STATUS = {
    AVAILABLE: 'available',     // Доступно для взятия
    ACTIVE: 'active',           // Взято, в процессе
    COMPLETED_CONDITIONS: 'completed_conditions', // Условия выполнены, нужно сдать
    COMPLETED: 'completed',      // Завершено
    FAILED: 'failed'            // Провалено
};

// База данных заданий
window.MISSIONS_DB = {
    // ТИП 1: Доставить предмет (вернуться к заказчику)
    MISSION_1: {
        id: 'mission_1',
        title: 'Срочная поставка',
        giver: 'Маркус',
        location: 'Аванпост жилой',
        type: window.MISSION_TYPES.DELIVERY,
        description: 'Механику на верфи срочно нужен металлолом для ремонта.',
        objective: {
            item: 'SCRAP_METAL',
            amount: 2
        },
        reward: {
            credits: 200,
            items: ['FOOD']
        },
        dialogue: {
            start: 'У меня есть задание для тебя. Нужно доставить металлолом.',
            progress: 'Принёс металлолом?',
            complete: 'Отлично! Держи награду.'
        }
    },
    
    // ТИП 2: Доставка в другую клетку
    MISSION_2: {
        id: 'mission_2',
        title: 'Секретный пакет',
        giver: 'Вера',
        location: 'Охранный пост',
        type: window.MISSION_TYPES.TRANSPORT,
        description: 'Нужно доставить запечатанный пакет на исследовательскую базу.',
        objective: {
            targetLocation: 'Работающая исследовательская база',
            targetNpc: 'Доктор Чен'
        },
        reward: {
            credits: 300,
            items: []
        },
        dialogue: {
            start: 'Этот пакет нужно доставить доктору Чену. Никому не открывай.',
            progress: 'Пакет доставлен?',
            complete: 'Спасибо. Вот твоя награда.'
        }
    },
    
    // ТИП 3: Разведка (удалённая награда)
    MISSION_3: {
        id: 'mission_3',
        title: 'Разведка сектора',
        giver: 'Грег',
        location: 'Механик (мастерская)',
        type: window.MISSION_TYPES.EXPLORE,
        description: 'Нужно проверить сектор F13. Там была какая-то активность.',
        objective: {
            cell: 'F13',
            row: 11,
            col: 5
        },
        reward: {
            credits: 150,
            items: []
        },
        dialogue: {
            start: 'Надо проверить сектор F13. Просто зайди туда и возвращайся за наградой.',
            progress: 'Ты уже был в F13?',
            complete: 'Отлично! Деньги уже у тебя на счету.'
        }
    },
    
    // ТИП 1: Собрать ресурсы
    MISSION_4: {
        id: 'mission_4',
        title: 'Нехватка топлива',
        giver: 'Грег',
        location: 'Механик (мастерская)',
        type: window.MISSION_TYPES.COLLECT,
        description: 'Для тестов нужен урановый стержень.',
        objective: {
            item: 'URANIUM_ROD',
            amount: 1
        },
        reward: {
            credits: 300,
            items: ['SCRAP_METAL', 'SCRAP_METAL']
        },
        dialogue: {
            start: 'Если найдёшь урановый стержень, хорошо заплачу.',
            progress: 'Нашёл стержень?',
            complete: 'Отлично! Вот твои деньги и металлолом.'
        }
    }
};

// Активные задания игрока
window.activeMissions = [];

// Доступные задания по локациям
window.availableMissions = {};

// Карта для отслеживания клеток с заданиями
window.missionCells = {}; // формат: { "row_col": [missionId1, missionId2] }

// Инициализация заданий
function initMissions() {
    // Группируем задания по локациям
    Object.values(window.MISSIONS_DB).forEach(mission => {
        if (!window.availableMissions[mission.location]) {
            window.availableMissions[mission.location] = [];
        }
        window.availableMissions[mission.location].push({
            ...mission,
            status: window.MISSION_STATUS.AVAILABLE
        });
    });
}

// Получить статус клетки для отображения на карте
function getCellMissionStatus(row, col) {
    const key = `${row}_${col}`;
    const missionIds = window.missionCells[key] || [];
    if (missionIds.length === 0) return null;
    
    let hasActive = false;
    let hasCompleted = false;
    
    missionIds.forEach(id => {
        const mission = window.activeMissions.find(m => m.id === id);
        if (mission) {
            if (mission.status === window.MISSION_STATUS.COMPLETED_CONDITIONS) {
                hasCompleted = true;
            } else {
                hasActive = true;
            }
        }
    });
    
    if (hasCompleted) return 'completed';
    if (hasActive) return 'active';
    return null;
}

// Показать задания для локации
function showMissionsForLocation(locationName) {
    const missions = window.availableMissions[locationName] || [];
    const activeHere = window.activeMissions.filter(m => m.location === locationName);
    
    let missionsHTML = `
        <div class="location-dialog" style="max-width: 600px;">
            <div class="location-dialog-content">
                <div class="location-dialog-title">📋 ЗАДАНИЯ</div>
    `;
    
    if (missions.length === 0 && activeHere.length === 0) {
        missionsHTML += `<div class="location-dialog-text">Нет доступных заданий</div>`;
    } else {
        if (activeHere.length > 0) {
            missionsHTML += `<div style="color: #d4af37; margin: 10px 0;">АКТИВНЫЕ ЗАДАНИЯ:</div>`;
            activeHere.forEach(mission => {
                missionsHTML += `
                    <div style="background-color: #1a1a1a; border: 1px solid #d4af37; border-radius: 8px; padding: 10px; margin: 10px 0;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="color: #d4af37; font-weight: bold;">${mission.title}</span>
                            <span style="color: #5f874a;">⚡ АКТИВНО</span>
                        </div>
                        <div style="color: #5f874a; margin-top: 5px;">${mission.description}</div>
                        <button class="location-btn" id="abandon-${mission.id}" style="margin-top: 10px; border-color: #d06b6b; color: #d06b6b;">❌ ОТКАЗАТЬСЯ</button>
                    </div>
                `;
            });
        }
        
        if (missions.length > 0) {
            missionsHTML += `<div style="color: #4a9e5a; margin: 10px 0;">ДОСТУПНЫЕ ЗАДАНИЯ:</div>`;
            missions.forEach(mission => {
                missionsHTML += `
                    <div style="background-color: #1a1a1a; border: 1px solid #4a9e5a; border-radius: 8px; padding: 10px; margin: 10px 0;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="color: #4a9e5a; font-weight: bold;">${mission.title}</span>
                            <span style="color: #d4af37;">💰 ${mission.reward.credits}к</span>
                        </div>
                        <div style="color: #5f874a; margin-top: 5px;">${mission.description}</div>
                        <div style="color: #8bc34a; font-size: 11px; margin-top: 5px;">От: ${mission.giver}</div>
                        <button class="location-btn" id="accept-${mission.id}" style="margin-top: 10px;">✅ ПРИНЯТЬ</button>
                    </div>
                `;
            });
        }
    }
    
    missionsHTML += `
                <div class="location-dialog-buttons">
                    <button class="location-btn" id="missions-close">ЗАКРЫТЬ</button>
                </div>
            </div>
        </div>
    `;
    
    const dialogDiv = document.createElement('div');
    dialogDiv.innerHTML = missionsHTML;
    dialogDiv.className = 'location-dialog-container';
    document.body.appendChild(dialogDiv);
    
    // Обработчики для принятия заданий
    missions.forEach(mission => {
        const acceptBtn = document.getElementById(`accept-${mission.id}`);
        if (acceptBtn) {
            acceptBtn.addEventListener('click', () => {
                acceptMission(mission.id);
                dialogDiv.remove();
            });
        }
    });
    
    // Обработчики для отказа от заданий
    activeHere.forEach(mission => {
        const abandonBtn = document.getElementById(`abandon-${mission.id}`);
        if (abandonBtn) {
            abandonBtn.addEventListener('click', () => {
                abandonMission(mission.id);
                dialogDiv.remove();
                showMissionsForLocation(locationName);
            });
        }
    });
    
    document.getElementById('missions-close').addEventListener('click', () => dialogDiv.remove());
}

// Принять задание
function acceptMission(missionId) {
    const mission = window.MISSIONS_DB[missionId];
    if (!mission) return;
    
    // Проверяем, не взято ли уже это задание
    const alreadyActive = window.activeMissions.some(m => m.id === missionId);
    if (alreadyActive) {
        addToScreen('❌ Это задание уже активно');
        return;
    }
    
    // Удаляем из доступных
    window.availableMissions[mission.location] = window.availableMissions[mission.location].filter(m => m.id !== missionId);
    
    // Создаём активное задание
    const activeMission = {
        ...mission,
        status: window.MISSION_STATUS.ACTIVE,
        progress: 0,
        conditionsMet: false
    };
    
    window.activeMissions.push(activeMission);
    
    // Помечаем клетки
    markMissionCells(activeMission);
    
    addToScreen(`✅ Задание принято: ${mission.title}`);
    addToScreen(`💬 ${mission.giver}: "${mission.dialogue.start}"`);
    
    // Обновляем карту
    if (document.getElementById('tab-map').classList.contains('active')) {
        renderMap();
    }
}

// Пометить клетки, связанные с заданием
function markMissionCells(mission) {
    // Клетка, где взяли задание
    const startCell = getCellCoordinates(mission.location);
    if (startCell) {
        const key = `${startCell.row}_${startCell.col}`;
        if (!window.missionCells[key]) window.missionCells[key] = [];
        if (!window.missionCells[key].includes(mission.id)) {
            window.missionCells[key].push(mission.id);
        }
    }
    
    // Для типа 2 - клетка назначения
    if (mission.type === window.MISSION_TYPES.TRANSPORT || 
        mission.type === window.MISSION_TYPES.MESSAGE) {
        if (mission.objective.targetLocation) {
            const targetCell = getCellCoordinates(mission.objective.targetLocation);
            if (targetCell) {
                const key = `${targetCell.row}_${targetCell.col}`;
                if (!window.missionCells[key]) window.missionCells[key] = [];
                if (!window.missionCells[key].includes(mission.id)) {
                    window.missionCells[key].push(mission.id);
                    
                    // Открываем клетку на карте
                    if (window.gameMap && window.gameMap[targetCell.row] && window.gameMap[targetCell.row][targetCell.col]) {
                        window.gameMap[targetCell.row][targetCell.col].discovered = true;
                    }
                }
            }
        }
    }
}

// Получить координаты клетки по названию локации
function getCellCoordinates(locationName) {
    if (!window.gameMap) return null;
    
    for (let row = 0; row < window.MAP_ROWS; row++) {
        for (let col = 0; col < window.MAP_COLS; col++) {
            const tile = window.gameMap[row][col];
            if (tile.locations && tile.locations.name === locationName) {
                return { row, col };
            }
        }
    }
    return null;
}

// Проверить выполнение условий задания
function checkMissionCompletion() {
    window.activeMissions.forEach((mission, index) => {
        if (mission.status === window.MISSION_STATUS.COMPLETED) return;
        
        let conditionsMet = false;
        
        switch(mission.type) {
            case window.MISSION_TYPES.DELIVERY:
            case window.MISSION_TYPES.COLLECT:
                const itemCount = window.inventory.filter(item => item && item.id === mission.objective.item).length;
                conditionsMet = itemCount >= mission.objective.amount;
                break;
                
            case window.MISSION_TYPES.EXPLORE:
                conditionsMet = (window.playerRow === mission.objective.row && 
                                window.playerCol === mission.objective.col);
                break;
                
            case window.MISSION_TYPES.TRANSPORT:
            case window.MISSION_TYPES.MESSAGE:
                const targetCell = getCellCoordinates(mission.objective.targetLocation);
                conditionsMet = targetCell && 
                               window.playerRow === targetCell.row && 
                               window.playerCol === targetCell.col;
                break;
        }
        
        if (conditionsMet && mission.status === window.MISSION_STATUS.ACTIVE) {
            mission.status = window.MISSION_STATUS.COMPLETED_CONDITIONS;
            mission.conditionsMet = true;
            
            addToScreen(`✅ Условия задания выполнены: ${mission.title}`);
            addToScreen(`💬 Вернитесь к ${mission.giver} за наградой`);
            
            if (document.getElementById('tab-map').classList.contains('active')) {
                renderMap();
            }
        }
    });
}

// Сдать задание (получить награду)
function completeMission(missionId, locationName) {
    const index = window.activeMissions.findIndex(m => m.id === missionId);
    if (index === -1) return false;
    
    const mission = window.activeMissions[index];
    
    let canComplete = false;
    
    switch(mission.type) {
        case window.MISSION_TYPES.DELIVERY:
        case window.MISSION_TYPES.COLLECT:
        case window.MISSION_TYPES.KILL:
            canComplete = (locationName === mission.location);
            break;
            
        case window.MISSION_TYPES.TRANSPORT:
        case window.MISSION_TYPES.MESSAGE:
            canComplete = (locationName === mission.objective.targetLocation);
            break;
            
        case window.MISSION_TYPES.EXPLORE:
        case window.MISSION_TYPES.SCAN:
        case window.MISSION_TYPES.ACTIVATE:
            canComplete = true;
            break;
    }
    
    if (!canComplete) {
        addToScreen('❌ Здесь нельзя сдать это задание');
        return false;
    }
    
    if (mission.type === window.MISSION_TYPES.DELIVERY || 
        mission.type === window.MISSION_TYPES.COLLECT) {
        if (mission.status === window.MISSION_STATUS.COMPLETED_CONDITIONS) {
            let removed = 0;
            for (let i = 0; i < window.inventory.length && removed < mission.objective.amount; i++) {
                if (window.inventory[i] && window.inventory[i].id === mission.objective.item) {
                    window.inventory[i] = null;
                    removed++;
                }
            }
        }
    }
    
    window.credits += mission.reward.credits;
    
    mission.reward.items.forEach(itemId => {
        if (typeof createItem === 'function') {
            addItemToInventory(createItem(itemId));
        }
    });
    
    addToScreen(`✅ ЗАДАНИЕ ВЫПОЛНЕНО: ${mission.title}`);
    addToScreen(`💰 Получено: ${mission.reward.credits}к кредитов`);
    addToScreen(`💬 ${mission.giver}: "${mission.dialogue.complete}"`);
    
    window.activeMissions.splice(index, 1);
    removeMissionFromCells(missionId);
    
    if (document.getElementById('tab-map').classList.contains('active')) {
        renderMap();
    }
    
    return true;
}

// Отказаться от задания
function abandonMission(missionId) {
    const index = window.activeMissions.findIndex(m => m.id === missionId);
    if (index === -1) return;
    
    const mission = window.activeMissions[index];
    
    if (mission.status === window.MISSION_STATUS.COMPLETED_CONDITIONS && 
        (mission.type === window.MISSION_TYPES.EXPLORE || 
         mission.type === window.MISSION_TYPES.SCAN || 
         mission.type === window.MISSION_TYPES.ACTIVATE)) {
        addToScreen('❌ Нельзя отказаться от выполненного задания');
        return;
    }
    
    window.activeMissions.splice(index, 1);
    
    if (!window.availableMissions[mission.location]) {
        window.availableMissions[mission.location] = [];
    }
    window.availableMissions[mission.location].push({
        ...mission,
        status: window.MISSION_STATUS.AVAILABLE
    });
    
    removeMissionFromCells(missionId);
    
    addToScreen(`❌ Отказ от задания: ${mission.title}`);
    
    if (document.getElementById('tab-map').classList.contains('active')) {
        renderMap();
    }
}

// Удалить задание из всех клеток
function removeMissionFromCells(missionId) {
    for (let key in window.missionCells) {
        window.missionCells[key] = window.missionCells[key].filter(id => id !== missionId);
        if (window.missionCells[key].length === 0) {
            delete window.missionCells[key];
        }
    }
}

// Инициализация при загрузке
initMissions();
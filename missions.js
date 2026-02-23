// Типы заданий
window.MISSION_TYPES = {
    DELIVERY: 'delivery',      // Доставить предмет
    EXPLORE: 'explore',        // Разведать клетку
    COLLECT: 'collect',        // Собрать ресурсы
    KILL: 'kill',              // Уничтожить цель
    SCAN: 'scan'               // Просканировать область
};

// Статусы заданий
window.MISSION_STATUS = {
    AVAILABLE: 'available',
    ACTIVE: 'active',
    COMPLETED: 'completed',
    FAILED: 'failed'
};

// База данных заданий
window.MISSIONS_DB = {
    // Тестовое задание 1: Доставить металлолом
    MISSION_1: {
        id: 'mission_1',
        title: 'Срочная поставка',
        giver: 'Маркус',
        location: 'Аванпост жилой',
        type: window.MISSION_TYPES.DELIVERY,
        description: 'Механику на верфи срочно нужен металлолом для ремонта.',
        objective: {
            item: 'SCRAP_METAL',
            amount: 2,
            targetLocation: 'Верфь',
            targetNpc: 'Елена'
        },
        reward: {
            credits: 200,
            items: ['FOOD']
        },
        dialogue: {
            start: 'У меня есть задание для тебя. Нужно доставить металлолом Елене на верфь.',
            progress: 'Ты уже доставил металлолом? Елена ждет.',
            complete: 'Отлично! Елена подтвердила доставку. Держи награду.'
        }
    },
    
    // Тестовое задание 2: Разведать клетку
    MISSION_2: {
        id: 'mission_2',
        title: 'Разведка сектора',
        giver: 'Вера',
        location: 'Охранный пост',
        type: window.MISSION_TYPES.EXPLORE,
        description: 'Нужно проверить сектор F13. Там была какая-то активность.',
        objective: {
            cell: 'F13', // F = 5-я буква (индекс 5), 13 = строка 12 (индекс 11)
            row: 11,
            col: 5
        },
        reward: {
            credits: 150,
            items: []
        },
        dialogue: {
            start: 'Надо проверить сектор F13. Говорят, там что-то странное.',
            progress: 'Ты уже был в F13? Что там?',
            complete: 'Спасибо за разведку. Держи оплату.'
        }
    },
    
    // Тестовое задание 3: Собрать ресурсы
    MISSION_3: {
        id: 'mission_3',
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
            complete: 'Отлично! Вот твои деньги и немного металлолома в придачу.'
        }
    }
};

// Активные задания игрока
window.activeMissions = [];

// Доступные задания по локациям
window.availableMissions = {};

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
    
    // Удаляем из доступных
    window.availableMissions[mission.location] = window.availableMissions[mission.location].filter(m => m.id !== missionId);
    
    // Добавляем в активные
    window.activeMissions.push({
        ...mission,
        status: window.MISSION_STATUS.ACTIVE,
        progress: 0
    });
    
    addToScreen(`✅ Задание принято: ${mission.title}`);
    addToScreen(`💬 ${mission.giver}: "${mission.dialogue.start}"`);
}

// Отказаться от задания
function abandonMission(missionId) {
    const index = window.activeMissions.findIndex(m => m.id === missionId);
    if (index === -1) return;
    
    const mission = window.activeMissions[index];
    window.activeMissions.splice(index, 1);
    
    // Возвращаем в доступные
    if (!window.availableMissions[mission.location]) {
        window.availableMissions[mission.location] = [];
    }
    window.availableMissions[mission.location].push({
        ...mission,
        status: window.MISSION_STATUS.AVAILABLE
    });
    
    addToScreen(`❌ Отказ от задания: ${mission.title}`);
}

// Проверить выполнение заданий
function checkMissionCompletion() {
    window.activeMissions.forEach((mission, index) => {
        let completed = false;
        
        switch(mission.type) {
            case window.MISSION_TYPES.DELIVERY:
                // Проверяем, есть ли предмет в инвентаре
                const itemCount = window.inventory.filter(item => item && item.id === mission.objective.item).length;
                completed = itemCount >= mission.objective.amount;
                if (completed) {
                    // Забираем предметы
                    let removed = 0;
                    for (let i = 0; i < window.inventory.length && removed < mission.objective.amount; i++) {
                        if (window.inventory[i] && window.inventory[i].id === mission.objective.item) {
                            window.inventory[i] = null;
                            removed++;
                        }
                    }
                }
                break;
                
            case window.MISSION_TYPES.EXPLORE:
                // Проверяем, посещена ли нужная клетка
                completed = (window.playerRow === mission.objective.row && 
                            window.playerCol === mission.objective.col);
                break;
                
            case window.MISSION_TYPES.COLLECT:
                const collectCount = window.inventory.filter(item => item && item.id === mission.objective.item).length;
                completed = collectCount >= mission.objective.amount;
                if (completed) {
                    let removed = 0;
                    for (let i = 0; i < window.inventory.length && removed < mission.objective.amount; i++) {
                        if (window.inventory[i] && window.inventory[i].id === mission.objective.item) {
                            window.inventory[i] = null;
                            removed++;
                        }
                    }
                }
                break;
        }
        
        if (completed) {
            completeMission(mission.id);
        }
    });
}

// Завершить задание
function completeMission(missionId) {
    const index = window.activeMissions.findIndex(m => m.id === missionId);
    if (index === -1) return;
    
    const mission = window.activeMissions[index];
    
    // Выдаём награду
    window.credits += mission.reward.credits;
    
    mission.reward.items.forEach(itemId => {
        if (typeof createItem === 'function') {
            addItemToInventory(createItem(itemId));
        }
    });
    
    addToScreen(`✅ ЗАДАНИЕ ВЫПОЛНЕНО: ${mission.title}`);
    addToScreen(`💰 Получено: ${mission.reward.credits}к кредитов`);
    addToScreen(`💬 ${mission.giver}: "${mission.dialogue.complete}"`);
    
    // Удаляем из активных
    window.activeMissions.splice(index, 1);
}

// Инициализация при загрузке
initMissions();
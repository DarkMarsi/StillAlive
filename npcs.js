// Типы NPC
window.NPC_TYPES = {
    TRADER: 'trader',        // Торговец
    MECHANIC: 'mechanic',    // Механик
    SCIENTIST: 'scientist',  // Ученый
    BARTENDER: 'bartender',  // Бармен
    MISSION_GIVER: 'mission_giver' // Квестодатель
};

// База данных NPC
window.NPCS_DB = {
    // Торговцы
    MARCUS: {
        id: 'marcus',
        name: 'Маркус',
        type: window.NPC_TYPES.TRADER,
        location: 'Аванпост жилой',
        sprite: '👨‍💼',
        description: 'Бывший торговый представитель, теперь торгует запчастями и ресурсами.',
        dialogue: {
            greeting: 'О, свежая кровь! Нужны запчасти? У меня есть всё, кроме совести.',
            bye: 'Возвращайся, если найдешь что-то ценное.'
        }
    },
    
    ELENA: {
        id: 'elena',
        name: 'Елена',
        type: window.NPC_TYPES.TRADER,
        location: 'Верфь',
        sprite: '👩‍🔧',
        description: 'Инженер с верфи, продает оборудование и инструменты.',
        dialogue: {
            greeting: 'Запчасти кончаются, а работа не ждет. Что нужно?',
            bye: 'Будь осторожен в глубине.'
        }
    },
    
    // Механики
    GREG: {
        id: 'greg',
        name: 'Грег',
        type: window.NPC_TYPES.MECHANIC,
        location: 'Механик (мастерская)',
        sprite: '👨‍🔧',
        description: 'Старый механик, знает о "Наутилусе" всё.',
        dialogue: {
            greeting: 'Слышал, у тебя проблемы с двигателем? Я могу помочь... за плату.',
            bye: 'Заходи, если что-то сломается. А оно сломается.'
        }
    },
    
    // Ученые
    DR_CHEN: {
        id: 'dr_chen',
        name: 'Доктор Чен',
        type: window.NPC_TYPES.SCIENTIST,
        location: 'Работающая исследовательская база',
        sprite: '👩‍🔬',
        description: 'Изучает местную фауну и аномалии.',
        dialogue: {
            greeting: 'Вы верите в то, что мы здесь не одни? Я видел такое...',
            bye: 'Берегите себя. Здесь опасно.'
        }
    },
    
    // Бармены
    SANCHES: {
        id: 'sanches',
        name: 'Педро Санчес',
        type: window.NPC_TYPES.BARTENDER,
        location: 'Рыболовный пост',
        sprite: '👨‍🍳',
        description: 'Бывший кок, теперь содержит небольшую забегаловку.',
        dialogue: {
            greeting: 'Еда кончилась три дня назад. Есть только синте-кофе и старые байки.',
            bye: 'Заходи, если хочешь послушать истории.'
        }
    },
    
    // Квестодатели
    STRANGER: {
        id: 'stranger',
        name: 'Таинственный незнакомец',
        type: window.NPC_TYPES.MISSION_GIVER,
        location: 'Шлюз-бункер',
        sprite: '🥷',
        description: 'Человек в плаще, лица не видно.',
        dialogue: {
            greeting: 'Я слежу за тобой. У меня есть предложение...',
            bye: 'Подумай. Я найду тебя сам.'
        }
    },
    
    VERA: {
        id: 'vera',
        name: 'Вера',
        type: window.NPC_TYPES.MISSION_GIVER,
        location: 'Охранный пост',
        sprite: '👮‍♀️',
        description: 'Начальник охраны, всегда ищет добровольцев на опасные задания.',
        dialogue: {
            greeting: 'Нужен кто-то с крепкими нервами. Интересует подработка?',
            bye: 'Возвращайся, если передумаешь.'
        }
    }
};

// Получить NPC по локации
function getNPCsByLocation(locationName) {
    return Object.values(window.NPCS_DB).filter(npc => npc.location === locationName);
}

// Показать диалог с NPC
function showNPCDialog(npc) {
    const dialogHTML = `
        <div class="location-dialog">
            <div class="location-dialog-content">
                <div class="location-dialog-title" style="font-size: 20px;">
                    ${npc.sprite} ${npc.name}
                </div>
                <div style="color: #5f874a; text-align: center; margin-bottom: 15px; font-style: italic;">
                    ${npc.description}
                </div>
                <div class="location-dialog-text" style="background-color: #1a1a1a; padding: 15px; border-radius: 8px;">
                    "${npc.dialogue.greeting}"
                </div>
                <div class="location-dialog-buttons" style="flex-wrap: wrap; gap: 10px; margin-top: 20px;">
                    <button class="location-btn" id="npc-talk" style="border-color: #4a9e5a; color: #4a9e5a;">💬 ПОГОВОРИТЬ</button>
                    ${npc.type === window.NPC_TYPES.TRADER ? '<button class="location-btn" id="npc-trade" style="border-color: #d4af37; color: #d4af37;">💰 ТОРГОВАТЬ</button>' : ''}
                    ${npc.type === window.NPC_TYPES.MECHANIC ? '<button class="location-btn" id="npc-repair" style="border-color: #d4af37; color: #d4af37;">🔧 РЕМОНТ</button>' : ''}
                    ${npc.type === window.NPC_TYPES.SCIENTIST ? '<button class="location-btn" id="npc-research" style="border-color: #8bc34a; color: #8bc34a;">🔬 ИССЛЕДОВАТЬ</button>' : ''}
                    ${npc.type === window.NPC_TYPES.MISSION_GIVER ? '<button class="location-btn" id="npc-missions" style="border-color: #d06b6b; color: #d06b6b;">⚠️ ЗАДАНИЯ</button>' : ''}
                    <button class="location-btn" id="npc-close">ЗАКРЫТЬ</button>
                </div>
            </div>
        </div>
    `;
    
    const dialogDiv = document.createElement('div');
    dialogDiv.innerHTML = dialogHTML;
    dialogDiv.className = 'location-dialog-container';
    document.body.appendChild(dialogDiv);
    
    document.getElementById('npc-close').addEventListener('click', () => dialogDiv.remove());
    
    if (document.getElementById('npc-talk')) {
        document.getElementById('npc-talk').addEventListener('click', () => {
            addToScreen(`💬 ${npc.name}: ${npc.dialogue.bye}`);
        });
    }
    
    if (document.getElementById('npc-missions')) {
        document.getElementById('npc-missions').addEventListener('click', () => {
            dialogDiv.remove();
            showMissionsForLocation(npc.location);
        });
    }
    
    // Заглушки для остальных действий
    if (document.getElementById('npc-trade')) {
        document.getElementById('npc-trade').addEventListener('click', () => {
            addToScreen('💰 Торговля появится в следующем обновлении');
        });
    }
    
    if (document.getElementById('npc-repair')) {
        document.getElementById('npc-repair').addEventListener('click', () => {
            addToScreen('🔧 Ремонт модулей: 100к за 10% восстановления');
            // Здесь будет логика ремонта
        });
    }
}
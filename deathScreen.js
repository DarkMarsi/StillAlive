// Функция для расчета пройденного расстояния
function calculateTotalDistance() {
    // Каждая смена клетки + движение внутри клетки
    const cellsVisited = window.messageHistory.filter(msg => msg.includes('вошли в сектор')).length;
    const distanceInMeters = Math.abs(window.positionX) + Math.abs(window.positionY) + (cellsVisited * 1000);
    return Math.round(distanceInMeters / 1000); // в километрах
}

// Функция для форматирования времени
function formatPlayTime(minutes) {
    const days = Math.floor(minutes / (24 * 60));
    const hours = Math.floor((minutes % (24 * 60)) / 60);
    const mins = minutes % 60;
    
    let result = '';
    if (days > 0) result += `${days}д `;
    if (hours > 0) result += `${hours}ч `;
    result += `${mins}м`;
    return result;
}

// Функция для показа экрана смерти
function showDeathScreen() {
    // Останавливаем игру
    window.gamePaused = true;
    window.gameOver = true;
    
    // Рассчитываем статистику
    const survivedTime = formatPlayTime(window.time);
    const totalDistance = calculateTotalDistance();
    const regionsExplored = window.currentRegion;
    const modulesBroken = [
        window.moduleEngine < 100 ? '⚙️' : '',
        window.moduleReactor < 100 ? '☢️' : '',
        window.moduleBattery < 100 ? '🔋' : '',
        window.moduleBallast < 100 ? '💧' : '',
        window.moduleLifeSupport < 100 ? '💔' : ''
    ].filter(Boolean).length;
    
    // Создаем затемненный фон
    const overlay = document.createElement('div');
    overlay.className = 'death-screen-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 20000;
        font-family: 'Courier New', monospace;
    `;
    
    // Формируем контент
    const deathHTML = `
        <div class="death-container" style="
            background-color: #0a0a0a;
            border: 3px solid #d06b6b;
            border-radius: 8px;
            padding: 30px;
            max-width: 600px;
            width: 100%;
            box-shadow: 0 0 50px rgba(208, 107, 107, 0.3);
            color: #5f874a;
        ">
            <div style="text-align: center; margin-bottom: 30px;">
                <div style="font-size: 48px; color: #d06b6b; margin-bottom: 10px;">💀</div>
                <div style="font-size: 24px; color: #d06b6b; text-transform: uppercase; letter-spacing: 3px;">
                    СВЯЗЬ ПОТЕРЯНА
                </div>
            </div>
            
            <div style="border: 2px solid #d06b6b; padding: 20px; margin-bottom: 20px; background-color: #1a1a1a;">
                <div style="font-size: 18px; color: #d06b6b; margin-bottom: 10px; text-align: center;">
                    ОБЪЕКТ: ${window.playerName || 'ЗАКЛЮЧЕННЫЙ-734'}
                </div>
                <div style="font-size: 14px; color: #5f874a; text-align: center; line-height: 1.5;">
                    Последняя передача данных зафиксирована в секторе 
                    ${String.fromCharCode(65 + window.playerCol)}${window.playerRow + 1}.
                    Причина гибели: уточняется.
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 30px;">
                <div style="background-color: #1a1a1a; border: 1px solid #5f874a; padding: 15px; text-align: center;">
                    <div style="font-size: 12px; color: #5f874a; margin-bottom: 5px;">ВРЕМЯ ВЫЖИВАНИЯ</div>
                    <div style="font-size: 20px; color: #8bc34a;">${survivedTime}</div>
                </div>
                
                <div style="background-color: #1a1a1a; border: 1px solid #5f874a; padding: 15px; text-align: center;">
                    <div style="font-size: 12px; color: #5f874a; margin-bottom: 5px;">ПРОЙДЕНО</div>
                    <div style="font-size: 20px; color: #8bc34a;">${totalDistance} км</div>
                </div>
                
                <div style="background-color: #1a1a1a; border: 1px solid #5f874a; padding: 15px; text-align: center;">
                    <div style="font-size: 12px; color: #5f874a; margin-bottom: 5px;">РЕГИОНОВ</div>
                    <div style="font-size: 20px; color: #8bc34a;">${regionsExplored}/5</div>
                </div>
                
                <div style="background-color: #1a1a1a; border: 1px solid #5f874a; padding: 15px; text-align: center;">
                    <div style="font-size: 12px; color: #5f874a; margin-bottom: 5px;">МОДУЛЕЙ ПОВРЕЖДЕНО</div>
                    <div style="font-size: 20px; color: #d06b6b;">${modulesBroken}</div>
                </div>
            </div>
            
            <div style="text-align: center; margin-bottom: 30px;">
                <div style="font-size: 14px; color: #5f874a; margin-bottom: 10px;">ПОДПИСЬ АДМИНИСТРАЦИИ:</div>
                <div style="border-top: 1px solid #d06b6b; width: 200px; margin: 0 auto;"></div>
                <div style="font-size: 12px; color: #5f874a; margin-top: 5px;">Инспектор СИСТЕМЫ "АБИСС"</div>
            </div>
            
            <div style="display: flex; justify-content: center;">
                <button class="death-btn" id="death-return-btn" style="
                    background-color: #1a1a1a;
                    border: 2px solid #5f874a;
                    color: #5f874a;
                    font-family: 'Courier New', monospace;
                    font-size: 18px;
                    font-weight: bold;
                    padding: 15px 40px;
                    cursor: pointer;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    transition: all 0.3s;
                ">ВЕРНУТЬСЯ В МЕНЮ</button>
            </div>
        </div>
    `;
    
    overlay.innerHTML = deathHTML;
    document.body.appendChild(overlay);
    
    // Обработчик кнопки
    document.getElementById('death-return-btn').addEventListener('click', function() {
        overlay.remove();
        // Перезапускаем игру через ресет
        if (typeof resetBtn !== 'undefined' && resetBtn) {
            resetBtn.click();
        }
    });
    
    // Добавляем эффект при наведении
    const btn = document.getElementById('death-return-btn');
    btn.addEventListener('mouseenter', function() {
        this.style.backgroundColor = '#5f874a';
        this.style.color = 'black';
        this.style.boxShadow = '0 0 20px #5f874a';
    });
    btn.addEventListener('mouseleave', function() {
        this.style.backgroundColor = '#1a1a1a';
        this.style.color = '#5f874a';
        this.style.boxShadow = 'none';
    });
}
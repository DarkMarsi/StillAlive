// startMenu.js - стартовое меню с контрактом

// Переменная для хранения имени игрока
let playerName = 'ЗАКЛЮЧЕННЫЙ-734';

// Функция для отображения стартового меню
function showStartMenu() {
        // Ставим игру на паузу
    if (window.gamePaused !== undefined) {
        window.gamePaused = true;
    }
    // Создаем затемненный фон
    const overlay = document.createElement('div');
    overlay.className = 'start-menu-overlay';
    overlay.id = 'start-menu-overlay';
    
    // Создаем контракт
    const contractHTML = `
        <div class="contract-container">
            <div class="contract-header">
                <div class="contract-title">КОНТРАКТ № А-734/●</div>
                <div class="contract-subtitle">МЕЖПЛАНЕТНАЯ ПЕНИТЕНЦИАРНАЯ СИСТЕМА "АБИСС"</div>
            </div>
            
            <div class="contract-content">
                <p class="contract-paragraph">
                    Настоящий контракт заключен между Администрацией Исправительной Колонии "Гидра-9" 
                    (далее — "Администрация") и нижеподписавшимся лицом (далее — "Заключенный").
                </p>
                
                <p class="contract-paragraph">
                    В связи с переполнением исправительных учреждений на Земле и высокой смертностью 
                    среди добровольцев, Администрация предлагает Заключенному возможность досрочного 
                    освобождения на следующих условиях:
                </p>
                
                <div class="contract-clause">
                    <span class="clause-number">1.</span>
                    <span class="clause-text">Заключенный направляется на планету К-9 (классификация: Океанический мир, уровень опасности: НЕОПРЕДЕЛЕН) для выполнения разведывательной миссии.</span>
                </div>
                
                <div class="contract-clause">
                    <span class="clause-number">2.</span>
                    <span class="clause-text">Заключенный обязуется управлять подводным аппаратом "Наутилус-Мк2" и исследовать секторы, указанные Администрацией.</span>
                </div>
                
                <div class="contract-clause">
                    <span class="clause-number">3.</span>
                    <span class="clause-text">АДМИНИСТРАЦИЯ НЕ НЕСЕТ ОТВЕТСТВЕННОСТИ ЗА:</span>
                    <ul class="clause-sublist">
                        <li>Психическое или физическое здоровье Заключенного</li>
                        <li>Технические неисправности оборудования</li>
                        <li>Встречи с местными формами жизни (задокументированы случаи агрессии)</li>
                        <li>Потерю сигнала или связи с базой</li>
                        <li>Временные аномалии в секторах</li>
                        <li>Смерть или исчезновение Заключенного</li>
                    </ul>
                </div>
                
                <div class="contract-clause">
                    <span class="clause-number">4.</span>
                    <span class="clause-text">В случае успешного выполнения миссии (обнаружение пригодных для колонизации зон или ценных ресурсов) Заключенный получает ПОЛНОЕ ПОМИЛОВАНИЕ и денежное вознаграждение в размере 500 000 кредитов.</span>
                </div>
                
                <div class="contract-clause">
                    <span class="clause-number">5.</span>
                    <span class="clause-text">Заключенный добровольно соглашается на криогенную заморозку на время транспортировки и имплантацию нейро-интерфейса для управления аппаратом.</span>
                </div>
                
                <div class="contract-signature">
                    <div class="signature-field">
                        <span class="signature-label">ИМЯ ЗАКЛЮЧЕННОГО:</span>
                        <input type="text" class="signature-input" id="player-name-input" value="ЗАКЛЮЧЕННЫЙ-734" maxlength="30">
                    </div>
                    <div class="signature-field">
                        <span class="signature-label">ДАТА:</span>
                        <span class="signature-date" id="contract-date"></span>
                    </div>
                </div>
                
                <div class="contract-warning">
                    ⚠️ ПОДПИСЫВАЯ ДАННЫЙ КОНТРАКТ, ВЫ ПОДТВЕРЖДАЕТЕ, ЧТО ОЗНАКОМЛЕНЫ СО ВСЕМИ РИСКАМИ И НЕ ИМЕЕТЕ ПРЕТЕНЗИЙ К АДМИНИСТРАЦИИ
                </div>
            </div>
            
            <div class="contract-footer">
                <button class="contract-btn contract-btn-sign" id="sign-contract-btn">ПОДПИСАТЬ КОНТРАКТ</button>
                <button class="contract-btn contract-btn-reject" id="reject-contract-btn">ОТКАЗАТЬСЯ</button>
            </div>
        </div>
    `;
    
    overlay.innerHTML = contractHTML;
        
    // СНАЧАЛА добавляем overlay на страницу
    document.body.appendChild(overlay);

    // ПОТОМ ищем элемент и вставляем дату
    const dateElement = document.getElementById('contract-date');
    if (dateElement) {
        // Устанавливаем дату на 1000 лет вперед
        const today = new Date();
        const futureYear = today.getFullYear() + 1000;
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        
        // Формат: ГГГГ.ММ.ДД
        const futureDate = `${futureYear}.${month}.${day}`;
        dateElement.textContent = futureDate;
        
        console.log('Дата установлена:', futureDate); // для проверки
    }

    // Теперь можно добавлять обработчики
    document.getElementById('sign-contract-btn').addEventListener('click', function() {
        
        // Показываем сообщение о подписании
        showContractAccepted();
    });
    
    document.getElementById('reject-contract-btn').addEventListener('click', function() {
        showContractRejected();
    });
    
    // Обновляем имя в реальном времени
    document.getElementById('player-name-input').addEventListener('input', function(e) {
        playerName = e.target.value.trim() || 'ЗАКЛЮЧЕННЫЙ-734';
    });
}

// Функция при подписании контракта
function showContractAccepted() {
    const overlay = document.getElementById('start-menu-overlay');
    if (!overlay) return;
    
    overlay.innerHTML = `
        <div class="contract-container acceptance-container">
            <div class="contract-header">
                <div class="contract-title">КОНТРАКТ ПОДПИСАН</div>
            </div>
            <div class="contract-content" style="text-align: center;">
                <div class="acceptance-icon">📜✓</div>
                <p class="contract-paragraph" style="font-size: 18px;">
                    Заключенный <span style="color: #8bc34a; font-weight: bold;">${playerName}</span>,<br>
                    ваш контракт принят.
                </p>
                <p class="contract-paragraph">
                    Криогенная заморозка начнется через 60 секунд.<br>
                    Пробуждение запланировано на орбите планеты К-9.
                </p>
                <p class="contract-paragraph" style="color: #b84a4a; margin-top: 30px;">
                    Администрация желает вам удачи.<br>
                    Она вам понадобится.
                </p>
            </div>
            <div class="contract-footer">
                <button class="contract-btn contract-btn-sign" id="start-game-btn">НАЧАТЬ МИССИЮ</button>
            </div>
        </div>
    `;
    
    // ЗАПУСКАЕМ ЗВУК ВОДЫ ПОСЛЕ ПОДПИСАНИЯ
    startWaterAmbient();
    
    document.getElementById('start-game-btn').addEventListener('click', function() {
        // Удаляем меню и запускаем игру
        overlay.remove();
        startGame();
    });
}

// Функция при отказе от контракта
function showContractRejected() {
    const overlay = document.getElementById('start-menu-overlay');
    if (!overlay) return;
    
    overlay.innerHTML = `
        <div class="contract-container rejection-container">
            <div class="contract-header">
                <div class="contract-title">ОТКАЗ ОТ КОНТРАКТА</div>
            </div>
            <div class="contract-content" style="text-align: center;">
                <div class="rejection-icon">⛔</div>
                <p class="contract-paragraph" style="font-size: 18px;">
                    Вы отказались от участия в программе.
                </p>
                <p class="contract-paragraph" style="color: #b84a4a;">
                    В соответствии с пунктом 7.3 Устава Исправительной Колонии,<br>
                    отказ от контракта приравнивается к попытке побега.
                </p>
                <p class="contract-paragraph" style="margin-top: 30px;">
                    Приговор: пожизненное заключение в камере 23-Б<br>
                    без права пересмотра.
                </p>
            </div>
            <div class="contract-footer">
                <button class="contract-btn contract-btn-sign" id="go-back-btn">ВЕРНУТЬСЯ К КОНТРАКТУ</button>
            </div>
        </div>
    `;
    
    document.getElementById('go-back-btn').addEventListener('click', function() {
        overlay.remove();
        showStartMenu();
    });
}

// запуск игры
function startGame() {
    // Снимаем игру с паузы
    window.gamePaused = false;
    // Здесь просто убеждаемся, что игра работает
    console.log('Игра начата с именем:', playerName);
    
    // Можно добавить приветствие с именем игрока
    if (typeof addToScreen === 'function') {
        addToScreen(`🔓 КОНТРАКТ ПОДПИСАН, ЗАКЛЮЧЕННЫЙ ${playerName}`);
        addToScreen('💀 ДОБРО ПОЖАЛОВАТЬ НА БОРТ "НАУТИЛУСА"');
        addToScreen('Введите /help для списка команд');
    }
}

// Автоматически показываем меню при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Даем небольшую задержку, чтобы все остальные скрипты загрузились
    setTimeout(() => {
        showStartMenu();
    }, 100);
});
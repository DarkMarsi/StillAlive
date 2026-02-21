// signals.js
function addSignal(title, message) {
    const newSignal = {
        id: window.signalIdCounter++,
        title: title,
        message: message,
        time: formatGameTime(window.time),
        day: window.day,
        read: false
    };
    
    window.signalsList.unshift(newSignal);
    
    if (document.getElementById('tab-signals').classList.contains('active')) {
        showSignalsTab();
    }
    
    addToScreen(`📡 Новый сигнал: ${title}`);
}

function showSignalsTab() {
    if (window.signalsList.length === 0) {
        window.screen.innerHTML = '📡 ВХОДЯЩИЕ СИГНАЛЫ<br>────────────────<br>• Нет новых сигналов';
        return;
    }
    
    let signalsHTML = '<div class="signals-list">';
    signalsHTML += '<div class="signals-header">📡 ВХОДЯЩИЕ СИГНАЛЫ</div>';
    signalsHTML += '<div class="signals-divider"></div>';
    
    for (let signal of window.signalsList) {
        signalsHTML += `
            <div class="signal-item ${signal.read ? 'read' : 'unread'}" data-signal-id="${signal.id}">
                <span class="signal-status">${signal.read ? '✓' : '●'}</span>
                <span class="signal-title">${signal.title}</span>
                <span class="signal-time">День ${signal.day} ${signal.time}</span>
            </div>
        `;
    }
    
    signalsHTML += '</div>';
    window.screen.innerHTML = signalsHTML;
    
    document.querySelectorAll('.signal-item').forEach(item => {
        item.addEventListener('click', function() {
            const signalId = parseInt(this.dataset.signalId);
            openSignal(signalId);
        });
    });
}

function openSignal(signalId) {
    document.querySelectorAll('.signal-message-container').forEach(win => win.remove());
    const signal = window.signalsList.find(s => s.id === signalId);
    if (!signal) return;
    
    signal.read = true;
    
    let signalHTML = `
        <div class="signal-message" id="signal-${signalId}">
            <div class="signal-message-header">
                <span class="signal-message-title">${signal.title}</span>
                <span class="signal-message-close">✕</span>
            </div>
            <div class="signal-message-info">
                День ${signal.day} • ${signal.time}
            </div>
            <div class="signal-message-divider"></div>
            <div class="signal-message-body">
                ${signal.message}
            </div>
        </div>
    `;
    
    const signalDiv = document.createElement('div');
    signalDiv.innerHTML = signalHTML;
    signalDiv.className = 'signal-message-container';
    document.body.appendChild(signalDiv);
    
    const message = signalDiv.querySelector('.signal-message');
    message.style.top = '50%';
    message.style.left = '50%';
    message.style.transform = 'translate(-50%, -50%)';
    
    signalDiv.querySelector('.signal-message-close').addEventListener('click', function() {
        signalDiv.remove();
        if (document.getElementById('tab-signals').classList.contains('active')) {
            showSignalsTab();
        }
    });
    
    setTimeout(() => {
        document.addEventListener('click', function closeSignal(e) {
            if (!signalDiv.contains(e.target) && !e.target.closest('.signal-item')) {
                signalDiv.remove();
                document.removeEventListener('click', closeSignal);
                if (document.getElementById('tab-signals').classList.contains('active')) {
                    showSignalsTab();
                }
            }
        });
    }, 100);
}
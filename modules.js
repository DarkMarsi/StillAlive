// modules.js
function showModuleMenu(moduleName, moduleId, currentHealth) {
    document.querySelectorAll('.module-menu-container').forEach(menu => menu.remove());

    let menuHTML = `
        <div class="module-menu" id="menu-${moduleId}">
            <div class="menu-header">
                <span class="menu-title">${moduleName}</span>
                <span class="menu-close">✕</span>
            </div>
            <div class="menu-health">Прочность: ${currentHealth}%</div>
            <div class="menu-divider"></div>
            <div class="menu-item disabled">Стандартный модуль</div>
            <div class="menu-item disabled">Улучшенный модуль</div>
            <div class="menu-item disabled">Защищённый модуль</div>
            <div class="menu-divider"></div>
            <div class="menu-item unavailable">❌НЕТ ДОСТУПНЫХ МОДУЛЕЙ</div>
        </div>
    `;

    const menuDiv = document.createElement('div');
    menuDiv.innerHTML = menuHTML;
    menuDiv.className = 'module-menu-container';
    document.body.appendChild(menuDiv);
    
    const menu = menuDiv.querySelector('.module-menu');
    
    menu.style.top = '50%';
    menu.style.left = '50%';
    menu.style.transform = 'translate(-50%, -50%)';
    
    menuDiv.querySelector('.menu-close').addEventListener('click', function() {
        menuDiv.remove();
    });
    
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!menuDiv.contains(e.target) && !e.target.closest('.module-card')) {
                menuDiv.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 100);
}
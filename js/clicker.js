/**
 * clicker.js - Обработка кликов
 * Обрабатывает клики по главной кнопке и создаёт floating numbers
 */

const Clicker = {
    /**
     * Инициализирует обработчик кликов
     */
    init() {
        const generateBtn = document.getElementById('generateBtn');
        const floatingContainer = document.getElementById('floatingNumbers');
        
        generateBtn.addEventListener('click', (e) => {
            this.handleClick(e);
        });
        
        // Поддержка touch событий для мобильных
        generateBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mockEvent = {
                clientX: touch.clientX,
                clientY: touch.clientY,
                target: e.target
            };
            this.handleClick(mockEvent);
        });
    },
    
    /**
     * Обрабатывает клик
     * @param {Event} e - Событие клика
     */
    handleClick(e) {
        const locEarned = GameState.clickPower;
        GameState.addLOC(locEarned);
        GameState.totalClicks++;
        
        // Создаём floating number
        this.createFloatingNumber(e, locEarned);
        
        // Анимация кнопки
        this.animateButton();
        
        // Проверяем достижения по кликам
        Achievements.checkClickAchievements();
        
        // Обновляем UI
        UI.updateResourceDisplay();
    },
    
    /**
     * Создаёт всплывающее число при клике
     * @param {Event} e - Событие клика
     * @param {number} amount - Количество LOC
     */
    createFloatingNumber(e, amount) {
        const container = document.getElementById('floatingNumbers');
        const button = document.getElementById('generateBtn');
        
        const floatEl = document.createElement('div');
        floatEl.className = 'floating-number';
        floatEl.textContent = '+' + Utils.formatNumber(amount);
        
        // Позиционируем относительно центра кнопки
        const rect = button.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        const randomX = Utils.randomRange(-50, 50);
        const x = (rect.left + rect.width / 2) - containerRect.left + randomX;
        const y = (rect.top + rect.height / 2) - containerRect.top;
        
        floatEl.style.left = x + 'px';
        floatEl.style.top = y + 'px';
        
        container.appendChild(floatEl);
        
        // Удаляем элемент после завершения анимации
        setTimeout(() => {
            if (floatEl.parentNode) {
                floatEl.parentNode.removeChild(floatEl);
            }
        }, 1000);
    },
    
    /**
     * Анимация кнопки при клике
     */
    animateButton() {
        const button = document.getElementById('generateBtn');
        button.classList.add('shake');
        
        setTimeout(() => {
            button.classList.remove('shake');
        }, 300);
    }
};

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Clicker;
}

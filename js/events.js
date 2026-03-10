/**
 * events.js - Система случайных событий
 * Управляет случайными событиями и их эффектами
 */

const EventsSystem = {
    // Таймер для следующего события
    eventTimer: null,
    
    // Текущие активные эффекты
    activeBuffs: [],
    
    /**
     * Инициализирует систему событий
     */
    init() {
        this.startEventTimer();
        this.log('Welcome to The Dev-Eater AI!', 'special');
        this.log('Start generating LOC by clicking the button.', 'info');
    },
    
    /**
     * Запускает таймер случайных событий
     */
    startEventTimer() {
        // Первое событие через 30-60 секунд
        const delay = Utils.randomRange(30000, 60000);
        
        this.eventTimer = setTimeout(() => {
            this.triggerRandomEvent();
            // Затем каждые 30-60 секунд
            this.startEventTimer();
        }, delay);
    },
    
    /**
     * Срабатывает случайное событие
     */
    triggerRandomEvent() {
        // Выбираем случайное событие с учётом шанса
        const event = this.selectRandomEvent();
        
        if (event) {
            this.applyEvent(event);
            this.log(`📢 ${event.message}`, 'special');
        }
    },
    
    /**
     * Выбирает случайное событие на основе шансов
     * @returns {Object|null} Выбранное событие
     */
    selectRandomEvent() {
        // Фильтруем события, которые могут произойти
        const availableEvents = GameData.randomEvents.filter(e => {
            return Utils.checkChance(e.chance);
        });
        
        if (availableEvents.length === 0) {
            // Если ничего не выбрано, выбираем любое событие
            return Utils.randomChoice(GameData.randomEvents);
        }
        
        return Utils.randomChoice(availableEvents);
    },
    
    /**
     * Применяет эффект события
     * @param {Object} event - Данные события
     */
    applyEvent(event) {
        const effect = event.effect();
        
        switch (effect.type) {
            case 'loc':
                GameState.addLOC(effect.value);
                UI.updateResourceDisplay();
                break;
                
            case 'dominance':
                GameState.marketDominance = Math.min(100, GameState.marketDominance + effect.value);
                UI.updateTopBar();
                break;
                
            case 'debuff':
            case 'buff':
            case 'click_debuff':
            case 'click_buff':
                GameState.addEffect({
                    type: effect.type,
                    duration: effect.duration,
                    multiplier: effect.multiplier
                });
                GameState.updateCalculatedValues();
                
                // Планируем снятие эффекта
                setTimeout(() => {
                    GameState.updateEffects();
                    GameState.updateCalculatedValues();
                    UI.updateResourceDisplay();
                    this.log(`Effect ended: ${event.name}`, 'info');
                }, effect.duration);
                break;
                
            case 'production_stop':
                GameState.addEffect({
                    type: 'production_stop',
                    duration: effect.duration
                });
                GameState.updateCalculatedValues();
                
                setTimeout(() => {
                    GameState.updateEffects();
                    GameState.updateCalculatedValues();
                    UI.updateResourceDisplay();
                    this.log('Production resumed!', 'success');
                }, effect.duration);
                break;
        }
    },
    
    /**
     * Добавляет запись в лог событий
     * @param {string} message - Сообщение
     * @param {string} type - Тип сообщения (info, success, warning, error, special)
     */
    log(message, type = 'info') {
        const container = document.getElementById('logContainer');
        
        const entryEl = document.createElement('div');
        entryEl.className = `log-entry ${type}`;
        entryEl.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        
        // Вставляем в начало (сверху)
        if (container.firstChild) {
            container.insertBefore(entryEl, container.firstChild);
        } else {
            container.appendChild(entryEl);
        }
        
        // Ограничиваем количество записей
        while (container.children.length > 50) {
            container.removeChild(container.lastChild);
        }
    },
    
    /**
     * Обновляет отображение активных эффектов
     */
    updateActiveEffectsDisplay() {
        // Можно добавить индикаторы активных баффов/дебаффов
    }
};

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EventsSystem;
}

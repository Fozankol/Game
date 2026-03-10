/**
 * saveSystem.js - Система сохранений
 * Управляет автосохранением, загрузкой и offline progress
 */

const SaveSystem = {
    SAVE_KEY: 'devEaterAI_save',
    AUTO_SAVE_INTERVAL: 30000, // 30 секунд
    autoSaveTimer: null,
    
    /**
     * Инициализирует систему сохранений
     */
    init() {
        this.loadGame();
        this.startAutoSave();
        
        // Сохранение при закрытии вкладки
        window.addEventListener('beforeunload', () => {
            this.saveGame();
        });
    },
    
    /**
     * Запускает автосохранение
     */
    startAutoSave() {
        this.autoSaveTimer = setInterval(() => {
            this.saveGame();
        }, this.AUTO_SAVE_INTERVAL);
    },
    
    /**
     * Останавливает автосохранение
     */
    stopAutoSave() {
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
        }
    },
    
    /**
     * Сохраняет игру в localStorage
     */
    saveGame() {
        const data = GameState.export();
        data.lastSaveTime = Date.now();
        
        try {
            localStorage.setItem(this.SAVE_KEY, JSON.stringify(data));
            console.log('Game saved successfully');
        } catch (e) {
            console.error('Failed to save game:', e);
        }
    },
    
    /**
     * Загружает игру из localStorage
     */
    loadGame() {
        try {
            const savedData = localStorage.getItem(this.SAVE_KEY);
            
            if (savedData) {
                const data = JSON.parse(savedData);
                GameState.import(data);
                
                // Обрабатываем offline progress
                this.processOfflineProgress(data.lastSaveTime);
                
                EventsSystem.log('Game loaded successfully!', 'success');
                return true;
            }
        } catch (e) {
            console.error('Failed to load game:', e);
        }
        
        // Если нет сохранения, инициализируем новое состояние
        GameState.init();
        EventsSystem.log('New game started!', 'info');
        return false;
    },
    
    /**
     * Обрабатывает прогресс пока игрок был офлайн
     * @param {number} lastSaveTime - Время последнего сохранения
     */
    processOfflineProgress(lastSaveTime) {
        const now = Date.now();
        const offlineTime = now - lastSaveTime;
        
        // Минимум 1 минута офлайн для начисления прогресса
        if (offlineTime < 60000) return;
        
        // Получаем LOC/sec на момент сохранения
        const locPerSecond = GameState.calculateLOCPerSecond();
        
        if (locPerSecond <= 0) return;
        
        // Считаем офлайн прогресс (50% эффективности)
        const offlineSeconds = offlineTime / 1000;
        const offlineLOC = Math.floor(locPerSecond * offlineSeconds * 0.5);
        
        if (offlineLOC > 0) {
            GameState.addLOC(offlineLOC);
            
            // Показываем модальное окно
            this.showOfflineModal(offlineTime, offlineLOC);
            
            EventsSystem.log(`Offline progress: +${Utils.formatNumber(offlineLOC)} LOC`, 'success');
        }
    },
    
    /**
     * Показывает модальное окно офлайн прогресса
     * @param {number} offlineTime - Время офлайн в мс
     * @param {number} offlineLOC - Заработанные LOC
     */
    showOfflineModal(offlineTime, offlineLOC) {
        const modal = document.getElementById('offlineModal');
        const messageEl = document.getElementById('offlineMessage');
        
        const timeString = Utils.formatTime(offlineTime);
        
        messageEl.innerHTML = `
            You were offline for <strong>${timeString}</strong>.<br><br>
            Your AI generated <strong style="color: var(--neon-green);">${Utils.formatNumber(offlineLOC)} LOC</strong> while you were away!
        `;
        
        modal.classList.remove('hidden');
    },
    
    /**
     * Сбрасывает сохранение
     */
    resetSave() {
        try {
            localStorage.removeItem(this.SAVE_KEY);
            EventsSystem.log('Save data cleared!', 'warning');
        } catch (e) {
            console.error('Failed to clear save:', e);
        }
    },
    
    /**
     * Экспортирует сохранение в строку
     * @returns {string} Base64 encoded save
     */
    exportSave() {
        const data = GameState.export();
        return btoa(JSON.stringify(data));
    },
    
    /**
     * Импортирует сохранение из строки
     * @param {string} saveString - Base64 encoded save
     * @returns {boolean} Успешность импорта
     */
    importSave(saveString) {
        try {
            const data = JSON.parse(atob(saveString));
            GameState.import(data);
            this.saveGame();
            return true;
        } catch (e) {
            console.error('Failed to import save:', e);
            return false;
        }
    }
};

// Глобальная функция для закрытия модальных окон
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SaveSystem;
}

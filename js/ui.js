/**
 * ui.js - Система пользовательского интерфейса
 * Управляет обновлением и рендерингом UI элементов
 */

const UI = {
    /**
     * Инициализирует UI систему
     */
    init() {
        this.cacheElements();
    },
    
    /**
     * Кэширует DOM элементы для производительности
     */
    cacheElements() {
        this.elements = {
            locCount: document.getElementById('locCount'),
            locPerSecond: document.getElementById('locPerSecond'),
            totalLOC: document.getElementById('totalLOC'),
            clickPower: document.getElementById('clickPower'),
            marketDominance: document.getElementById('marketDominance'),
            aiLevel: document.getElementById('aiLevel'),
            aiLevelName: document.getElementById('aiLevelName'),
            levelProgress: document.getElementById('levelProgress'),
            currentLevelLOC: document.getElementById('currentLevelLOC'),
            nextLevelLOC: document.getElementById('nextLevelLOC'),
            neuralChips: document.getElementById('neuralChips')
        };
    },
    
    /**
     * Обновляет все UI элементы
     */
    updateAll() {
        this.updateResourceDisplay();
        this.updateTopBar();
        this.updateLevelProgress();
        this.updateShopAvailability();
        this.updatePrestigeDisplay();
    },
    
    /**
     * Обновляет отображение ресурсов
     */
    updateResourceDisplay() {
        if (!this.elements.locCount) return;
        
        this.elements.locCount.textContent = Utils.formatNumber(GameState.loc);
        this.elements.locPerSecond.textContent = Utils.formatNumber(GameState.locPerSecond);
        this.elements.totalLOC.textContent = Utils.formatNumber(GameState.totalLOC);
        this.elements.clickPower.textContent = Utils.formatNumber(GameState.clickPower);
        this.elements.neuralChips.textContent = GameState.neuralChips;
        
        // Обновляем заголовок вкладки
        document.title = `${Utils.formatNumber(GameState.loc)} LOC - The Dev-Eater AI`;
    },
    
    /**
     * Обновляет верхнюю панель
     */
    updateTopBar() {
        if (!this.elements.marketDominance) return;
        
        this.elements.marketDominance.textContent = Utils.formatPercent(GameState.marketDominance);
    },
    
    /**
     * Обновляет прогресс уровня ИИ
     */
    updateLevelProgress() {
        if (!this.elements.levelProgress) return;
        
        const progress = GameState.getLevelProgress();
        const currentLevel = GameState.getCurrentAILevel();
        
        this.elements.aiLevel.textContent = currentLevel.level;
        this.elements.aiLevelName.textContent = currentLevel.name;
        this.elements.levelProgress.style.width = progress.percent + '%';
        this.elements.currentLevelLOC.textContent = Utils.formatNumber(progress.current);
        this.elements.nextLevelLOC.textContent = Utils.formatNumber(progress.next);
    },
    
    /**
     * Обновляет доступность апгрейдов в магазине
     */
    updateShopAvailability() {
        Generators.updateAllAvailability();
        Upgrades.updateAllAvailability();
        Research.updateAllAvailability();
    },
    
    /**
     * Обновляет отображение престижа
     */
    updatePrestigeDisplay() {
        Prestige.updatePrestigeDisplay();
    },
    
    /**
     * Запускает игровой цикл обновления UI
     */
    startGameLoop() {
        // Основное обновление каждые 100мс
        setInterval(() => {
            this.fastUpdate();
        }, 100);
        
        // Медленное обновление каждые 1 секунду
        setInterval(() => {
            this.slowUpdate();
        }, 1000);
    },
    
    /**
     * Быстрое обновление (часто меняющиеся элементы)
     */
    fastUpdate() {
        // Плавное обновление LOC от авто-генерации
        if (GameState.locPerSecond > 0) {
            const locToAdd = GameState.locPerSecond / 10; // 10 раз в секунду
            GameState.addLOC(locToAdd);
            this.updateResourceDisplay();
        }
        
        // Проверяем активные эффекты
        GameState.updateEffects();
    },
    
    /**
     * Медленное обновление (раз в секунду)
     */
    slowUpdate() {
        // Обновляем Market Dominance на основе прогресса
        const dominanceTarget = Math.min(100, Math.log10(GameState.totalLOC + 1) * 10);
        if (GameState.marketDominance < dominanceTarget) {
            GameState.marketDominance += 0.1;
            this.updateTopBar();
        }
        
        // Проверяем повышение уровня
        if (GameState.checkLevelUp()) {
            EventsSystem.log(`🎉 AI Level up! Now: ${GameState.getCurrentAILevel().name}`, 'special');
            this.updateLevelProgress();
        }
        
        // Проверяем достижения
        Achievements.checkAllAchievements();
        
        // Проверяем спавн босса
        Bosses.checkBossSpawn();
        
        // Обновляем доступность магазина
        this.updateShopAvailability();
    }
};

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UI;
}

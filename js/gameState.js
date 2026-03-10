/**
 * gameState.js - Состояние игры
 * Хранит всё игровое состояние и предоставляет методы для работы с ним
 */

const GameState = {
    // Основные ресурсы
    loc: 0,
    totalLOC: 0,
    locPerSecond: 0,
    clickPower: 1,
    
    // Прогресс
    marketDominance: 0,
    aiLevel: 1,
    
    // Статистика
    totalClicks: 0,
    totalUpgradesPurchased: 0,
    prestigeCount: 0,
    
    // Валюта престижа
    neuralChips: 0,
    
    // Генераторы (количество каждого)
    generators: {},
    
    // Купленные апгрейды
    clickUpgrades: {},
    multiplierUpgrades: {},
    
    // Исследования
    research: {},
    
    // Достижения
    achievements: [],
    
    // Активные эффекты событий
    activeEffects: [],
    
    // Боссы
    currentBoss: null,
    bossesDefeated: 0,
    
    // Время последнего сохранения
    lastSaveTime: Date.now(),
    
    // Время последней активности (для offline progress)
    lastActiveTime: Date.now(),
    
    /**
     * Инициализирует начальное состояние игры
     */
    init() {
        // Инициализируем генераторы нулями
        GameData.generators.forEach(gen => {
            this.generators[gen.id] = 0;
        });
        
        // Инициализируем кликовые апгрейды
        GameData.clickUpgrades.forEach(upg => {
            this.clickUpgrades[upg.id] = 0;
        });
        
        // Инициализируем мультипликаторы
        GameData.multiplierUpgrades.forEach(upg => {
            this.multiplierUpgrades[upg.id] = false;
        });
        
        // Инициализируем исследования
        GameData.research.forEach(res => {
            this.research[res.id] = false;
        });
    },
    
    /**
     * Добавляет LOC
     * @param {number} amount - Количество LOC
     */
    addLOC(amount) {
        this.loc += amount;
        this.totalLOC += amount;
    },
    
    /**
     * Тратит LOC
     * @param {number} amount - Количество LOC
     * @returns {boolean} Удалось ли потратить
     */
    spendLOC(amount) {
        if (this.loc >= amount) {
            this.loc -= amount;
            return true;
        }
        return false;
    },
    
    /**
     * Получает текущий уровень ИИ
     * @returns {Object} Информация об уровне
     */
    getCurrentAILevel() {
        for (let i = GameData.aiLevels.length - 1; i >= 0; i--) {
            if (this.totalLOC >= GameData.aiLevels[i].requiredLOC) {
                return GameData.aiLevels[i];
            }
        }
        return GameData.aiLevels[0];
    },
    
    /**
     * Получает прогресс до следующего уровня
     * @returns {Object} {current, next, percent}
     */
    getLevelProgress() {
        const currentLevel = this.getCurrentAILevel();
        const currentIndex = GameData.aiLevels.findIndex(l => l.level === currentLevel.level);
        
        if (currentIndex >= GameData.aiLevels.length - 1) {
            return { current: this.totalLOC, next: this.totalLOC, percent: 100 };
        }
        
        const nextLevel = GameData.aiLevels[currentIndex + 1];
        const prevRequired = currentLevel.requiredLOC;
        const nextRequired = nextLevel.requiredLOC;
        
        const progress = this.totalLOC - prevRequired;
        const total = nextRequired - prevRequired;
        const percent = Math.min(100, (progress / total) * 100);
        
        return {
            current: this.totalLOC,
            next: nextRequired,
            percent: percent
        };
    },
    
    /**
     * Рассчитывает LOC за клик
     * @returns {number} LOC за клик
     */
    calculateClickPower() {
        let baseClick = 1;
        
        // Бонусы от кликовых апгрейдов
        GameData.clickUpgrades.forEach(upg => {
            const count = this.clickUpgrades[upg.id] || 0;
            baseClick += upg.bonus * count;
        });
        
        // Мультипликаторы кликов
        let clickMultiplier = 1;
        GameData.multiplierUpgrades.forEach(upg => {
            if (upg.isClickMultiplier && this.multiplierUpgrades[upg.id]) {
                clickMultiplier *= upg.multiplier;
            }
        });
        
        // Бонусы от достижений
        this.achievements.forEach(achId => {
            const ach = GameData.achievements.find(a => a.id === achId);
            if (ach && ach.bonus.includes('click')) {
                const bonusPercent = parseFloat(ach.bonus) / 100;
                clickMultiplier += bonusPercent;
            }
        });
        
        // Бонусы от престижа
        if (this.neuralChips > 0) {
            clickMultiplier += this.neuralChips * 0.1; // +10% per chip
        }
        
        // Применяем активные эффекты
        this.activeEffects.forEach(effect => {
            if (effect.type === 'click_debuff' || effect.type === 'click_buff') {
                clickMultiplier *= effect.multiplier;
            }
        });
        
        return baseClick * clickMultiplier;
    },
    
    /**
     * Рассчитывает LOC в секунду
     * @returns {number} LOC/sec
     */
    calculateLOCPerSecond() {
        let baseProduction = 0;
        
        // Производство от генераторов
        GameData.generators.forEach(gen => {
            const count = this.generators[gen.id] || 0;
            baseProduction += gen.baseProduction * count;
        });
        
        // Мультипликаторы производства
        let productionMultiplier = 1;
        GameData.multiplierUpgrades.forEach(upg => {
            if (!upg.isClickMultiplier && this.multiplierUpgrades[upg.id]) {
                productionMultiplier *= upg.multiplier;
            }
        });
        
        // Бонусы от исследований
        GameData.research.forEach(res => {
            if (this.research[res.id]) {
                if (res.bonus.includes('%')) {
                    const bonusPercent = parseFloat(res.bonus) / 100;
                    productionMultiplier += bonusPercent;
                }
            }
        });
        
        // Бонусы от достижений
        this.achievements.forEach(achId => {
            const ach = GameData.achievements.find(a => a.id === achId);
            if (ach && (ach.bonus.includes('LOC/sec') || ach.bonus.includes('production'))) {
                const bonusPercent = parseFloat(ach.bonus) / 100;
                productionMultiplier += bonusPercent;
            }
        });
        
        // Бонусы от престижа
        if (this.neuralChips > 0) {
            productionMultiplier += this.neuralChips * 0.05; // +5% per chip
        }
        
        // Применяем активные эффекты
        this.activeEffects.forEach(effect => {
            if (effect.type === 'debuff' || effect.type === 'buff') {
                productionMultiplier *= effect.multiplier;
            }
            if (effect.type === 'production_stop') {
                productionMultiplier = 0;
            }
        });
        
        return baseProduction * productionMultiplier;
    },
    
    /**
     * Обновляет рассчитанные значения
     */
    updateCalculatedValues() {
        this.clickPower = this.calculateClickPower();
        this.locPerSecond = this.calculateLOCPerSecond();
    },
    
    /**
     * Проверяет и обновляет уровень ИИ
     * @returns {boolean} Повысился ли уровень
     */
    checkLevelUp() {
        const newLevel = this.getCurrentAILevel().level;
        if (newLevel > this.aiLevel) {
            this.aiLevel = newLevel;
            return true;
        }
        return false;
    },
    
    /**
     * Добавляет активный эффект
     * @param {Object} effect - Эффект
     */
    addEffect(effect) {
        effect.endTime = Date.now() + effect.duration;
        this.activeEffects.push(effect);
    },
    
    /**
     * Обновляет активные эффекты (удаляет истёкшие)
     */
    updateEffects() {
        const now = Date.now();
        this.activeEffects = this.activeEffects.filter(effect => {
            return effect.endTime > now;
        });
    },
    
    /**
     * Сбрасывает прогресс для престижа
     * @returns {number} Количество полученных Neural Chips
     */
    performPrestige() {
        const chipsEarned = Math.floor(Math.sqrt(this.totalLOC / 1000000));
        
        this.neuralChips += chipsEarned;
        this.prestigeCount++;
        
        // Сбрасываем прогресс
        this.loc = 0;
        this.totalLOC = 0;
        this.aiLevel = 1;
        this.marketDominance = 0;
        
        // Сбрасываем генераторы
        GameData.generators.forEach(gen => {
            this.generators[gen.id] = 0;
        });
        
        // Сбрасываем апгрейды
        GameData.clickUpgrades.forEach(upg => {
            this.clickUpgrades[upg.id] = 0;
        });
        
        GameData.multiplierUpgrades.forEach(upg => {
            this.multiplierUpgrades[upg.id] = false;
        });
        
        // Сбрасываем исследования
        GameData.research.forEach(res => {
            this.research[res.id] = false;
        });
        
        // Сбрасываем эффекты
        this.activeEffects = [];
        this.currentBoss = null;
        
        // Сохраняем достижения и статистику престижа
        const savedAchievements = [...this.achievements];
        const savedPrestigeCount = this.prestigeCount;
        const savedNeuralChips = this.neuralChips;
        const savedBossesDefeated = this.bossesDefeated;
        
        this.init();
        
        this.achievements = savedAchievements;
        this.prestigeCount = savedPrestigeCount;
        this.neuralChips = savedNeuralChips;
        this.bossesDefeated = savedBossesDefeated;
        
        return chipsEarned;
    },
    
    /**
     * Экспортирует состояние в объект для сохранения
     * @returns {Object} Сериализуемое состояние
     */
    export() {
        return {
            loc: this.loc,
            totalLOC: this.totalLOC,
            marketDominance: this.marketDominance,
            aiLevel: this.aiLevel,
            totalClicks: this.totalClicks,
            totalUpgradesPurchased: this.totalUpgradesPurchased,
            prestigeCount: this.prestigeCount,
            neuralChips: this.neuralChips,
            generators: this.generators,
            clickUpgrades: this.clickUpgrades,
            multiplierUpgrades: this.multiplierUpgrades,
            research: this.research,
            achievements: this.achievements,
            bossesDefeated: this.bossesDefeated,
            lastSaveTime: Date.now()
        };
    },
    
    /**
     * Импортирует состояние из сохранённого объекта
     * @param {Object} data - Сохранённые данные
     */
    import(data) {
        this.loc = data.loc || 0;
        this.totalLOC = data.totalLOC || 0;
        this.marketDominance = data.marketDominance || 0;
        this.aiLevel = data.aiLevel || 1;
        this.totalClicks = data.totalClicks || 0;
        this.totalUpgradesPurchased = data.totalUpgradesPurchased || 0;
        this.prestigeCount = data.prestigeCount || 0;
        this.neuralChips = data.neuralChips || 0;
        this.generators = data.generators || {};
        this.clickUpgrades = data.clickUpgrades || {};
        this.multiplierUpgrades = data.multiplierUpgrades || {};
        this.research = data.research || {};
        this.achievements = data.achievements || [];
        this.bossesDefeated = data.bossesDefeated || 0;
        this.lastSaveTime = data.lastSaveTime || Date.now();
        this.lastActiveTime = Date.now();
        
        // Инициализируем отсутствующие поля
        this.init();
        
        // Merge saved data with initialized data
        if (data.generators) {
            Object.assign(this.generators, data.generators);
        }
        if (data.clickUpgrades) {
            Object.assign(this.clickUpgrades, data.clickUpgrades);
        }
        if (data.multiplierUpgrades) {
            Object.assign(this.multiplierUpgrades, data.multiplierUpgrades);
        }
        if (data.research) {
            Object.assign(this.research, data.research);
        }
        
        this.updateCalculatedValues();
    }
};

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameState;
}

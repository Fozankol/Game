/**
 * generators.js - Система генераторов
 * Управляет покупкой и производством генераторов LOC
 */

const Generators = {
    /**
     * Инициализирует систему генераторов
     */
    init() {
        this.renderShop();
    },
    
    /**
     * Рендерит магазин генераторов
     */
    renderShop() {
        const container = document.getElementById('generatorsTab');
        container.innerHTML = '';
        
        GameData.generators.forEach(gen => {
            const count = GameState.generators[gen.id] || 0;
            const cost = this.getCost(gen.baseCost, count);
            
            const itemEl = document.createElement('div');
            itemEl.className = 'upgrade-item';
            itemEl.id = `gen-${gen.id}`;
            itemEl.onclick = () => this.buyGenerator(gen.id);
            
            itemEl.innerHTML = `
                <div class="upgrade-info">
                    <div class="upgrade-name">${gen.name}</div>
                    <div class="upgrade-desc">${gen.description}</div>
                </div>
                <div class="upgrade-cost">
                    ${Utils.formatNumber(cost)} LOC
                    <span class="upgrade-count">${count}</span>
                </div>
            `;
            
            container.appendChild(itemEl);
        });
    },
    
    /**
     * Рассчитывает стоимость генератора
     * @param {number} baseCost - Базовая стоимость
     * @param {number} count - Текущее количество
     * @returns {number} Текущая стоимость
     */
    getCost(baseCost, count) {
        return Math.floor(baseCost * Math.pow(1.15, count));
    },
    
    /**
     * Покупает генератор
     * @param {string} genId - ID генератора
     */
    buyGenerator(genId) {
        const gen = GameData.generators.find(g => g.id === genId);
        if (!gen) return;
        
        const count = GameState.generators[genId] || 0;
        const cost = this.getCost(gen.baseCost, count);
        
        if (GameState.spendLOC(cost)) {
            GameState.generators[genId] = count + 1;
            GameState.totalUpgradesPurchased++;
            
            // Обновляем расчёты
            GameState.updateCalculatedValues();
            
            // Обновляем UI
            this.updateGeneratorDisplay(genId);
            UI.updateResourceDisplay();
            
            // Лог события
            EventsSystem.log(`Purchased ${gen.name}. Production increased!`, 'success');
            
            // Проверяем достижения
            Achievements.checkUpgradeAchievements();
        } else {
            EventsSystem.log('Not enough LOC!', 'error');
        }
    },
    
    /**
     * Обновляет отображение конкретного генератора
     * @param {string} genId - ID генератора
     */
    updateGeneratorDisplay(genId) {
        const gen = GameData.generators.find(g => g.id === genId);
        if (!gen) return;
        
        const el = document.getElementById(`gen-${genId}`);
        if (!el) return;
        
        const count = GameState.generators[genId];
        const cost = this.getCost(gen.baseCost, count);
        
        el.querySelector('.upgrade-count').textContent = count;
        el.querySelector('.upgrade-cost').innerHTML = `${Utils.formatNumber(cost)} LOC <span class="upgrade-count">${count}</span>`;
        
        // Проверяем доступность
        if (GameState.loc >= cost) {
            el.classList.remove('disabled');
        } else {
            el.classList.add('disabled');
        }
    },
    
    /**
     * Обновляет доступность всех генераторов
     */
    updateAllAvailability() {
        GameData.generators.forEach(gen => {
            const count = GameState.generators[gen.id] || 0;
            const cost = this.getCost(gen.baseCost, count);
            const el = document.getElementById(`gen-${gen.id}`);
            
            if (el) {
                if (GameState.loc >= cost) {
                    el.classList.remove('disabled');
                } else {
                    el.classList.add('disabled');
                }
            }
        });
    },
    
    /**
     * Получает общее производство от всех генераторов
     * @returns {number} Базовое производство
     */
    getTotalProduction() {
        let total = 0;
        GameData.generators.forEach(gen => {
            const count = GameState.generators[gen.id] || 0;
            total += gen.baseProduction * count;
        });
        return total;
    }
};

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Generators;
}

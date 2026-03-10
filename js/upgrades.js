/**
 * upgrades.js - Система апгрейдов
 * Управляет покупкой кликовых апгрейдов и мультипликаторов
 */

const Upgrades = {
    /**
     * Инициализирует систему апгрейдов
     */
    init() {
        this.renderClickUpgrades();
        this.renderMultiplierUpgrades();
        this.setupTabs();
    },
    
    /**
     * Настраивает переключение вкладок магазина
     */
    setupTabs() {
        const tabs = document.querySelectorAll('.tab-btn');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Удаляем активный класс со всех кнопок
                tabs.forEach(t => t.classList.remove('active'));
                // Добавляем активный класс нажатой кнопке
                tab.classList.add('active');
                
                // Скрываем все контенты
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                // Показываем нужный контент
                const tabName = tab.dataset.tab;
                document.getElementById(`${tabName}Tab`).classList.add('active');
            });
        });
    },
    
    /**
     * Рендерит магазин кликовых апгрейдов
     */
    renderClickUpgrades() {
        const container = document.getElementById('clicksTab');
        container.innerHTML = '';
        
        GameData.clickUpgrades.forEach(upg => {
            const count = GameState.clickUpgrades[upg.id] || 0;
            const cost = this.getClickUpgradeCost(upg.baseCost, count);
            
            const itemEl = document.createElement('div');
            itemEl.className = 'upgrade-item';
            itemEl.id = `click-${upg.id}`;
            itemEl.onclick = () => this.buyClickUpgrade(upg.id);
            
            // Если уже куплен (для кликовых апгрейдов можно покупать несколько раз)
            if (count >= 10) {
                itemEl.classList.add('purchased');
            }
            
            itemEl.innerHTML = `
                <div class="upgrade-info">
                    <div class="upgrade-name">${upg.name}</div>
                    <div class="upgrade-desc">${upg.description}</div>
                </div>
                <div class="upgrade-cost">
                    ${Utils.formatNumber(cost)} LOC
                    <span class="upgrade-count">${count}/10</span>
                </div>
            `;
            
            container.appendChild(itemEl);
        });
    },
    
    /**
     * Рендерит магазин мультипликаторов
     */
    renderMultiplierUpgrades() {
        const container = document.getElementById('multipliersTab');
        container.innerHTML = '';
        
        GameData.multiplierUpgrades.forEach(upg => {
            const purchased = GameState.multiplierUpgrades[upg.id];
            
            const itemEl = document.createElement('div');
            itemEl.className = 'upgrade-item';
            itemEl.id = `mult-${upg.id}`;
            
            if (!purchased) {
                itemEl.onclick = () => this.buyMultiplier(upg.id);
            } else {
                itemEl.classList.add('purchased');
            }
            
            const percentBonus = Math.round((upg.multiplier - 1) * 100);
            
            itemEl.innerHTML = `
                <div class="upgrade-info">
                    <div class="upgrade-name">${upg.name}</div>
                    <div class="upgrade-desc">${upg.description}</div>
                </div>
                <div class="upgrade-cost">
                    ${purchased ? '✓ PURCHASED' : Utils.formatNumber(upg.baseCost) + ' LOC'}
                </div>
            `;
            
            container.appendChild(itemEl);
        });
    },
    
    /**
     * Рассчитывает стоимость кликового апгрейда
     * @param {number} baseCost - Базовая стоимость
     * @param {number} count - Текущее количество
     * @returns {number} Текущая стоимость
     */
    getClickUpgradeCost(baseCost, count) {
        return Math.floor(baseCost * Math.pow(1.3, count));
    },
    
    /**
     * Покупает кликовый апгрейд
     * @param {string} upgId - ID апгрейда
     */
    buyClickUpgrade(upgId) {
        const upg = GameData.clickUpgrades.find(u => u.id === upgId);
        if (!upg) return;
        
        const count = GameState.clickUpgrades[upgId] || 0;
        
        // Максимум 10 покупок одного апгрейда
        if (count >= 10) {
            EventsSystem.log('Maximum upgrade level reached!', 'warning');
            return;
        }
        
        const cost = this.getClickUpgradeCost(upg.baseCost, count);
        
        if (GameState.spendLOC(cost)) {
            GameState.clickUpgrades[upgId] = count + 1;
            GameState.totalUpgradesPurchased++;
            
            // Обновляем расчёты
            GameState.updateCalculatedValues();
            
            // Обновляем UI
            this.updateClickUpgradeDisplay(upgId);
            UI.updateResourceDisplay();
            
            // Лог события
            EventsSystem.log(`Purchased ${upg.name}. Click power increased!`, 'success');
            
            // Проверяем достижения
            Achievements.checkUpgradeAchievements();
        } else {
            EventsSystem.log('Not enough LOC!', 'error');
        }
    },
    
    /**
     * Покупает мультипликатор
     * @param {string} upgId - ID апгрейда
     */
    buyMultiplier(upgId) {
        const upg = GameData.multiplierUpgrades.find(u => u.id === upgId);
        if (!upg) return;
        
        if (GameState.multiplierUpgrades[upgId]) {
            EventsSystem.log('Already purchased!', 'warning');
            return;
        }
        
        if (GameState.spendLOC(upg.baseCost)) {
            GameState.multiplierUpgrades[upgId] = true;
            GameState.totalUpgradesPurchased++;
            
            // Обновляем расчёты
            GameState.updateCalculatedValues();
            
            // Обновляем UI
            this.updateMultiplierDisplay(upgId);
            UI.updateResourceDisplay();
            
            // Лог события
            EventsSystem.log(`Purchased ${upg.name}. Production multiplier applied!`, 'success');
            
            // Проверяем достижения
            Achievements.checkUpgradeAchievements();
        } else {
            EventsSystem.log('Not enough LOC!', 'error');
        }
    },
    
    /**
     * Обновляет отображение кликового апгрейда
     * @param {string} upgId - ID апгрейда
     */
    updateClickUpgradeDisplay(upgId) {
        const upg = GameData.clickUpgrades.find(u => u.id === upgId);
        if (!upg) return;
        
        const el = document.getElementById(`click-${upgId}`);
        if (!el) return;
        
        const count = GameState.clickUpgrades[upgId];
        const cost = this.getClickUpgradeCost(upg.baseCost, count);
        
        el.querySelector('.upgrade-count').textContent = `${count}/10`;
        el.querySelector('.upgrade-cost').innerHTML = `${Utils.formatNumber(cost)} LOC <span class="upgrade-count">${count}/10</span>`;
        
        if (count >= 10) {
            el.classList.add('purchased');
            el.onclick = null;
        } else if (GameState.loc >= cost) {
            el.classList.remove('disabled');
        } else {
            el.classList.add('disabled');
        }
    },
    
    /**
     * Обновляет отображение мультипликатора
     * @param {string} upgId - ID апгрейда
     */
    updateMultiplierDisplay(upgId) {
        const upg = GameData.multiplierUpgrades.find(u => u.id === upgId);
        if (!upg) return;
        
        const el = document.getElementById(`mult-${upgId}`);
        if (!el) return;
        
        el.classList.add('purchased');
        el.querySelector('.upgrade-cost').textContent = '✓ PURCHASED';
        el.onclick = null;
    },
    
    /**
     * Обновляет доступность всех апгрейдов
     */
    updateAllAvailability() {
        // Кликовые апгрейды
        GameData.clickUpgrades.forEach(upg => {
            const count = GameState.clickUpgrades[upg.id] || 0;
            if (count >= 10) return;
            
            const cost = this.getClickUpgradeCost(upg.baseCost, count);
            const el = document.getElementById(`click-${upg.id}`);
            
            if (el) {
                if (GameState.loc >= cost) {
                    el.classList.remove('disabled');
                } else {
                    el.classList.add('disabled');
                }
            }
        });
        
        // Мультипликаторы
        GameData.multiplierUpgrades.forEach(upg => {
            if (GameState.multiplierUpgrades[upg.id]) return;
            
            const el = document.getElementById(`mult-${upg.id}`);
            
            if (el) {
                if (GameState.loc >= upg.baseCost) {
                    el.classList.remove('disabled');
                } else {
                    el.classList.add('disabled');
                }
            }
        });
    }
};

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Upgrades;
}

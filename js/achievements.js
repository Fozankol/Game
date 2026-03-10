/**
 * achievements.js - Система достижений
 * Управляет отслеживанием и разблокировкой достижений
 */

const Achievements = {
    /**
     * Инициализирует систему достижений
     */
    init() {
        this.renderAchievements();
        this.checkAllAchievements();
    },
    
    /**
     * Рендерит список достижений
     */
    renderAchievements() {
        const container = document.getElementById('achievementsList');
        container.innerHTML = '';
        
        GameData.achievements.forEach(ach => {
            const unlocked = GameState.achievements.includes(ach.id);
            
            const itemEl = document.createElement('div');
            itemEl.className = 'achievement-item';
            itemEl.id = `ach-${ach.id}`;
            itemEl.onclick = () => this.showAchievementDetails(ach.id);
            
            if (unlocked) {
                itemEl.classList.add('unlocked');
            }
            
            itemEl.innerHTML = `
                <div class="achievement-icon">${ach.icon}</div>
                <div class="achievement-name">${ach.name}</div>
            `;
            
            container.appendChild(itemEl);
        });
    },
    
    /**
     * Показывает детали достижения
     * @param {string} achId - ID достижения
     */
    showAchievementDetails(achId) {
        const ach = GameData.achievements.find(a => a.id === achId);
        if (!ach) return;
        
        const unlocked = GameState.achievements.includes(achId);
        
        if (unlocked) {
            EventsSystem.log(`${ach.name}: ${ach.description}. Bonus: ${ach.bonus}`, 'success');
        } else {
            EventsSystem.log(`${ach.name}: ${ach.description} (Locked)`, 'info');
        }
    },
    
    /**
     * Проверяет все достижения
     */
    checkAllAchievements() {
        GameData.achievements.forEach(ach => {
            if (!GameState.achievements.includes(ach.id)) {
                if (ach.type === 'clicks') {
                    // Проверяется отдельно
                } else if (ach.type === 'upgrades') {
                    // Проверяется отдельно
                } else if (ach.type === 'prestige') {
                    // Проверяется отдельно
                } else {
                    // Стандартные достижения по LOC
                    if (GameState.totalLOC >= ach.requirement) {
                        this.unlock(ach.id);
                    }
                }
            }
        });
    },
    
    /**
     * Проверяет достижения по кликам
     */
    checkClickAchievements() {
        GameData.achievements.forEach(ach => {
            if (ach.type === 'clicks' && !GameState.achievements.includes(ach.id)) {
                if (GameState.totalClicks >= ach.requirement) {
                    this.unlock(ach.id);
                }
            }
        });
    },
    
    /**
     * Проверяет достижения по апгрейдам
     */
    checkUpgradeAchievements() {
        GameData.achievements.forEach(ach => {
            if (ach.type === 'upgrades' && !GameState.achievements.includes(ach.id)) {
                if (GameState.totalUpgradesPurchased >= ach.requirement) {
                    this.unlock(ach.id);
                }
            }
        });
    },
    
    /**
     * Проверяет достижения престижа
     */
    checkPrestigeAchievements() {
        GameData.achievements.forEach(ach => {
            if (ach.type === 'prestige' && !GameState.achievements.includes(ach.id)) {
                if (GameState.prestigeCount >= ach.requirement) {
                    this.unlock(ach.id);
                }
            }
        });
    },
    
    /**
     * Разблокирует достижение
     * @param {string} achId - ID достижения
     */
    unlock(achId) {
        const ach = GameData.achievements.find(a => a.id === achId);
        if (!ach) return;
        
        GameState.achievements.push(achId);
        
        // Обновляем UI
        const el = document.getElementById(`ach-${achId}`);
        if (el) {
            el.classList.add('unlocked');
        }
        
        // Показываем уведомление
        this.showAchievementModal(ach);
        
        // Лог события
        EventsSystem.log(`🏆 Achievement unlocked: ${ach.name}! Bonus: ${ach.bonus}`, 'special');
        
        // Обновляем расчёты (достижения дают бонусы)
        GameState.updateCalculatedValues();
    },
    
    /**
     * Показывает модальное окно достижения
     * @param {Object} ach - Данные достижения
     */
    showAchievementModal(ach) {
        const modal = document.getElementById('achievementModal');
        document.getElementById('achievementName').textContent = `${ach.icon} ${ach.name}`;
        document.getElementById('achievementBonus').textContent = `Bonus: ${ach.bonus}`;
        
        modal.classList.remove('hidden');
        
        // Автоматически закрываем через 3 секунды
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 3000);
    },
    
    /**
     * Получает общий бонус от достижений
     * @returns {Object} {clickMultiplier, productionMultiplier}
     */
    getTotalBonus() {
        let clickMultiplier = 1;
        let productionMultiplier = 1;
        
        GameState.achievements.forEach(achId => {
            const ach = GameData.achievements.find(a => a.id === achId);
            if (ach) {
                if (ach.bonus.includes('click')) {
                    const bonus = parseFloat(ach.bonus) / 100;
                    clickMultiplier += bonus;
                }
                if (ach.bonus.includes('LOC/sec') || ach.bonus.includes('production')) {
                    const bonus = parseFloat(ach.bonus) / 100;
                    productionMultiplier += bonus;
                }
            }
        });
        
        return { clickMultiplier, productionMultiplier };
    }
};

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Achievements;
}

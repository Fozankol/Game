/**
 * prestige.js - Система престижа (Singularity Reset)
 * Управляет механикой перерождения
 */

const Prestige = {
    /**
     * Инициализирует систему престижа
     */
    init() {
        this.setupPrestigeButton();
        this.updatePrestigeDisplay();
    },
    
    /**
     * Настраивает кнопку престижа
     */
    setupPrestigeButton() {
        const prestigeBtn = document.getElementById('prestigeBtn');
        if (prestigeBtn) {
            prestigeBtn.addEventListener('click', () => {
                this.performPrestige();
            });
        }
    },
    
    /**
     * Рассчитывает количество Neural Chips за престиж
     * @returns {number} Количество чипов
     */
    calculateChipsEarned() {
        // Формула: sqrt(totalLOC / 1,000,000)
        return Math.floor(Math.sqrt(GameState.totalLOC / 1000000));
    },
    
    /**
     * Проверяет доступность престижа
     * @returns {boolean} Доступен ли престиж
     */
    isPrestigeAvailable() {
        return GameState.totalLOC >= 1000000; // Минимум 1M LOC для престижа
    },
    
    /**
     * Обновляет отображение кнопки престижа
     */
    updatePrestigeDisplay() {
        const btn = document.getElementById('prestigeBtn');
        const info = document.getElementById('prestigeInfo');
        
        if (!btn || !info) return;
        
        const chipsEarned = this.calculateChipsEarned();
        
        if (this.isPrestigeAvailable()) {
            btn.disabled = false;
            info.innerHTML = `
                <div>Perform Singularity Reset to gain:</div>
                <div style="color: var(--neon-purple); font-weight: bold; margin-top: 5px;">
                    🧠 ${chipsEarned} Neural Chip${chipsEarned !== 1 ? 's' : ''}
                </div>
                <div style="font-size: 0.8em; margin-top: 5px;">
                    Each chip gives +5% production and +10% click power
                </div>
            `;
        } else {
            btn.disabled = true;
            info.innerHTML = `
                <div style="color: var(--text-secondary);">
                    Need 1,000,000 total LOC to unlock<br>
                    Current: ${Utils.formatNumber(GameState.totalLOC)} LOC
                </div>
            `;
        }
    },
    
    /**
     * Выполняет престиж (Singularity Reset)
     */
    performPrestige() {
        if (!this.isPrestigeAvailable()) {
            EventsSystem.log('Not enough progress for Singularity Reset!', 'error');
            return;
        }
        
        const chipsEarned = GameState.performPrestige();
        
        EventsSystem.log(`⚡ SINGULARITY RESET! Gained ${chipsEarned} Neural Chips!`, 'special');
        
        // Обновляем UI
        UI.updateAll();
        this.updatePrestigeDisplay();
        
        // Проверяем достижение
        Achievements.checkPrestigeAchievements();
        
        // Показываем уведомление
        setTimeout(() => {
            EventsSystem.log('Game reset. Your AI has been reborn stronger!', 'info');
        }, 1000);
    },
    
    /**
     * Получает множитель от Neural Chips
     * @returns {Object} {productionMultiplier, clickMultiplier}
     */
    getChipBonus() {
        const chips = GameState.neuralChips;
        return {
            productionMultiplier: 1 + (chips * 0.05), // +5% per chip
            clickMultiplier: 1 + (chips * 0.1) // +10% per chip
        };
    }
};

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Prestige;
}

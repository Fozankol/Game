/**
 * bosses.js - Система боссов
 * Управляет боями с боссами
 */

const Bosses = {
    /**
     * Инициализирует систему боссов
     */
    init() {
        this.setupFightButton();
    },
    
    /**
     * Настраивает кнопку боя с боссом
     */
    setupFightButton() {
        const fightBtn = document.getElementById('fightBossBtn');
        if (fightBtn) {
            fightBtn.addEventListener('click', () => {
                this.fightBoss();
            });
        }
    },
    
    /**
     * Проверяет возможность спавна босса
     */
    checkBossSpawn() {
        // Босс появляется при достижении определённых порогов LOC
        const bossThresholds = [
            { loc: 50000, bossIndex: 0 },
            { loc: 250000, bossIndex: 1 },
            { loc: 1000000, bossIndex: 2 },
            { loc: 10000000, bossIndex: 3 },
            { loc: 100000000, bossIndex: 4 }
        ];
        
        for (const threshold of bossThresholds) {
            if (GameState.totalLOC >= threshold.loc && 
                GameState.bossesDefeated <= threshold.bossIndex &&
                !GameState.currentBoss) {
                
                const boss = GameData.bosses[threshold.bossIndex];
                this.spawnBoss(boss);
                break;
            }
        }
    },
    
    /**
     * Спавнит босса
     * @param {Object} boss - Данные босса
     */
    spawnBoss(boss) {
        GameState.currentBoss = {
            ...boss,
            currentHealth: boss.health
        };
        
        // Показываем модальное окно
        this.showBossModal(boss);
        
        EventsSystem.log(`⚠️ BOSS ENCOUNTER: ${boss.name}!`, 'error');
    },
    
    /**
     * Показывает модальное окно босса
     * @param {Object} boss - Данные босса
     */
    showBossModal(boss) {
        const modal = document.getElementById('bossModal');
        document.getElementById('bossMessage').textContent = boss.message;
        document.getElementById('bossHealthText').textContent = '100%';
        document.getElementById('bossHealthBar').style.width = '100%';
        
        modal.classList.remove('hidden');
    },
    
    /**
     * Скрывает модальное окно босса
     */
    hideBossModal() {
        const modal = document.getElementById('bossModal');
        modal.classList.add('hidden');
    },
    
    /**
     * Атакует босса
     */
    fightBoss() {
        if (!GameState.currentBoss) return;
        
        const boss = GameState.currentBoss;
        
        // Урон равен текущему LOC/sec * 10 + click power * 100
        const damage = (GameState.locPerSecond * 10) + (GameState.clickPower * 100);
        
        boss.currentHealth -= damage;
        
        // Обновляем отображение здоровья
        const healthPercent = Math.max(0, (boss.currentHealth / boss.health) * 100);
        document.getElementById('bossHealthBar').style.width = healthPercent + '%';
        document.getElementById('bossHealthText').textContent = healthPercent.toFixed(1) + '%';
        
        // Анимация получения урона
        const modal = document.querySelector('.boss-modal');
        modal.classList.add('shake');
        setTimeout(() => modal.classList.remove('shake'), 300);
        
        // Проверяем победу
        if (boss.currentHealth <= 0) {
            this.defeatBoss(boss);
        }
    },
    
    /**
     * Победа над боссом
     * @param {Object} boss - Данные побеждённого босса
     */
    defeatBoss(boss) {
        GameState.bossesDefeated++;
        GameState.currentBoss = null;
        
        // Награда
        GameState.addLOC(boss.reward);
        GameState.marketDominance = Math.min(100, GameState.marketDominance + boss.dominanceBonus);
        
        EventsSystem.log(`🎉 Boss defeated: ${boss.name}! Reward: ${Utils.formatNumber(boss.reward)} LOC, +${boss.dominanceBonus}% Dominance`, 'success');
        
        // Закрываем модальное окно
        this.hideBossModal();
        
        // Обновляем UI
        UI.updateResourceDisplay();
        UI.updateTopBar();
        
        // Проверяем следующего босса
        this.checkBossSpawn();
    }
};

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Bosses;
}

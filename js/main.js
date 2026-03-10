/**
 * main.js - Точка входа в игру
 * Инициализирует все модули и запускает игровой цикл
 */

// ============================================
// THE DEV-EATER AI
// Idle Clicker Game
// ============================================

const Game = {
    /**
     * Инициализирует всю игру
     */
    init() {
        console.log('🚀 Initializing The Dev-Eater AI...');
        
        // Инициализируем состояние (загружаем сохранение или создаём новое)
        GameState.init();
        
        // Инициализируем UI
        UI.init();
        
        // Инициализируем систему сохранений (это также загрузит сохранение если есть)
        SaveSystem.init();
        
        // Инициализируем все игровые системы
        Clicker.init();
        Generators.init();
        Upgrades.init();
        Research.init();
        Achievements.init();
        EventsSystem.init();
        Bosses.init();
        Prestige.init();
        
        // Обновляем UI после загрузки
        UI.updateAll();
        
        // Запускаем игровой цикл
        UI.startGameLoop();
        
        console.log('✅ Game initialized successfully!');
        console.log('💡 Tip: Click the GENERATE CODE button to start earning LOC!');
    }
};

// Запускаем игру когда DOM готов
document.addEventListener('DOMContentLoaded', () => {
    Game.init();
});

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Game;
}

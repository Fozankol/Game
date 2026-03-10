/**
 * research.js - Система исследований
 * Управляет покупкой однократных исследований
 */

const Research = {
    /**
     * Инициализирует систему исследований
     */
    init() {
        this.renderResearch();
    },
    
    /**
     * Рендерит список исследований
     */
    renderResearch() {
        const container = document.getElementById('researchList');
        container.innerHTML = '';
        
        GameData.research.forEach(res => {
            const purchased = GameState.research[res.id];
            
            const itemEl = document.createElement('div');
            itemEl.className = 'research-item';
            itemEl.id = `research-${res.id}`;
            
            if (!purchased) {
                itemEl.onclick = () => this.buyResearch(res.id);
            } else {
                itemEl.classList.add('completed');
            }
            
            itemEl.innerHTML = `
                <div class="upgrade-info">
                    <div class="research-name">${res.name}</div>
                    <div class="research-bonus">${res.bonus}</div>
                </div>
                <div class="upgrade-cost">
                    ${purchased ? '✓' : Utils.formatNumber(res.cost) + ' LOC'}
                </div>
            `;
            
            container.appendChild(itemEl);
        });
    },
    
    /**
     * Покупает исследование
     * @param {string} resId - ID исследования
     */
    buyResearch(resId) {
        const res = GameData.research.find(r => r.id === resId);
        if (!res) return;
        
        if (GameState.research[resId]) {
            EventsSystem.log('Already researched!', 'warning');
            return;
        }
        
        if (GameState.spendLOC(res.cost)) {
            GameState.research[resId] = true;
            
            // Обновляем расчёты
            GameState.updateCalculatedValues();
            
            // Обновляем UI
            this.updateResearchDisplay(resId);
            UI.updateResourceDisplay();
            
            // Лог события
            EventsSystem.log(`Researched ${res.name}. ${res.bonus}`, 'success');
        } else {
            EventsSystem.log('Not enough LOC!', 'error');
        }
    },
    
    /**
     * Обновляет отображение исследования
     * @param {string} resId - ID исследования
     */
    updateResearchDisplay(resId) {
        const res = GameData.research.find(r => r.id === resId);
        if (!res) return;
        
        const el = document.getElementById(`research-${resId}`);
        if (!el) return;
        
        el.classList.add('completed');
        el.querySelector('.upgrade-cost').textContent = '✓';
        el.onclick = null;
    },
    
    /**
     * Обновляет доступность всех исследований
     */
    updateAllAvailability() {
        GameData.research.forEach(res => {
            if (GameState.research[res.id]) return;
            
            const el = document.getElementById(`research-${res.id}`);
            
            if (el) {
                if (GameState.loc >= res.cost) {
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
    module.exports = Research;
}

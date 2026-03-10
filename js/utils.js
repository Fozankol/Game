/**
 * utils.js - Вспомогательные функции для игры
 * Содержит функции для форматирования чисел, случайных значений и т.д.
 */

const Utils = {
    /**
     * Форматирует большие числа в читаемый вид (K, M, B, T и т.д.)
     * @param {number} num - Число для форматирования
     * @returns {string} Отформатированное число
     */
    formatNumber(num) {
        if (num < 1000) return Math.floor(num).toString();
        
        const suffixes = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];
        const suffixNum = Math.floor(Math.log10(num) / 3);
        
        if (suffixNum >= suffixes.length) {
            return num.toExponential(2);
        }
        
        let shortValue = parseFloat((num / Math.pow(1000, suffixNum)).toFixed(2));
        // Убираем лишние нули после запятой
        shortValue = parseFloat(shortValue.toFixed(2));
        
        return shortValue + suffixes[suffixNum];
    },

    /**
     * Форматирует проценты
     * @param {number} num - Число
     * @returns {string} Отформатированный процент
     */
    formatPercent(num) {
        return num.toFixed(2) + '%';
    },

    /**
     * Возвращает случайное число в диапазоне
     * @param {number} min - Минимум
     * @param {number} max - Максимум
     * @returns {number} Случайное число
     */
    randomRange(min, max) {
        return Math.random() * (max - min) + min;
    },

    /**
     * Возвращает случайный элемент из массива
     * @param {Array} arr - Массив
     * @returns {*} Случайный элемент
     */
    randomChoice(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    },

    /**
     * Проверяет шанс (возвращает true с вероятностью chance%)
     * @param {number} chance - Шанс в процентах
     * @returns {boolean} Результат проверки
     */
    checkChance(chance) {
        return Math.random() * 100 < chance;
    },

    /**
     * Задерживает выполнение на указанное время
     * @param {number} ms - Время в миллисекундах
     * @returns {Promise} Промис
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    /**
     * Клонирует объект глубоко
     * @param {Object} obj - Объект для клонирования
     * @returns {Object} Клон объекта
     */
    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    /**
     * Получает текущее время в миллисекундах
     * @returns {number} Timestamp
     */
    now() {
        return Date.now();
    },

    /**
     * Форматирует время в читаемый вид
     * @param {number} ms - Миллисекунды
     * @returns {string} Отформатированное время
     */
    formatTime(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        } else {
            return `${seconds}s`;
        }
    }
};

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}

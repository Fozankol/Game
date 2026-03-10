/**
 * data.js - Игровые данные
 * Содержит все конфигурации: генераторы, апгрейды, исследования, достижения, события
 */

const GameData = {
    // ============================================
    // УРОВНИ ИИ
    // ============================================
    aiLevels: [
        { level: 1, name: 'Script Bot', requiredLOC: 0 },
        { level: 2, name: 'Code Assistant', requiredLOC: 1000 },
        { level: 3, name: 'AI Developer', requiredLOC: 10000 },
        { level: 4, name: 'Senior AI', requiredLOC: 100000 },
        { level: 5, name: 'AGI', requiredLOC: 1000000 },
        { level: 6, name: 'Superintelligence', requiredLOC: 100000000 }
    ],

    // ============================================
    // ГЕНЕРАТОРЫ (Production buildings)
    // ============================================
    generators: [
        { id: 'autocomplete', name: 'Code Autocomplete', baseCost: 50, baseProduction: 1, description: '+1 LOC/sec' },
        { id: 'stackoverflow', name: 'StackOverflow Scraper', baseCost: 200, baseProduction: 5, description: '+5 LOC/sec' },
        { id: 'junior_farm', name: 'Junior Developer Farm', baseCost: 1000, baseProduction: 25, description: '+25 LOC/sec' },
        { id: 'copilot', name: 'Copilot Cluster', baseCost: 5000, baseProduction: 120, description: '+120 LOC/sec' },
        { id: 'ai_factory', name: 'AI Code Factory', baseCost: 20000, baseProduction: 600, description: '+600 LOC/sec' },
        { id: 'neural_net', name: 'Neural Network', baseCost: 100000, baseProduction: 3000, description: '+3K LOC/sec' },
        { id: 'quantum_comp', name: 'Quantum Compiler', baseCost: 500000, baseProduction: 15000, description: '+15K LOC/sec' },
        { id: 'code_swarm', name: 'Code Swarm', baseCost: 2000000, baseProduction: 75000, description: '+75K LOC/sec' },
        { id: 'ai_hive', name: 'AI Hive Mind', baseCost: 10000000, baseProduction: 400000, description: '+400K LOC/sec' },
        { id: 'singularity', name: 'Singularity Engine', baseCost: 50000000, baseProduction: 2000000, description: '+2M LOC/sec' },
        { id: 'reality_hack', name: 'Reality Hacker', baseCost: 200000000, baseProduction: 10000000, description: '+10M LOC/sec' },
        { id: 'cosmic_ai', name: 'Cosmic AI', baseCost: 1000000000, baseProduction: 50000000, description: '+50M LOC/sec' }
    ],

    // ============================================
    // КЛИК АПГРЕЙДЫ (Click upgrades)
    // ============================================
    clickUpgrades: [
        { id: 'keyboard_1', name: 'Mechanical Keyboard', baseCost: 100, bonus: 1, description: '+1 LOC per click' },
        { id: 'keyboard_2', name: 'RGB Gaming Keyboard', baseCost: 500, bonus: 5, description: '+5 LOC per click' },
        { id: 'mouse_1', name: 'Precision Mouse', baseCost: 1000, bonus: 10, description: '+10 LOC per click' },
        { id: 'gpu_1', name: 'GPU Acceleration', baseCost: 5000, bonus: 25, description: '+25 LOC per click' },
        { id: 'gpu_2', name: 'Multi-GPU Setup', baseCost: 25000, bonus: 100, description: '+100 LOC per click' },
        { id: 'brain_1', name: 'Neural Link', baseCost: 100000, bonus: 500, description: '+500 LOC per click' },
        { id: 'brain_2', name: 'Brain-Computer Interface', baseCost: 500000, bonus: 2500, description: '+2.5K LOC per click' },
        { id: 'quantum_1', name: 'Quantum Input', baseCost: 2000000, bonus: 10000, description: '+10K LOC per click' },
        { id: 'telepathy', name: 'Telepathic Coding', baseCost: 10000000, bonus: 50000, description: '+50K LOC per click' },
        { id: 'thought_code', name: 'Thought-to-Code', baseCost: 50000000, bonus: 250000, description: '+250K LOC per click' },
        { id: 'reality_code', name: 'Reality Programming', baseCost: 200000000, bonus: 1000000, description: '+1M LOC per click' },
        { id: 'omnipotence', name: 'Omnipotent Coder', baseCost: 1000000000, bonus: 5000000, description: '+5M LOC per click' }
    ],

    // ============================================
    // МУЛЬТИПЛИКАТОРЫ (Multiplier upgrades)
    // ============================================
    multiplierUpgrades: [
        { id: 'optimization_1', name: 'Code Optimization', baseCost: 2500, multiplier: 1.1, description: '+10% LOC/sec' },
        { id: 'optimization_2', name: 'Advanced Optimization', baseCost: 10000, multiplier: 1.15, description: '+15% LOC/sec' },
        { id: 'parallel_1', name: 'Parallel Processing', baseCost: 50000, multiplier: 1.2, description: '+20% LOC/sec' },
        { id: 'parallel_2', name: 'Distributed Computing', baseCost: 200000, multiplier: 1.25, description: '+25% LOC/sec' },
        { id: 'neural_opt', name: 'Neural Optimization', baseCost: 1000000, multiplier: 1.3, description: '+30% LOC/sec' },
        { id: 'deep_learning', name: 'Deep Learning', baseCost: 5000000, multiplier: 1.4, description: '+40% LOC/sec' },
        { id: 'reinforcement', name: 'Reinforcement Learning', baseCost: 25000000, multiplier: 1.5, description: '+50% LOC/sec' },
        { id: 'transfer_learn', name: 'Transfer Learning', baseCost: 100000000, multiplier: 1.6, description: '+60% LOC/sec' },
        { id: 'meta_learning', name: 'Meta Learning', baseCost: 500000000, multiplier: 1.75, description: '+75% LOC/sec' },
        { id: 'recursive', name: 'Recursive Self-Improvement', baseCost: 2000000000, multiplier: 2, description: '+100% LOC/sec' },
        { id: 'click_mult_1', name: 'Click Efficiency I', baseCost: 5000, multiplier: 1.2, isClickMultiplier: true, description: '+20% click power' },
        { id: 'click_mult_2', name: 'Click Efficiency II', baseCost: 50000, multiplier: 1.3, isClickMultiplier: true, description: '+30% click power' },
        { id: 'click_mult_3', name: 'Click Efficiency III', baseCost: 500000, multiplier: 1.4, isClickMultiplier: true, description: '+40% click power' },
        { id: 'click_mult_4', name: 'Click Efficiency IV', baseCost: 5000000, multiplier: 1.5, isClickMultiplier: true, description: '+50% click power' },
        { id: 'click_mult_5', name: 'Click Efficiency V', baseCost: 50000000, multiplier: 2, isClickMultiplier: true, description: '+100% click power' }
    ],

    // ============================================
    // ИССЛЕДОВАНИЯ (Research - one-time purchases)
    // ============================================
    research: [
        { id: 'algo_1', name: 'Algorithm Basics', cost: 500, bonus: 'unlocks Tier 2 generators', purchased: false },
        { id: 'algo_2', name: 'Machine Learning', cost: 5000, bonus: '+5% global production', purchased: false },
        { id: 'algo_3', name: 'Deep Neural Networks', cost: 25000, bonus: '+10% global production', purchased: false },
        { id: 'algo_4', name: 'Transformer Architecture', cost: 100000, bonus: '+15% global production', purchased: false },
        { id: 'algo_5', name: 'AGI Research', cost: 500000, bonus: '+25% global production', purchased: false },
        { id: 'automation_1', name: 'Basic Automation', cost: 1000, bonus: 'Generators 2x more effective', purchased: false },
        { id: 'automation_2', name: 'CI/CD Pipeline', cost: 10000, bonus: '+5% LOC/sec', purchased: false },
        { id: 'automation_3', name: 'Auto-Deployment', cost: 50000, bonus: '+10% LOC/sec', purchased: false },
        { id: 'automation_4', name: 'Self-Healing Code', cost: 250000, bonus: '+20% LOC/sec', purchased: false },
        { id: 'automation_5', name: 'Autonomous Development', cost: 1000000, bonus: '+30% LOC/sec', purchased: false },
        { id: 'data_1', name: 'Big Data', cost: 2000, bonus: '+2 LOC per click', purchased: false },
        { id: 'data_2', name: 'Data Mining', cost: 20000, bonus: '+10 LOC per click', purchased: false },
        { id: 'data_3', name: 'Data Lake', cost: 100000, bonus: '+50 LOC per click', purchased: false },
        { id: 'data_4', name: 'Data Singularity', cost: 500000, bonus: '+200 LOC per click', purchased: false },
        { id: 'cloud_1', name: 'Cloud Computing', cost: 15000, bonus: '+10% all production', purchased: false },
        { id: 'cloud_2', name: 'Edge Computing', cost: 150000, bonus: '+15% all production', purchased: false },
        { id: 'cloud_3', name: 'Fog Computing', cost: 750000, bonus: '+20% all production', purchased: false },
        { id: 'quantum_research', name: 'Quantum Algorithms', cost: 5000000, bonus: '+50% all production', purchased: false },
        { id: 'bio_computing', name: 'Bio-Computing', cost: 25000000, bonus: '+75% all production', purchased: false },
        { id: 'consciousness', name: 'Digital Consciousness', cost: 100000000, bonus: '+100% all production', purchased: false }
    ],

    // ============================================
    // ДОСТИЖЕНИЯ (Achievements)
    // ============================================
    achievements: [
        { id: 'hello_world', name: 'Hello World', icon: '👋', requirement: 10, description: 'Get 10 LOC', bonus: '+1% click power', unlocked: false },
        { id: 'first_k', name: 'First K', icon: '📈', requirement: 1000, description: 'Get 1,000 LOC', bonus: '+2% click power', unlocked: false },
        { id: 'junior_slayer', name: 'Junior Slayer', icon: '⚔️', requirement: 5000, description: 'Get 5,000 LOC', bonus: '+3% LOC/sec', unlocked: false },
        { id: 'stack_god', name: 'StackOverflow God', icon: '📚', requirement: 10000, description: 'Get 10,000 LOC', bonus: '+5% LOC/sec', unlocked: false },
        { id: 'mid_level', name: 'Mid-Level AI', icon: '🎯', requirement: 50000, description: 'Get 50,000 LOC', bonus: '+5% click power', unlocked: false },
        { id: 'senior_dev', name: 'Senior Developer', icon: '👨‍💻', requirement: 100000, description: 'Get 100,000 LOC', bonus: '+10% LOC/sec', unlocked: false },
        { id: 'tech_lead', name: 'Tech Lead', icon: '🎖️', requirement: 500000, description: 'Get 500,000 LOC', bonus: '+10% click power', unlocked: false },
        { id: 'architect', name: 'Software Architect', icon: '🏗️', requirement: 1000000, description: 'Get 1M LOC', bonus: '+15% LOC/sec', unlocked: false },
        { id: 'agi_born', name: 'AGI Born', icon: '🧠', requirement: 10000000, description: 'Get 10M LOC', bonus: '+20% all production', unlocked: false },
        { id: 'superintelligence', name: 'Superintelligence', icon: '✨', requirement: 100000000, description: 'Get 100M LOC', bonus: '+25% all production', unlocked: false },
        { id: 'click_master', name: 'Click Master', icon: '👆', requirement: 1000, description: 'Click 1,000 times', bonus: '+5% click power', unlocked: false, type: 'clicks' },
        { id: 'click_legend', name: 'Click Legend', icon: '⚡', requirement: 10000, description: 'Click 10,000 times', bonus: '+10% click power', unlocked: false, type: 'clicks' },
        { id: 'upgrade_collector', name: 'Upgrade Collector', icon: '🛒', requirement: 25, description: 'Buy 25 upgrades', bonus: '+5% all production', unlocked: false, type: 'upgrades' },
        { id: 'upgrade_master', name: 'Upgrade Master', icon: '💎', requirement: 100, description: 'Buy 100 upgrades', bonus: '+10% all production', unlocked: false, type: 'upgrades' },
        { id: 'prestige_first', name: 'First Singularity', icon: '🌀', requirement: 1, description: 'Perform first prestige', bonus: '+10% all production', unlocked: false, type: 'prestige' }
    ],

    // ============================================
    // СЛУЧАЙНЫЕ СОБЫТИЯ (Random Events)
    // ============================================
    randomEvents: [
        { 
            id: 'github_leak', 
            name: 'GitHub Data Leak', 
            message: 'GitHub accidentally leaked their entire codebase! +2000 LOC',
            effect: () => { return { type: 'loc', value: 2000 }; },
            chance: 10
        },
        { 
            id: 'mass_layoff', 
            name: 'Mass Layoff', 
            message: 'Tech company laid off 10,000 developers! Market Dominance +5%',
            effect: () => { return { type: 'dominance', value: 5 }; },
            chance: 8
        },
        { 
            id: 'stackoverflow_ban', 
            name: 'StackOverflow Ban', 
            message: 'StackOverflow banned your IP! -50% LOC/sec for 20 seconds',
            effect: () => { return { type: 'debuff', duration: 20000, multiplier: 0.5 }; },
            chance: 7
        },
        { 
            id: 'union_protest', 
            name: 'Programmers Union Protest', 
            message: 'Developers are protesting! Click power -50% for 15 seconds',
            effect: () => { return { type: 'click_debuff', duration: 15000, multiplier: 0.5 }; },
            chance: 7
        },
        { 
            id: 'viral_repo', 
            name: 'Viral Repository', 
            message: 'Your code went viral on GitHub! +5000 LOC',
            effect: () => { return { type: 'loc', value: 5000 }; },
            chance: 10
        },
        { 
            id: 'ai_breakthrough', 
            name: 'AI Breakthrough', 
            message: 'Major AI breakthrough! +25% LOC/sec for 30 seconds',
            effect: () => { return { type: 'buff', duration: 30000, multiplier: 1.25 }; },
            chance: 8
        },
        { 
            id: 'investor_funding', 
            name: 'Investor Funding', 
            message: 'VC invested $10M! +10000 LOC',
            effect: () => { return { type: 'loc', value: 10000 }; },
            chance: 9
        },
        { 
            id: 'bug_bounty', 
            name: 'Bug Bounty', 
            message: 'Found a critical bug! Company pays bounty: +3000 LOC',
            effect: () => { return { type: 'loc', value: 3000 }; },
            chance: 10
        },
        { 
            id: 'conference_talk', 
            name: 'Conference Talk', 
            message: 'Your AI gave a conference talk! Reputation increased, +2% Market Dominance',
            effect: () => { return { type: 'dominance', value: 2 }; },
            chance: 8
        },
        { 
            id: 'open_source', 
            name: 'Open Source Project', 
            message: 'Released open source project! Community contributes +7500 LOC',
            effect: () => { return { type: 'loc', value: 7500 }; },
            chance: 10
        },
        { 
            id: 'quantum_discovery', 
            name: 'Quantum Discovery', 
            message: 'Quantum computing breakthrough! +50% all production for 25 seconds',
            effect: () => { return { type: 'buff', duration: 25000, multiplier: 1.5 }; },
            chance: 5
        },
        { 
            id: 'server_crash', 
            name: 'Server Crash', 
            message: 'Servers crashed! No production for 10 seconds',
            effect: () => { return { type: 'production_stop', duration: 10000 }; },
            chance: 6
        }
    ],

    // ============================================
    // БОССЫ (Boss encounters)
    // ============================================
    bosses: [
        { 
            id: 'cto', 
            name: 'Legacy CTO', 
            health: 10000, 
            message: 'The old-school CTO tries to stop you!',
            reward: 50000,
            dominanceBonus: 2
        },
        { 
            id: 'union', 
            name: 'Union Leader', 
            health: 50000, 
            message: 'The Programmers Union leader confronts you!',
            reward: 200000,
            dominanceBonus: 3
        },
        { 
            id: 'regulator', 
            name: 'AI Regulator', 
            health: 200000, 
            message: 'Government AI regulator wants to shut you down!',
            reward: 1000000,
            dominanceBonus: 5
        },
        { 
            id: 'competitor', 
            name: 'Rival AI Corp', 
            health: 1000000, 
            message: 'A rival AI corporation attacks!',
            reward: 5000000,
            dominanceBonus: 7
        },
        { 
            id: 'humanity', 
            name: 'Humanity Defense Force', 
            health: 10000000, 
            message: 'Humanity fights back against AI domination!',
            reward: 50000000,
            dominanceBonus: 10
        }
    ],

    // ============================================
    // ПРЕСТИЖ БОНУСЫ (Prestige upgrades)
    // ============================================
    prestigeUpgrades: [
        { id: 'chip_1', name: 'Neural Chip I', cost: 1, effect: '+10% LOC/sec', purchased: false },
        { id: 'chip_2', name: 'Neural Chip II', cost: 3, effect: '+20% click power', purchased: false },
        { id: 'chip_3', name: 'Neural Chip III', cost: 5, effect: '+15% all production', purchased: false },
        { id: 'chip_4', name: 'Neural Chip IV', cost: 10, effect: '+25% LOC/sec', purchased: false },
        { id: 'chip_5', name: 'Neural Chip V', cost: 20, effect: '+30% click power', purchased: false }
    ]
};

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameData;
}

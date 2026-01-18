/**
 * Central Game Configuration
 * Use this file to balance hardware specs, command costs, and simulation parameters.
 */

export const GAME_CONFIG = {
    HARDWARE: {
        CPU: {
            v1: { id: 'cpu_v1', level: 1, clockSpeed: 0.016, cores: 1, cost: 0 },
            v2: { id: 'cpu_v2', level: 2, clockSpeed: 0.033, cores: 1, cost: 800 },
            v3: { id: 'cpu_v3', level: 3, clockSpeed: 0.2, cores: 1, cost: 2500 },
            v4: { id: 'cpu_v4', level: 4, clockSpeed: 0.5, cores: 1, cost: 6500 },
            v5: { id: 'cpu_v5', level: 5, clockSpeed: 1.6, cores: 1, cost: 15000 },
            v6: { id: 'cpu_v6', level: 6, clockSpeed: 1.8, cores: 2, cost: 35000 },
            v7: { id: 'cpu_v7', level: 7, clockSpeed: 2.6, cores: 4, cost: 85000 },
            v8: { id: 'cpu_v8', level: 8, clockSpeed: 3.4, cores: 8, cost: 180000 },
            v9: { id: 'cpu_v9', level: 9, clockSpeed: 2.9, cores: 16, cost: 450000 },
            v10: { id: 'cpu_v10', level: 10, clockSpeed: 5.0, cores: 32, cost: 1200000 },
        },
        RAM: {
            v1: { id: 'ram_v1', level: 1, capacity: 0.016, cost: 0 }, // 16MB
            v2: { id: 'ram_v2', level: 2, capacity: 0.064, cost: 600 }, // 64MB
            v3: { id: 'ram_v3', level: 3, capacity: 0.256, cost: 1800 }, // 256MB
            v4: { id: 'ram_v4', level: 4, capacity: 1.0, cost: 5000 }, // 1GB
            v5: { id: 'ram_v5', level: 5, capacity: 4.0, cost: 12000 }, // 4GB
            v6: { id: 'ram_v6', level: 6, capacity: 8.0, cost: 30000 }, // 8GB
            v7: { id: 'ram_v7', level: 7, capacity: 16.0, cost: 75000 },
            v8: { id: 'ram_v8', level: 8, capacity: 32.0, cost: 160000 },
            v9: { id: 'ram_v9', level: 9, capacity: 64.0, cost: 400000 },
            v10: { id: 'ram_v10', level: 10, capacity: 128.0, cost: 1000000 },
        },
        STORAGE: {
            v1: { id: 'hd_v1', level: 1, capacity: 0.04, cost: 0 }, // 40MB
            v2: { id: 'hd_v2', level: 2, capacity: 0.5, cost: 500 },
            v3: { id: 'hd_v3', level: 3, capacity: 2.0, cost: 1500 },
            v4: { id: 'hd_v4', level: 4, capacity: 10.0, cost: 4500 },
            v5: { id: 'hd_v5', level: 5, capacity: 40.0, cost: 12000 },
            v6: { id: 'hd_v6', level: 6, capacity: 120.0, cost: 35000 },
            v7: { id: 'hd_v7', level: 7, capacity: 500.0, cost: 90000 },
            v8: { id: 'hd_v8', level: 8, capacity: 1024.0, cost: 200000 },
            v9: { id: 'hd_v9', level: 9, capacity: 4096.0, cost: 500000 },
            v10: { id: 'hd_v10', level: 10, capacity: 16384.0, cost: 1500000 },
        },
        NETWORK: {
            v1: { id: 'net_v1', level: 1, bandwidth: 0.014, cost: 0 },
            v2: { id: 'net_v2', level: 2, bandwidth: 0.056, cost: 500 },
            v3: { id: 'net_v3', level: 3, bandwidth: 0.128, cost: 1500 },
            v4: { id: 'net_v4', level: 4, bandwidth: 1.5, cost: 4500 },
            v5: { id: 'net_v5', level: 5, bandwidth: 10.0, cost: 12000 },
            v6: { id: 'net_v6', level: 6, bandwidth: 100.0, cost: 35000 },
            v7: { id: 'net_v7', level: 7, bandwidth: 1000.0, cost: 90000 },
            v8: { id: 'net_v8', level: 8, bandwidth: 10000.0, cost: 200000 },
            v9: { id: 'net_v9', level: 9, bandwidth: 25000.0, cost: 500000 },
            v10: { id: 'net_v10', level: 10, bandwidth: 999999.0, cost: 1500000 },
        },
        COOLING: {
            v1: { id: 'cool_v1', level: 1, heatDissipation: 1.0, cost: 0 },
            v2: { id: 'cool_v2', level: 2, heatDissipation: 1.1, cost: 400 },
            v3: { id: 'cool_v3', level: 3, heatDissipation: 1.2, cost: 1200 },
            v4: { id: 'cool_v4', level: 4, heatDissipation: 1.4, cost: 3500 },
            v5: { id: 'cool_v5', level: 5, heatDissipation: 1.7, cost: 9000 },
            v6: { id: 'cool_v6', level: 6, heatDissipation: 2.0, cost: 25000 },
            v7: { id: 'cool_v7', level: 7, heatDissipation: 2.5, cost: 60000 },
            v8: { id: 'cool_v8', level: 8, heatDissipation: 3.2, cost: 150000 },
            v9: { id: 'cool_v9', level: 9, heatDissipation: 4.5, cost: 400000 },
            v10: { id: 'cool_v10', level: 10, heatDissipation: 8.0, cost: 1000000 },
        }
    },
    PROCESS_COSTS: {
        'nmap': { cpuUsage: 0.15, ramUsage: 0.032 }, // 32MB
        'nmap-pro': { cpuUsage: 0.25, ramUsage: 0.128 }, // 128MB
        'hydra': { cpuUsage: 0.4, ramUsage: 0.256 }, // 256MB
        'download': { cpuUsage: 0.05, ramUsage: 0.008 }, // 8MB
        'scp': { cpuUsage: 0.05, ramUsage: 0.008 }, // 8MB
        'sqlmap': { cpuUsage: 0.35, ramUsage: 0.512 }, // 512MB
        'msfconsole': { cpuUsage: 0.5, ramUsage: 1.0 }, // 1GB
        'msf-exploit': { cpuUsage: 0.6, ramUsage: 1.5 }, // 1.5GB
        'john': { cpuUsage: 0.9, ramUsage: 2.0 }, // 2GB
        'neuro-crack': { cpuUsage: 0.95, ramUsage: 4.0 }, // 4GB
        'ping': { cpuUsage: 0.01, ramUsage: 0.004 }, // 4MB
    },
    SIMULATION: {
        MB_PER_GB: 1024,
        BASE_OVERCLOCK_BOOST: 1.3,
        THROTTLE_TEMP_THRESHOLD: 80,
        CRITICAL_TEMP_THRESHOLD: 95,
        THROTTLE_PENALTY: 0.5,
        SWAP_DELAY_PENALTY: 5.0,
        DOWNLOAD_BASE_RAM: 0.002, // 2MB
        DOWNLOAD_SIZE_FACTOR: 0.05,
        PASSIVE_HEAT_GAIN: 0.2,
        OVERCLOCK_HEAT_BASE: 2.5,
        DISSIPATION_FACTOR: 0.75,
        DEGRADATION_CHANCE: 0.05,
        DEGRADATION_STAT_REDUCTION: 0.8,
    },
    MISSIONS: {
        TIERS: {
            1: { minRep: 0, rewardRange: { min: 200, max: 250 } },
            2: { minRep: 501, rewardRange: { min: 600, max: 800 } },
            3: { minRep: 1001, rewardRange: { min: 2500, max: 3500 } },
            4: { minRep: 3001, rewardRange: { min: 10000, max: 14000 } },
            5: { minRep: 8001, rewardRange: { min: 45000, max: 60000 } },
        },
        REPUTATION_REWARDS: {
            SELL_NORMAL: 10,
            SELL_SENSITIVE: 50,
            RANSOM_PAID: 100,
            RANSOM_REFUSED: 20,
        }
    }
};

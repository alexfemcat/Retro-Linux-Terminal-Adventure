import { PlayerState } from '../types';
import { MARKET_CATALOG } from '../data/marketData';

/**
 * Global Hardware Simulation Configuration
 * Easily tweak these values to balance the game.
 */
export const HARDWARE_CONFIG = {
    MB_PER_GB: 1024,

    // CPU Calculations
    BASE_OVERCLOCK_BOOST: 1.3,
    THROTTLE_TEMP_THRESHOLD: 80,
    CRITICAL_TEMP_THRESHOLD: 95,
    THROTTLE_PENALTY: 0.5,

    // RAM / Swap Calculations
    SWAP_DELAY_PENALTY: 5.0, // 5x slower when thrashing
    DOWNLOAD_BASE_RAM: 0.002, // Base GB used by download process (2MB)
    DOWNLOAD_SIZE_FACTOR: 0.05, // 5% of file size (in GB) added to RAM usage

    // Thermal Calculations
    PASSIVE_HEAT_GAIN: 0.2, // Heat per active process
    OVERCLOCK_HEAT_BASE: 2.5,
    DISSIPATION_FACTOR: 0.75,

    // Hardware Degradation
    DEGRADATION_CHANCE: 0.05, // 5% chance per second at critical temp
    DEGRADATION_STAT_REDUCTION: 0.8, // 20% reduction in stats
};

export interface ProcessMetrics {
    cpuUsage: number; // Percentage of 1 core (0-1.0)
    ramUsage: number; // GB
}

export const PROCESS_COSTS: Record<string, ProcessMetrics> = {
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
};

export class HardwareService {
    /**
     * Calculates the effective speed multiplier based on hardware and current state.
     */
    static getEffectiveSpeedMultiplier(playerState: PlayerState): number {
        const { cpu } = playerState.hardware;
        const { isOverclocked, voltageLevel, systemHeat } = playerState;

        let multiplier = cpu.clockSpeed * cpu.cores;

        if (isOverclocked) {
            // Voltage exponentially increases speed but also heat
            // 1.0v = 1.0x (of OC boost), 1.5v = 2.0x (of OC boost)
            const voltageBoost = Math.pow(voltageLevel, 2);
            multiplier *= (HARDWARE_CONFIG.BASE_OVERCLOCK_BOOST * voltageBoost);
        }

        // Thermal Throttling
        if (systemHeat > HARDWARE_CONFIG.THROTTLE_TEMP_THRESHOLD) {
            multiplier *= HARDWARE_CONFIG.THROTTLE_PENALTY;
        }

        return multiplier;
    }

    /**
     * Calculates the delay for a process based on base time and hardware.
     */
    static calculateProcessDelay(baseTimeMs: number, playerState: PlayerState, currentRamUsage: number): number {
        const speedMultiplier = this.getEffectiveSpeedMultiplier(playerState);
        let delay = baseTimeMs / speedMultiplier;

        // RAM Thrashing
        if (currentRamUsage > playerState.hardware.ram.capacity) {
            delay *= HARDWARE_CONFIG.SWAP_DELAY_PENALTY;
        }

        return delay;
    }

    /**
     * Calculates heat delta per second.
     */
    static calculateHeatDelta(playerState: PlayerState, activeProcessCount: number): number {
        const { cooling } = playerState.hardware;
        const { isOverclocked, voltageLevel } = playerState;

        let heatGain = HARDWARE_CONFIG.PASSIVE_HEAT_GAIN * activeProcessCount;

        if (isOverclocked) {
            // Heat grows exponentially with voltage: (voltage^4)
            heatGain += HARDWARE_CONFIG.OVERCLOCK_HEAT_BASE * Math.pow(voltageLevel, 4);
        }

        const heatDissipation = cooling.heatDissipation * HARDWARE_CONFIG.DISSIPATION_FACTOR;

        return heatGain - heatDissipation;
    }

    /**
     * Checks if a hardware component should degrade due to heat.
     * Should be called when systemHeat > 95.
     */
    static shouldDegrade(currentHeat: number): boolean {
        if (currentHeat < HARDWARE_CONFIG.CRITICAL_TEMP_THRESHOLD) return false;
        // 5% chance per heartbeat (e.g. per second)
        return Math.random() < HARDWARE_CONFIG.DEGRADATION_CHANCE;
    }

    /**
     * Randomly degrades a hardware component.
     */
    static degradeHardware(playerState: PlayerState): { updatedState: PlayerState; degradedComponent: string } {
        const components: (keyof PlayerState['hardware'])[] = ['cpu', 'ram', 'network', 'storage', 'cooling'];
        const target = components[Math.floor(Math.random() * components.length)];

        const updatedHardware = { ...playerState.hardware };
        const component = updatedHardware[target];

        if (component.level > 1) {
            (component as any).level -= 1;
            // Also reduce the actual stats proportionally
            if (target === 'cpu') {
                (component as any).clockSpeed *= HARDWARE_CONFIG.DEGRADATION_STAT_REDUCTION;
            } else if (target === 'ram') {
                (component as any).capacity = Math.max(1, (component as any).capacity - 2);
            } else if (target === 'cooling') {
                (component as any).heatDissipation *= HARDWARE_CONFIG.DEGRADATION_STAT_REDUCTION;
            }
        }

        return {
            updatedState: { ...playerState, hardware: updatedHardware },
            degradedComponent: target.toUpperCase()
        };
    }

    /**
     * Calculates current storage usage in KB (Inventory + Installed Software).
     */
    static calculateStorageUsage(playerState: PlayerState, _vfs: any): number {
        let total = 0;

        // 1. Permanent Inventory (loot already sold or moved, includes ~/bin and ~/loot contents)
        if (playerState.inventory) {
            total += playerState.inventory.reduce((sum, node) => sum + (node.type === 'file' ? (node.size || 0) : 0), 0);
        }

        // 2. Mission Inventory (files downloaded but not yet moved to ~/loot)
        if (playerState.missionInventory) {
            total += playerState.missionInventory.reduce((sum, node) => sum + (node.size || 0), 0);
        }

        // 3. Installed Software (binaries in ~/bin)
        playerState.installedSoftware.forEach(id => {
            const soft = MARKET_CATALOG.find(i => i.id === id);
            if (soft && (soft as any).storageSize) {
                total += (soft as any).storageSize * 1024; // Convert MB to KB
            }
        });

        // 4. Default Commands (small but non-zero)
        const defaultCommands = ['help', 'ls', 'cd', 'cat', 'pwd', 'whoami', 'clear', 'exit', 'inv', 'rm', 'kill', 'echo', 'alias', 'sh', 'theme', 'settings', 'market', 'jobs'];
        total += defaultCommands.length * 100; // ~100KB per default command

        // Ensure we never return negative or NaN
        return Math.max(0, total || 0);
    }
}

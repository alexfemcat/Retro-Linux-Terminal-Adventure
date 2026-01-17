import { useMemo } from 'react';
import type { PlayerState } from '../types';
import { HardwareService, PROCESS_COSTS } from '../services/HardwareService';

export interface PerformanceStats {
    cpuLoad: number; // 0-100%
    ramUsed: number; // GB
    ramCapacity: number; // GB
    storageUsed: number; // MB
    storageCapacity: number; // MB
    isThrashing: boolean;
    isOverheating: boolean;
    isCritical: boolean;
}

export const usePerformance = (
    playerState: PlayerState | null,
    activeProcesses: { id: string; name: string; ram: number }[]
): PerformanceStats => {
    return useMemo(() => {
        if (!playerState) {
            return {
                cpuLoad: 0,
                ramUsed: 0,
                ramCapacity: 0,
                storageUsed: 0,
                storageCapacity: 0,
                isThrashing: false,
                isOverheating: false,
                isCritical: false
            };
        }

        const ramCapacity = playerState.hardware.ram.capacity;
        const storageCapacity = playerState.hardware.storage.capacity * 1024; // Convert GB to MB

        // Calculate Total RAM
        const ramUsed = activeProcesses.reduce((acc, p) => acc + p.ram, 0);
        const isThrashing = ramUsed > ramCapacity * 0.9; // Thrashing starts at 90%

        // Calculate Storage Usage
        const storageUsed = HardwareService.calculateStorageUsage(playerState);

        // Calculate CPU Load
        // We use the base process costs to estimate load
        let totalCpuUsage = activeProcesses.reduce((acc, proc) => {
            // strip prefix if any (e.g. download:file.txt)
            const baseName = proc.name.split(':')[0];
            const cost = PROCESS_COSTS[baseName]?.cpuUsage || 0.05;
            return acc + cost;
        }, 0);

        // CPU load is usage / available cores
        const availableCores = playerState.hardware.cpu.cores;
        const cpuLoad = Math.min(100, (totalCpuUsage / availableCores) * 100);

        const isOverheating = playerState.systemHeat > 80;
        const isCritical = playerState.systemHeat > 95;

        return {
            cpuLoad,
            ramUsed,
            ramCapacity,
            storageUsed,
            storageCapacity,
            isThrashing,
            isOverheating,
            isCritical
        };
    }, [playerState, activeProcesses]);
};

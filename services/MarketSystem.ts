import { PlayerState, HardwareSpecs } from '../types';

export interface MarketItem {
    id: string;
    name: string;
    type: 'software' | 'hardware';
    description: string;
    cost: number;
    // For hardware upgrades
    hardwareKey?: keyof HardwareSpecs;
    stats?: any;
}

export const MARKET_CATALOG: MarketItem[] = [
    // Software
    { id: 'ping', name: 'ping', type: 'software', description: 'Network connectivity tester', cost: 100 },
    { id: 'nmap', name: 'nmap', type: 'software', description: 'Advanced network scanner', cost: 500 },
    { id: 'hydra', name: 'hydra', type: 'software', description: 'Password brute-force tool', cost: 1500 },

    // Hardware
    {
        id: 'cpu_v2',
        name: 'CPU v2',
        type: 'hardware',
        description: 'Dual-core processor. Increases execution speed.',
        cost: 1000,
        hardwareKey: 'cpu',
        stats: { level: 2, clockSpeed: 2.0, cores: 2 }
    },
    {
        id: 'ram_v2',
        name: 'RAM 8GB',
        type: 'hardware',
        description: 'Enhanced memory. Improves multitasking and trace defense.',
        cost: 800,
        hardwareKey: 'ram',
        stats: { level: 2, capacity: 8 }
    },
    {
        id: 'hd_v2',
        name: 'Storage 500GB',
        type: 'hardware',
        description: 'High capacity drive. Increases loot storage.',
        cost: 600,
        hardwareKey: 'storage',
        stats: { level: 2, capacity: 500 }
    }
];

export interface PurchaseResult {
    success: boolean;
    error?: string;
    updatedPlayerState?: PlayerState;
}

export function buyItem(itemId: string, playerState: PlayerState): PurchaseResult {
    const item = MARKET_CATALOG.find(i => i.id === itemId);

    if (!item) {
        return { success: false, error: `Item '${itemId}' not found in catalog.` };
    }

    if (playerState.credits < item.cost) {
        return { success: false, error: `Insufficient credits. Need ${item.cost}c, have ${playerState.credits}c.` };
    }

    // Check if already owned/installed
    if (item.type === 'software' && playerState.installedSoftware.includes(item.id)) {
        return { success: false, error: `Software '${item.id}' is already installed.` };
    }

    if (item.type === 'hardware' && item.hardwareKey && playerState.hardware[item.hardwareKey].level >= (item.stats?.level || 0)) {
        return { success: false, error: `Higher or equal version of ${item.name} is already installed.` };
    }

    const updatedState: PlayerState = {
        ...playerState,
        credits: playerState.credits - item.cost
    };

    if (item.type === 'software') {
        updatedState.installedSoftware = [...updatedState.installedSoftware, item.id];
    } else if (item.type === 'hardware' && item.hardwareKey) {
        updatedState.hardware = {
            ...updatedState.hardware,
            [item.hardwareKey]: { id: item.id, ...item.stats }
        };
    }

    return {
        success: true,
        updatedPlayerState: updatedState
    };
}

import { PlayerState } from '../types';
import { MARKET_CATALOG } from '../data/marketData';

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

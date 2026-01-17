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

    // 1. Reputation Gating
    if (item.category !== 'hardware' && item.category !== 'consumable') {
        const software = item as any; // Cast to access tier/repReq
        if (software.reputationReq && playerState.reputation < software.reputationReq) {
            return { success: false, error: `Insufficient Reputation. Need ${software.reputationReq}, have ${playerState.reputation}.` };
        }

        // Tier Prerequisites (Optional but good for progression)
        if (software.tier > 1) {
            const lowerTierSoftware = MARKET_CATALOG.filter(i =>
                i.category === software.category &&
                (i as any).tier === software.tier - 1
            );

            if (lowerTierSoftware.length > 0) {
                const hasPrerequisite = lowerTierSoftware.some(prev =>
                    playerState.installedSoftware.includes(prev.id)
                );
                if (!hasPrerequisite) {
                    return { success: false, error: `Prerequisite Error: You must own a Tier ${software.tier - 1} ${software.category} tool first.` };
                }
            }
        }
    }

    // 2. Credits Check
    if (playerState.credits < item.cost) {
        return { success: false, error: `Insufficient credits. Need ${item.cost}c, have ${playerState.credits}c.` };
    }

    // 3. Ownership/Upgrade Check
    if (item.category !== 'hardware' && item.category !== 'consumable') {
        if (playerState.installedSoftware.includes(item.id)) {
            return { success: false, error: `Software '${item.id}' is already installed.` };
        }
    }

    if (item.category === 'hardware' && (item as any).hardwareKey && playerState.hardware[(item as any).hardwareKey as keyof typeof playerState.hardware].level >= ((item as any).stats?.level || 0)) {
        return { success: false, error: `Higher or equal version of ${item.name} is already installed.` };
    }

    // 4. Storage Check (Software only for now)
    if (item.category !== 'hardware' && item.category !== 'consumable') {
        const softwareSize = (item as any).storageSize || 0;
        const currentStorageUsed = calculateTotalStorageUsed(playerState);
        const capacityMB = playerState.hardware.storage.capacity * 1024; // Convert GB to MB

        if (currentStorageUsed + softwareSize > capacityMB) {
            return { success: false, error: `Insufficient storage space. Need ${softwareSize}MB, have ${Math.max(0, capacityMB - currentStorageUsed)}MB free.` };
        }
    }

    // Update State
    const updatedState: PlayerState = {
        ...playerState,
        credits: playerState.credits - item.cost
    };

    if (item.category !== 'hardware' && item.category !== 'consumable') {
        updatedState.installedSoftware = [...updatedState.installedSoftware, item.id];
    } else if (item.category === 'hardware' && (item as any).hardwareKey) {
        updatedState.hardware = {
            ...updatedState.hardware,
            [(item as any).hardwareKey]: { id: item.id, ...(item as any).stats }
        };
    } else if (item.category === 'consumable') {
        // Consumables could go to inventory or a separate list, for now let's put them in inventory as a file-like object
        const consumableFile = {
            type: 'file' as const,
            name: `${item.id}.tool`,
            content: `[CONSUMABLE TOOL]\n${item.description}`,
            size: 1, // Consumables are small
            permissions: 'user' as const
        };
        updatedState.inventory = [...(updatedState.inventory || []), consumableFile];
    }

    return {
        success: true,
        updatedPlayerState: updatedState
    };
}

function calculateTotalStorageUsed(playerState: PlayerState): number {
    let total = 0;

    // 1. Files in inventory (includes consumables)
    if (playerState.inventory) {
        total += playerState.inventory.reduce((sum, node) => sum + (node.type === 'file' ? (node.size || 0) : 0), 0);
    }

    // 2. Installed Software
    playerState.installedSoftware.forEach(id => {
        const soft = MARKET_CATALOG.find(i => i.id === id);
        if (soft && (soft as any).storageSize) {
            total += (soft as any).storageSize;
        }
    });

    return total;
}

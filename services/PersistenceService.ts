import { DatabaseSchema, PlayerState, SaveSlot } from '../types';

const LOCAL_STORAGE_KEY = 'retro-terminal-adventure-db';
const CURRENT_VERSION = '2.0';

const DEFAULT_DB_SCHEMA: DatabaseSchema = {
    meta: { version: CURRENT_VERSION },
    saves: {
        slot_1: { id: 'slot_1', isEmpty: true },
        slot_2: { id: 'slot_2', isEmpty: true },
        slot_3: { id: 'slot_3', isEmpty: true },
        dev_save_slot: { id: 'dev_save_slot', isEmpty: true },
    },
};

async function readDBFromLocalStorage(): Promise<DatabaseSchema> {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data) {
        try {
            const parsed = JSON.parse(data) as DatabaseSchema;
            // Ensure schema version is compatible or handled
            return parsed;
        } catch (error) {
            console.error('Error parsing database from localStorage, re-initializing.', error);
            return DEFAULT_DB_SCHEMA;
        }
    }
    return DEFAULT_DB_SCHEMA;
}

/**
 * Safe write wrapper for localStorage with integrity check and quota handling.
 */
async function writeDBToLocalStorage(data: DatabaseSchema): Promise<void> {
    try {
        const serialized = JSON.stringify(data, null, 2);
        // Basic integrity check: ensure it can be parsed back
        JSON.parse(serialized);
        localStorage.setItem(LOCAL_STORAGE_KEY, serialized);
    } catch (error) {
        if (error instanceof Error) {
            if (error.name === 'QuotaExceededError') {
                console.error('CRITICAL: LocalStorage quota exceeded. Save failed.');
            } else {
                console.error('CRITICAL: Failed to write to LocalStorage:', error.message);
            }
        }
        throw error;
    }
}

export async function initDB(): Promise<void> {
    const dbData = await readDBFromLocalStorage();
    // Ensure meta version is updated if it's an old DB
    if (dbData.meta.version !== CURRENT_VERSION) {
        dbData.meta.version = CURRENT_VERSION;
    }
    await writeDBToLocalStorage(dbData);
}

export async function writeSave(slotId: string, data: PlayerState): Promise<void> {
    const dbData = await readDBFromLocalStorage();
    dbData.saves[slotId] = {
        id: slotId,
        isEmpty: false,
        playerState: { ...data, version: CURRENT_VERSION },
        updatedAt: new Date().toISOString()
    };
    await writeDBToLocalStorage(dbData);
}

export function autoSavePlayerState(data: PlayerState): void {
    if (data.isDevMode) {
        writeSave('dev_save_slot', data);
    } else {
        const slotId = localStorage.getItem('active-save-slot') || 'slot_1';
        writeSave(slotId, data);
    }
}

/**
 * Handles migration of save data from older versions to the current schema.
 */
export function migrateSaveData(data: any): PlayerState {
    const defaultState = createInitialPlayerState();

    // Future-proofing: If version mismatch, apply specific transforms
    // For now, we merge with defaultState to ensure new fields (like systemHeat) exist.

    const migrated = {
        ...defaultState,
        ...data,
        emails: data.emails || defaultState.emails,
        browserHistory: data.browserHistory || defaultState.browserHistory,
        version: CURRENT_VERSION // Always stamp with current version after migration
    };

    // Deep merge hardware if needed to prevent level/stat mismatch
    if (data.hardware) {
        migrated.hardware = {
            ...defaultState.hardware,
            ...data.hardware
        };
    }

    return migrated;
}

export async function readSave(slotId: string): Promise<PlayerState | null> {
    const dbData = await readDBFromLocalStorage();
    const slot = dbData.saves[slotId];
    if (slot && !slot.isEmpty && slot.playerState) {
        return migrateSaveData(slot.playerState);
    }
    return null;
}

export async function deleteSave(slotId: string): Promise<void> {
    const dbData = await readDBFromLocalStorage();
    dbData.saves[slotId] = { id: slotId, isEmpty: true };
    await writeDBToLocalStorage(dbData);
}

export async function getAllSaveSlots(): Promise<SaveSlot[]> {
    const dbData = await readDBFromLocalStorage();
    return Object.values(dbData.saves);
}

export function createInitialPlayerState(): PlayerState {
    return {
        version: CURRENT_VERSION,
        credits: 0,
        reputation: 0,
        installedSoftware: ['ls', 'cd', 'help', 'jobs', 'exit', 'nmap-lite', 'browser', 'mail'],
        inventory: [],
        emails: [
            {
                id: 'welcome_mail',
                sender: 'The Architect',
                subject: 'Welcome to the Grid',
                body: 'Operative,\n\nYour terminal is now active. Use the browser to find contracts on the Onion Forum. We will contact you directly for high-priority tasks.\n\nStay invisible.',
                timestamp: new Date().toISOString().split('T')[0],
                status: 'unread',
                type: 'tip'
            }
        ],
        browserHistory: [],
        hardware: {
            cpu: { id: 'cpu_v1', level: 1, clockSpeed: 0.016, cores: 1 },
            ram: { id: 'ram_v1', level: 1, capacity: 0.004 },
            network: { id: 'net_v1', level: 1, bandwidth: 0.014 },
            storage: { id: 'hd_v1', level: 1, capacity: 0.04 },
            cooling: { id: 'cool_v1', level: 1, heatDissipation: 1.0 }
        },
        activeMissionId: null,
        availableMissions: [],
        systemHeat: 0,
        isOverclocked: false,
        voltageLevel: 1.0,
        isDevMode: false
    };
}

export { readDBFromLocalStorage as readDB };

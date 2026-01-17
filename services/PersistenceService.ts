import { DatabaseSchema, PlayerState, SaveSlot } from '../types';

const LOCAL_STORAGE_KEY = 'retro-terminal-adventure-db';

const DEFAULT_DB_SCHEMA: DatabaseSchema = {
    meta: { version: '2.0' },
    saves: {
        slot_1: { id: 'slot_1', isEmpty: true },
        slot_2: { id: 'slot_2', isEmpty: true },
        slot_3: { id: 'slot_3', isEmpty: true },
    },
};

async function readDBFromLocalStorage(): Promise<DatabaseSchema> {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data) {
        try {
            return JSON.parse(data) as DatabaseSchema;
        } catch (error) {
            console.error('Error parsing database from localStorage, re-initializing.', error);
            return DEFAULT_DB_SCHEMA;
        }
    }
    return DEFAULT_DB_SCHEMA;
}

async function writeDBToLocalStorage(data: DatabaseSchema): Promise<void> {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data, null, 2));
}

export async function initDB(): Promise<void> {
    // For localStorage, initDB mainly ensures a valid schema is present
    const dbData = await readDBFromLocalStorage();
    await writeDBToLocalStorage(dbData); // Ensure a clean, valid schema is saved if not already.
}

export async function writeSave(slotId: string, data: PlayerState): Promise<void> {
    const dbData = await readDBFromLocalStorage();
    dbData.saves[slotId] = { id: slotId, isEmpty: false, playerState: data };
    await writeDBToLocalStorage(dbData);
}

export async function readSave(slotId: string): Promise<PlayerState | null> {
    const dbData = await readDBFromLocalStorage();
    const slot = dbData.saves[slotId];
    if (slot && !slot.isEmpty && slot.playerState) {
        // Merge with default state to handle legacy save migration
        return {
            ...createInitialPlayerState(),
            ...slot.playerState
        };
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
        credits: 0,
        reputation: 0,
        installedSoftware: ['ls', 'cd', 'help', 'market', 'jobs', 'exit'],
        inventory: [],
        hardware: {
            cpu: { id: 'cpu_v1', level: 1, clockSpeed: 1.0, cores: 1 },
            ram: { id: 'ram_v1', level: 1, capacity: 4 },
            network: { id: 'net_v1', level: 1, bandwidth: 10 },
            storage: { id: 'hd_v1', level: 1, capacity: 100 },
            cooling: { id: 'cool_v1', level: 1, heatDissipation: 1.0 }
        },
        activeMissionId: null,
        availableMissions: []
    };
}

// Export readDB for internal use if needed by TitleScreen, etc.
export { readDBFromLocalStorage as readDB };

import React, { useEffect, useState } from 'react';
import { initDB, readSave, writeSave, getAllSaveSlots, createInitialPlayerState } from '../services/PersistenceService';
import { PlayerState, SaveSlot } from '../types';

interface TitleScreenProps {
    onGameLoad: (playerState: PlayerState, slotId: string) => void;
}

const TitleScreen: React.FC<TitleScreenProps> = ({ onGameLoad }) => {
    const [saveSlots, setSaveSlots] = useState<SaveSlot[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const initializeAndLoad = async () => {
            try {
                await initDB();
                const allSlots = await getAllSaveSlots();
                setSaveSlots(allSlots);
            } catch (err) {
                setError("Failed to initialize or load save data.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        initializeAndLoad();
    }, []);

    const displaySlot = (slot: SaveSlot) => {
        if (slot.isEmpty) {
            return `[${slot.id.toUpperCase()}] :: FREE SPACE`;
        }
        const playerState = slot.playerState as PlayerState; // Cast since we know it's not empty
        return `[${slot.id.toUpperCase()}] :: CREDITS: ${playerState.credits} :: REP: ${playerState.reputation}`;
    };

    const handleSlotClick = async (slotId: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const existingSave = await readSave(slotId);

            if (existingSave) {
                // Load game
                onGameLoad(existingSave, slotId);
            } else {
                // New game
                const freshPlayerState = createInitialPlayerState();
                await writeSave(slotId, freshPlayerState);
                onGameLoad(freshPlayerState, slotId); // Load the newly created game
            }
            // Re-load slots to update UI after changes
            const allSlots = await getAllSaveSlots();
            setSaveSlots(allSlots);
        } catch (err) {
            setError("Failed to handle slot action.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <div className="retro-text">LOADING SAVE DATA...</div>;
    }

    if (error) {
        return <div className="retro-text error-text">ERROR: {error}</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-black retro-crt">
            <h1 className="text-green-400 text-4xl mb-8 font-mono glitch">RETRO TERMINAL ADVENTURE</h1>
            <div className="space-y-4">
                {saveSlots.map((slot) => (
                    <div
                        key={slot.id}
                        className="retro-slot-item text-green-300 border border-green-700 p-4 cursor-pointer hover:bg-green-900 transition-colors duration-200"
                        onClick={() => handleSlotClick(slot.id)}
                    >
                        {displaySlot(slot)}
                    </div>
                ))}
            </div>
            <p className="retro-footer-text text-gray-500 mt-8">SELECT A SLOT TO BEGIN</p>
        </div>
    );
};

export default TitleScreen;

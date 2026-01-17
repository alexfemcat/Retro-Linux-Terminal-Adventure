import React, { useEffect, useState } from 'react';
import { initDB, readSave, writeSave, getAllSaveSlots, createInitialPlayerState } from '../services/PersistenceService';
import { PlayerState, SaveSlot } from '../types';

interface TitleScreenProps {
    onGameLoad: (playerState: PlayerState, slotId: string) => void;
    isBooting?: boolean;
}

const TitleScreen: React.FC<TitleScreenProps> = ({ onGameLoad, isBooting }) => {
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

    if (isBooting) {
        return (
            <div className="flex flex-col items-start justify-start h-screen bg-black p-12 font-mono text-green-500 overflow-hidden relative">
                <div className="animate-pulse mb-4">RETRO-BIOS v2.0.4 - RELEASE 1998</div>
                <div className="space-y-1">
                    <div className="animate-[typing_0.5s_steps(20)_forwards]">CPU: R-CORE 4000 @ 1.2GHz ... OK</div>
                    <div className="animate-[typing_0.5s_steps(20)_0.5s_forwards] opacity-0">MEMORY: 65536 KB ... OK</div>
                    <div className="animate-[typing_0.5s_steps(20)_1.0s_forwards] opacity-0">VFS MOUNTING /dev/sda1 ... OK</div>
                    <div className="animate-[typing_0.5s_steps(20)_1.5s_forwards] opacity-0 text-yellow-500">INITIATING SYSTEM HANDSHAKE...</div>
                    <div className="animate-[typing_0.5s_steps(20)_2.0s_forwards] opacity-0 text-cyan-400 font-bold">WELCOME BACK, OPERATIVE.</div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent pointer-events-none animate-scanline"></div>
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-black font-mono text-green-500">
                <div className="animate-spin mb-4">/</div>
                LOADING DATA...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-black font-mono text-red-500">
                [ERROR] :: {error}
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-black overflow-hidden relative font-vt323">
            {/* CRT Effects */}
            <div className="absolute inset-0 pointer-events-none z-10 bg-[radial-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_100%),linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_100%,100%_4px,3px_100%]"></div>

            <div className="z-20 flex flex-col items-center max-w-2xl w-full px-8">
                <div className="mb-12 text-center">
                    <h1 className="text-[#33ff00] text-6xl mb-2 tracking-[0.2em] font-bold drop-shadow-[0_0_10px_rgba(51,255,0,0.5)]">RETRO-TERM</h1>
                    <div className="text-amber-500 text-sm tracking-[0.5em] uppercase opacity-70">Persistent Simulation RPG v2.0</div>
                </div>

                <div className="w-full space-y-4 mb-12">
                    <div className="text-xs text-green-900 mb-2 uppercase tracking-widest border-b border-green-900/30 pb-1">Select Partition</div>
                    {saveSlots.map((slot) => {
                        const isEmpty = slot.isEmpty;
                        return (
                            <div
                                key={slot.id}
                                className={`group relative overflow-hidden border ${isEmpty ? 'border-green-900/30 text-green-900' : 'border-[#33ff00]/50 text-[#33ff00] shadow-[0_0_15px_rgba(51,255,0,0.1)]'} p-6 cursor-pointer hover:bg-[#33ff00]/5 transition-all duration-300 transform hover:-translate-y-1`}
                                onClick={() => handleSlotClick(slot.id)}
                            >
                                <div className="flex justify-between items-center relative z-10">
                                    <div className="flex flex-col">
                                        <span className="text-xs opacity-50 mb-1">SLOT_{slot.id.split('_')[1]}</span>
                                        <span className="text-xl font-bold tracking-wider uppercase">
                                            {isEmpty ? 'Empty Partition' : `User_${slot.id.split('_')[1]}`}
                                        </span>
                                    </div>
                                    {!isEmpty && slot.playerState && (
                                        <div className="text-right flex flex-col gap-1">
                                            <div className="text-xs">
                                                <span className="opacity-50 uppercase mr-2">Credits</span>
                                                <span className="text-amber-500 font-bold">{slot.playerState.credits}</span>
                                            </div>
                                            <div className="text-xs">
                                                <span className="opacity-50 uppercase mr-2">Reputation</span>
                                                <span className="text-cyan-400 font-bold">{slot.playerState.reputation}</span>
                                            </div>
                                        </div>
                                    )}
                                    {isEmpty && (
                                        <div className="text-xs italic opacity-30 uppercase tracking-tighter">Ready to Initialize</div>
                                    )}
                                </div>
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#33ff00]/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                            </div>
                        );
                    })}
                </div>

                <div className="text-[10px] text-green-900/40 uppercase tracking-[0.3em] animate-pulse">
                    Waiting for user input...
                </div>
            </div>

            {/* Background scanline */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent pointer-events-none animate-scanline z-30"></div>
        </div>
    );
};

export default TitleScreen;

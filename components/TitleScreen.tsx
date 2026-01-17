import React, { useEffect, useState, useRef } from 'react';
import { initDB, readSave, writeSave, deleteSave, getAllSaveSlots, createInitialPlayerState } from '../services/PersistenceService';
import { PlayerState, SaveSlot } from '../types';

interface TitleScreenProps {
    onGameLoad: (playerState: PlayerState, slotId: string) => void;
}

const TitleScreen: React.FC<TitleScreenProps> = ({ onGameLoad }) => {
    const [saveSlots, setSaveSlots] = useState<SaveSlot[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);
    const [confirmingImport, setConfirmingImport] = useState<string | null>(null);
    const [activeImportSlot, setActiveImportSlot] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleExport = (slotId: string, playerState: PlayerState) => {
        const dataStr = JSON.stringify(playerState, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `retro_save_${slotId}_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleImportClick = (slotId: string, isEmpty: boolean) => {
        if (!isEmpty) {
            setConfirmingImport(slotId);
        } else {
            triggerFileInput(slotId);
        }
    };

    const triggerFileInput = (slotId: string) => {
        setActiveImportSlot(slotId);
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const slotId = activeImportSlot;
        if (!slotId) return;

        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const content = e.target?.result as string;
                const importedState = JSON.parse(content) as PlayerState;

                // Basic validation: Check for essential fields
                if (typeof importedState.credits !== 'number' || !Array.isArray(importedState.installedSoftware)) {
                    throw new Error("Invalid save file format.");
                }

                await writeSave(slotId, importedState);
                const allSlots = await getAllSaveSlots();
                setSaveSlots(allSlots);
                setConfirmingImport(null);
                setActiveImportSlot(null);
            } catch (err) {
                setError("Failed to import save: " + (err instanceof Error ? err.message : "Invalid JSON"));
            }
        };
        reader.readAsText(file);
        // Clear input for next use
        event.target.value = '';
    };

    const handleDelete = async (slotId: string) => {
        if (confirmingDelete !== slotId) {
            setConfirmingDelete(slotId);
            return;
        }

        try {
            await deleteSave(slotId);
            const allSlots = await getAllSaveSlots();
            setSaveSlots(allSlots);
            setConfirmingDelete(null);
        } catch (err) {
            setError("Failed to delete save.");
        }
    };


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
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept=".json"
                        onChange={handleFileChange}
                    />

                    {saveSlots.filter(s => s.id !== 'dev_save_slot').map((slot) => {
                        const isEmpty = slot.isEmpty;
                        const isConfirmingDelete = confirmingDelete === slot.id;
                        const isConfirmingImport = confirmingImport === slot.id;

                        return (
                            <div key={slot.id} className="relative group">
                                <div
                                    className={`relative overflow-hidden border ${isEmpty ? 'border-green-900/30 text-green-900' : 'border-[#33ff00]/50 text-[#33ff00] shadow-[0_0_15px_rgba(51,255,0,0.1)]'} p-6 cursor-pointer hover:bg-[#33ff00]/5 transition-all duration-300 transform hover:-translate-y-1`}
                                    onClick={() => !isConfirmingDelete && !isConfirmingImport && handleSlotClick(slot.id)}
                                >
                                    <div className="flex justify-between items-center relative z-10">
                                        <div className="flex flex-col">
                                            <span className="text-xs opacity-50 mb-1">SLOT_{slot.id.split('_')[1]}</span>
                                            <span className="text-xl font-bold tracking-wider uppercase">
                                                {isEmpty ? 'Empty Partition' : `User_${slot.id.split('_')[1]}`}
                                            </span>
                                        </div>
                                        {!isEmpty && slot.playerState && !isConfirmingDelete && !isConfirmingImport && (
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

                                        {isConfirmingDelete && (
                                            <div className="flex gap-4 items-center z-30">
                                                <span className="text-red-500 font-bold animate-pulse text-sm">DELETE THIS DATA?</span>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDelete(slot.id); }}
                                                    className="px-3 py-1 bg-red-600 text-white text-xs font-bold hover:bg-red-500"
                                                >
                                                    CONFIRM
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setConfirmingDelete(null); }}
                                                    className="px-3 py-1 bg-gray-800 text-gray-400 text-xs hover:bg-gray-700"
                                                >
                                                    CANCEL
                                                </button>
                                            </div>
                                        )}

                                        {isConfirmingImport && (
                                            <div className="flex gap-4 items-center z-30">
                                                <span className="text-amber-500 font-bold animate-pulse text-sm">OVERWRITE EXISTING?</span>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); triggerFileInput(slot.id); }}
                                                    className="px-3 py-1 bg-amber-600 text-black text-xs font-bold hover:bg-amber-500"
                                                >
                                                    OVERWRITE
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setConfirmingImport(null); }}
                                                    className="px-3 py-1 bg-gray-800 text-gray-400 text-xs hover:bg-gray-700"
                                                >
                                                    CANCEL
                                                </button>
                                            </div>
                                        )}

                                        {isEmpty && !isConfirmingImport && (
                                            <div className="text-xs italic opacity-30 uppercase tracking-tighter">Ready to Initialize</div>
                                        )}
                                    </div>

                                    {/* Action Buttons Layer */}
                                    {!isConfirmingDelete && !isConfirmingImport && (
                                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            {!isEmpty && slot.playerState && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleExport(slot.id, slot.playerState!); }}
                                                    className="text-[10px] px-2 py-0.5 border border-green-500/30 hover:bg-green-500/20 text-green-500"
                                                    title="Export Save"
                                                >
                                                    EXP
                                                </button>
                                            )}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleImportClick(slot.id, isEmpty); }}
                                                className="text-[10px] px-2 py-0.5 border border-amber-500/30 hover:bg-amber-500/20 text-amber-500"
                                                title="Import Save"
                                            >
                                                IMP
                                            </button>
                                            {!isEmpty && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDelete(slot.id); }}
                                                    className="text-[10px] px-2 py-0.5 border border-red-500/30 hover:bg-red-500/20 text-red-500"
                                                    title="Delete Save"
                                                >
                                                    DEL
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#33ff00]/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                                </div>
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

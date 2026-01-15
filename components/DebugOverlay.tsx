import React from 'react';
import type { GameState } from '../types';

interface DebugOverlayProps {
    gameState: GameState;
}

export const DebugOverlay: React.FC<DebugOverlayProps> = ({ gameState }) => {
    return (
        <div
            className="flex-shrink-0 p-4 bg-black/60 border-2 border-red-500/30 rounded-lg font-mono text-[10px] text-red-400 select-none backdrop-blur-sm shadow-xl mt-4"
            style={{ textShadow: 'none' }}
        >
            <h3 className="text-red-500 font-bold mb-2 border-b border-red-500/30 pb-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                DEBUG TERMINAL (ADMIN ONLY)
            </h3>
            <div className="space-y-2">
                <div>
                    <span className="text-gray-500 uppercase">[Objective]</span>
                    <div className="ml-2">
                        Path: <span className="text-white">/{gameState.objective.filePath.join('/')}</span><br />
                        File: <span className="text-white font-bold">{gameState.objective.fileName}</span>
                    </div>
                </div>

                {gameState.discoveryClue && (
                    <div>
                        <span className="text-gray-500 uppercase">[Intermediate Lead]</span>
                        <div className="ml-2">
                            Path: <span className="text-white">/{gameState.discoveryClue.path.join('/')}</span><br />
                            File: <span className="text-white font-bold">{gameState.discoveryClue.name}</span>
                        </div>
                    </div>
                )}

                <div>
                    <span className="text-gray-500 uppercase">[Security]</span>
                    <div className="ml-2">
                        Root Pass: <span className="text-yellow-400 font-bold underline">{gameState.rootPassword}</span>
                    </div>
                </div>

                <div className="text-[10px] text-red-500/50 mt-2 italic">
                    * Detach this component before public release
                </div>
            </div>
        </div>
    );
};

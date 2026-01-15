import React from 'react';
import type { GameState, Directory, File, VFSNode } from '../types';

interface DebugOverlayProps {
    gameState: GameState;
}

const getFileByPath = (vfs: Directory, path: string[], fileName: string): File | null => {
    let current: VFSNode = vfs;
    for (const segment of path) {
        if (current.type === 'directory') {
            current = current.children[segment];
            if (!current) return null;
        } else {
            return null;
        }
    }
    if (current.type === 'directory') {
        const file = current.children[fileName];
        return file && file.type === 'file' ? file : null;
    }
    return null;
};

export const DebugOverlay: React.FC<DebugOverlayProps> = ({ gameState }) => {
    const objectiveFile = getFileByPath(gameState.vfs, gameState.objective.filePath, gameState.objective.fileName);
    const pwdHintFile = gameState.pwdHintLocation
        ? getFileByPath(gameState.vfs, gameState.pwdHintLocation.path, gameState.pwdHintLocation.name)
        : null;

    const renderEncryption = (file: File | null) => {
        if (!file || !file.isEncrypted) return <span className="text-green-500">[Clear]</span>;
        if (!file.encryption) return <span className="text-yellow-500">[Encrypted: Legacy]</span>;

        return (
            <div className="space-y-1 mt-1">
                {file.encryption.requirements.map((req, idx) => (
                    <div key={idx} className="text-orange-500">
                        [{req.type.toUpperCase()}{req.transformation ? `:${req.transformation.type.toUpperCase()}` : ''}] Key: <span className="text-white font-bold underline">{req.targetValue}</span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div
            className="flex-shrink-0 p-4 bg-black/60 border-2 border-red-500/30 rounded-lg font-mono text-[10px] text-red-400 select-none backdrop-blur-sm shadow-xl mt-4"
            style={{ textShadow: 'none' }}
        >
            <h3 className="text-red-500 font-bold mb-2 border-b border-red-500/30 pb-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                DEBUG TERMINAL (ADMIN ONLY)
            </h3>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <div>
                        <span className="text-gray-500 uppercase">[Objective]</span>
                        <div className="ml-2">
                            Path: <span className="text-white">/{gameState.objective.filePath.join('/')}</span><br />
                            File: <span className="text-white font-bold">{gameState.objective.fileName}</span><br />
                            Status: {renderEncryption(objectiveFile)}
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
                            Root Pass: <span className="text-yellow-400 font-bold underline">{gameState.rootPassword}</span><br />
                            Type: <span className="text-white">{gameState.pwdDeliveryType}</span><br />
                            {gameState.pwdHintLocation && (
                                <>
                                    Loc: <span className="text-white font-bold">/{gameState.pwdHintLocation.path.join('/')}/{gameState.pwdHintLocation.name}</span><br />
                                    Hint Status: {renderEncryption(pwdHintFile)}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-2 border-l border-red-500/20 pl-4">
                    <div>
                        <span className="text-gray-500 uppercase">[System State]</span>
                        <div className="ml-2">
                            Boot: <span className="text-white">{new Date(gameState.bootTime).toLocaleString()}</span><br />
                            Uptime: <span className="text-white">{Math.floor((Date.now() - gameState.bootTime) / 60000)}m</span><br />
                            Procs: <span className="text-white">{gameState.processes.length} recognized</span>
                        </div>
                    </div>

                    <div>
                        <span className="text-gray-500 uppercase">[Env Keys]</span>
                        <div className="ml-2 max-h-32 overflow-y-auto">
                            {Object.entries(gameState.envVars).slice(0, 8).map(([k, v]) => (
                                <div key={k} title={v}>
                                    {k}=<span className="text-white">{v}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <span className="text-gray-500 uppercase">[Archetype]</span>
                        <div className="ml-2">
                            Start: <span className="text-white font-bold">{gameState.starterArchetype}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-[10px] text-red-500/50 mt-2 italic border-t border-red-500/30 pt-1">
                * Path to objective: {gameState.objective.filePath.join(' -> ')}
            </div>
        </div>
    );
};

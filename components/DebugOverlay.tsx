import React, { useState } from 'react';
import type { GameState, NetworkNode, WinCondition, PlayerState } from '../types';
import { MARKET_CATALOG } from '../data/marketData';

interface DebugOverlayProps {
    gameState: GameState;
    activeNode: NetworkNode;
    playerState: PlayerState;
    isMissionActive: boolean;
    onPlayerStateChange: (state: PlayerState) => void;
    onGameStateChange: (state: GameState) => void;
    onWin: () => void;
    onAbort: () => void;
}

export const DebugOverlay: React.FC<DebugOverlayProps> = ({
    gameState,
    activeNode,
    playerState,
    isMissionActive,
    onPlayerStateChange,
    onGameStateChange,
    onWin,
    onAbort
}) => {
    const [activeTab, setActiveTab] = useState<'mission' | 'player' | 'hardware'>('player');

    // Custom Mission Generation State
    const [customNodes, setCustomNodes] = useState(3);
    const [customDifficulty, setCustomDifficulty] = useState(2);
    const [customType, setCustomType] = useState<'file_found' | 'root_access' | 'process_killed' | 'file_modified'>('file_found');

    const modifyCredits = (amount: number) => {
        onPlayerStateChange({ ...playerState, credits: Math.max(0, playerState.credits + amount) });
    };

    const modifyReputation = (amount: number) => {
        onPlayerStateChange({ ...playerState, reputation: Math.max(0, playerState.reputation + amount) });
    };

    const toggleSoftware = (id: string) => {
        const hasIt = playerState.installedSoftware.includes(id);
        const newSoftware = hasIt
            ? playerState.installedSoftware.filter(s => s !== id)
            : [...playerState.installedSoftware, id];
        onPlayerStateChange({ ...playerState, installedSoftware: newSoftware });
    };

    const revealAllNodes = () => {
        const newNodes = gameState.nodes.map(n => ({ ...n, isDiscovered: true }));
        onGameStateChange({ ...gameState, nodes: newNodes });
    };

    const setHeat = (val: number) => {
        onPlayerStateChange({ ...playerState, systemHeat: val });
    };

    const spawnMission = (tier: number) => {
        const config = { numNodes: tier + 1, difficultyMultiplier: tier };
        const fakeMission = {
            id: `dev_${Date.now()}`,
            title: `DEBUG TIER ${tier}`,
            difficulty: Math.min(5, Math.max(1, tier)) as 1 | 2 | 3 | 4 | 5,
            reward: tier * 500,
            description: 'FORCE-SPAWNED VIA DEBUG MENU',
            targetNetworkConfig: config
        };
        const updatedMissions = [...playerState.availableMissions, fakeMission as any];
        onPlayerStateChange({ ...playerState, availableMissions: updatedMissions });
    };

    const spawnCustomMission = () => {
        const config = {
            numNodes: customNodes,
            difficultyMultiplier: customDifficulty,
            winConditionType: customType,
            targetFileName: customType === 'file_found' ? `SECRET_${Math.floor(Math.random() * 1000)}.dat` : undefined
        };
        const fakeMission = {
            id: `custom_${Date.now()}`,
            title: `CUSTOM OP: ${customType.toUpperCase()}`,
            difficulty: Math.min(5, Math.max(1, customDifficulty)) as 1 | 2 | 3 | 4 | 5,
            reward: customNodes * customDifficulty * 200,
            description: `CUSTOM MISSION - TYPE: ${customType.toUpperCase()} - NODES: ${customNodes}`,
            targetNetworkConfig: config
        };
        const updatedMissions = [...playerState.availableMissions, fakeMission as any];
        onPlayerStateChange({ ...playerState, availableMissions: updatedMissions });
    };

    const renderWinCondition = (win: WinCondition) => {
        let desc = "";
        switch (win.type) {
            case 'root_access':
                const targetNode = gameState.nodes.find(n => n.id === win.nodeId);
                desc = `Root Access on ${targetNode?.hostname || win.nodeId}`;
                break;
            case 'file_found':
                desc = `Download ${win.path[win.path.length - 1]}`;
                break;
            case 'process_killed':
                desc = `Kill ${win.processName}`;
                break;
        }
        return <span className="text-yellow-400 font-bold">{desc}</span>;
    };

    return (
        <div className="flex flex-col h-full bg-black/90 border-2 border-green-500/30 rounded-lg font-mono text-[11px] text-green-400 select-none backdrop-blur-md shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-3 bg-green-500/10 border-b border-green-500/30 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="font-bold tracking-tighter">TERMINAL_DEBUG_OS v2.0</span>
                </div>
                <div className="text-[9px] opacity-50 uppercase">{isMissionActive ? 'MISSION_MODE' : 'HOMEBASE'}</div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-green-500/20">
                {(['player', 'mission', 'hardware'] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-2 uppercase tracking-widest transition-colors ${activeTab === tab ? 'bg-green-500/20 text-white font-bold' : 'hover:bg-white/5 opacity-50'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="flex-grow overflow-y-auto p-4 custom-scrollbar space-y-4">

                {activeTab === 'player' && (
                    <div className="space-y-4">
                        <section>
                            <h4 className="text-gray-500 uppercase text-[9px] mb-2 border-b border-gray-800 pb-1">Account Assets</h4>
                            <div className="grid grid-cols-2 gap-2 mb-3">
                                <div className="bg-gray-900/50 p-2 rounded">
                                    <div className="text-gray-500 mb-1">CREDITS</div>
                                    <div className="text-amber-500 font-bold text-sm mb-2">{playerState.credits}c</div>
                                    <div className="flex gap-1">
                                        <button onClick={() => modifyCredits(100)} className="bg-green-900/40 px-2 py-1 rounded hover:bg-green-800/60">+100</button>
                                        <button onClick={() => modifyCredits(1000)} className="bg-green-900/40 px-2 py-1 rounded hover:bg-green-800/60">+1k</button>
                                    </div>
                                </div>
                                <div className="bg-gray-900/50 p-2 rounded">
                                    <div className="text-gray-500 mb-1">REPUTATION</div>
                                    <div className="text-cyan-400 font-bold text-sm mb-2">{playerState.reputation} XP</div>
                                    <div className="flex gap-1">
                                        <button onClick={() => modifyReputation(50)} className="bg-green-900/40 px-2 py-1 rounded hover:bg-green-800/60">+50</button>
                                        <button onClick={() => modifyReputation(500)} className="bg-green-900/40 px-2 py-1 rounded hover:bg-green-800/60">+500</button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h4 className="text-gray-500 uppercase text-[9px] mb-2 border-b border-gray-800 pb-1">Software Binaries</h4>
                            <div className="grid grid-cols-2 gap-1">
                                {MARKET_CATALOG.filter(i => ['utility', 'exploit', 'sniffing'].includes(i.category)).map(item => {
                                    const installed = playerState.installedSoftware.includes(item.id);
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => toggleSoftware(item.id)}
                                            className={`text-left px-2 py-1 rounded transition-colors ${installed ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-gray-900/30 text-gray-600 border border-transparent hover:border-gray-700'}`}
                                        >
                                            {installed ? '✓' : '+'} {item.id}
                                        </button>
                                    );
                                })}
                            </div>
                        </section>

                        <section>
                            <h4 className="text-gray-500 uppercase text-[9px] mb-2 border-b border-gray-800 pb-1">Inventory Management</h4>
                            <div className="bg-gray-900/50 p-2 rounded max-h-32 overflow-y-auto custom-scrollbar">
                                {playerState.inventory.length === 0 ? (
                                    <div className="text-gray-700 italic text-center py-2">Inventory Empty</div>
                                ) : (
                                    <div className="space-y-1">
                                        {playerState.inventory.map((item, i) => (
                                            <div key={i} className="flex justify-between items-center text-[10px] text-gray-400">
                                                <span>{item.name}</span>
                                                <span className="text-cyan-800">{item.type === 'file' ? `${(item.size || 0).toFixed(1)}MB` : 'DIR'}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => onPlayerStateChange({ ...playerState, inventory: [] })}
                                className="w-full mt-2 py-1 bg-red-900/20 text-red-500 hover:bg-red-900/40 rounded transition-colors"
                            >
                                WIPE INVENTORY
                            </button>
                        </section>
                    </div>
                )}

                {activeTab === 'mission' && (
                    <div className="space-y-4">
                        {isMissionActive ? (
                            <>
                                <section>
                                    <h4 className="text-gray-500 uppercase text-[9px] mb-2 border-b border-gray-800 pb-1">Active Objective</h4>
                                    <div className="p-2 bg-green-900/20 border border-green-500/20 rounded">
                                        {renderWinCondition(gameState.winCondition)}
                                    </div>
                                </section>

                                <section>
                                    <h4 className="text-gray-500 uppercase text-[9px] mb-2 border-b border-gray-800 pb-1">Signal Trace</h4>
                                    <div className="bg-gray-900/50 p-2 rounded">
                                        <div className="flex justify-between mb-1">
                                            <span>PROGRESS</span>
                                            <span className={gameState.traceProgress > 75 ? 'text-red-500' : 'text-yellow-500'}>{gameState.traceProgress}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={gameState.traceProgress}
                                            onChange={(e) => onGameStateChange({ ...gameState, traceProgress: parseInt(e.target.value), isTraceActive: true })}
                                            className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-green-500"
                                        />
                                        <div className="flex gap-2 mt-2">
                                            <button onClick={() => onGameStateChange({ ...gameState, traceProgress: 0 })} className="text-[8px] bg-blue-900/20 px-1 rounded">CLEAR</button>
                                            <button onClick={() => onGameStateChange({ ...gameState, traceProgress: 100 })} className="text-[8px] bg-red-900/20 px-1 rounded">TRIGGER DISCONNECT</button>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="text-gray-500 uppercase text-[9px]">Network Topology</h4>
                                        <button
                                            onClick={revealAllNodes}
                                            className="text-[9px] bg-blue-900/40 text-blue-400 px-2 py-0.5 rounded hover:bg-blue-800/60"
                                        >
                                            REVEAL ALL
                                        </button>
                                    </div>
                                    <div className="space-y-1">
                                        {gameState.nodes.map(node => (
                                            <div key={node.id} className={`p-2 rounded bg-gray-900/50 border ${node.id === activeNode.id ? 'border-green-500/50' : 'border-transparent'}`}>
                                                <div className="flex justify-between text-[10px]">
                                                    <span className={node.id === activeNode.id ? 'text-white font-bold' : 'text-gray-400'}>{node.hostname}</span>
                                                    <span className="text-gray-600">{node.ip}</span>
                                                </div>
                                                <div className="flex justify-between mt-1 items-center">
                                                    <div className="text-[10px]">
                                                        <span className="text-gray-500">ROOT: </span>
                                                        <span className="text-yellow-500 select-all font-bold">{node.rootPassword}</span>
                                                    </div>
                                                    <div className={`text-[8px] px-1 rounded ${node.isDiscovered ? 'text-blue-400' : 'text-red-900'}`}>
                                                        {node.isDiscovered ? 'DISCOVERED' : 'HIDDEN'}
                                                    </div>
                                                </div>
                                                {node.vulnerabilities.length > 0 && (
                                                    <div className="mt-2 space-y-1 border-t border-gray-800 pt-1">
                                                        <div className="text-[7px] text-gray-500 uppercase">Vulnerabilities:</div>
                                                        {node.vulnerabilities.map((v, i) => (
                                                            <div key={i} className="text-[8px] flex justify-between">
                                                                <span className="text-red-400">{v.type.toUpperCase()}</span>
                                                                <span className="text-gray-500">Lvl {v.level}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section className="pt-2 flex gap-2">
                                    <button onClick={onWin} className="flex-1 py-2 bg-green-600 text-black font-bold hover:bg-green-500 rounded">FORCE WIN</button>
                                    <button onClick={onAbort} className="flex-1 py-2 bg-red-600 text-white font-bold hover:bg-red-500 rounded">ABORT</button>
                                </section>
                            </>
                        ) : (
                            <>
                                <section>
                                    <h4 className="text-gray-500 uppercase text-[9px] mb-3 border-b border-gray-800 pb-1">Custom Mission Generator</h4>
                                    <div className="space-y-3 bg-gray-900/40 p-3 rounded border border-green-500/10">
                                        <div>
                                            <div className="flex justify-between text-[8px] mb-1">
                                                <span>NODE COUNT</span>
                                                <span className="text-white">{customNodes}</span>
                                            </div>
                                            <input type="range" min="2" max="10" value={customNodes} onChange={e => setCustomNodes(parseInt(e.target.value))} className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-green-500" />
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-[8px] mb-1">
                                                <span>DIFFICULTY</span>
                                                <span className="text-white">TIER {customDifficulty}</span>
                                            </div>
                                            <input type="range" min="1" max="5" value={customDifficulty} onChange={e => setCustomDifficulty(parseInt(e.target.value))} className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-green-500" />
                                        </div>
                                        <div>
                                            <div className="text-[8px] mb-1 uppercase opacity-50">Objective Type</div>
                                            <div className="grid grid-cols-2 gap-1">
                                                <button onClick={() => setCustomType('file_found')} className={`py-1 rounded border text-[9px] ${customType === 'file_found' ? 'bg-green-500/20 border-green-500 text-white' : 'bg-gray-800 border-transparent text-gray-500'}`}>DATA THEFT</button>
                                                <button onClick={() => setCustomType('root_access')} className={`py-1 rounded border text-[9px] ${customType === 'root_access' ? 'bg-green-500/20 border-green-500 text-white' : 'bg-gray-800 border-transparent text-gray-500'}`}>ROOT ACCESS</button>
                                                <button onClick={() => setCustomType('process_killed')} className={`py-1 rounded border text-[9px] ${customType === 'process_killed' ? 'bg-green-500/20 border-green-500 text-white' : 'bg-gray-800 border-transparent text-gray-500'}`}>ASSASSINATION</button>
                                                <button onClick={() => setCustomType('file_modified')} className={`py-1 rounded border text-[9px] ${customType === 'file_modified' ? 'bg-green-500/20 border-green-500 text-white' : 'bg-gray-800 border-transparent text-gray-500'}`}>DEFACEMENT</button>
                                            </div>
                                        </div>
                                        <button
                                            onClick={spawnCustomMission}
                                            className="w-full py-2 bg-green-600 text-black font-bold hover:bg-green-500 rounded mt-2 shadow-[0_0_10px_rgba(34,197,94,0.3)] transition-all active:scale-95"
                                        >
                                            DEPLOY CONTRACT
                                        </button>
                                    </div>
                                </section>

                                <section>
                                    <h4 className="text-gray-500 uppercase text-[9px] mb-2 border-b border-gray-800 pb-1">Quick Templates</h4>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[1, 3, 5].map(tier => (
                                            <button
                                                key={tier}
                                                onClick={() => spawnMission(tier)}
                                                className="py-2 bg-green-900/30 border border-green-500/20 hover:bg-green-500/20 text-green-400 rounded flex flex-col items-center"
                                            >
                                                <span className="text-[10px] font-bold">T{tier}</span>
                                            </button>
                                        ))}
                                    </div>
                                </section>
                            </>
                        )}
                    </div>
                )}

                {activeTab === 'hardware' && (
                    <div className="space-y-4">
                        <section>
                            <h4 className="text-gray-500 uppercase text-[9px] mb-2 border-b border-gray-800 pb-1">Thermal Telemetry</h4>
                            <div className="bg-gray-900/50 p-3 rounded">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-500">SYSTEM_HEAT</span>
                                    <span className={`font-bold ${playerState.systemHeat > 80 ? 'text-red-500' : 'text-green-500'}`}>{playerState.systemHeat.toFixed(1)}°C</span>
                                </div>
                                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden mb-4">
                                    <div
                                        className={`h-full transition-all duration-500 ${playerState.systemHeat > 80 ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-green-500 shadow-[0_0_10px_#33ff00]'}`}
                                        style={{ width: `${Math.min(100, playerState.systemHeat)}%` }}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <button onClick={() => setHeat(0)} className="py-1 bg-blue-900/40 text-blue-400 rounded border border-blue-500/20 hover:bg-blue-800/60">RESET HEAT</button>
                                    <button onClick={() => setHeat(99)} className="py-1 bg-red-900/40 text-red-500 rounded border border-red-500/20 hover:bg-red-800/60">OVERHEAT</button>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h4 className="text-gray-500 uppercase text-[9px] mb-2 border-b border-gray-800 pb-1">Component Specs</h4>
                            <div className="space-y-1">
                                {Object.entries(playerState.hardware).map(([key, spec]: [string, any]) => (
                                    <div key={key} className="bg-gray-900/30 p-2 rounded flex justify-between items-center text-[10px]">
                                        <div className="flex flex-col">
                                            <span className="text-white uppercase font-bold">{key}</span>
                                            <span className="text-gray-600 text-[8px]">{spec.id}</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-cyan-400">LVL {spec.level}</div>
                                            <div className="text-[8px] text-gray-500">
                                                {key === 'cpu' && `${spec.clockSpeed}GHz x${spec.cores}`}
                                                {key === 'ram' && `${spec.capacity}GB`}
                                                {key === 'storage' && `${spec.capacity}GB`}
                                                {key === 'network' && `${spec.bandwidth}MBps`}
                                                {key === 'cooling' && `${spec.heatDissipation}x`}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => {
                                    // Cheat: Set all hardware to Level 2
                                    const highSpec = {
                                        cpu: { id: 'cpu_v2', level: 2, clockSpeed: 2.0, cores: 2 },
                                        ram: { id: 'ram_v2', level: 2, capacity: 8 },
                                        network: { id: 'net_v1', level: 1, bandwidth: 50 },
                                        storage: { id: 'hd_v2', level: 2, capacity: 500 },
                                        cooling: { id: 'cool_v1', level: 1, heatDissipation: 2.0 }
                                    };
                                    onPlayerStateChange({ ...playerState, hardware: highSpec as any });
                                }}
                                className="w-full mt-3 py-2 border border-cyan-500/30 text-cyan-500 hover:bg-cyan-500/10 rounded font-bold uppercase"
                            >
                                UPGRADE ALL (DEV_PACK)
                            </button>
                        </section>
                    </div>
                )}

            </div>

            {/* Footer */}
            <div className="p-2 bg-black border-t border-green-500/30 text-center text-[8px] text-gray-600 uppercase tracking-tighter">
                F2 TO TOGGLE DEBUG // USE CAREFULLY IN PROD
            </div>
        </div>
    );
};

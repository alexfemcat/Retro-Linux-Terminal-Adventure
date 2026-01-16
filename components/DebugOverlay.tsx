import React from 'react';
import type { GameState, NetworkNode, WinCondition } from '../types';

interface DebugOverlayProps {
    gameState: GameState;
    activeNode: NetworkNode;
}

export const DebugOverlay: React.FC<DebugOverlayProps> = ({ gameState, activeNode }) => {

    const renderWinCondition = (win: WinCondition) => {
        let desc = "";
        switch (win.type) {
            case 'root_access':
                const targetNode = gameState.nodes.find(n => n.id === win.nodeId);
                desc = `Root Access on ${targetNode?.hostname || win.nodeId} (${targetNode?.ip})`;
                break;
            case 'file_found':
                desc = `Find File at /${win.path.join('/')} on ${win.nodeId}`;
                break;
            case 'process_killed':
                desc = `Kill Process '${win.processName}' on ${win.nodeId}`;
                break;
        }
        return <span className="text-yellow-400 font-bold">{desc}</span>;
    };

    return (
        <div
            className="flex-shrink-0 p-4 bg-black/80 border-2 border-green-500/30 rounded-lg font-mono text-[10px] text-green-400 select-none backdrop-blur-md shadow-xl mt-4 h-full overflow-y-auto custom-scrollbar"
            style={{ textShadow: 'none' }}
        >
            <h3 className="text-green-500 font-bold mb-4 border-b border-green-500/30 pb-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                NETWORK DEBUGGER (F2 - DEV MODE)
            </h3>

            {/* Win Condition */}
            <div className="mb-4 p-2 bg-green-900/20 border border-green-500/20 rounded">
                <span className="text-gray-400 uppercase text-xs block mb-1">Current Objective</span>
                {renderWinCondition(gameState.winCondition)}
            </div>

            {/* Network Map */}
            <div className="mb-4 space-y-2">
                <h4 className="text-gray-500 uppercase text-xs border-b border-gray-700 pb-1">Network Topology ({gameState.nodes.length} Nodes)</h4>
                {gameState.nodes.map((node) => (
                    <div
                        key={node.id}
                        className={`p-2 rounded border ${node.id === activeNode.id ? 'border-green-400 bg-green-900/30' : 'border-gray-700 bg-gray-900/30'} flex justify-between items-center`}
                    >
                        <div>
                            <div className={`${node.id === activeNode.id ? 'text-white font-bold' : 'text-gray-400'}`}>
                                {node.hostname}
                            </div>
                            <div className="text-xs text-gray-500">{node.ip}</div>
                        </div>
                        <div className="text-right">
                            <div className={`text-[9px] px-1 rounded ${node.isDiscovered ? 'bg-blue-900/50 text-blue-300' : 'bg-red-900/50 text-red-300'}`}>
                                {node.isDiscovered ? 'KNOWN' : 'UNKNOWN'}
                            </div>
                            {node.id === activeNode.id && <div className="text-[9px] text-green-500 mt-1">ACTIVE</div>}
                        </div>
                    </div>
                ))}
            </div>

            {/* Active Node Details */}
            <div className="space-y-2 border-t border-gray-700 pt-2">
                <h4 className="text-gray-500 uppercase text-xs mb-1">Active System: <span className="text-white">{activeNode.hostname}</span></h4>

                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <span className="text-gray-500">OS:</span> <span className="text-white">{activeNode.osVersion.split('-')[0]}</span>
                    </div>
                    <div>
                        <span className="text-gray-500">User:</span> <span className="text-white">{activeNode.currentUser}</span>
                    </div>
                    <div className="col-span-2">
                        <span className="text-gray-500">Root Pwd:</span> <span className="text-yellow-500 font-bold ml-1 select-all">{activeNode.rootPassword}</span>
                    </div>
                    <div className="col-span-2">
                        <span className="text-gray-500">Theme:</span> <span className="text-white text-[9px]">{activeNode.themeColor}</span>
                    </div>
                </div>

                <div className="mt-2">
                    <span className="text-gray-500 block mb-1">Open Ports:</span>
                    <div className="grid grid-cols-1 gap-1">
                        {activeNode.ports.map(p => (
                            <div key={p.port} className="flex justify-between text-[9px] bg-gray-800/50 px-1 rounded">
                                <span className="text-blue-300">{p.port}/{p.service}</span>
                                <span className={p.isOpen ? 'text-green-500' : 'text-red-500'}>{p.isOpen ? 'OPEN' : 'CLOSED'}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Developer Cheat Sheet */}
            <div className="mt-4 border-t border-gray-700 pt-2">
                <h4 className="text-gray-500 uppercase text-xs mb-1">Developer Cheat Sheet</h4>
                <div className="text-gray-400 text-[9px] space-y-1">
                    <div className="bg-gray-900/50 p-1 rounded">
                        <span className="text-yellow-400">All Node IPs:</span>
                        <div className="pl-2">
                            {gameState.nodes.map(n => (
                                <div key={n.id}>{n.hostname}: {n.ip}</div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-gray-900/50 p-1 rounded">
                        <span className="text-yellow-400">All Root Passwords:</span>
                        <div className="pl-2">
                            {gameState.nodes.map(n => (
                                <div key={n.id}>{n.hostname}: <span className="text-green-400">{n.rootPassword}</span></div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-gray-900/50 p-1 rounded">
                        <span className="text-yellow-400">Quick Test:</span>
                        <div className="pl-2 text-cyan-300">
                            1. cat /etc/hosts (see all IPs)
                            <br />
                            2. cat /var/log/auth.log (find real clue)
                            <br />
                            3. cat ~/.bash_history (find ssh command)
                            <br />
                            4. ssh user@[next-ip] (use root pwd from above)
                            <br />
                            5. sudo (use root pwd from above)
                        </div>
                    </div>
                    <div className="bg-gray-900/50 p-1 rounded">
                        <span className="text-yellow-400">Honeypot Files:</span>
                        <div className="pl-2">
                            /var/log/fake_auth.log (200-300 fake entries)
                            <br />
                            /tmp/password_dump.txt (200-300 fake passwords)
                            <br />
                            /tmp/ip_scan_results.txt (50 fake IPs)
                            <br />
                            /tmp/leaked_tokens.txt (fake tokens)
                        </div>
                    </div>
                    <div className="bg-gray-900/50 p-1 rounded">
                        <span className="text-yellow-400">Real Clue Files:</span>
                        <div className="pl-2">
                            /var/log/auth.log (real IP buried in logs)
                            <br />
                            ~/.bash_history (ssh commands to next node)
                            <br />
                            /home/user/* (password puzzle components)
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

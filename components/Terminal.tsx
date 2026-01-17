import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { GameState, VFSNode, NetworkNode, PlayerState, Directory } from '../types';
import { checkCommandAvailability, COMMAND_REGISTRY } from '../services/CommandRegistry';
import { MARKET_CATALOG, buyItem } from '../services/MarketSystem';
import { writeSave } from '../services/PersistenceService';
import { HardwareService, PROCESS_COSTS, HARDWARE_CONFIG } from '../services/HardwareService';

export interface TerminalProps {
    gameState: GameState;
    activeNode: NetworkNode;
    playerState: PlayerState;
    isMissionActive: boolean;
    activeProcesses: { id: string; name: string; ram: number }[];
    setActiveProcesses: React.Dispatch<React.SetStateAction<{ id: string; name: string; ram: number }[]>>;
    onNodeChange: (index: number) => void;
    onWin: () => void;
    onMissionAccept: (mission: any) => void;
    onMissionAbort: () => void;
    onPlayerStateChange: (newState: PlayerState) => void;
    currentPath: string[];
    setCurrentPath: (path: string[]) => void;
    currentUser: 'user' | 'root';
    setCurrentUser: (user: 'user' | 'root') => void;
    onVFSChange?: (newVFS: VFSNode) => void;
}

const getPathDisplay = (currentPath: string[]) => {
    const path = `/${currentPath.join('/')}`;
    if (path === '/home/user') return '~';
    if (path.startsWith('/home/user/')) return `~/${currentPath.slice(2).join('/')}`;
    return path;
};

const InputLine: React.FC<{
    currentPath: string[];
    currentUser: 'user' | 'root';
    hostname: string;
    onSubmit: (command: string) => void;
    onTab: (value: string, setValue: (v: string) => void) => void;
    getCompletion: (value: string) => string | null;
    inputRef: React.RefObject<HTMLInputElement>;
    commandHistory: string[];
    isPasswordInput: boolean;
    themeColor: string;
}> = ({ currentPath, currentUser, hostname, onSubmit, onTab, getCompletion, inputRef, commandHistory, isPasswordInput, themeColor }) => {
    const [value, setValue] = useState('');
    const [suggestion, setSuggestion] = useState<string | null>(null);
    const [historyIndex, setHistoryIndex] = useState(-1);

    useEffect(() => {
        setSuggestion(getCompletion(value));
    }, [value, getCompletion]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(value);
        setValue('');
        setHistoryIndex(-1);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Tab' && !isPasswordInput) {
            e.preventDefault();
            if (suggestion) {
                setValue(suggestion + (suggestion.endsWith('/') ? '' : ' '));
            } else {
                onTab(value, setValue);
            }
        } else if (e.key === 'ArrowUp' && !isPasswordInput) {
            e.preventDefault();
            if (commandHistory.length > 0) {
                const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
                setHistoryIndex(newIndex);
                setValue(commandHistory[commandHistory.length - 1 - newIndex]);
            }
        } else if (e.key === 'ArrowDown' && !isPasswordInput) {
            e.preventDefault();
            if (historyIndex > 0) {
                const newIndex = historyIndex - 1;
                setHistoryIndex(newIndex);
                setValue(commandHistory[commandHistory.length - 1 - newIndex]);
            } else if (historyIndex === 0) {
                setHistoryIndex(-1);
                setValue('');
            }
        }
    };

    const pathString = getPathDisplay(currentPath);

    return (
        <form onSubmit={handleSubmit} className="flex w-full">
            {!isPasswordInput && (
                <label htmlFor="command-input" className="flex-shrink-0 mr-2">
                    <span className={themeColor}>{currentUser}@{hostname}</span>
                    <span className="text-gray-400">:</span>
                    <span className="text-blue-400">{pathString}</span>
                    <span className="text-gray-400">{currentUser === 'root' ? '#' : '$'}</span>
                </label>
            )}
            {isPasswordInput && (
                <label htmlFor="command-input" className="flex-shrink-0 mr-2">
                    <span className="text-white">Password: </span>
                </label>
            )}
            <div className="flex-grow relative overflow-hidden h-6">
                {!isPasswordInput && suggestion && suggestion.startsWith(value) && value.length > 0 && (
                    <div
                        className="absolute left-0 top-0 pl-0 text-gray-500 pointer-events-none whitespace-pre z-0"
                        style={{ textShadow: 'none' }}
                    >
                        {suggestion}
                    </div>
                )}
                <input
                    ref={inputRef}
                    id="command-input"
                    type={isPasswordInput ? "password" : "text"}
                    className="absolute left-0 top-0 w-full bg-transparent border-none outline-none pl-0 text-inherit z-10"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    autoComplete="off"
                    autoCapitalize="off"
                    autoCorrect="off"
                />
            </div>
            {!isPasswordInput && <div className="w-2 h-6 bg-[#33ff00] blinking-cursor shrink-0"></div>}
        </form >
    );
};


export const Terminal: React.FC<TerminalProps> = ({
    gameState,
    activeNode,
    playerState,
    isMissionActive,
    activeProcesses,
    setActiveProcesses,
    onNodeChange,
    onWin,
    onMissionAccept,
    onMissionAbort,
    onPlayerStateChange,
    currentPath,
    setCurrentPath,
    currentUser,
    setCurrentUser,
    onVFSChange
}) => {
    const [history, setHistory] = useState<React.ReactNode[]>([]);
    const [commandHistory, setCommandHistory] = useState<string[]>([]);

    // Generalized Input State
    const [inputMode, setInputMode] = useState<'command' | 'password'>('command');
    const [passwordCallback, setPasswordCallback] = useState<((pwd: string) => void) | null>(null);

    const [isLockedOut] = useState<boolean>(false);
    const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

    const [isDiskActive, setIsDiskActive] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const terminalEndRef = useRef<HTMLDivElement>(null);

    const { vfs, processes, envVars, hostname, themeColor } = activeNode;
    const { scenario } = gameState;

    // Helper to generate welcome message
    const getWelcomeLines = useCallback(() => {
        const welcomeLines = scenario.welcomeMessage.split('\n').map((line: string, i: number) => <div key={`welcome-${i}`}>{line}</div>);
        const motd = !isMissionActive ? "Homebase - Operating System v2.0" : `Connected to ${activeNode.hostname} (${activeNode.ip})`;

        if (!isMissionActive) {
            return [...welcomeLines, <div key="motd" className="text-gray-500 mb-2 mt-2 border-b border-gray-700">{motd}</div>];
        } else {
            return [<div key="motd" className="text-gray-500 mb-2 mt-2 border-b border-gray-700">{motd}</div>];
        }
    }, [activeNode.id, activeNode.hostname, activeNode.ip, scenario.welcomeMessage]);

    // Initial Welcome
    useEffect(() => {
        if (history.length === 0) {
            setHistory(getWelcomeLines());
        }
    }, [getWelcomeLines]);

    useEffect(() => {
        terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history, isLockedOut, inputMode]);

    const resolvePath = useCallback((pathStr: string): string[] | null => {
        if (!pathStr) return currentPath;
        let effectivePathStr = pathStr;
        if (pathStr.startsWith('~')) {
            effectivePathStr = pathStr.replace('~', '/home/user');
        }
        const parts = effectivePathStr.split('/').filter(p => p);
        let newPath: string[] = effectivePathStr.startsWith('/') ? [] : [...currentPath];

        for (const part of parts) {
            if (part === '.') continue;
            else if (part === '..') {
                if (newPath.length > 0) newPath.pop();
            } else {
                newPath.push(part);
            }
        }
        // Validate
        let node: VFSNode = vfs;
        const validPath: string[] = [];
        for (const part of newPath) {
            if (node.type !== 'directory') return null;
            if (node.children[part]) {
                node = node.children[part];
                validPath.push(part);
            } else {
                return null; // Strict for now, or add case-insensitivity back if needed
            }
        }
        return validPath;
    }, [currentPath, vfs]);

    const getNodeByPath = useCallback((path: string[]): VFSNode | null => {
        let node: VFSNode = vfs;
        for (const part of path) {
            if (node.type === 'directory' && node.children[part]) {
                node = node.children[part];
            } else {
                return null;
            }
        }
        return node;
    }, [vfs]);

    const promptPassword = (callback: (pwd: string) => void) => {
        setInputMode('password');
        setPasswordCallback(() => callback);
    };

    const processCommand = async (command: string) => {
        if (isLockedOut || isTransitioning) return;

        // Handle Password Input
        if (inputMode === 'password') {
            if (passwordCallback) {
                setInputMode('command');
                setPasswordCallback(null);
                passwordCallback(command);
            }
            return;
        }

        const trimmedCommand = command.trim();
        if (trimmedCommand) {
            setCommandHistory(prev => [...prev, trimmedCommand]);
            // Echo the command
            const pathString = getPathDisplay(currentPath);
            setHistory(prev => [...prev, (
                <div key={Date.now()} className="flex">
                    <span className={themeColor}>{currentUser}@{hostname}</span>
                    <span className="text-gray-400">:</span>
                    <span className="text-blue-400">{pathString}</span>
                    <span className="text-gray-400">{currentUser === 'root' ? '#' : '$'}</span>
                    <span className="pl-2">{trimmedCommand}</span>
                </div>
            )]);
        } else {
            return;
        }

        const [cmd, ...args] = trimmedCommand.split(/\s+/).filter(Boolean);
        let output: React.ReactNode | null = null;

        const availability = checkCommandAvailability(cmd, {
            playerState,
            isMissionActive,
            currentPath,
            currentUser,
            hostname
        });

        if (!availability.available) {
            setHistory(prev => [...prev, availability.error]);
            return;
        }

        switch (cmd) {
            case 'help':
                output = (
                    <div className="whitespace-pre-wrap text-yellow-300">
                        <div className="font-bold mb-1">AVAILABLE COMMANDS:</div>
                        <div className="grid grid-cols-[120px_200px_1fr] gap-x-4 opacity-90">
                            <div className="border-b border-yellow-300/30 pb-1">COMMAND</div>
                            <div className="border-b border-yellow-300/30 pb-1">USAGE</div>
                            <div className="border-b border-yellow-300/30 pb-1">DESCRIPTION</div>
                            {Object.values(COMMAND_REGISTRY).filter(def => {
                                const availability = checkCommandAvailability(def.id, {
                                    playerState,
                                    isMissionActive,
                                    currentPath,
                                    currentUser,
                                    hostname
                                });
                                return availability.available;
                            }).map(def => (
                                <React.Fragment key={def.id}>
                                    <div>{def.id}</div>
                                    <div className="text-gray-400">{def.usage}</div>
                                    <div>{def.description}</div>
                                </React.Fragment>
                            ))}
                        </div>
                        <div className="mt-4 text-xs text-yellow-300/70 italic">
                            TIPS: Clues are fragmented. Use 'cat' on logs. 'nmap' to discover services. 'ssh' to pivot.
                        </div>
                    </div>
                );
                break;
            case 'jobs':
                if (args[0] === 'accept') {
                    const index = parseInt(args[1]) - 1;
                    const mission = playerState.availableMissions[index];
                    if (mission) {
                        output = `Mission '${mission.title}' accepted. Initiating connection...`;
                        setTimeout(() => onMissionAccept(mission), 1000);
                    } else {
                        output = <div className="text-red-500">Error: Invalid mission ID. Use 'jobs' to see available contracts.</div>;
                    }
                } else {
                    output = (
                        <div className="text-yellow-400">
                            <div className="font-bold border-b border-yellow-400/30 mb-2 pb-1">AVAILABLE CONTRACTS</div>
                            <div className="grid grid-cols-[40px_1fr_60px_80px] gap-x-4">
                                <div className="opacity-70">#</div>
                                <div className="opacity-70">TITLE</div>
                                <div className="opacity-70">DIFF</div>
                                <div className="opacity-70">REWARD</div>
                                {playerState.availableMissions.map((m, idx) => (
                                    <React.Fragment key={m.id}>
                                        <div>[{idx + 1}]</div>
                                        <div className="font-bold">{m.title}</div>
                                        <div>{'★'.repeat(m.difficulty)}</div>
                                        <div>{m.reward}c</div>
                                    </React.Fragment>
                                ))}
                            </div>
                            <div className="mt-4 text-xs text-gray-500 italic border-t border-yellow-400/20 pt-2">
                                Usage: jobs accept [number]
                            </div>
                        </div>
                    );
                }
                break;
            case 'overclock':
                if (args[0] === 'on') {
                    onPlayerStateChange({ ...playerState, isOverclocked: true });
                    output = <div className="text-yellow-400">[SYSTEM] Overclocking ENABLED. Heat generation increased.</div>;
                } else if (args[0] === 'off') {
                    onPlayerStateChange({ ...playerState, isOverclocked: false });
                    output = <div className="text-blue-400">[SYSTEM] Overclocking DISABLED.</div>;
                } else {
                    output = `Usage: overclock [on|off]. Currently: ${playerState.isOverclocked ? 'ON' : 'OFF'}`;
                }
                break;
            case 'voltage':
                const v = parseFloat(args[0]);
                if (isNaN(v) || v < 1.0 || v > 1.5) {
                    output = "Usage: voltage [1.0 - 1.5]. Warning: Higher voltage increases speed but creates extreme heat.";
                } else {
                    onPlayerStateChange({ ...playerState, voltageLevel: v });
                    output = <div className="text-yellow-500">[SYSTEM] Voltage set to {v.toFixed(2)}V.</div>;
                }
                break;
            case 'memstat':
                const totalUsed = activeProcesses.reduce((acc, p) => acc + p.ram, 0);
                const capacity = playerState.hardware.ram.capacity;
                const isThrashing = totalUsed > capacity;
                output = (
                    <div className="text-cyan-400">
                        <div className="font-bold border-b border-cyan-400/30 mb-2 pb-1">MEMORY STATUS</div>
                        <div className="grid grid-cols-[100px_1fr] gap-x-4">
                            <div>CAPACITY:</div><div>{capacity} GB</div>
                            <div>USED:</div><div>{totalUsed.toFixed(1)} GB</div>
                            <div>STATUS:</div><div className={isThrashing ? 'text-red-500 blink' : 'text-green-500'}>{isThrashing ? 'THRASHING (SWAP ACTIVE)' : 'OPTIMAL'}</div>
                        </div>
                        {isThrashing && <div className="text-red-500 text-xs mt-2 italic animate-pulse">WARNING: Memory exceeded. System is using disk swap. All operations slowed by 500%.</div>}
                        <div className="mt-4 text-xs opacity-70">ACTIVE ALLOCATIONS:</div>
                        {activeProcesses.map((p, i) => (
                            <div key={i} className="text-xs ml-4">- {p.name}: {p.ram} GB (PID: {p.id})</div>
                        ))}
                    </div>
                );
                break;
            case 'market':
                if (args[0] === 'buy') {
                    const itemId = args[1];
                    if (!itemId) {
                        output = "Usage: market buy <item_id>";
                    } else {
                        const result = buyItem(itemId, playerState);
                        if (result.success && result.updatedPlayerState) {
                            output = (
                                <div className="text-green-400">
                                    [SUCCESS] Purchased {itemId}. Credits remaining: {result.updatedPlayerState.credits}c
                                </div>
                            );
                            onPlayerStateChange(result.updatedPlayerState);
                            // Auto-save logic
                            const slotId = localStorage.getItem('active-save-slot') || 'slot_1';
                            writeSave(slotId, result.updatedPlayerState);
                        } else {
                            output = <div className="text-red-500">[ERROR] {result.error}</div>;
                        }
                    }
                } else if (args[0] === 'sell') {
                    const fileName = args[1];
                    if (!fileName) {
                        output = "Usage: market sell <filename>";
                    } else {
                        const lootFile = playerState.inventory.find(item => item.name === fileName);
                        if (!lootFile || lootFile.type !== 'file') {
                            output = <div className="text-red-500">Error: File '{fileName}' not found in loot inventory.</div>;
                        } else {
                            // Calculate price: size * factor + random variance
                            const price = Math.floor((lootFile.size || 0) * 0.5 + (Math.random() * 50));
                            const finalPrice = Math.max(10, price);

                            // Animation: Transaction
                            setIsDiskActive(true);
                            const oldCredits = playerState.credits;
                            const newCredits = oldCredits + finalPrice;

                            setHistory(prev => [...prev, <div key={`sell-${Date.now()}`} className="text-yellow-400">Processing transaction... selling {fileName} for {finalPrice}c</div>]);

                            let currentDisplayCredits = oldCredits;
                            const steps = 10;
                            const increment = Math.ceil(finalPrice / steps);

                            const sellInterval = setInterval(() => {
                                currentDisplayCredits += increment;
                                if (currentDisplayCredits >= newCredits) {
                                    currentDisplayCredits = newCredits;
                                    clearInterval(sellInterval);
                                    setIsDiskActive(false);

                                    const updatedInventory = playerState.inventory.filter(item => item.name !== fileName);
                                    const newState = {
                                        ...playerState,
                                        credits: newCredits,
                                        inventory: updatedInventory
                                    };
                                    onPlayerStateChange(newState);

                                    // Remove from VFS if we are at homebase
                                    if (activeNode.id === 'localhost' || activeNode.id === 'local') {
                                        const userHome = ((vfs.children.home as Directory).children.user as Directory);
                                        const lootDir = userHome.children.loot as Directory;
                                        if (lootDir.children[fileName]) {
                                            delete lootDir.children[fileName];
                                            if (onVFSChange) onVFSChange(vfs);
                                        }
                                    }

                                    const slotId = localStorage.getItem('active-save-slot') || 'slot_1';
                                    writeSave(slotId, newState);

                                    setHistory(prev => [...prev, <div key={`sell-done-${Date.now()}`} className="text-green-400">Transaction Complete. +{finalPrice}c added to balance.</div>]);
                                }
                            }, 50);
                            return; // Async
                        }
                    }
                } else {
                    const software = MARKET_CATALOG.filter(i => i.type === 'software');
                    const hardware = MARKET_CATALOG.filter(i => i.type === 'hardware');
                    output = (
                        <div className="text-yellow-400">
                            <div className="font-bold border-b border-yellow-400/30 mb-2 pb-1">MARKETPLACE - HARDWARE & SOFTWARE</div>

                            <div className="mb-1 text-xs opacity-70">SOFTWARE</div>
                            <div className="grid grid-cols-[100px_80px_1fr] gap-x-4 mb-4">
                                {software.map(item => (
                                    <React.Fragment key={item.id}>
                                        <div className={playerState.installedSoftware.includes(item.id) ? 'line-through opacity-50' : 'font-bold'}>{item.id}</div>
                                        <div>{item.cost}c</div>
                                        <div className="text-gray-400 text-sm">{item.description}</div>
                                    </React.Fragment>
                                ))}
                            </div>

                            <div className="mb-1 text-xs opacity-70">HARDWARE</div>
                            <div className="grid grid-cols-[100px_80px_1fr] gap-x-4 mb-4">
                                {hardware.map(item => {
                                    const currentLevel = playerState.hardware[item.hardwareKey!].level;
                                    const isOwned = currentLevel >= (item.stats?.level || 0);
                                    return (
                                        <React.Fragment key={item.id}>
                                            <div className={isOwned ? 'line-through opacity-50' : 'font-bold'}>{item.id}</div>
                                            <div>{item.cost}c</div>
                                            <div className="text-gray-400 text-sm">{item.description}</div>
                                        </React.Fragment>
                                    );
                                })}
                            </div>

                            <div className="text-xs text-gray-500 italic border-t border-yellow-400/20 pt-2">
                                Usage: market buy [item_id] | market sell [filename]
                            </div>
                        </div>
                    );
                }
                break;
            case 'abort':
            case 'disconnect':
                output = "Aborting mission... disconnecting...";
                setTimeout(() => onMissionAbort(), 1000);
                break;
            case 'clear':
                setHistory(getWelcomeLines());
                return;
            case 'rm':
                const rmFileName = args[0];
                if (!rmFileName) {
                    output = "usage: rm [file]";
                    break;
                }
                const rmPath = resolvePath(rmFileName);
                if (!rmPath) {
                    output = `rm: cannot remove '${rmFileName}': No such file or directory`;
                    break;
                }
                const nodeToRemove = getNodeByPath(rmPath);
                if (!nodeToRemove) {
                    output = `rm: cannot remove '${rmFileName}': No such file or directory`;
                    break;
                }
                if (nodeToRemove.type === 'directory') {
                    output = `rm: cannot remove '${rmFileName}': Is a directory`;
                    break;
                }
                if (nodeToRemove.permissions === 'root' && currentUser !== 'root') {
                    output = `rm: cannot remove '${rmFileName}': Permission denied`;
                    break;
                }

                // Animation: Shredding
                const shreddingLines = [
                    `Shredding ${rmFileName}...`,
                    `[***       ]`,
                    `[******    ]`,
                    `[********* ]`,
                    `DELETED.`
                ];

                setIsDiskActive(true);
                let shredIdx = 0;
                const shredInterval = setInterval(() => {
                    if (shredIdx < shreddingLines.length) {
                        setHistory(prev => [...prev, <div key={`shred-${Date.now()}-${shredIdx}`} className="text-red-500 opacity-70">{shreddingLines[shredIdx]}</div>]);
                        shredIdx++;
                    } else {
                        clearInterval(shredInterval);
                        setIsDiskActive(false);

                        // Perform actual removal
                        const parentPath = rmPath.slice(0, -1);
                        const fileName = rmPath[rmPath.length - 1];
                        const parentNode = getNodeByPath(parentPath) as Directory;

                        if (parentNode && parentNode.children[fileName]) {
                            delete parentNode.children[fileName];

                            // If on localhost and in loot, remove from inventory
                            if (activeNode.id === 'localhost' || activeNode.id === 'local') {
                                const isLoot = rmPath[0] === 'home' && rmPath[1] === 'user' && rmPath[2] === 'loot';
                                if (isLoot) {
                                    const updatedInventory = playerState.inventory.filter(item => item.name !== fileName);
                                    onPlayerStateChange({ ...playerState, inventory: updatedInventory });
                                }
                            }

                            if (onVFSChange) {
                                onVFSChange(vfs);
                            }
                        }
                    }
                }, 150);
                return; // Async
            case 'ls':
                const lsNode = getNodeByPath(currentPath);
                if (lsNode?.type === 'directory') {
                    if (lsNode.permissions === 'root' && currentUser !== 'root') {
                        output = `ls: cannot open directory '.': Permission denied`;
                    } else {
                        const showHidden = args.includes('-a');
                        const isLongFormat = args.includes('-l');
                        const children = Object.keys(lsNode.children).filter(name => showHidden || !name.startsWith('.'));

                        if (isLongFormat) {
                            output = (
                                <div className="flex flex-col gap-1 w-full text-sm font-mono opacity-90">
                                    <div className="grid grid-cols-[100px_80px_100px_1fr] gap-4 border-b border-gray-700 pb-1 mb-1 text-gray-500">
                                        <span>PERMS</span>
                                        <span>SIZE</span>
                                        <span>OWNER</span>
                                        <span>NAME</span>
                                    </div>
                                    {children.map(name => {
                                        const child = (lsNode as any).children[name];
                                        const isDir = child.type === 'directory';
                                        const size = isDir ? '-' : (child.size >= 1024 ? `${(child.size / 1024).toFixed(2)}GB` : `${(child.size || 0).toFixed(1)}MB`);
                                        return (
                                            <div key={name} className="grid grid-cols-[100px_80px_100px_1fr] gap-4">
                                                <span className="text-yellow-600 font-mono">{child.permissions === 'root' ? 'drwx------' : (isDir ? 'drwxr-xr-x' : '-rw-r--r--')}</span>
                                                <span className="text-cyan-600">{size}</span>
                                                <span className="text-gray-400">{child.permissions || 'user'}</span>
                                                <span className={`${isDir ? 'text-blue-400 font-bold' : 'text-white'}`}>
                                                    {name}{isDir ? '/' : ''}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        } else {
                            output = (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full text-sm">
                                    {children.map(name => {
                                        const child = (lsNode as any).children[name];
                                        const isDir = child.type === 'directory';
                                        return (
                                            <div key={name} style={{ textShadow: 'none' }} className={`${isDir ? 'text-blue-400 font-bold' : 'text-white'} ${child.permissions === 'root' ? 'opacity-70' : ''}`}>
                                                {name}{isDir ? '/' : ''}
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        }
                    }
                }
                break;
            case 'cd':
                const targetPath = resolvePath(args[0] || '/home/user');
                if (targetPath) {
                    const tNode = getNodeByPath(targetPath);
                    if (tNode?.type === 'directory') {
                        if (tNode.permissions === 'root' && currentUser !== 'root') {
                            output = `-bash: cd: ${args[0]}: Permission denied`;
                        } else {
                            setCurrentPath(targetPath);
                        }
                    } else {
                        output = `-bash: cd: ${args[0]}: Not a directory`;
                    }
                } else {
                    output = `-bash: cd: ${args[0]}: No such file or directory`;
                }
                break;
            case 'cat':
                const catPath = resolvePath(args[0]);
                if (catPath) {
                    const fNode = getNodeByPath(catPath);
                    if (fNode?.type === 'file') {
                        if (fNode.permissions === 'root' && currentUser !== 'root') {
                            output = `cat: ${args[0]}: Permission denied`;
                        } else {
                            output = <div className="whitespace-pre-wrap">{fNode.content}</div>;
                            // Check Win Condition: File Found
                            if (gameState.winCondition.type === 'file_found' &&
                                activeNode.id === gameState.winCondition.nodeId &&
                                fNode.name === gameState.winCondition.path[gameState.winCondition.path.length - 1]) {
                                onWin();
                            }
                        }
                    } else {
                        output = `cat: ${args[0]}: Is a directory`;
                    }
                } else {
                    output = `cat: ${args[0]}: No such file or directory`;
                }
                break;
            case 'download':
            case 'scp':
                const downloadFileName = args[0];
                if (!downloadFileName) {
                    output = "usage: download [file]";
                    break;
                }
                const downloadPath = resolvePath(downloadFileName);
                if (downloadPath) {
                    const fNode = getNodeByPath(downloadPath);
                    if (fNode?.type === 'file') {
                        if (fNode.permissions === 'root' && currentUser !== 'root') {
                            output = `download: ${downloadFileName}: Permission denied`;
                        } else {
                            const fileSizeMB = fNode.size || 0.1;
                            const fileSizeGB = fileSizeMB / 1024;

                            // 1. Check Storage Capacity (Phase 5)
                            const currentUsageMB = HardwareService.calculateStorageUsage(playerState);
                            const capacityMB = playerState.hardware.storage.capacity * 1024;
                            if (currentUsageMB + fileSizeMB > capacityMB) {
                                output = (
                                    <div className="text-red-500">
                                        Error: Disk Full. Available: {(capacityMB - currentUsageMB).toFixed(1)}MB, Required: {fileSizeMB.toFixed(1)}MB.
                                    </div>
                                );
                                break;
                            }

                            // 2. Check RAM Capacity (Phase 4)

                            if (fileSizeGB > playerState.hardware.ram.capacity) {
                                output = <div className="text-red-500">Error: File '{fNode.name}' ({fileSizeMB.toFixed(1)}MB) is too large for your system's RAM ({playerState.hardware.ram.capacity}GB). Upgrade RAM to handle this buffer.</div>;
                                break;
                            }

                            const pid = Math.floor(Math.random() * 9000) + 1000;
                            // Download cost is base + multiplier of file size in RAM
                            const ramCost = HARDWARE_CONFIG.DOWNLOAD_BASE_RAM + (fileSizeGB * HARDWARE_CONFIG.DOWNLOAD_SIZE_FACTOR);

                            setActiveProcesses(prev => [...prev, { id: pid.toString(), name: `download:${fNode.name}`, ram: ramCost }]);

                            const currentRamUsage = activeProcesses.reduce((acc, p) => acc + p.ram, 0) + ramCost;

                            // 3. Calculate Delay (Phase 5: Network + CPU)
                            const networkSpeedMBps = playerState.hardware.network.bandwidth || 1;
                            const networkDelay = (fileSizeMB / networkSpeedMBps) * 1000;
                            const baseProcessingDelay = 500;
                            const totalBaseDelay = networkDelay + baseProcessingDelay;

                            const delay = HardwareService.calculateProcessDelay(totalBaseDelay, playerState, currentRamUsage);

                            setIsDiskActive(true);
                            // Visual Feedback: Progress Bar
                            let progress = 0;
                            const progressId = Date.now();
                            setHistory(prev => [...prev, <div key={`prog-${progressId}`} className="text-cyan-400">Downloading {fNode.name}... [          ] 0%</div>]);

                            const updateProgress = setInterval(() => {
                                progress += 10;
                                if (progress <= 100) {
                                    const dots = '='.repeat(progress / 10);
                                    const spaces = ' '.repeat(10 - (progress / 10));
                                    setHistory(prev => {
                                        const newHist = [...prev];
                                        newHist[newHist.length - 1] = <div key={`prog-${progressId}`} className="text-cyan-400">Downloading {fNode.name}... [{dots}{'>'}{spaces}] {progress}%</div>;
                                        return newHist;
                                    });
                                } else {
                                    clearInterval(updateProgress);
                                }
                            }, delay / 11);

                            setTimeout(() => {
                                setIsDiskActive(false);
                                setHistory(prev => [...prev, (
                                    <div className="text-green-400">
                                        [SUCCESS] Downloaded '{fNode.name}' ({fileSizeMB.toFixed(1)}MB) in {(delay / 1000).toFixed(2)}s.
                                    </div>
                                )]);

                                // Add to inventory
                                const updatedPlayerState = {
                                    ...playerState,
                                    inventory: [...playerState.inventory, fNode]
                                };
                                onPlayerStateChange(updatedPlayerState);

                                // Auto-save
                                const slotId = localStorage.getItem('active-save-slot') || 'slot_1';
                                writeSave(slotId, updatedPlayerState);

                                // End process
                                setActiveProcesses(prev => prev.filter(p => p.id !== pid.toString()));

                                // Check Win Condition: File Found (theft)
                                if (gameState.winCondition.type === 'file_found' &&
                                    activeNode.id === gameState.winCondition.nodeId &&
                                    fNode.name === gameState.winCondition.path[gameState.winCondition.path.length - 1]) {
                                    onWin();
                                }
                            }, delay);
                            return; // Async handled above
                        }
                    } else {
                        output = `download: ${downloadFileName}: Is a directory`;
                    }
                } else {
                    output = `download: ${downloadFileName}: No such file or directory`;
                }
                break;
            case 'ping':
                if (!args[0]) { output = "usage: ping [ip]"; break; }
                const targetIp = args[0];
                const targetNode = gameState.nodes.find(n => n.ip === targetIp);
                if (targetNode) {
                    output = (
                        <div>
                            PING {targetIp} ({targetIp}) 56(84) bytes of data.<br />
                            64 bytes from {targetIp}: icmp_seq=1 ttl=64 time=0.045 ms<br />
                            64 bytes from {targetIp}: icmp_seq=2 ttl=64 time=0.032 ms<br />
                            64 bytes from {targetIp}: icmp_seq=3 ttl=64 time=0.038 ms<br />
                            --- {targetIp} ping statistics ---<br />
                            3 packets transmitted, 3 received, 0% packet loss, time 2048ms
                        </div>
                    );
                } else {
                    output = `ping: use_of_closed_network_range: Destination Host Unreachable`;
                }
                break;
            case 'ip':
                if (args[0] === 'a' || args[0] === 'addr') {
                    output = (
                        <div className="whitespace-pre-wrap">
                            {`1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000
    link/ether 52:54:00:12:34:56 brd ff:ff:ff:ff:ff:ff
    inet ${activeNode.ip}/24 brd 192.168.1.255 scope global dynamic eth0
       valid_lft 86324sec preferred_lft 86324sec`}
                        </div>
                    );
                } else {
                    output = "Usage: ip a";
                }
                break;
            case 'nmap':
                if (!args[0]) { output = "usage: nmap [ip]"; break; }
                const nmapIp = args[0];
                const nmapTarget = gameState.nodes.find(n => n.ip === nmapIp);

                if (nmapTarget) {
                    const pid = Math.floor(Math.random() * 9000) + 1000;
                    const cost = PROCESS_COSTS['nmap'];

                    // Start process
                    setActiveProcesses(prev => [...prev, { id: pid.toString(), name: 'nmap', ram: cost.ramUsage }]);

                    setHistory(prev => [...prev, <div key={`scan-${pid}`}>Starting Nmap 7.92 (PID: {pid}) at {new Date().toISOString()}...</div>]);

                    const currentRamUsage = activeProcesses.reduce((acc, p) => acc + p.ram, 0) + cost.ramUsage;
                    const delay = HardwareService.calculateProcessDelay(1500, playerState, currentRamUsage);

                    setTimeout(() => {
                        const portLines = nmapTarget.ports.map(p =>
                            `${p.port}/tcp ${p.isOpen ? 'open' : 'closed'}  ${p.service.padEnd(12)} ${args.includes('-sV') ? p.version : ''}`
                        );
                        const result = (
                            <div className="whitespace-pre-wrap text-blue-300">
                                {`Nmap scan report for ${nmapTarget.hostname} (${nmapIp})`}
                                <br />Host is up (0.0003s latency).
                                <br />PORT     STATE SERVICE      VERSION
                                <br />{portLines.join('\n')}
                                <br /><br />Nmap done: 1 IP address (1 host up) scanned in {(delay / 1000).toFixed(2)} seconds
                            </div>
                        );
                        setHistory(prev => [...prev, result]);
                        // End process
                        setActiveProcesses(prev => prev.filter(p => p.id !== pid.toString()));
                    }, delay);
                    return; // Async handled above
                } else {
                    output = `Note: Host seems down. If it is really up, but blocking our ping probes, try -Pn`;
                }
                break;
            case 'grep':
                if (args.length < 2) {
                    output = "usage: grep [term] [file]";
                    break;
                }
                const searchTerm = args[0];
                const grepFilePath = resolvePath(args[1]);

                if (!grepFilePath) {
                    output = `grep: ${args[1]}: No such file or directory`;
                    break;
                }

                const fileNode = getNodeByPath(grepFilePath);

                if (!fileNode) {
                    output = `grep: ${args[1]}: No such file or directory`;
                    break;
                }

                if (fileNode.type === 'directory') {
                    output = `grep: ${args[1]}: Is a directory`;
                    break;
                }

                if (fileNode.permissions === 'root' && currentUser !== 'root') {
                    output = `grep: ${args[1]}: Permission denied`;
                    break;
                }

                const lines = fileNode.content.split('\n');
                const matchingLines = lines.filter(line => line.includes(searchTerm));

                if (matchingLines.length > 0) {
                    output = <div className="whitespace-pre-wrap">{matchingLines.join('\n')}</div>;
                } else {
                    output = null; // No output if no matches
                }
                break;
            case 'ssh':
                if (!args[0]) { output = "usage: ssh [user]@[ip]"; break; }
                const [userStr, ipStr] = args[0].split('@');
                if (!userStr || !ipStr) { output = "usage: ssh [user]@[ip]"; break; }

                const sshTarget = gameState.nodes.find(n => n.ip === ipStr);
                const sshTargetIndex = gameState.nodes.findIndex(n => n.ip === ipStr);

                if (!sshTarget) {
                    output = `ssh: connect to host ${ipStr} port 22: Connection refused`;
                    break;
                }

                if (!sshTarget.ports.some(p => p.port === 22 && p.isOpen)) {
                    output = `ssh: connect to host ${ipStr} port 22: Connection refused`;
                    break;
                }

                setHistory(prev => [...prev, <div>The authenticity of host '{ipStr}' can't be established.<br />ED25519 key fingerprint is SHA256:randomHashesHere...<br />Connecting...</div>]);

                const attemptLogin = (_isRoot: boolean) => {
                    // Start glitch animation
                    setIsTransitioning(true);
                    setTimeout(() => {
                        setIsTransitioning(false);
                        onNodeChange(sshTargetIndex);
                        setHistory([]);
                    }, 1000);
                };

                if (userStr === 'root') {
                    // Prompt for root password
                    promptPassword((pwd) => {
                        if (pwd === sshTarget.rootPassword) {
                            if (gameState.winCondition.type === 'root_access' && gameState.winCondition.nodeId === sshTarget.id) {
                                onWin();
                            } else {
                                attemptLogin(true);
                            }
                        } else {
                            setHistory(prev => [...prev, <div className="text-red-500">Permission denied, please try again.</div>]);
                        }
                    });
                } else {
                    // For regular user login, use same password as root (simplified)
                    // In a real system, each user would have their own password
                    promptPassword((pwd) => {
                        if (pwd === sshTarget.rootPassword) {
                            attemptLogin(false);
                        } else {
                            setHistory(prev => [...prev, <div className="text-red-500">Permission denied, please try again.</div>]);
                        }
                    });
                }
                return;
            case 'exit':
                if (activeNode.id !== 'local') {
                    // Return to local
                    setIsTransitioning(true);
                    setTimeout(() => {
                        setIsTransitioning(false);
                        onNodeChange(0); // 0 is always local
                        setHistory([]);
                    }, 800);
                } else {
                    output = "logout";
                }
                break;
            case 'sudo':
                promptPassword((pwd) => {
                    if (pwd === activeNode.rootPassword) {
                        setCurrentUser('root');
                        if (gameState.winCondition.type === 'root_access' && gameState.winCondition.nodeId === activeNode.id) {
                            onWin();
                        } else {
                            setHistory(prev => [...prev, <div className="text-yellow-400">sudo: root access granted.</div>]);
                        }
                    } else {
                        setHistory(prev => [...prev, <div className="text-red-500">Sorry, try again.</div>]);
                    }
                });
                return;
            case 'ps':
                output = (
                    <div className="whitespace-pre-wrap">
                        <div className="text-gray-400 border-b border-gray-600 mb-1">USER       PID %CPU %MEM    START   COMMAND</div>
                        {(processes || []).map(p => (
                            <div key={p.pid} className="grid grid-cols-[80px_60px_60px_60px_80px_1fr]">
                                <span>{p.user}</span>
                                <span>{p.pid}</span>
                                <span>{p.cpu.toFixed(1)}</span>
                                <span>{p.mem.toFixed(1)}</span>
                                <span>{p.start}</span>
                                <span>{p.command}</span>
                            </div>
                        ))}
                    </div>
                );
                break;
            case 'env':
                output = (
                    <div className="whitespace-pre-wrap">
                        {Object.entries(envVars || {}).map(([k, v]) => (
                            <div key={k}>{k}={v}</div>
                        ))}
                    </div>
                );
                break;
            case 'whoami':
                output = currentUser;
                break;
            case 'pwd':
                output = `/${currentPath.join('/')}`;
                break;
            case 'uptime':
                const uptimeMs = Date.now() - gameState.bootTime;
                const uptimeSec = Math.floor(uptimeMs / 1000);
                const days = Math.floor(uptimeSec / 86400);
                const hours = Math.floor((uptimeSec % 86400) / 3600);
                const minutes = Math.floor((uptimeSec % 3600) / 60);
                const bootDate = new Date(gameState.bootTime);
                output = (
                    <div>
                        {bootDate.toLocaleTimeString()} up {days > 0 ? `${days} day${days > 1 ? 's' : ''}, ` : ''}{hours}:{minutes.toString().padStart(2, '0')}, 1 user, load average: 0.15, 0.10, 0.05
                    </div>
                );
                break;
            case 'date':
                const now = new Date();
                output = now.toString();
                break;
            default:
                output = `command not found: ${cmd}`;
        }

        if (output) {
            setHistory(prev => [...prev, output]);
        }
    };

    // Auto-completion logic
    const getCommonPrefix = (strings: string[]): string => {
        if (strings.length === 0) return '';
        let prefix = strings[0];
        for (let i = 1; i < strings.length; i++) {
            while (strings[i].indexOf(prefix) !== 0) {
                prefix = prefix.substring(0, prefix.length - 1);
                if (prefix === '') return '';
            }
        }
        return prefix;
    };

    const getCompletion = useCallback((currentValue: string): string | null => {
        if (!currentValue) return null;
        const parts = currentValue.trimStart().split(/\s+/);
        const lastPart = parts[parts.length - 1];
        const isCommand = parts.length === 1 && !currentValue.endsWith(' ');

        if (isCommand) {
            const cmds = Object.keys(COMMAND_REGISTRY);
            const matches = cmds.filter(c => c.startsWith(currentValue));
            if (matches.length > 0) return getCommonPrefix(matches) + (matches.length === 1 ? ' ' : '');
        } else {
            const node = getNodeByPath(currentPath);
            if (node?.type === 'directory') {
                const matches = Object.keys(node.children)
                    .filter(name => name.startsWith(lastPart))
                    .map(name => {
                        const child = node.children[name];
                        return child.type === 'directory' ? `${name}/` : name;
                    });
                if (matches.length > 0) {
                    const common = getCommonPrefix(matches);
                    const rest = currentValue.substring(0, currentValue.lastIndexOf(lastPart));
                    return rest + common;
                }
            }
        }
        return null;
    }, [currentPath, getNodeByPath]);


    if (playerState.systemHeat >= 100) {
        return (
            <div className="w-full h-full bg-blue-900 text-white p-20 font-mono flex flex-col items-start justify-center overflow-hidden">
                <div className="bg-white text-blue-900 px-4 py-1 font-bold mb-8">FATAL SYSTEM ERROR</div>
                <div className="text-2xl mb-4">A critical thermal exception has occurred at address 0x00000FF.</div>
                <div className="mb-8 opacity-80">
                    *  If this is the first time you've seen this Stop error screen,
                    check your cooling levels and reduce voltage.
                    <br /><br />
                    *  Check to make sure any new hardware is properly installed.
                    If this is a new installation, ask your hardware vendor
                    for any driver updates you might need.
                </div>
                <div className="mb-4">Technical information:</div>
                <div className="mb-12">*** STOP: 0x0000001E (0xC0000005, 0x804B518F, 0x00000000, 0x00000000)</div>
                <div className="animate-pulse">REBOOTING IN 5 SECONDS...</div>
                {/* Auto-reboot logic */}
                {(() => {
                    setTimeout(() => onMissionAbort(), 5000);
                    return null;
                })()}
            </div>
        );
    }

    return (
        <div
            className={`w-full h-full flex flex-col p-10 text-lg font-vt323 crt-screen relative active-node-theme ${themeColor} ${isTransitioning ? 'glitch-text blur-sm brightness-150' : ''}`}
            onClick={() => {
                if (window.getSelection()?.toString() === '') {
                    inputRef.current?.focus();
                }
            }}
        >
            {/* System Status Bar */}
            <div className="flex justify-between items-center border-b border-green-900/30 pb-2 mb-4 font-mono text-xs tracking-widest uppercase opacity-70">
                <div className="flex gap-6">
                    <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        SYS: ONLINE
                    </span>
                    <span>MODE: {isMissionActive ? 'MISSION_OPS' : 'HOMEBASE'}</span>
                    <span className={`flex items-center gap-2 ${playerState.systemHeat > 80 ? 'text-red-500 animate-pulse' : 'text-gray-400'}`}>
                        TEMP: {playerState.systemHeat.toFixed(1)}°C
                    </span>
                    <span className={`flex items-center gap-2 ${isDiskActive ? 'text-amber-500 animate-pulse' : 'text-gray-600'}`}>
                        <span className={`w-2 h-2 rounded-full ${isDiskActive ? 'bg-amber-500 shadow-[0_0_5px_#f59e0b]' : 'bg-gray-800'}`}></span>
                        DISK
                    </span>
                    <span className="text-gray-400">
                        RAM: {activeProcesses.reduce((acc, p) => acc + p.ram, 0).toFixed(1)}/{playerState.hardware.ram.capacity}GB
                    </span>
                    <span className="text-gray-400">
                        DISK: {(HardwareService.calculateStorageUsage(playerState) / 1024).toFixed(2)}/{playerState.hardware.storage.capacity}GB
                    </span>
                </div>
                <div className="text-yellow-500 font-bold bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20 shadow-[0_0_10px_rgba(234,179,8,0.2)]">
                    BAL: {playerState.credits.toLocaleString()} CR
                </div>
            </div>

            <div className="flex-grow overflow-y-auto pr-2 pl-2 custom-scrollbar">
                {history.map((line, i) => <div key={i} className="mb-1 leading-tight break-words">{line}</div>)}
                <div ref={terminalEndRef} />
            </div>
            {!isLockedOut && (
                <InputLine
                    currentPath={currentPath}
                    currentUser={currentUser}
                    hostname={activeNode.hostname}
                    onSubmit={processCommand}
                    onTab={(val, setVal) => {
                        const comp = getCompletion(val);
                        if (comp) setVal(comp);
                    }}
                    getCompletion={getCompletion}
                    inputRef={inputRef}
                    commandHistory={commandHistory}
                    isPasswordInput={inputMode === 'password'}
                    themeColor={themeColor}
                />
            )}
        </div>
    );
};

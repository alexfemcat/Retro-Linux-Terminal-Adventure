import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { GameState, VFSNode, NetworkNode, PlayerState, Directory, File as VFSFile } from '../types';
import { checkCommandAvailability, COMMAND_REGISTRY } from '../services/CommandRegistry';
import { DEV_COMMAND_REGISTRY } from '../services/DevCommandRegistry';
import { MARKET_CATALOG } from '../data/marketData';
import { writeSave, readSave, createInitialPlayerState } from '../services/PersistenceService';
import { HardwareService, PROCESS_COSTS, HARDWARE_CONFIG } from '../services/HardwareService';
import { PerformanceStats } from '../hooks/usePerformance';
import { TaskManager } from './TaskManager';
import { KernelPanic } from './KernelPanic';
import { TutorialService, TUTORIAL_STEPS } from '../services/TutorialService';
import { TutorialOverlay } from './TutorialOverlay';
import { syncBinDirectory } from '../services/VFSService';

export interface TerminalProps {
    gameState: GameState;
    activeNode: NetworkNode;
    playerState: PlayerState;
    performance: PerformanceStats;
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
    onGameStateChange?: (newState: GameState) => void;
    onTransitionPreview?: (type: 'entering' | 'aborting') => void;
    onReboot?: (newState: PlayerState) => void;
    worldEvent?: any;
    onOpenSettings?: () => void;
    onOpenBrowser?: (url?: string) => void;
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
    playerState: PlayerState;
}> = ({ currentPath, currentUser, hostname, onSubmit, onTab, getCompletion, inputRef, commandHistory, isPasswordInput, themeColor, playerState }) => {
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
                    {/* Dev Mode Prompt Styling */}
                    <span className={playerState.isDevMode ? "text-purple-500 font-bold" : themeColor}>
                        {playerState.isDevMode ? 'root@dev-sandbox' : `${currentUser}@${hostname}`}
                    </span>
                    <span className="text-gray-400">:</span>
                    <span className={playerState.isDevMode ? "text-red-500" : "text-blue-400"}>{pathString}</span>
                    <span className="text-gray-400">{(currentUser === 'root' || playerState.isDevMode) ? '#' : '$'}</span>
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
    performance,
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
    onVFSChange,
    onGameStateChange,
    onTransitionPreview,
    onReboot,
    onOpenSettings,
    onOpenBrowser
}) => {
    const [history, setHistory] = useState<React.ReactNode[]>([]);
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const [aliases, setAliases] = useState<Record<string, string>>({});

    // Generalized Input State
    const [inputMode, setInputMode] = useState<'command' | 'password'>('command');
    const [passwordCallback, setPasswordCallback] = useState<((pwd: string) => void) | null>(null);

    const [isLockedOut] = useState<boolean>(false);
    const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

    const [isDiskActive, setIsDiskActive] = useState<boolean>(false);
    const [showTaskManager, setShowTaskManager] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const terminalEndRef = useRef<HTMLDivElement>(null);

    const { vfs, processes, envVars, hostname, themeColor } = activeNode;
    const { scenario } = gameState;

    const isTutorialActive = playerState.activeMissionId === 'tutorial';
    const tutorialStepIndex = playerState.tutorialStep || 0;
    const currentTutorialStep = isTutorialActive && tutorialStepIndex < TUTORIAL_STEPS.length ? TUTORIAL_STEPS[tutorialStepIndex] : null;

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
            const lines = getWelcomeLines();
            // Check for new game (0 rep, empty inventory) to suggest tutorial
            if (playerState.reputation === 0 && playerState.inventory.length === 0 && !playerState.activeMissionId) {
                lines.push(
                    <div key="new-user-tip" className="mt-4 p-2 border border-cyan-500/50 text-cyan-400 bg-cyan-900/10 animate-pulse">
                        <div className="font-bold tracking-widest">NEW USER DETECTED</div>
                        <div className="text-sm">Type <span className="text-white font-bold mx-1">tutorial</span> and press Enter to begin training simulation.</div>
                    </div>
                );
            }
            setHistory(lines);
        }
    }, [getWelcomeLines, playerState.reputation, playerState.inventory.length, playerState.activeMissionId]);

    const exitTutorial = () => {
        const resetState: PlayerState = { ...playerState, activeMissionId: null };
        delete resetState.tutorialStep;

        const slotId = playerState.isDevMode ? 'dev_save_slot' : (localStorage.getItem('active-save-slot') || 'slot_1');
        writeSave(slotId, resetState);

        if (onReboot) {
            onReboot(resetState);
        } else {
            window.location.reload(); // Fallback
        }
    };

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

    useEffect(() => {
        if (activeNode.id === 'localhost' || activeNode.id === 'local') {
            const newVFS = syncBinDirectory(playerState, vfs);
            if (onVFSChange) {
                onVFSChange(newVFS);
            }
        }
    }, [playerState.installedSoftware, activeNode.id]);

    useEffect(() => {
        const bashrcPath = resolvePath('~/.bashrc');
        if (bashrcPath) {
            const bashrcNode = getNodeByPath(bashrcPath);
            if (bashrcNode?.type === 'file') {
                const newAliases: Record<string, string> = {};
                bashrcNode.content.split('\n').forEach(line => {
                    if (line.startsWith('alias ')) {
                        const match = line.match(/alias\s+([^=]+)="([^"]+)"/);
                        if (match) {
                            newAliases[match[1]] = match[2];
                        }
                    }
                });
                setAliases(newAliases);
            }
        }
    }, [vfs, resolvePath, getNodeByPath]);

    const promptPassword = (callback: (pwd: string) => void) => {
        setInputMode('password');
        setPasswordCallback(() => callback);
    };

    const COMMAND_NOISE: Record<string, number> = {
        'ls': 0,
        'cat': 0,
        'cd': 0,
        'pwd': 0,
        'whoami': 0,
        'nmap': 10,
        'nmap-pro': 15,
        'hydra': 25,
        'brute-force.sh': 30,
        'ssh': 5,
        'sudo': 10,
        'download': 20,
        'sqlmap': 15,
        'msfconsole': 12,
        'msf-exploit': 15,
        'john': 0, // offline
        'echo': 5,
        'kill': 10,
    };

    const processCommand = async (command: string) => {
        if (isLockedOut || isTransitioning) return;

        // Trace Logic
        if (isMissionActive && onGameStateChange) {
            const [cmd] = command.trim().split(/\s+/);
            const noise = COMMAND_NOISE[cmd] !== undefined ? COMMAND_NOISE[cmd] : 2;
            const newTrace = Math.min(100, gameState.traceProgress + noise);

            if (newTrace >= 100) {
                setHistory(prev => [...prev, <div className="text-red-600 font-bold blink">!!! SIGNAL TRACE DETECTED - EMERGENCY DISCONNECT !!!</div>]);
                setTimeout(() => onMissionAbort(), 1500);
                onGameStateChange({ ...gameState, traceProgress: 100, isTraceActive: true });
                return;
            }

            // Trace Response Levels
            if (newTrace >= 75 && gameState.traceProgress < 75) {
                setHistory(prev => [...prev, <div className="text-red-500 font-bold">WARNING: NODE ENCRYPTION ROTATING. PORTS CLOSING.</div>]);
            } else if (newTrace >= 50 && gameState.traceProgress < 50) {
                setIsTransitioning(true);
                setTimeout(() => setIsTransitioning(false), 500);
                setHistory(prev => [...prev, <div className="text-yellow-500 font-bold">CAUTION: UNUSUAL NETWORK TRAFFIC DETECTED BY TARGET.</div>]);
            } else if (newTrace >= 25 && gameState.traceProgress < 25) {
                setHistory(prev => [...prev, <div className="text-blue-400 opacity-70">Heads up: Remote admin is running a routine check. Stay quiet.</div>]);
            }

            if (noise > 0) {
                onGameStateChange({ ...gameState, traceProgress: newTrace, isTraceActive: true });
            }
        }

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
                    <span className={playerState.isDevMode ? "text-purple-500 font-bold" : themeColor}>
                        {playerState.isDevMode ? 'root@dev-sandbox' : `${currentUser}@${hostname}`}
                    </span>
                    <span className="text-gray-400">:</span>
                    <span className={playerState.isDevMode ? "text-red-500" : "text-blue-400"}>{pathString}</span>
                    <span className="text-gray-400">{(currentUser === 'root' || playerState.isDevMode) ? '#' : '$'}</span>
                    <span className="pl-2">{trimmedCommand}</span>
                </div>
            )]);
        } else {
            return;
        }

        let [cmd, ...args] = trimmedCommand.split(/\s+/).filter(Boolean);
        if (aliases[cmd]) {
            const aliasCmd = aliases[cmd];
            const aliasParts = aliasCmd.split(/\s+/);
            cmd = aliasParts[0];
            args = [...aliasParts.slice(1), ...args];
        }
        let output: React.ReactNode | null = null;

        // Tutorial Check Logic
        if (isTutorialActive && currentTutorialStep) {
            if (currentTutorialStep.check(cmd, args, gameState, playerState)) {
                // Execute Step Completion Logic
                if (currentTutorialStep.onComplete) {
                    currentTutorialStep.onComplete(gameState, playerState);
                }

                // Step Completed
                const nextIndex = tutorialStepIndex + 1;
                const nextStep = nextIndex < TUTORIAL_STEPS.length ? TUTORIAL_STEPS[nextIndex] : null;

                // Update State
                // Update State
                const updatedState: PlayerState = { ...playerState, tutorialStep: nextIndex };

                if (!nextStep) {
                    // Tutorial Finished
                    updatedState.activeMissionId = null;
                    updatedState.tutorialStep = undefined;

                    // Save and Reboot to restore normal game state
                    writeSave(playerState.isDevMode ? 'dev_save_slot' : (localStorage.getItem('active-save-slot') || 'slot_1'), updatedState);
                    onPlayerStateChange(updatedState);

                    if (onReboot) {
                        setTimeout(() => onReboot(updatedState), 1500);
                    }
                    return; // Stop processing command to prevent weird state mismatch
                }

                onPlayerStateChange(updatedState);
                writeSave(playerState.isDevMode ? 'dev_save_slot' : (localStorage.getItem('active-save-slot') || 'slot_1'), updatedState);
            }
        }

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
            case 'tutorial':
                if (args[0] === 'reset') {
                    if (activeNode.id !== 'local' && activeNode.id !== 'localhost') {
                        output = <div className="text-red-500">Error: Can only reset from Homebase. Disconnect first.</div>;
                        break;
                    }
                    const tutorialState = TutorialService.generateTutorialState(playerState);
                    const tutorialPlayerState = {
                        ...playerState,
                        activeMissionId: 'tutorial',
                        tutorialStep: 0,
                        installedSoftware: Array.from(new Set([...playerState.installedSoftware, 'nmap']))
                    };
                    if (onGameStateChange) onGameStateChange(tutorialState);
                    onPlayerStateChange(tutorialPlayerState);
                    setHistory([<div className="text-cyan-400 font-bold">SIMULATION RESET. RE-INITIALIZING...</div>]);
                    return;
                }

                if (activeNode.id !== 'local' && activeNode.id !== 'localhost') {
                    output = <div className="text-red-500">Error: Simulation can only be accessed from secure Homebase terminals. Disconnect first.</div>;
                } else {
                    const tutorialState = TutorialService.generateTutorialState(playerState);
                    const tutorialPlayerState = {
                        ...playerState,
                        activeMissionId: 'tutorial',
                        tutorialStep: 0,
                        installedSoftware: Array.from(new Set([...playerState.installedSoftware, 'nmap']))
                    };

                    if (onGameStateChange) onGameStateChange(tutorialState);
                    onPlayerStateChange(tutorialPlayerState);
                    // Force refresh history
                    setHistory([<div className="text-cyan-400 font-bold">LOADING TRAINING SIMULATION...</div>]);
                    return;
                }
                break;
            case 'help':
                output = (
                    <div className="whitespace-pre-wrap text-yellow-300">
                        <div className="font-bold mb-1">AVAILABLE COMMANDS:</div>
                        <div className="grid grid-cols-[120px_200px_1fr] gap-x-4 opacity-90">
                            <div className="border-b border-yellow-300/30 pb-1">COMMAND</div>
                            <div className="border-b border-yellow-300/30 pb-1">USAGE</div>
                            <div className="border-b border-yellow-300/30 pb-1">DESCRIPTION</div>
                            {Object.values(COMMAND_REGISTRY).filter(def => {
                                // Only show default commands or commands the player has actually installed
                                const isUnlocked = def.isDefaultCommand || playerState.installedSoftware.includes(def.id) || (def.requiredSoftware && playerState.installedSoftware.includes(def.requiredSoftware));
                                if (!isUnlocked) return false;

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
                            {playerState.isDevMode && Object.values(DEV_COMMAND_REGISTRY).map(def => (
                                <React.Fragment key={def.id}>
                                    <div className="text-purple-400 font-bold">{def.id}</div>
                                    <div className="text-gray-400">{def.usage}</div>
                                    <div className="text-purple-200">{def.description}</div>
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
                } else if (args[0] === 'refresh' || args[0] === 'generate') {
                    const count = parseInt(args[1]) || 6;
                    const { missionGenerator } = await import('../services/MissionGenerator');
                    const newMissions = missionGenerator.generateMissions(playerState.reputation, count);
                    onPlayerStateChange({ ...playerState, availableMissions: newMissions });
                    output = <div className="text-green-400">Successfully rolled {newMissions.length} new contracts. Check 'jobs' list.</div>;
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
                                        <div className="text-gray-500">[{idx + 1}]</div>
                                        <div className="font-bold text-white">{m.title}</div>
                                        <div className="text-amber-500">{'★'.repeat(m.difficulty)}</div>
                                        <div className="text-green-500">{m.reward}c</div>
                                        <div className="col-start-2 col-span-3 text-xs text-gray-500 mb-2">
                                            {m.description.split('\n')[0]}
                                        </div>
                                    </React.Fragment>
                                ))}
                            </div>
                            <div className="mt-4 text-xs text-gray-500 italic border-t border-yellow-400/20 pt-2">
                                Usage: jobs accept [number] | jobs refresh
                            </div>
                        </div>
                    );
                }
                break;
            case 'browser':
                if (onOpenBrowser) {
                    onOpenBrowser(args[0]);
                }
                break;
            case 'mail':
                if (onOpenBrowser) {
                    onOpenBrowser('mail://homebase');
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
                                    <div className="grid grid-cols-[100px_80px_100px_120px_1fr] gap-4 border-b border-gray-700 pb-1 mb-1 text-gray-500">
                                        <span>PERMS</span>
                                        <span>OWNER</span>
                                        <span>SIZE</span>
                                        <span>MODIFIED</span>
                                        <span>NAME</span>
                                    </div>
                                    {children.map(name => {
                                        const child = (lsNode as any).children[name];
                                        const isDir = child.type === 'directory';
                                        const formatSize = (kb: number) => {
                                            if (kb < 1024) return `${kb.toFixed(1)}K`;
                                            if (kb < 1024 * 1024) return `${(kb / 1024).toFixed(1)}M`;
                                            return `${(kb / 1024 / 1024).toFixed(1)}G`;
                                        };
                                        const size = formatSize(child.size || 0);

                                        // Fake date
                                        const date = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
                                        const formattedDate = `${date.toLocaleString('default', { month: 'short' })} ${date.getDate().toString().padStart(2, ' ')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

                                        return (
                                            <div key={name} className="grid grid-cols-[100px_80px_100px_120px_1fr] gap-4">
                                                <span className="text-yellow-600 font-mono">{child.permissions === 'root' ? 'drwx------' : (isDir ? 'drwxr-xr-x' : '-rw-r--r--')}</span>
                                                <span className="text-gray-400">{child.permissions || 'user'}</span>
                                                <span className="text-cyan-600 text-right pr-4">{size}</span>
                                                <span className="text-gray-500">{formattedDate}</span>
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
            case 'echo':
                // Usage: echo "text" > file
                const textMatch = trimmedCommand.match(/"([^"]+)"\s*>\s*([^\s]+)/);
                if (!textMatch) {
                    output = "usage: echo \"text\" > [file]";
                    break;
                }
                const [_, echoContent, echoFileName] = textMatch;
                const echoPath = resolvePath(echoFileName);
                if (echoPath) {
                    const parentPath = echoPath.slice(0, -1);
                    const fName = echoPath[echoPath.length - 1];
                    const parentNode = getNodeByPath(parentPath) as Directory;

                    if (parentNode) {
                        const existing = parentNode.children[fName];
                        if (existing && existing.type === 'directory') {
                            output = `echo: cannot write to '${echoFileName}': Is a directory`;
                            break;
                        }
                        if (existing && existing.permissions === 'root' && currentUser !== 'root') {
                            output = `echo: cannot write to '${echoFileName}': Permission denied`;
                            break;
                        }

                        parentNode.children[fName] = {
                            type: 'file',
                            name: fName,
                            content: echoContent,
                            size: (echoContent.length / 1024 / 1024) || 0.01
                        };
                        output = null;

                        if (onVFSChange) onVFSChange(vfs);

                        // Check Win Condition: File Modified (Defacement)
                        if (gameState.winCondition.type === 'file_modified' &&
                            activeNode.id === gameState.winCondition.nodeId &&
                            echoContent === gameState.winCondition.targetContent &&
                            fName === gameState.winCondition.path[gameState.winCondition.path.length - 1]) {
                            onWin();
                        }
                    }
                }
                break;
            case 'kill':
                const pidToKill = parseInt(args[0]);
                if (isNaN(pidToKill)) {
                    output = "usage: kill [pid]";
                    break;
                }
                const procToKill = processes.find(p => p.pid === pidToKill);
                if (procToKill) {
                    if (procToKill.user === 'root' && currentUser !== 'root') {
                        output = `kill: (${pidToKill}) - Operation not permitted`;
                        break;
                    }

                    // Trigger win condition if matching
                    if (gameState.winCondition.type === 'process_killed' &&
                        activeNode.id === gameState.winCondition.nodeId &&
                        procToKill.name === gameState.winCondition.processName) {
                        onWin();
                    }

                    // Note: This only "simulates" killing by message for now as we don't mutate processes array in activeNode directly yet in all components
                    output = `Terminated process ${pidToKill} (${procToKill.name}).`;
                } else {
                    output = `kill: (${pidToKill}) - No such process`;
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
                            const fileSizeKB = fNode.size || 1;

                            // 1. Check Storage Capacity (Phase 5)
                            const currentUsageKB = HardwareService.calculateStorageUsage(playerState, null);
                            const capacityKB = playerState.hardware.storage.capacity * 1024 * 1024;
                            if (currentUsageKB + fileSizeKB > capacityKB) {
                                output = (
                                    <div className="text-red-500">
                                        Error: Disk Full. Available: {((capacityKB - currentUsageKB) / 1024).toFixed(1)}MB, Required: {(fileSizeKB / 1024).toFixed(1)}MB.
                                    </div>
                                );
                                break;
                            }

                            // 2. Check RAM Capacity (Phase 4)

                            if (fileSizeKB / 1024 > playerState.hardware.ram.capacity * 1024) {
                                output = <div className="text-red-500">Error: File '{fNode.name}' ({(fileSizeKB / 1024).toFixed(1)}MB) is too large for your system's RAM ({playerState.hardware.ram.capacity}GB). Upgrade RAM to handle this buffer.</div>;
                                break;
                            }

                            const pid = Math.floor(Math.random() * 9000) + 1000;
                            // Download cost is base + multiplier of file size in RAM
                            const ramCost = HARDWARE_CONFIG.DOWNLOAD_BASE_RAM + (fileSizeKB / 1024 / 1024 * HARDWARE_CONFIG.DOWNLOAD_SIZE_FACTOR);

                            setActiveProcesses(prev => [...prev, { id: pid.toString(), name: `download:${fNode.name}`, ram: ramCost }]);

                            const currentRamUsage = activeProcesses.reduce((acc, p) => acc + p.ram, 0) + ramCost;

                            // 3. Calculate Delay (Phase 5: Network + CPU)
                            const networkSpeedMBps = playerState.hardware.network.bandwidth || 1;
                            const networkDelay = (fileSizeKB / 1024 / networkSpeedMBps) * 1000;
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

                                // Re-check storage capacity right before finishing to prevent race conditions or state changes
                                const finalUsageKB = HardwareService.calculateStorageUsage(playerState, null);
                                const finalCapacityKB = playerState.hardware.storage.capacity * 1024 * 1024;

                                if (finalUsageKB + fileSizeKB > finalCapacityKB) {
                                    setHistory(prev => [...prev, (
                                        <div className="text-red-500">
                                            [ERROR] Download failed: Disk became full during transfer.
                                        </div>
                                    )]);
                                    setActiveProcesses(prev => prev.filter(p => p.id !== pid.toString()));
                                    return;
                                }

                                setHistory(prev => [...prev, (
                                    <div className="text-green-400">
                                        [SUCCESS] Downloaded '{fNode.name}' ({(fileSizeKB / 1024).toFixed(1)}MB) in {(delay / 1000).toFixed(2)}s.
                                    </div>
                                )]);

                                // Add to mission inventory
                                const updatedPlayerState = {
                                    ...playerState,
                                    missionInventory: [...(playerState.missionInventory || []), fNode]
                                };
                                onPlayerStateChange(updatedPlayerState);

                                // Auto-save (respect dev mode)
                                const slotId = playerState.isDevMode ? 'dev_save_slot' : (localStorage.getItem('active-save-slot') || 'slot_1');
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
            case 'inv':
                const invStorageUsed = HardwareService.calculateStorageUsage(playerState, null);
                const invCapacity = playerState.hardware.storage.capacity * 1024 * 1024;
                const invPercent = (invStorageUsed / invCapacity) * 100;

                output = (
                    <div className="text-cyan-400 font-mono">
                        <div className="font-bold border-b border-cyan-400/30 mb-2 pb-1">INVENTORY STATUS</div>
                        <div className="mb-4">
                            <div className="flex justify-between text-xs mb-1">
                                <span>STORAGE USAGE</span>
                                <span className={invPercent > 90 ? 'text-red-500' : 'text-cyan-400'}>
                                    {(invStorageUsed / (1024 * 1024)).toFixed(2)} / {(invCapacity / (1024 * 1024)).toFixed(2)} GB
                                </span>
                            </div>
                            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden border border-cyan-900">
                                <div
                                    className={`h-full ${invPercent > 90 ? 'bg-red-500' : 'bg-cyan-500'}`}
                                    style={{ width: `${Math.min(100, invPercent)}%` }}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-[1fr_80px_100px] gap-2 text-xs border-b border-cyan-900/50 pb-1 mb-1 opacity-70">
                            <div>ITEM</div>
                            <div>TYPE</div>
                            <div>SIZE</div>
                        </div>

                        {playerState.inventory.length === 0 ? (
                            <div className="text-gray-500 italic">No loot in inventory.</div>
                        ) : (
                            playerState.inventory.map((item, idx) => (
                                <div key={idx} className="grid grid-cols-[1fr_80px_100px] gap-2 hover:bg-white/5">
                                    <span className="text-white truncate">{item.name}</span>
                                    <span className="text-gray-400 uppercase">{item.type}</span>
                                    <span className="text-cyan-600">{item.type === 'file' ? `${((item.size || 0) / 1024).toFixed(2)}MB` : '-'}</span>
                                </div>
                            ))
                        )}

                        <div className="mt-4 pt-2 border-t border-cyan-900/50">
                            <div className="text-[10px] text-gray-500 uppercase mb-1">Installed Software Usage</div>
                            {playerState.installedSoftware.map(softId => {
                                const soft = MARKET_CATALOG.find(i => i.id === softId);
                                return (
                                    <div key={softId} className="flex justify-between text-xs text-gray-400">
                                        <span>{softId}</span>
                                        <span>{(((soft as any)?.storageSize || 0) / 1024).toFixed(2)} MB</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
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
            case 'nmap-pro':
                if (!args[0]) { output = "usage: nmap-pro [ip]"; break; }
                const nmapProIp = args[0];
                const nmapProTarget = gameState.nodes.find(n => n.ip === nmapProIp);

                if (nmapProTarget) {
                    const pid = Math.floor(Math.random() * 9000) + 1000;
                    const cost = { ramUsage: 1.5 }; // nmap-pro is heavier

                    setActiveProcesses(prev => [...prev, { id: pid.toString(), name: 'nmap-pro', ram: cost.ramUsage }]);
                    setHistory(prev => [...prev, <div key={`scan-pro-${pid}`}>Starting Nmap-Pro 1.0 (Enterprise Scan) at {new Date().toISOString()}...</div>]);

                    const currentRamUsage = activeProcesses.reduce((acc, p) => acc + p.ram, 0) + cost.ramUsage;
                    const delay = HardwareService.calculateProcessDelay(2500, playerState, currentRamUsage);

                    setTimeout(() => {
                        const portLines = nmapProTarget.ports.map(p =>
                            `${p.port}/tcp ${p.isOpen ? 'open' : 'closed'}  ${p.service.padEnd(12)} ${p.version}`
                        );

                        const vulnerabilities = nmapProTarget.vulnerabilities.map(v =>
                            `[!] VULNERABILITY FOUND: ${v.type.toUpperCase()} - ${v.hint} (${v.entryPoint}) - TIER ${v.level}`
                        );

                        const result = (
                            <div className="whitespace-pre-wrap text-blue-300">
                                {`Nmap-Pro scan report for ${nmapProTarget.hostname} (${nmapProIp})`}
                                <br />Host is up (0.0001s latency). OS: {nmapProTarget.osVersion}
                                <br />PORT     STATE SERVICE      VERSION
                                <br />{portLines.join('\n')}
                                <br /><br />
                                <div className="text-red-400 font-bold">
                                    {vulnerabilities.length > 0 ? vulnerabilities.join('\n') : 'No high-level vulnerabilities detected by automated scan.'}
                                </div>
                                <br />Nmap-Pro done: 1 IP address scanned in {(delay / 1000).toFixed(2)} seconds
                            </div>
                        );
                        setHistory(prev => [...prev, result]);
                        setActiveProcesses(prev => prev.filter(p => p.id !== pid.toString()));
                    }, delay);
                    return;
                } else {
                    output = `nmap-pro: host ${nmapProIp} not found.`;
                }
                break;
            case 'hydra':
                if (!args[0]) { output = "usage: hydra [user]@[ip] [-P wordlist]"; break; }
                const pFlagIndex = args.indexOf('-P');
                if (pFlagIndex !== -1) {
                    const wordlistName = args[pFlagIndex + 1];
                    // Check for both the exact name and the .tool extension used for consumables
                    const hasWordlist = playerState.inventory.some(item =>
                        item.name === wordlistName || item.name === `${wordlistName}.tool`
                    );
                    if (!hasWordlist) {
                        output = <div className="text-red-500">Error: Wordlist file '{wordlistName}' not found in local storage. Purchase one from the market first.</div>;
                        break;
                    }
                }
                // Fallthrough to existing hydra logic (which I need to check/add)
                const [hydraUser, hydraIp] = args[0].split('@');
                const hydraTarget = gameState.nodes.find(n => n.ip === hydraIp);
                if (hydraTarget) {
                    output = (
                        <div className="text-green-400">
                            Hydra v9.2 (c) 2021 by van Hauser/THC - Starting...<br />
                            [DATA] attacking ssh://${hydraIp}:22/<br />
                            [22][ssh] host: ${hydraIp}   login: ${hydraUser}   password: ${hydraTarget.rootPassword}<br />
                            1 of 1 target successfully completed, 1 valid password found
                        </div>
                    );
                } else {
                    output = "hydra: connection refused";
                }
                break;
            case 'sqlmap':
                if (!args[0]) { output = "usage: sqlmap [ip]"; break; }
                const sqlIp = args[0];
                const sqlTarget = gameState.nodes.find(n => n.ip === sqlIp);
                if (sqlTarget) {
                    const dbVuln = sqlTarget.vulnerabilities.find(v => v.type === 'db');
                    if (dbVuln) {
                        const pid = Math.floor(Math.random() * 9000) + 1000;
                        setHistory(prev => [...prev, (
                            <div key={`sql-${pid}`} className="text-pink-400 font-mono">
                                [!] Testing URL: http://${sqlIp}:5432/api/v1/query?id=1<br />
                                [!] Heuristic test: PostgreSQL (9.6) detected<br />
                                [!] GET parameter 'id' is vulnerable. Testing payloads...
                            </div>
                        )]);

                        setTimeout(() => {
                            setHistory(prev => [...prev, (
                                <div key={`sql-dump-${pid}`} className="text-pink-600 font-mono animate-pulse">
                                    [!] DUMPING DATABASE...<br />
                                    [0%] [                                ]<br />
                                    [30%] [#########                       ]<br />
                                    [65%] [#####################           ]<br />
                                    [100%] [################################]<br />
                                    [SUCCESS] Database dumped! Found 124 tables.<br />
                                    <div className="text-white mt-2">
                                        - users: 14 entries (extracted root_hash)<br />
                                        - config: 2 entries<br />
                                        - logs: 1024 entries
                                    </div>
                                    <br />
                                    <div className="border border-pink-500 p-2 bg-pink-900/20 text-pink-300">
                                        ROOT_PASSWORD_HASH: {btoa(sqlTarget.rootPassword || 'none')}<br />
                                        Saved to ~/loot/db_dump.hash
                                    </div>
                                    <br />Use 'john' to crack this hash.
                                </div>
                            )]);

                            // Add hash file to inventory
                            const hashFile: VFSFile = {
                                type: 'file',
                                name: 'db_dump.hash',
                                content: btoa(sqlTarget.rootPassword || 'none'),
                                size: 0.01
                            };
                            onPlayerStateChange({
                                ...playerState,
                                inventory: [...playerState.inventory, hashFile]
                            });

                        }, 1500);
                        return;
                    } else {
                        output = <div className="text-red-500">[ERROR] No SQL injection points detected on target.</div>;
                    }
                } else {
                    output = `sqlmap: connection refused to ${sqlIp}`;
                }
                break;
            case 'msfconsole':
                output = (
                    <div className="text-red-400 font-bold whitespace-pre">
                        {`
      .:okOOOkdl:..          .lodxkkkxo:.
    .:ONWWWWWWWWWWNWNXK0k0KKNWNNWWWWWWWNWNXO.
   .ONWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW.
   NWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW.
   `}
                        <div className="text-white font-mono">
                            Metasploit Framework v6.1.0-dev<br />
                            Type 'search [name]' to find exploits.
                        </div>
                    </div>
                );
                break;
            case 'msf-exploit':
                if (!args[0]) { output = "usage: msf-exploit [ip] [service]"; break; }
                const msfIp = args[0];
                const msfTarget = gameState.nodes.find(n => n.ip === msfIp);
                if (msfTarget) {
                    const serviceVuln = msfTarget.vulnerabilities.find(v => v.type === 'service');
                    if (serviceVuln) {
                        setHistory(prev => [...prev, (
                            <div key={`msf-${Date.now()}`} className="text-red-500 font-mono">
                                [*] Exploit target: ${msfIp} (${msfTarget.hostname})<br />
                                [*] Payload: linux/x64/shell_reverse_tcp<br />
                                [*] Transmitting exploit body...
                            </div>
                        )]);

                        let progress = 0;
                        const msfProgId = Date.now();
                        const interval = setInterval(() => {
                            progress += 25;
                            if (progress <= 100) {
                                setHistory(prev => {
                                    const next = [...prev];
                                    next[next.length - 1] = (
                                        <div key={msfProgId} className="text-red-500 font-mono">
                                            [*] Transmitting exploit body... [{'#'.repeat(progress / 10)}{' '.repeat(10 - progress / 10)}] {progress}%
                                        </div>
                                    );
                                    return next;
                                });
                            } else {
                                clearInterval(interval);
                                setHistory(prev => [...prev, (
                                    <div className="text-red-500 font-mono mt-2">
                                        [*] Exploit completed, but no session was created.<br />
                                        [!] Waiting for stages... (3.4s)<br />
                                        [*] Command shell session 1 opened (192.168.1.100:4444 {'->'} ${msfIp}:80)<br /><br />
                                        <div className="text-green-500 font-bold animate-pulse">SESSION 1 ESTABLISHED. You now have USER access.</div>
                                    </div>
                                )]);

                                setTimeout(() => {
                                    const targetIdx = gameState.nodes.findIndex(n => n.id === msfTarget.id);
                                    onNodeChange(targetIdx);
                                    setHistory([]);
                                }, 2000);
                            }
                        }, 400);

                        return;
                    } else {
                        output = <div className="text-red-500">[*] Exploit failed: Target not vulnerable to selected payload. Use nmap-pro to verify service versions.</div>;
                    }
                } else {
                    output = `msf-exploit: host ${msfIp} not found.`;
                }
                break;
            case '0day-pack':
                if (!args[0]) { output = "usage: 0day-pack [ip]"; break; }
                const zDayIp = args[0];
                const zDayTarget = gameState.nodes.find(n => n.ip === zDayIp);
                if (zDayTarget) {
                    setHistory(prev => [...prev, (
                        <div key={`0day-${Date.now()}`} className="text-yellow-400 font-mono italic animate-pulse">
                            [!] DEPLOYING UNKNOWN EXPLOIT PACKAGE...<br />
                            [!] TARGET OS: {zDayTarget.osVersion}<br />
                            [*] Identifying kernel patch level...<br />
                            [*] Buffer overflow triggered at 0xdeadbeef<br />
                            <div className="text-white font-bold bg-yellow-600/30 p-2 border border-yellow-500 mt-2">
                                [SUCCESS] SYSTEM COMPROMISED. Root access established.<br />
                                root_password: {zDayTarget.rootPassword}
                            </div>
                        </div>
                    )]);
                } else {
                    output = `0day-pack: target ${zDayIp} unreachable.`;
                }
                break;
            case 'neuro-crack':
                if (!args[0]) { output = "usage: neuro-crack [ip]"; break; }
                const neuroIp = args[0];
                const neuroTarget = gameState.nodes.find(n => n.ip === neuroIp);
                if (neuroTarget) {
                    setHistory(prev => [...prev, (
                        <div key={`neuro-${Date.now()}`} className="text-purple-400 font-mono">
                            [NEURAL] Initializing heuristic bypass...<br />
                            [NEURAL] Analyzing encryption patterns...<br />
                            <div className="flex gap-1 text-xs opacity-50 overflow-hidden">
                                {Array(20).fill(0).map((_, i) => <div key={i} className="animate-bounce" style={{ animationDelay: `${i * 100}ms` }}>{Math.random() > 0.5 ? '1' : '0'}</div>)}
                            </div>
                        </div>
                    )]);

                    setTimeout(() => {
                        setHistory(prev => [...prev, (
                            <div key={`neuro-res-${Date.now()}`} className="text-purple-500 font-mono">
                                [NEURAL] Mapping qubit states... SUCCESS<br />
                                [NEURAL] Injecting sub-atomic bypass sequence...<br />
                                <div className="text-white font-bold mt-4 p-2 border-2 border-purple-500 bg-purple-900/40 shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                                    [CRITICAL SUCCESS] Root Password Recovered: {neuroTarget.rootPassword}
                                </div>
                                <div className="text-red-500 font-bold mt-2 animate-pulse">
                                    !!! WARNING: CRITICAL HARDWARE STRAIN DETECTED !!!
                                </div>
                            </div>
                        )]);
                        // Heat spike!
                        onPlayerStateChange({ ...playerState, systemHeat: playerState.systemHeat + 45 });
                    }, 2000);
                    return;
                } else {
                    output = `neuro-crack: could not establish neural link to ${neuroIp}`;
                }
                break;
            case 'john':
                const hashFileName = args[0];
                if (!hashFileName) { output = "usage: john [hash_file]"; break; }
                const hashFile = playerState.inventory.find(item => item.name === hashFileName);
                if (!hashFile || hashFile.type !== 'file') {
                    output = <div className="text-red-500">Error: Hash file '{hashFileName}' not found in local inventory.</div>;
                    break;
                }

                setHistory(prev => [...prev, (
                    <div key={`john-${Date.now()}`} className="text-yellow-500 font-mono">
                        John the Ripper 1.9.0-jumbo-1 (Intel 64-bit)<br />
                        Loaded 1 password hash (bcrypt) [bcrypt 32/64]<br />
                        Press 'q' or Ctrl-C to abort, almost any other key for status<br />
                        Proceeding with wordlist attack...
                    </div>
                )]);

                setTimeout(() => {
                    const crackedPassword = atob(hashFile.content);
                    setHistory(prev => [...prev, (
                        <div key={`john-done-${Date.now()}`} className="text-green-400 font-mono mt-2">
                            {crackedPassword}        (root)<br /><br />
                            1 password hash cracked, 0 left<br />
                            <div className="text-white bg-green-900/20 p-1 border border-green-500 mt-1 inline-block">
                                Successfully recovered password from hash.
                            </div>
                        </div>
                    )]);
                }, 3000);
                return;
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
                    // Tutorial Logic: SSH success is a step completion
                    if (isTutorialActive && tutorialStepIndex === 5) {
                        const nextIndex = tutorialStepIndex + 1;
                        const updatedState: PlayerState = { ...playerState, tutorialStep: nextIndex };
                        onPlayerStateChange(updatedState);
                        writeSave(playerState.isDevMode ? 'dev_save_slot' : (localStorage.getItem('active-save-slot') || 'slot_1'), updatedState);
                    }

                    // Start glitch animation
                    setIsTransitioning(true);
                    setTimeout(() => {
                        setIsTransitioning(false);
                        onNodeChange(sshTargetIndex);
                        setHistory([]);
                    }, 1000);
                };

                const handlePasswordPrompt = (pwd: string) => {
                    if (pwd === sshTarget.rootPassword) {
                        attemptLogin(userStr === 'root');
                    } else {
                        if (isTutorialActive && tutorialStepIndex === 5) {
                            setHistory(prev => [...prev, <div className="text-cyan-400">[THE ARCHITECT]: Incorrect. The training password is 'training'. Try again.</div>]);
                        } else {
                            setHistory(prev => [...prev, <div className="text-red-500">Permission denied, please try again.</div>]);
                        }
                    }
                };

                // This is the SSH step, but the actual step completion is handled in attemptLogin.
                // We just let it proceed to the password prompt.
                if (isTutorialActive && currentTutorialStep && currentTutorialStep.id === 'ssh_connect') {
                    if (cmd === 'ssh' && args[0] === 'user@192.168.1.55') {
                        promptPassword(handlePasswordPrompt);
                        return;
                    }
                }

                promptPassword(handlePasswordPrompt);
                return;
            case 'exit':
                if (playerState.isDevMode) {
                    output = "Error: Use 'logout' to exit dev-sandbox.";
                    break;
                }
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
                if ((args[0] === 'login' && args[1] === 'dev') || (args[0] === 'dev' && args[1] === 'login')) {
                    promptPassword(async (pwd) => {
                        if (pwd === '6969') {
                            const devState: PlayerState = { ...playerState, isDevMode: true };
                            await writeSave('dev_save_slot', devState);
                            if (onReboot) {
                                onReboot(devState);
                            } else {
                                onPlayerStateChange(devState);
                            }
                        } else {
                            setHistory(prev => [...prev, <div key={Date.now()} className="text-red-500">sudo: authentication failed.</div>]);
                        }
                    });
                } else {
                    promptPassword((pwd) => {
                        if (pwd === activeNode.rootPassword) {
                            setCurrentUser('root');
                            if (gameState.winCondition.type === 'root_access' && gameState.winCondition.nodeId === activeNode.id) {
                                onWin();
                            } else {
                                setHistory(prev => [...prev, <div key={Date.now()} className="text-yellow-400">sudo: root access granted.</div>]);
                            }
                        } else {
                            setHistory(prev => [...prev, <div key={Date.now()} className="text-red-500">Sorry, try again.</div>]);
                        }
                    });
                }
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
            case 'netmap':
                output = (
                    <div className="font-mono text-cyan-400">
                        <div className="font-bold border-b border-cyan-400/30 mb-2 pb-1">NETWORK TOPOLOGY MAP</div>
                        <div className="flex flex-col gap-2">
                            {gameState.nodes.map((node, idx) => {
                                const isCurrent = activeNode.id === node.id;
                                const isDiscovered = node.isDiscovered || node.id === 'local';
                                return (
                                    <div key={node.id} className={`flex items-center gap-2 ${isDiscovered ? '' : 'opacity-30'}`}>
                                        <div className="w-4 flex justify-center">
                                            {isCurrent ? <span className="text-yellow-400 animate-pulse">▶</span> : <span>○</span>}
                                        </div>
                                        <div className={`px-2 py-0.5 border ${isCurrent ? 'border-yellow-400 text-yellow-400' : 'border-cyan-900 text-cyan-700'}`}>
                                            {isDiscovered ? `${node.hostname} (${node.ip})` : '???.???.???.???'}
                                        </div>
                                        {idx < gameState.nodes.length - 1 && (
                                            <div className="text-gray-600">───▶</div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-4 text-xs opacity-50">
                            * Active pivot points highlighted in yellow.
                        </div>
                    </div>
                );
                break;
            case 'date':
                const now = new Date();
                output = now.toString();
                break;
            case 'logout':
                if (playerState.isDevMode) {
                    const slotId = localStorage.getItem('active-save-slot') || 'slot_1';
                    const originalState = await readSave(slotId);
                    const newState = originalState || createInitialPlayerState();
                    if (onReboot) {
                        onReboot(newState);
                    } else {
                        onPlayerStateChange(newState);
                    }
                } else {
                    output = "logout";
                }
                break;
            case 'devhelp':
                output = (
                    <div className="text-purple-300">
                        <div className="font-bold mb-2">DEV OPS COMMAND SUITE:</div>
                        <div className="grid grid-cols-[150px_1fr] gap-x-4 gap-y-1">
                            {Object.values(DEV_COMMAND_REGISTRY).map(d => (
                                <React.Fragment key={d.id}>
                                    <div className="font-bold">{d.id}</div>
                                    <div className="text-gray-400">{d.description}</div>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                );
                break;
            case 'dev-guide':
                const category = args[0];
                if (category === 'animations') {
                    output = (
                        <div className="text-purple-300">
                            <div className="font-bold border-b border-purple-500/30 mb-2 pb-1">ANIMATION REFERENCE GUIDE</div>
                            <div className="grid grid-cols-[180px_1fr] gap-4 text-sm">
                                <div className="font-bold">debug-anim bios</div><div>Phase 1: POST and boot sequence. Re-runs system startup logs.</div>
                                <div className="font-bold">debug-anim panic</div><div>Phase 4: Kernel Panic. Triggers the BSOD hex-dump and reboot.</div>
                                <div className="font-bold">debug-anim glitch</div><div>Visual Jitter: Manually scrambles terminal pixels.</div>
                                <div className="font-bold">debug-anim mission-in</div><div>Infiltration: The "Sick as Hell" mission loading sequence.</div>
                                <div className="font-bold">debug-anim mission-out</div><div>Exfiltration: The "Sick as Hell" mission abort sequence.</div>
                                <div className="font-bold">rm [file]</div><div>Shredding: 5-step progress bar with red "DELETED" text.</div>
                                <div className="font-bold">download [file]</div><div>Transfer: Cyan progress bar with percentage tracking.</div>
                                <div className="font-bold">market sell [file]</div><div>Credit Tikker: Rapid credit increment animation.</div>
                                <div className="font-bold">ssh [user]@[ip]</div><div>Network Pivot: Transition glitch effect and history wipe.</div>
                            </div>
                        </div>
                    );
                } else if (category === 'triggers') {
                    output = (
                        <div className="text-purple-300">
                            <div className="font-bold border-b border-purple-500/30 mb-2 pb-1">SYSTEM TRIGGER GUIDE</div>
                            <div className="grid grid-cols-[180px_1fr] gap-4 text-sm">
                                <div className="font-bold text-red-400">Thermal Crash</div><div>Trigger: systemHeat {'>'}= 100. Action: Immediate BSOD & Reboot.</div>
                                <div className="font-bold text-red-400">Degradation</div><div>Trigger: systemHeat {'>'} 95. Action: Permanent hardware level reduction.</div>
                                <div className="font-bold text-green-400">Mission Win</div><div>Trigger: Obtain root on target or download SECRET.dat.</div>
                                <div className="font-bold">Disk Full</div><div>Trigger: inventory size {'>'} storage capacity. Action: Prevents downloads.</div>
                                <div className="font-bold">RAM Thrashing</div><div>Trigger: process RAM {'>'} capacity. Action: 500% operation slowdown.</div>
                            </div>
                        </div>
                    );
                } else if (category === 'missions') {
                    output = (
                        <div className="text-purple-300">
                            <div className="font-bold border-b border-purple-500/30 mb-2 pb-1">MISSION SYSTEM INTERNALS</div>
                            <div className="grid grid-cols-[180px_1fr] gap-4 text-sm">
                                <div className="font-bold">Generation</div><div>Uses MissionGenerator.ts to scale complexity by reputation.</div>
                                <div className="font-bold">Tier 1-6</div><div>Determines node count (2 to 7) and target difficulty.</div>
                                <div className="font-bold">Procedural VFS</div><div>Backwards-chained clues. Node N always contains login to Node N+1.</div>
                                <div className="font-bold">Dev Command</div><div>dev-mission [tier] - Instantly force-deploys a mission.</div>
                            </div>
                        </div>
                    );
                } else if (category === 'commands') {
                    output = (
                        <div className="text-purple-300">
                            <div className="font-bold border-b border-purple-500/30 mb-2 pb-1">DEV-OPS COMMAND REFERENCE</div>
                            <div className="grid grid-cols-[180px_1fr] gap-4 text-sm">
                                <div className="font-bold">spawn software [id]</div><div>Injects binary (e.g., nmap, hydra) into playerState.</div>
                                <div className="font-bold">spawn hardware [id]</div><div>Hot-swaps component. ID must match MARKET_CATALOG.</div>
                                <div className="font-bold">spawn item [id]</div><div>Adds file to loot inventory. Used for selling/testing.</div>
                                <div className="font-bold">spawn credits [n]</div><div>Instantly sets current balance.</div>
                                <div className="font-bold">dev-reveal</div><div>Bypasses discovery fog; sets isDiscovered=true for all nodes.</div>
                                <div className="font-bold">dev-reset</div><div>Wipes dev_save_slot and returns to vanilla sandbox.</div>
                            </div>
                        </div>
                    );
                } else {
                    output = "usage: dev-guide <animations|triggers|commands|missions>";
                }
                break;
            case 'spawn':
                const [spawnType, spawnId] = args;
                if (spawnType === 'software') {
                    if (!spawnId) { output = "usage: spawn software [id]"; break; }
                    onPlayerStateChange({ ...playerState, installedSoftware: [...new Set([...playerState.installedSoftware, spawnId])] });
                    output = `[SPAWN] Software '${spawnId}' installed.`;
                } else if (spawnType === 'hardware') {
                    const hwItem = MARKET_CATALOG.find(i => i.id === spawnId && i.category === 'hardware') as any;
                    if (!hwItem || !hwItem.hardwareKey) { output = "usage: spawn hardware [valid_hardware_id]"; break; }
                    onPlayerStateChange({
                        ...playerState,
                        hardware: { ...playerState.hardware, [hwItem.hardwareKey]: hwItem.stats }
                    });
                    output = `[SPAWN] Hardware '${spawnId}' swapped.`;
                } else if (spawnType === 'item') {
                    if (!spawnId) { output = "usage: spawn item [name]"; break; }
                    const newItem: VFSNode = { type: 'file', name: spawnId, content: '[DEV_ITEM]', size: 100 };
                    onPlayerStateChange({ ...playerState, inventory: [...playerState.inventory, newItem] });
                    output = `[SPAWN] Item '${spawnId}' added to inventory.`;
                } else if (spawnType === 'credits') {
                    const amt = parseInt(spawnId);
                    if (isNaN(amt)) { output = "usage: spawn credits [amount]"; break; }
                    onPlayerStateChange({ ...playerState, credits: amt });
                    output = `[SPAWN] Balance set to ${amt}c.`;
                } else {
                    output = "usage: spawn <software|hardware|item|credits>";
                }
                break;
            case 'debug-anim':
                const animType = args[0];
                if (animType === 'bios') {
                    if (onReboot) {
                        onReboot(playerState);
                    } else {
                        setHistory([]);
                        setHistory([<div key="reboot" className="text-white font-mono">REBOOTING... (BIOS DEBUG)</div>]);
                        setTimeout(() => setHistory(getWelcomeLines()), 2000);
                    }
                } else if (animType === 'panic') {
                    onPlayerStateChange({ ...playerState, systemHeat: 100 });
                } else if (animType === 'glitch') {
                    setIsTransitioning(true);
                    setTimeout(() => setIsTransitioning(false), 2000);
                    output = "[DEBUG] Glitch animation triggered.";
                } else if (animType === 'mission-in') {
                    if (onTransitionPreview) onTransitionPreview('entering');
                    output = "[DEBUG] Mission-In transition triggered.";
                } else if (animType === 'mission-out') {
                    if (onTransitionPreview) onTransitionPreview('aborting');
                    output = "[DEBUG] Mission-Out transition triggered.";
                } else {
                    output = "usage: debug-anim <bios|panic|glitch|mission-in|mission-out>";
                }
                break;
            case 'dev-set-load':
                // This is tricky because load is calculated. We can mock systemHeat.
                const cpuArg = args.indexOf('--cpu');
                if (cpuArg !== -1) {
                    const val = parseFloat(args[cpuArg + 1]);
                    if (!isNaN(val)) onPlayerStateChange({ ...playerState, systemHeat: val });
                }
                output = "[DEV] System load/heat adjusted.";
                break;
            case 'dev-reveal':
                if (onGameStateChange) {
                    const revealedNodes = gameState.nodes.map(n => ({ ...n, isDiscovered: true }));
                    onGameStateChange({ ...gameState, nodes: revealedNodes });
                    output = "[DEV] All network nodes revealed.";
                }
                break;
            case 'dev-reset':
                await writeSave('dev_save_slot', createInitialPlayerState());
                onPlayerStateChange({ ...createInitialPlayerState(), isDevMode: true });
                output = "[DEV] Sandbox reset to defaults.";
                break;
            case 'dev-mission':
                const tier = parseInt(args[0]) || 1;
                const config = { numNodes: tier + 1, difficultyMultiplier: tier };
                const fakeMission = {
                    id: `dev_${Date.now()}`,
                    title: `DEV OPS TIER ${tier}`,
                    difficulty: Math.min(5, Math.max(1, tier)) as 1 | 2 | 3 | 4 | 5,
                    reward: 0,
                    description: 'DEVELOPER SANDBOX MISSION',
                    targetNetworkConfig: config
                };
                onMissionAccept(fakeMission);
                output = `[DEV] Initializing Mission Tier ${tier}...`;
                break;
            case 'alias':
                if (args.length === 0) {
                    output = Object.entries(aliases).map(([key, value]) => `alias ${key}="${value}"`).join('\n');
                    break;
                }
                const aliasMatch = args.join(' ').match(/([^=]+)="([^"]+)"/);
                if (aliasMatch) {
                    const [, key, value] = aliasMatch;
                    const bashrcPath = resolvePath('~/.bashrc');
                    if (bashrcPath) {
                        const bashrcNode = getNodeByPath(bashrcPath) as VFSFile;
                        if (bashrcNode) {
                            bashrcNode.content += `\nalias ${key}="${value}"`;
                            setAliases(prev => ({ ...prev, [key]: value }));
                            if (onVFSChange) onVFSChange(vfs);
                        }
                    }
                } else {
                    output = "usage: alias [name]=\"[command]\"";
                }
                break;
            case 'sh':
                const scriptName = args[0];
                if (!scriptName) {
                    output = "usage: sh [file]";
                    break;
                }
                const scriptPath = resolvePath(scriptName);
                if (scriptPath) {
                    const scriptNode = getNodeByPath(scriptPath);
                    if (scriptNode?.type === 'file') {
                        const commands = scriptNode.content.split('\n').filter(Boolean);
                        const executeCommands = async () => {
                            for (const command of commands) {
                                if (command.startsWith('sh ')) {
                                    setHistory(prev => [...prev, <div className="text-red-500">Error: Recursive script execution is not allowed.</div>]);
                                    continue;
                                }
                                await processCommand(command);
                                await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay
                            }
                        };
                        executeCommands();
                    } else {
                        output = `sh: ${scriptName}: No such file or directory`;
                    }
                } else {
                    output = `sh: ${scriptName}: No such file or directory`;
                }
                break;
            case 'theme':
                const themeName = args[0];
                const availableThemes = playerState.inventory
                    .filter(item => item.name.startsWith('theme_') && item.name.endsWith('.tool'))
                    .map(item => item.name.replace('.tool', ''));

                if (!themeName) {
                    output = `Usage: theme [theme_name]\nAvailable themes: ${availableThemes.join(', ') || 'none'}`;
                    break;
                }

                const fullThemeId = themeName.startsWith('theme_') ? themeName : `theme_${themeName}`;

                if (availableThemes.includes(fullThemeId)) {
                    onPlayerStateChange({ ...playerState, theme: fullThemeId });
                    output = `Theme set to ${themeName}.`;
                } else {
                    output = `Theme '${themeName}' not purchased.`;
                }
                break;
            case 'settings':
                if (activeNode.id !== 'local' && activeNode.id !== 'localhost') {
                    output = <div className="text-red-500">Error: Settings can only be changed at Homebase.</div>;
                    break;
                }
                if (onOpenSettings) {
                    onOpenSettings();
                }
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
            const cmds = [...Object.keys(COMMAND_REGISTRY)];
            if (playerState.isDevMode) {
                cmds.push(...Object.keys(DEV_COMMAND_REGISTRY));
            }
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
    }, [currentPath, getNodeByPath, playerState.isDevMode]);


    if (playerState.systemHeat >= 100) {
        return <KernelPanic onReboot={onMissionAbort} />;
    }

    return (
        <div
            className={`w-full h-full flex flex-col p-10 text-lg font-vt323 crt-screen relative active-node-theme ${playerState.theme || themeColor} ${isTransitioning || (performance.isThrashing && !playerState.settings?.disableJitter) ? 'glitch-text blur-sm brightness-150' : ''} ${playerState.settings?.scanlines ? 'scanlines' : ''} ${playerState.settings?.flicker ? 'crt-flicker' : ''} ${playerState.settings?.chromaticAberration ? 'chromatic-aberration' : ''}`}
            style={{
                fontSize: playerState.settings?.fontSize || 16,
                transform: `scale(${playerState.settings?.scale || 1})`,
            }}
            onClick={() => {
                if (window.getSelection()?.toString() === '') {
                    inputRef.current?.focus();
                }
            }}
        >
            {/* System Status Bar */}
            <div className="flex justify-between items-center border-b border-green-900/30 pb-2 mb-4 font-mono text-xs tracking-widest uppercase opacity-70">
                <div className="flex gap-6">
                    <button
                        onClick={() => setShowTaskManager(!showTaskManager)}
                        className={`flex items-center gap-2 px-2 py-0.5 rounded transition-colors ${showTaskManager ? 'bg-cyan-900/50 text-cyan-400' : 'hover:bg-white/5'}`}
                    >
                        <span className={`w-1.5 h-1.5 rounded-full ${showTaskManager ? 'bg-cyan-400' : 'bg-green-500 animate-pulse'}`}></span>
                        {showTaskManager ? 'HIDE_MONITOR' : 'SYS: ONLINE'}
                    </button>

                    {isTutorialActive ? (
                        <button
                            onClick={exitTutorial}
                            className="bg-red-900/30 text-red-400 px-2 py-0.5 rounded border border-red-500/30 hover:bg-red-900/50 transition-all animate-pulse"
                        >
                            EXIT SIMULATION
                        </button>
                    ) : (
                        <span>MODE: {isMissionActive ? 'MISSION_OPS' : 'HOMEBASE'}</span>
                    )}
                    <span className={`flex items-center gap-2 ${playerState.systemHeat > 80 ? 'text-red-500 animate-pulse' : 'text-gray-400'}`}>
                        TEMP: {playerState.systemHeat.toFixed(1)}°C
                    </span>
                    <span className={`flex items-center gap-2 ${isDiskActive ? 'text-amber-500 animate-pulse' : 'text-gray-600'}`}>
                        <span className={`w-2 h-2 rounded-full ${isDiskActive ? 'bg-amber-500 shadow-[0_0_5px_#f59e0b]' : 'bg-gray-800'}`}></span>
                        DISK
                    </span>
                    <span className={`${performance.isThrashing ? 'text-red-500 animate-pulse' : 'text-gray-400'}`}>
                        RAM: {performance.ramUsed.toFixed(1)}/{performance.ramCapacity}GB
                    </span>
                    <span className={`${(performance.storageUsed / performance.storageCapacity) > 0.9 ? 'text-red-500' : 'text-gray-400'}`}>
                        DISK: {(performance.storageUsed / (1024 * 1024)).toFixed(2)}/{(performance.storageCapacity / (1024 * 1024)).toFixed(2)} GB
                    </span>
                    {isMissionActive && (
                        <span className="flex items-center gap-2">
                            TRACE:
                            <div className="w-32 h-2 bg-gray-800 border border-gray-700 relative overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-500 ${gameState.traceProgress > 75 ? 'bg-red-500' : gameState.traceProgress > 40 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                    style={{ width: `${gameState.traceProgress}%` }}
                                ></div>
                                {gameState.traceProgress > 50 && (
                                    <div className="absolute inset-0 bg-red-500/20 animate-pulse"></div>
                                )}
                            </div>
                            <span className={gameState.traceProgress > 75 ? 'text-red-500 animate-pulse' : 'text-gray-400'}>
                                {gameState.traceProgress}%
                            </span>
                        </span>
                    )}
                </div>
                <div className="text-yellow-500 font-bold bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20 shadow-[0_0_10px_rgba(234,179,8,0.2)]">
                    BAL: {playerState.credits.toLocaleString()} CR
                </div>
            </div>

            <div className="flex-grow relative overflow-hidden flex flex-col">
                {showTaskManager && (
                    <div className="absolute top-0 right-0 w-80 h-full z-20 p-2">
                        <TaskManager
                            playerState={playerState}
                            performance={performance}
                            activeProcesses={activeProcesses}
                            onKill={(id) => setActiveProcesses(prev => prev.filter(p => p.id !== id))}
                        />
                    </div>
                )}
                <div className="flex-grow overflow-y-auto pr-2 pl-2 custom-scrollbar">
                    {history.map((line, i) => <div key={i} className="mb-1 leading-tight break-words">{line}</div>)}
                    <div ref={terminalEndRef} />
                </div>
            </div>
            {isTutorialActive && currentTutorialStep && (
                <TutorialOverlay message={currentTutorialStep.message} />
            )}
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
                    playerState={playerState}
                />
            )}
        </div>
    );
};


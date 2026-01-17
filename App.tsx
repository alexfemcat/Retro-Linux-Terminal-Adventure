import React, { useState, useEffect, useCallback } from 'react';
import { Terminal } from './components/Terminal';
import { puzzleGenerator } from './services/puzzleGenerator';
import { missionGenerator } from './services/MissionGenerator';
import { writeSave, autoSavePlayerState } from './services/PersistenceService';
import { HardwareService } from './services/HardwareService';
import { DebugOverlay } from './components/DebugOverlay';
import { MissionTransition } from './components/MissionTransition';
import TitleScreen from './components/TitleScreen';
import BIOSBoot from './components/BIOSBoot';
import type { GameState, PlayerState, Directory } from './types';
import { usePerformance } from './hooks/usePerformance';
import { NewsTicker } from './components/NewsTicker';
import { Settings } from './components/Settings';

const App: React.FC = () => {
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [playerState, setPlayerState] = useState<PlayerState | null>(null);
    const [bootingPlayerState, setBootingPlayerState] = useState<PlayerState | null>(null);
    const [gameId, setGameId] = useState<number>(1);
    const [gameWon, setGameWon] = useState<boolean>(false);
    const [winMessage, setWinMessage] = useState<React.ReactNode[]>([]);
    const [showTitleScreen, setShowTitleScreen] = useState<boolean>(true);
    const [isBooting, setIsBooting] = useState<boolean>(false);
    const [isMissionActive, setIsMissionActive] = useState<boolean>(false);

    const [currentPath, setCurrentPath] = useState<string[]>(['home', 'user']);
    const [currentUser, setCurrentUser] = useState<'user' | 'root'>('user');

    const [showDebug, setShowDebug] = useState<boolean>(false);
    const [activeProcesses, setActiveProcesses] = useState<{ id: string; name: string; ram: number }[]>([]);

    const [transition, setTransition] = useState<{ type: 'entering' | 'aborting', mission?: any } | null>(null);
    const [worldEvent, setWorldEvent] = useState<any | null>(null);
    const [showSettings, setShowSettings] = useState<boolean>(false);

    const performance = usePerformance(playerState, activeProcesses);

    const startNewGame = useCallback((initialPlayerState: PlayerState) => {
        // Initialize missions if needed
        if (!initialPlayerState.availableMissions || initialPlayerState.availableMissions.length === 0) {
            initialPlayerState.availableMissions = missionGenerator.generateMissions(initialPlayerState.reputation);
        }

        // By default, start at Homebase
        const newGameState = puzzleGenerator.generateHomebase(initialPlayerState);
        setGameState(newGameState);
        setPlayerState(initialPlayerState);
        setIsMissionActive(false);

        setCurrentPath(['home', 'user']);
        setCurrentUser('user');

        setGameWon(false);
        setWinMessage([]);
        setGameId(id => id + 1);
    }, []);

    const handleMissionAccept = useCallback((mission: any) => {
        setTransition({ type: 'entering', mission });
    }, []);

    const completeMissionAccept = useCallback((mission: any) => {
        // Transition to Mission Mode
        const missionGameState = puzzleGenerator.generateNetwork(mission.targetNetworkConfig);
        setGameState(missionGameState);
        setIsMissionActive(true);

        setPlayerState(prev => prev ? { ...prev, activeMissionId: mission.id } : null);

        setCurrentPath(['home', 'user']);
        setCurrentUser('user');
        setGameId(id => id + 1); // Reset terminal history for mission
        setTransition(null);
    }, []);

    const handleMissionAbort = useCallback(() => {
        setTransition({ type: 'aborting' });
    }, []);

    const completeMissionAbort = useCallback(() => {
        if (playerState) {
            const updatedPlayerState = {
                ...playerState,
                activeMissionId: null,
                missionInventory: []
            };
            setPlayerState(updatedPlayerState);
            startNewGame(updatedPlayerState);

            // Auto-save (respect dev mode)
            const slotId = playerState.isDevMode ? 'dev_save_slot' : (localStorage.getItem('active-save-slot') || 'slot_1');
            writeSave(slotId, updatedPlayerState);
        }
        setTransition(null);
    }, [playerState, startNewGame]);

    const handleGameLoad = useCallback((loadedPlayerState: PlayerState, slotId: string) => {
        localStorage.setItem('active-save-slot', slotId);

        // If the player is in a tutorial, don't persist that state on refresh.
        if (loadedPlayerState.activeMissionId === 'tutorial') {
            loadedPlayerState.activeMissionId = null;
            delete loadedPlayerState.tutorialStep;
        }

        setBootingPlayerState(loadedPlayerState);
        setIsBooting(true);
    }, []);

    const handleBootComplete = useCallback(() => {
        if (bootingPlayerState) {
            startNewGame(bootingPlayerState);
            setShowTitleScreen(false);
            setIsBooting(false);
            setBootingPlayerState(null);
        }
    }, [bootingPlayerState, startNewGame]);

    const handleTransitionComplete = useCallback(() => {
        if (!transition) return;
        if (transition.mission?.isPreview) {
            setTransition(null);
        } else {
            if (transition.type === 'entering') {
                completeMissionAccept(transition.mission);
            } else {
                completeMissionAbort();
            }
        }
    }, [transition, completeMissionAccept, completeMissionAbort]);

    const handleReboot = useCallback((targetPlayerState: PlayerState) => {
        setBootingPlayerState(targetPlayerState);
        setIsBooting(true);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'F2') {
                setShowDebug(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Hardware Simulation Heartbeat
    useEffect(() => {
        if (!playerState || showTitleScreen) return;

        const interval = setInterval(() => {
            setPlayerState(prev => {
                if (!prev) return null;

                const heatDelta = HardwareService.calculateHeatDelta(prev, activeProcesses.length);
                let newHeat = Math.max(0, prev.systemHeat + heatDelta);

                // Handle Overheat
                if (newHeat >= 100) {
                    // Trigger System Crash
                    newHeat = 100;
                    // We'll let the Terminal UI handle the visual crash before aborting
                }

                // Check for Degradation
                if (newHeat > 95 && HardwareService.shouldDegrade(newHeat)) {
                    const { updatedState, degradedComponent } = HardwareService.degradeHardware(prev);
                    // We might want to alert the user here, but for now just update state
                    console.warn(`CRITICAL HEAT: ${degradedComponent} DEGRADED!`);
                    return { ...updatedState, systemHeat: newHeat };
                }

                return { ...prev, systemHeat: newHeat };
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [playerState === null, showTitleScreen, activeProcesses.length]);

    useEffect(() => {
        if (playerState) {
            autoSavePlayerState(playerState);
        }
    }, [playerState]);

    const handleWin = () => {
        if (!playerState) return;

        const activeMission = playerState.availableMissions.find(m => m.id === playerState.activeMissionId);
        const reward = activeMission?.reward || 0;
        const repGain = (activeMission?.difficulty || 1) * 20;

        const lines = [
            '>>> ACCESS GRANTED. ROOT PRIVILEGES OBTAINED.',
            '>>> MISSION OBJECTIVE SECURED.',
            `>>> REWARD: ${reward} CREDITS RECEIVED.`,
            `>>> REPUTATION: +${repGain} XP.`,
            '>>> NETWORK TRACE DELETED.',
            '>>> SYSTEM SHUTDOWN IMMINENT...',
            '----------------------------------------',
            'MISSION ACCOMPLISHED.',
            '----------------------------------------',
        ];

        setGameWon(true);

        const updatedPlayerState: PlayerState = {
            ...playerState,
            credits: playerState.credits + reward,
            reputation: playerState.reputation + repGain,
            activeMissionId: null,
            availableMissions: missionGenerator.generateMissions(playerState.reputation + repGain),
            inventory: [...playerState.inventory, ...(playerState.missionInventory || [])],
            missionInventory: []
        };

        // Auto-save immediately
        const slotId = localStorage.getItem('active-save-slot') || 'slot_1';
        writeSave(slotId, updatedPlayerState);

        let i = 0;
        const interval = setInterval(() => {
            if (i < lines.length) {
                setWinMessage(prev => [...prev, <div key={i}>{lines[i]}</div>]);
                i++;
            } else {
                clearInterval(interval);
            }
        }, 300);

        setPlayerState(updatedPlayerState);
    };

    if (isBooting && bootingPlayerState) {
        return <BIOSBoot hardware={bootingPlayerState.hardware} onComplete={handleBootComplete} />;
    }

    if (showTitleScreen) {
        return <TitleScreen onGameLoad={handleGameLoad} />;
    }

    if (!gameState || !playerState) {
        return (
            <div className="flex items-center justify-center h-screen text-2xl">
                Loading Retro Terminal Adventure...
            </div>
        );
    }

    const activeNode = gameState.nodes[gameState.activeNodeIndex];

    return (
        <div className="w-screen h-screen bg-[#111] flex items-center justify-center overflow-hidden relative">
            <NewsTicker onEvent={setWorldEvent} />
            {transition && (
                <MissionTransition
                    type={transition.type}
                    missionData={transition.mission}
                    onComplete={handleTransitionComplete}
                />
            )}
            {showSettings && playerState && (
                <Settings
                    playerState={playerState}
                    onPlayerStateChange={setPlayerState}
                    onClose={() => setShowSettings(false)}
                />
            )}
            {!gameWon ? (
                <>
                    {/* CRT Monitor Container */}
                    <div className="relative bg-[#2c2c2c] p-8 rounded-[30px] shadow-[0_0_50px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(0,0,0,1)] border-t-2 border-l-2 border-[#444] border-b-4 border-r-4 border-[#111]">

                        {/* Screen Bezel Branding */}
                        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 text-[#111] font-bold font-sans text-xs tracking-widest opacity-50 shadow-[0_1px_0_rgba(255,255,255,0.1)]">
                            RETRO-VISION 2000
                        </div>

                        {/* Power LED */}
                        <div className="absolute bottom-4 right-8 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_5px_red] animate-pulse"></div>

                        {/* The Terminal Screen (HD size: 960x720) */}
                        <div className="w-[960px] h-[720px] bg-black rounded-[20px] overflow-hidden relative shadow-[inset_0_0_20px_rgba(0,0,0,1)]">
                            {/* Screen Reflection/Glare Overlay */}
                            <div className="absolute inset-0 pointer-events-none z-50 bg-gradient-to-tr from-transparent via-[rgba(255,255,255,0.03)] to-transparent rounded-[20px]"></div>

                            <Terminal
                                key={gameId}
                                gameState={gameState} // Pass FULL gameState so Terminal can see all nodes for SSH/Ping
                                activeNode={activeNode} // Explicitly pass active node
                                playerState={playerState!}
                                performance={performance}
                                isMissionActive={isMissionActive}
                                activeProcesses={activeProcesses}
                                setActiveProcesses={setActiveProcesses}
                                onWin={handleWin}
                                onGameStateChange={setGameState}
                                onTransitionPreview={(type) => {
                                    setTransition({
                                        type,
                                        mission: {
                                            title: 'PREVIEW MODE',
                                            difficulty: 3,
                                            reward: 9999,
                                            description: 'THIS IS A VISUAL PREVIEW OF THE TRANSITION SYSTEM.',
                                            isPreview: true
                                        }
                                    });
                                }}
                                onMissionAccept={handleMissionAccept}
                                onMissionAbort={handleMissionAbort}
                                onPlayerStateChange={setPlayerState}
                                currentPath={currentPath}
                                setCurrentPath={setCurrentPath}
                                currentUser={currentUser}
                                setCurrentUser={setCurrentUser}
                                onVFSChange={(newVFS) => {
                                    if (gameState) {
                                        const newNodes = [...gameState.nodes];
                                        newNodes[gameState.activeNodeIndex] = {
                                            ...newNodes[gameState.activeNodeIndex],
                                            vfs: newVFS as Directory
                                        };
                                        setGameState({ ...gameState, nodes: newNodes });
                                    }
                                }}
                                onNodeChange={(index) => {
                                    // Handle Node Switch
                                    setGameState({ ...gameState, activeNodeIndex: index });
                                    // Reset path for new node logic could go here
                                    setCurrentPath(['home', 'user']);
                                    setCurrentUser('user');
                                }}
                                onReboot={handleReboot}
                                worldEvent={worldEvent}
                                onOpenSettings={() => setShowSettings(true)}
                            />
                            <button onClick={() => setShowSettings(true)} className="absolute top-4 right-4 text-xs text-gray-500 hover:text-white">SETTINGS</button>
                        </div>
                    </div>

                    {/* Debug Overlay - Positioned Absolutely to the right */}
                    <div className={`absolute right-8 top-1/2 transform -translate-y-1/2 w-96 h-[640px] transition-opacity duration-300 z-[100] ${showDebug ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                        {playerState && (
                            <DebugOverlay
                                gameState={gameState}
                                activeNode={activeNode}
                                playerState={playerState}
                                isMissionActive={isMissionActive}
                                onPlayerStateChange={(s) => setPlayerState(s)}
                                onGameStateChange={(s) => setGameState(s)}
                                onWin={handleWin}
                                onAbort={handleMissionAbort}
                            />
                        )}
                    </div>
                </>
            ) : (
                <div className="w-[960px] h-[720px] flex flex-col items-center justify-center text-2xl md:text-3xl text-center space-y-4 crt-screen p-8 bg-black rounded-[20px] text-[#33ff00] border-4 border-[#33ff00]/30 shadow-[0_0_30px_#33ff0055]">
                    <div className="space-y-2">
                        {winMessage}
                    </div>
                    <button
                        onClick={() => startNewGame(playerState!)}
                        className="mt-8 px-6 py-2 border-2 border-[#33ff00] hover:bg-[#33ff00] hover:text-black transition-colors duration-300 text-xl font-bold uppercase tracking-wider"
                    >
                        Reboot System
                    </button>
                </div>
            )}
        </div>
    );
};

export default App;

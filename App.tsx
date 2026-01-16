
import React, { useState, useEffect, useCallback } from 'react';
import { Terminal } from './components/Terminal';
import { puzzleGenerator } from './services/puzzleGenerator';
import { DebugOverlay } from './components/DebugOverlay';
import type { GameState } from './types';

const App: React.FC = () => {
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [gameId, setGameId] = useState<number>(1);
    const [gameWon, setGameWon] = useState<boolean>(false);
    const [winMessage, setWinMessage] = useState<React.ReactNode[]>([]);

    // Path and User are now derived from the VALID Active Node, but for local state we
    // might need to track them if they can change *per node*. 
    // Actually, 'currentUser' and 'currentPath' are specific to the user's session 
    // on that specific node.
    // For simplicity, let's keep them as React state, but they reset when node changes?
    // OR we store them IN the node state in GameState? 
    // The plan said "Game Generation" creates nodes.
    // Let's assume we maintain 'currentPath' and 'currentUser' for the *active view*.

    const [currentPath, setCurrentPath] = useState<string[]>(['home', 'user']);
    const [currentUser, setCurrentUser] = useState<'user' | 'root'>('user');

    const [showDebug, setShowDebug] = useState<boolean>(false);

    const startNewGame = useCallback(() => {
        const newGameState = puzzleGenerator.generateNewGame();
        setGameState(newGameState);

        // Reset view to local node (Index 0)
        const localNode = newGameState.nodes[0];
        setCurrentPath(['home', 'user']);
        setCurrentUser(localNode.currentUser || 'user');

        setGameWon(false);
        setWinMessage([]);
        setGameId(id => id + 1);
    }, []);

    useEffect(() => {
        startNewGame();
    }, [startNewGame]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'F2') {
                setShowDebug(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Effect to handle Node Switching (e.g. if we add a callback for SSH later)
    useEffect(() => {
        if (gameState) {
            // In a real app we might want to persits path per node, but for now
            // resetting to ~ is fine or keeping it if we want.
            // Actually, let's just make sure the Terminal receives the RIGHT stuff.
        }
    }, [gameState?.activeNodeIndex]);

    const handleWin = () => {
        const lines = [
            '>>> ACCESS GRANTED. ROOT PRIVILEGES OBTAINED.',
            '>>> MISSION OBJECTIVE SECURED.',
            '>>> NETWORK TRACE DELETED.',
            '>>> SYSTEM SHUTDOWN IMMINENT...',
            '----------------------------------------',
            'MISSION ACCOMPLISHED.',
            '----------------------------------------',
        ];

        setGameWon(true);

        let i = 0;
        const interval = setInterval(() => {
            if (i < lines.length) {
                setWinMessage(prev => [...prev, <div key={i}>{lines[i]}</div>]);
                i++;
            } else {
                clearInterval(interval);
            }
        }, 300);
    };

    if (!gameState) {
        return (
            <div className="flex items-center justify-center h-screen text-2xl">
                Loading Retro Terminal Adventure...
            </div>
        );
    }

    const activeNode = gameState.nodes[gameState.activeNodeIndex];

    return (
        <div className="w-screen h-screen bg-[#111] flex items-center justify-center overflow-hidden relative">
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
                                onWin={handleWin}
                                currentPath={currentPath}
                                setCurrentPath={setCurrentPath}
                                currentUser={currentUser}
                                setCurrentUser={setCurrentUser}
                                onNodeChange={(index) => {
                                    // Handle Node Switch
                                    setGameState({ ...gameState, activeNodeIndex: index });
                                    // Reset path for new node logic could go here
                                    setCurrentPath(['home', 'user']);
                                    setCurrentUser('user');
                                }}
                            />
                        </div>
                    </div>

                    {/* Debug Overlay - Positioned Absolutely to the right */}
                    <div className={`absolute right-8 top-1/2 transform -translate-y-1/2 w-80 h-[600px] transition-opacity duration-300 ${showDebug ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                        <DebugOverlay gameState={gameState} activeNode={activeNode} />
                    </div>
                </>
            ) : (
                <div className="w-[960px] h-[720px] flex flex-col items-center justify-center text-2xl md:text-3xl text-center space-y-4 crt-screen p-8 bg-black rounded-[20px] text-[#33ff00] border-4 border-[#33ff00]/30 shadow-[0_0_30px_#33ff0055]">
                    <div className="space-y-2">
                        {winMessage}
                    </div>
                    <button
                        onClick={startNewGame}
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

import React, { useState, useEffect, useCallback } from 'react';
import { Terminal } from './components/Terminal';
import { puzzleGenerator } from './services/puzzleGenerator';
import type { GameState } from './types';

const App: React.FC = () => {
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [gameId, setGameId] = useState<number>(1);
    const [gameWon, setGameWon] = useState<boolean>(false);
    const [winMessage, setWinMessage] = useState<React.ReactNode[]>([]);
    const [currentPath, setCurrentPath] = useState<string[]>(['home', 'user']);

    const startNewGame = useCallback(() => {
        const newGameState = puzzleGenerator.generateNewGame();
        setGameState(newGameState);
        setCurrentPath(['home', 'user']);
        setGameWon(false);
        setWinMessage([]);
        setGameId(id => id + 1);
    }, []);

    useEffect(() => {
        startNewGame();
    }, [startNewGame]);

    const handleWin = () => {
        const lines = [
            '>>> ACCESS GRANTED. TARGET FILE DECRYPTED.',
            '>>> PAYLOAD EXTRACTED.',
            '>>> CLEANING TRACES...',
            '>>> DISCONNECTING FROM HOST...',
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

    return (
        <div className="w-screen h-screen p-4">
            {!gameWon ? (
                <div className="w-full h-full">
                    <Terminal
                        key={gameId}
                        gameState={gameState}
                        onWin={handleWin}
                        currentPath={currentPath}
                        setCurrentPath={setCurrentPath}
                    />
                </div>
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-2xl md:text-4xl text-center space-y-4 crt-screen border-2 border-[#33ff00]/50 p-8">
                    <div className="space-y-2">
                        {winMessage}
                    </div>
                    {/* FIX: Corrected typo 'startNewG ame' to 'startNewGame' in the button's onClick handler. */}
                    <button
                        onClick={startNewGame}
                        className="mt-8 px-6 py-2 border-2 border-[#33ff00] hover:bg-[#33ff00] hover:text-black transition-colors duration-300 text-2xl"
                    >
                        Play Again
                    </button>
                </div>
            )}
        </div>
    );
};

export default App;
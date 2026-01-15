
import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { GameState, VFSNode } from '../types';

interface TerminalProps {
    gameState: GameState;
    onWin: () => void;
    currentPath: string[];
    setCurrentPath: (path: string[]) => void;
}

const getPathDisplay = (currentPath: string[]) => {
    const path = `/${currentPath.join('/')}`;
    if (path === '/home/user') return '~';
    if (path.startsWith('/home/user/')) return `~/${currentPath.slice(2).join('/')}`;
    return path;
};

const InputLine: React.FC<{
    currentPath: string[];
    onSubmit: (command: string) => void;
    inputRef: React.RefObject<HTMLInputElement>;
    commandHistory: string[];
}> = ({ currentPath, onSubmit, inputRef, commandHistory }) => {
    const [value, setValue] = useState('');
    const [historyIndex, setHistoryIndex] = useState(-1);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(value);
        setValue('');
        setHistoryIndex(-1);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (commandHistory.length > 0) {
                const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
                setHistoryIndex(newIndex);
                setValue(commandHistory[commandHistory.length - 1 - newIndex]);
            }
        } else if (e.key === 'ArrowDown') {
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
            <label htmlFor="command-input" className="flex-shrink-0">
                <span className="text-green-400">user@retro-term</span>
                <span className="text-gray-400">:</span>
                <span className="text-blue-400">{pathString}</span>
                <span className="text-gray-400">$</span>
            </label>
            <input
                ref={inputRef}
                id="command-input"
                type="text"
                className="flex-grow bg-transparent border-none outline-none pl-2 text-inherit"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
            />
            <div className="w-2 h-6 bg-[#33ff00] blinking-cursor"></div>
        </form>
    );
};


export const Terminal: React.FC<TerminalProps> = ({ gameState, onWin, currentPath, setCurrentPath }) => {
    const [history, setHistory] = useState<React.ReactNode[]>([]);
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const terminalEndRef = useRef<HTMLDivElement>(null);

    const { vfs, scenario, objective } = gameState;

    useEffect(() => {
        const welcomeLines = scenario.welcomeMessage.split('\n').map((line, i) => <div key={`welcome-${i}`}>{line}</div>);
        setHistory(welcomeLines);
    }, [scenario.welcomeMessage]);

    useEffect(() => {
        terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const resolvePath = useCallback((pathStr: string): string[] | null => {
        if (!pathStr) return currentPath;

        let effectivePathStr = pathStr;
        if (pathStr.startsWith('~')) {
            effectivePathStr = pathStr.replace('~', '/home/user');
        }

        const parts = effectivePathStr.split('/').filter(p => p);
        let newPath: string[] = [];

        if (effectivePathStr.startsWith('/')) {
            newPath = [];
        } else {
            newPath = [...currentPath];
        }

        for (const part of parts) {
            if (part === '.') {
                continue;
            } else if (part === '..') {
                if (newPath.length > 0) {
                    newPath.pop();
                }
            } else {
                newPath.push(part);
            }
        }

        // Validate path
        let node: VFSNode = vfs;
        for (const part of newPath) {
            if (node.type === 'directory' && node.children[part]) {
                node = node.children[part];
            } else {
                return null; // Invalid path
            }
        }

        return newPath;

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

    const processCommand = (command: string) => {
        const trimmedCommand = command.trim();
        if (trimmedCommand) {
            setCommandHistory(prev => [...prev, trimmedCommand]);
        }

        const [cmd, ...args] = trimmedCommand.split(/\s+/).filter(Boolean);
        let output: React.ReactNode = `command not found: ${cmd}`;

        if (!cmd) {
            output = null;
        } else {
            switch (cmd) {
                case 'help':
                    const helpText = `
COMMAND      USAGE                   DESCRIPTION
----------------------------------------------------------------------------
help         help                    Shows this list of commands.
ls           ls [-a]                 Lists files and directories. Use '-a' for hidden files.
cd           cd [directory]          Changes directory. Use '..' to go up a level.
cat          cat [file]              Displays the content of a file.
pwd          pwd                     Prints the current working directory path.
grep         grep [term] [file]      Searches for a specific 'term' within a 'file'.
clear        clear                   Clears all text from the terminal screen.`;
                    output = <div className="whitespace-pre-wrap">{helpText.trim()}</div>;
                    break;
                case 'clear':
                    const welcomeLines = scenario.welcomeMessage.split('\n').map((line, i) => <div key={`welcome-${i}`}>{line}</div>);
                    setHistory(welcomeLines);
                    output = null;
                    break;
                case 'pwd':
                    output = `/${currentPath.join('/')}`;
                    break;
                case 'ls':
                    const node = getNodeByPath(currentPath);
                    if (node?.type === 'directory') {
                        const showHidden = args.includes('-a');
                        let children = (Object.values(node.children) as VFSNode[]);

                        if (showHidden) {
                            const hiddenEntries: VFSNode[] = [
                                { name: '.', type: 'directory', children: {} },
                                { name: '..', type: 'directory', children: {} },
                            ];
                            children = [...hiddenEntries, ...children];
                        } else {
                            children = children.filter(child => !child.name.startsWith('.'));
                        }

                        output = (
                            <div className="grid grid-cols-3 gap-x-4">
                                {children.map(child => (
                                    <span key={child.name} className={child.type === 'directory' ? 'text-blue-400' : ''}>
                                        {child.name}
                                    </span>
                                ))}
                            </div>
                        );
                    } else {
                        output = `ls: cannot access '${currentPath.join('/')}': Not a directory`;
                    }
                    break;
                case 'cd':
                    const targetPath = resolvePath(args[0] || '/home/user');
                    if (targetPath) {
                        const targetNode = getNodeByPath(targetPath);
                        if (targetNode && targetNode.type === 'directory') {
                            setCurrentPath(targetPath);
                            output = null;
                        } else {
                            output = `cd: no such file or directory: ${args[0]}`;
                        }
                    } else {
                        output = `cd: no such file or directory: ${args[0]}`;
                    }
                    break;
                case 'cat':
                    const catPath = resolvePath(args[0]);
                    if (catPath) {
                        const fileNode = getNodeByPath(catPath);
                        if (fileNode?.type === 'file') {
                            output = <div className="whitespace-pre-wrap">{fileNode.content}</div>;
                            const isWin = fileNode.name === objective.fileName && JSON.stringify(catPath.slice(0, -1)) === JSON.stringify(objective.filePath);
                            if (isWin) {
                                onWin();
                            }
                        } else {
                            output = `cat: ${args[0]}: Is a directory or does not exist`;
                        }
                    } else {
                        output = `cat: ${args[0]}: No such file or directory`;
                    }
                    break;
                case 'grep':
                    if (args.length < 2) {
                        output = 'usage: grep [term] [file]';
                        break;
                    }
                    const [term, ...fileParts] = args;
                    const grepPath = resolvePath(fileParts.join(' '));
                    if (grepPath) {
                        const fileNode = getNodeByPath(grepPath);
                        if (fileNode?.type === 'file') {
                            const matchingLines = fileNode.content.split('\n').filter(line => line.includes(term));
                            output = <div className="whitespace-pre-wrap">{matchingLines.join('\n')}</div>;
                        } else {
                            output = `grep: ${fileParts.join(' ')}: Is a directory or does not exist`;
                        }
                    } else {
                        output = `grep: ${fileParts.join(' ')}: No such file or directory`;
                    }
                    break;
            }
        }

        const pathString = getPathDisplay(currentPath);
        const inputHistory = (
            <div className="flex">
                <span className="text-green-400">user@retro-term</span>
                <span className="text-gray-400">:</span>
                <span className="text-blue-400">{pathString}</span>
                <span className="text-gray-400">$</span>
                <span className="pl-2">{command}</span>
            </div>
        );

        setHistory(prev => [...prev, inputHistory, ...(output ? [output] : [])]);
    };

    return (
        <div
            className="w-full h-full flex flex-col p-4 text-xl border-2 border-[#33ff00]/50 crt-screen relative overflow-hidden"
            onClick={() => inputRef.current?.focus()}
        >
            <div className="flex-grow overflow-y-auto pr-2">
                {history.map((line, i) => <div key={i} className="mb-1">{line}</div>)}
                <div ref={terminalEndRef} />
            </div>
            <InputLine
                currentPath={currentPath}
                onSubmit={processCommand}
                inputRef={inputRef}
                commandHistory={commandHistory}
            />
        </div>
    );
};

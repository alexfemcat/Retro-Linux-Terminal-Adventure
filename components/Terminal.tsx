
import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { GameState, VFSNode } from '../types';

interface TerminalProps {
    gameState: GameState;
    onWin: () => void;
    currentPath: string[];
    setCurrentPath: (path: string[]) => void;
    currentUser: 'user' | 'root';
    setCurrentUser: (user: 'user' | 'root') => void;
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
    onSubmit: (command: string) => void;
    onTab: (value: string, setValue: (v: string) => void) => void;
    getCompletion: (value: string) => string | null;
    inputRef: React.RefObject<HTMLInputElement>;
    commandHistory: string[];
}> = ({ currentPath, currentUser, onSubmit, onTab, getCompletion, inputRef, commandHistory }) => {
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
        if (e.key === 'Tab') {
            e.preventDefault();
            if (suggestion) {
                setValue(suggestion + (suggestion.endsWith('/') ? '' : ' '));
            } else {
                onTab(value, setValue);
            }
        } else if (e.key === 'ArrowUp') {
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
                <span className="text-green-400">{currentUser}@retro-term</span>
                <span className="text-gray-400">:</span>
                <span className="text-blue-400">{pathString}</span>
                <span className="text-gray-400">{currentUser === 'root' ? '#' : '$'}</span>
            </label>
            <div className="flex-grow relative overflow-hidden h-6">
                {suggestion && suggestion.startsWith(value) && value.length > 0 && (
                    <div
                        className="absolute left-0 top-0 pl-2 text-gray-500 pointer-events-none whitespace-pre z-0"
                        style={{ textShadow: 'none' }}
                    >
                        {suggestion}
                    </div>
                )}
                <input
                    ref={inputRef}
                    id="command-input"
                    type="text"
                    className="absolute left-0 top-0 w-full bg-transparent border-none outline-none pl-2 text-inherit z-10"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    autoComplete="off"
                    autoCapitalize="off"
                    autoCorrect="off"
                />
            </div>
            <div className="w-2 h-6 bg-[#33ff00] blinking-cursor shrink-0"></div>
        </form >
    );
};


export const Terminal: React.FC<TerminalProps> = ({
    gameState,
    onWin,
    currentPath,
    setCurrentPath,
    currentUser,
    setCurrentUser
}) => {
    const [history, setHistory] = useState<React.ReactNode[]>([]);
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const [isSudoEntering, setIsSudoEntering] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const terminalEndRef = useRef<HTMLDivElement>(null);

    const { vfs, scenario, objective, rootPassword } = gameState;

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
        if (!isSudoEntering && trimmedCommand) {
            setCommandHistory(prev => [...prev, trimmedCommand]);
        }

        if (isSudoEntering) {
            setIsSudoEntering(false);
            if (trimmedCommand === rootPassword) {
                setCurrentUser('root');
                setHistory(prev => [...prev, <div key={Date.now() + 1} className="text-yellow-400">Access granted. You are now root.</div>]);
            } else {
                setHistory(prev => [...prev, <div key={Date.now() + 1} className="text-red-500">Sorry, try again.</div>]);
            }
            return;
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
whoami       whoami                  Print the current user name.
sudo         sudo                    Gain root privileges (requires password).
grep         grep [term] [file]      Searches for a specific 'term' within a 'file'.
decoder.exe  ./decoder.exe [file]    Decrypts a .crypt file.
clear        clear                   Clears all text from the terminal screen.`;
                    output = <div className="whitespace-pre-wrap">{helpText.trim()}</div>;
                    break;
                case 'whoami':
                    output = currentUser;
                    break;
                case 'sudo':
                    setIsSudoEntering(true);
                    output = "[sudo] password for user: ";
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
                        if (node.permissions === 'root' && currentUser !== 'root') {
                            output = `ls: cannot open directory '.': Permission denied`;
                            break;
                        }

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
                            <div className="flex flex-wrap gap-x-6 gap-y-1">
                                {children.map(child => (
                                    <span
                                        key={child.name}
                                        className={`${child.type === 'directory' ? 'text-slate-400 font-bold' : 'text-white'} ${child.permissions === 'root' ? 'opacity-70 italic' : ''}`}
                                        style={{ textShadow: child.type === 'directory' ? 'none' : '0 0 5px rgba(255,255,255,0.5)' }}
                                    >
                                        {child.name}{child.type === 'directory' ? '/' : ''}{child.permissions === 'root' ? ' [root]' : ''}
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
                            if (targetNode.permissions === 'root' && currentUser !== 'root') {
                                output = `-bash: cd: ${args[0]}: Permission denied`;
                            } else {
                                setCurrentPath(targetPath);
                                output = null;
                            }
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
                            if (fileNode.permissions === 'root' && currentUser !== 'root') {
                                output = `cat: ${args[0]}: Permission denied`;
                            } else if (fileNode.isEncrypted) {
                                output = `Error: File '${args[0]}' is encrypted. Access requires decoder.exe.`;
                            } else {
                                output = <div className="whitespace-pre-wrap">{fileNode.content}</div>;
                                const isWin = fileNode.name === objective.fileName && JSON.stringify(catPath.slice(0, -1)) === JSON.stringify(objective.filePath);
                                if (isWin) {
                                    onWin();
                                }
                            }
                        } else {
                            output = `cat: ${args[0]}: Is a directory or does not exist`;
                        }
                    } else {
                        output = `cat: ${args[0]}: No such file or directory`;
                    }
                    break;
                case './decoder.exe':
                case '/bin/decoder.exe':
                case 'decoder.exe':
                    if (args.length < 1) {
                        output = "Usage: decoder.exe <file.crypt>";
                        break;
                    }
                    const decPath = resolvePath(args[0]);
                    if (decPath) {
                        const fileNode = getNodeByPath(decPath);
                        if (fileNode?.type === 'file') {
                            if (!fileNode.isEncrypted) {
                                output = `decoder: ${args[0]}: File is not encrypted.`;
                            } else {
                                output = (
                                    <div className="text-yellow-400">
                                        <div className="mb-2">{">>>"} ANALYZING ENCRYPTION LAYER... DONE.</div>
                                        <div className="mb-2">{">>>"} BYPASSING CIPHER... DONE.</div>
                                        <div className="mb-2">{">>>"} DECRYPTED CONTENT:</div>
                                        <div className="whitespace-pre-wrap pl-4 border-l-2 border-yellow-400">{fileNode.content}</div>
                                    </div>
                                );
                                const isWin = fileNode.name === objective.fileName && JSON.stringify(decPath.slice(0, -1)) === JSON.stringify(objective.filePath);
                                if (isWin) {
                                    onWin();
                                }
                            }
                        } else {
                            output = `decoder: ${args[0]}: No such file.`;
                        }
                    } else {
                        output = `decoder: ${args[0]}: No such file or directory.`;
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
                            if (fileNode.permissions === 'root' && currentUser !== 'root') {
                                output = `grep: ${fileParts.join(' ')}: Permission denied`;
                            } else if (fileNode.isEncrypted) {
                                output = `grep: ${fileParts.join(' ')}: Binary file (encrypted) matches`;
                            } else {
                                const matchingLines = fileNode.content.split('\n').filter(line => line.includes(term));
                                output = <div className="whitespace-pre-wrap">{matchingLines.join('\n')}</div>;
                            }
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
                <span className="text-green-400">{currentUser}@retro-term</span>
                <span className="text-gray-400">:</span>
                <span className="text-blue-400">{pathString}</span>
                <span className="text-gray-400">{currentUser === 'root' ? '#' : '$'}</span>
                <span className="pl-2">{isSudoEntering ? '********' : trimmedCommand}</span>
            </div>
        );

        setHistory(prev => [...prev, inputHistory, ...(output ? [output] : [])]);
    };

    const handleTab = (currentValue: string, setValue: (v: string) => void) => {
        const completed = getCompletion(currentValue);
        if (completed) {
            setValue(completed);
        }
    };

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
            const availableCommands = ['help', 'ls', 'cd', 'cat', 'pwd', 'whoami', 'sudo', 'grep', 'clear', 'decoder.exe'];
            const matches = availableCommands.filter(c => c.startsWith(currentValue));
            if (matches.length > 0) {
                const common = getCommonPrefix(matches);
                const suffix = (matches.length === 1 && common === matches[0]) ? ' ' : '';
                return common + suffix;
            }
        } else {
            if (currentValue.endsWith(' ')) return null;

            let searchDir: string[] = [...currentPath];
            let prefix = lastPart;
            let pathPrefix = '';

            if (lastPart.includes('/')) {
                const lastSlashIdx = lastPart.lastIndexOf('/');
                pathPrefix = lastPart.substring(0, lastSlashIdx + 1);
                prefix = lastPart.substring(lastSlashIdx + 1);

                const resolved = resolvePath(pathPrefix);
                if (resolved) {
                    searchDir = resolved;
                } else {
                    return null;
                }
            }

            const node = getNodeByPath(searchDir);
            if (node?.type === 'directory') {
                const matches = Object.keys(node.children)
                    .filter(name => name.startsWith(prefix))
                    .map(name => {
                        const child = node.children[name];
                        return child.type === 'directory' ? `${name}/` : name;
                    });

                if (matches.length > 0) {
                    const common = getCommonPrefix(matches);
                    const isUnique = matches.length === 1;
                    const reconstructedLastPart = pathPrefix + common;
                    const rest = currentValue.substring(0, currentValue.lastIndexOf(lastPart));
                    const suffix = (isUnique && !common.endsWith('/')) ? ' ' : '';
                    return rest + reconstructedLastPart + suffix;
                }
            }
        }
        return null;
    }, [currentPath, getNodeByPath, resolvePath]);

    return (
        <div
            className="w-full h-full flex flex-col p-4 text-xl border-2 border-[#33ff00]/50 crt-screen relative overflow-hidden"
            onClick={() => {
                if (window.getSelection()?.toString() === '') {
                    inputRef.current?.focus();
                }
            }}
        >
            <div className="flex-grow overflow-y-auto pr-2">
                {history.map((line, i) => <div key={i} className="mb-1">{line}</div>)}
                <div ref={terminalEndRef} />
            </div>
            <InputLine
                currentPath={currentPath}
                currentUser={currentUser}
                onSubmit={processCommand}
                onTab={handleTab}
                getCompletion={getCompletion}
                inputRef={inputRef}
                commandHistory={commandHistory}
            />
        </div>
    );
};

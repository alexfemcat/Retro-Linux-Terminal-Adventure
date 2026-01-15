
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

const OverdriveSequence: React.FC<{
    requirements: { type: string, label: string, target: string, provided: string, success: boolean, failReason: string }[],
    onResult: (success: boolean) => void
}> = ({ requirements, onResult }) => {
    const [lines, setLines] = useState<string[]>([]);

    useEffect(() => {
        let isCancelled = false;
        const run = async () => {
            setLines(["INITIALIZING OVERDRIVE BYPASS..."]);
            await new Promise(r => setTimeout(r, 800));
            if (isCancelled) return;

            for (let i = 0; i < requirements.length; i++) {
                const req = requirements[i];

                for (let j = 0; j < 6; j++) {
                    const randomHex = Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase().padStart(6, '0');
                    setLines(prev => {
                        const next = [...prev];
                        next[i + 1] = `SYNCING ${req.label} STREAM: 0x${randomHex}`;
                        return next;
                    });
                    await new Promise(r => setTimeout(r, 100));
                    if (isCancelled) return;
                }

                if (req.success) {
                    setLines(prev => {
                        const next = [...prev];
                        const hexVal = isNaN(parseInt(req.target)) ? 'DATA' : `0x${parseInt(req.target).toString(16).toUpperCase().padStart(6, '0')}`;
                        next[i + 1] = `SYNCING ${req.label} STREAM: [OK] - ${hexVal}`;
                        return next;
                    });
                    await new Promise(r => setTimeout(r, 500));
                } else {
                    setLines(prev => {
                        const next = [...prev];
                        next[i + 1] = `SYNCING ${req.label} STREAM: [FAILED]`;
                        next.push(`CRITICAL ERROR: ${req.failReason}`);
                        return next;
                    });
                    await new Promise(r => setTimeout(r, 1000));
                    onResult(false);
                    return;
                }
            }

            setLines(prev => [...prev, "PHASE SHIFT COMPLETED. BREAKING ENCRYPTION..."]);
            await new Promise(r => setTimeout(r, 1000));
            onResult(true);
        };

        run();
        return () => { isCancelled = true; };
    }, [requirements, onResult]);

    return (
        <div className="font-mono text-sm border-l-2 border-yellow-500/50 pl-4 py-2 bg-yellow-500/5 my-2">
            {lines.map((l, i) => (
                <div key={i} className={l.includes('[OK]') ? 'text-green-400' : (l.includes('[FAILED]') || l.includes('ERROR') ? 'text-red-500' : 'text-yellow-400')}>
                    {l}
                </div>
            ))}
        </div>
    );
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
    const [failedAttempts, setFailedAttempts] = useState<number>(0);
    const [isLockedOut, setIsLockedOut] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const terminalEndRef = useRef<HTMLDivElement>(null);

    const { vfs, scenario, objective, rootPassword, bootTime, processes, envVars } = gameState;

    useEffect(() => {
        const welcomeLines = scenario.welcomeMessage.split('\n').map((line, i) => <div key={`welcome-${i}`}>{line}</div>);
        setHistory(welcomeLines);
    }, [scenario.welcomeMessage]);

    useEffect(() => {
        terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history, isLockedOut]);

    const handleLockout = useCallback(() => {
        setIsLockedOut(true);
        setHistory(prev => [...prev, <div key={Date.now()} className="text-red-600 font-bold blink">{">>>"} TERMINAL LOCKOUT INITIATED. TOO MANY FAILED OVERDRIVES. REBOOTING...</div>]);
        setTimeout(() => {
            setHistory([]);
            setIsLockedOut(false);
            setFailedAttempts(0);
            setHistory([<div key="reboot">SYSTEM REBOOT... OK.</div>, ...scenario.welcomeMessage.split('\n').map((line, i) => <div key={`welcome-re-${i}`}>{line}</div>)]);
        }, 10000);
    }, [scenario.welcomeMessage]);

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
        if (isLockedOut) return;

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
ls           ls [-a]                 Lists files and directories.
cd           cd [directory]          Changes directory.
cat          cat [file]              Displays the content of a file.
pwd          pwd                     Prints the current working directory.
whoami       whoami                  Print the current user name.
sudo         sudo                    Gain root privileges.
grep         grep [term] [file]      Searches for a specific 'term'.
ps           ps aux                  Lists running processes.
env          env                     Lists environment variables.
uptime       uptime                  Shows system running time.
date         date                    Shows current system date.
overdrive    overdrive [file] [flags] Attempts to decrypt a file using system state.
             --use-pid [PID]         Decrypt using a Process ID.
             --use-time [VAL]        Decrypt using a Time value.
             --use-env [VAL]         Decrypt using an Env Var value.
clear        clear                   Clears the terminal screen.`;
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
                    setHistory([]);
                    output = null;
                    break;
                case 'pwd':
                    output = `/${currentPath.join('/')}`;
                    break;
                case 'date':
                    output = new Date().toString();
                    break;
                case 'uptime':
                    const diff = Date.now() - (bootTime || Date.now());
                    const hours = Math.floor(diff / 3600000);
                    const minutes = Math.floor((diff % 3600000) / 60000);
                    output = `up ${hours} hours, ${minutes} minutes`;
                    break;
                case 'ps':
                    if (args[0] === 'aux' || args.length === 0) {
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
                    } else {
                        output = `ps: unsupported option '${args[0]}'. Try 'ps aux'`;
                    }
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
                                const hints = fileNode.encryption?.requirements.map(r => r.hint).filter(Boolean);
                                output = (
                                    <div className="text-red-400">
                                        <div>Error: File '${args[0]}' is encrypted.</div>
                                        <div>Access Control: ACTIVE</div>
                                        <div className="mt-2 text-gray-400">
                                            {hints?.map((h, i) => <div key={i}>- {h}</div>)}
                                        </div>
                                        <div className="mt-2 italic">Use 'overdrive' to attempt decryption.</div>
                                    </div>
                                );
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
                case 'overdrive':
                    if (args.length < 2) {
                        output = "Usage: overdrive [file] [--use-pid <PID> | --use-time <VAL> | --use-env <VAL>]";
                        break;
                    }

                    const odFilePath = resolvePath(args[0]);
                    if (!odFilePath) {
                        output = `overdrive: ${args[0]}: No such file or directory.`;
                        break;
                    }

                    const fileNode = getNodeByPath(odFilePath);
                    if (fileNode?.type !== 'file' || !fileNode.isEncrypted || !fileNode.encryption) {
                        output = `overdrive: ${args[0]}: File is not encrypted or is not a processable data stream.`;
                        break;
                    }

                    // Extract all flags
                    const providedFlags: Record<string, string> = {};
                    for (let i = 1; i < args.length; i++) {
                        if (args[i].startsWith('--use-') && args[i + 1]) {
                            providedFlags[args[i]] = args[i + 1];
                        }
                    }

                    const reqs = fileNode.encryption.requirements;
                    const results = reqs.map(req => {
                        const flag = `--use-${req.type}`;
                        const providedValue = providedFlags[flag];
                        const isMatch = providedValue?.toString() === req.targetValue.toString();

                        let failReason = "KEY_MISMATCH";
                        // Custom logic for "Almost correct" feedback
                        if (!isMatch && providedValue) {
                            if (req.transformation?.type === 'offset') {
                                // Check if they provided the base PID instead of transformed
                                const basePid = (req.targetValue as number) - (req.transformation.value as number);
                                if (providedValue === basePid.toString()) failReason = "OFFSET_ERROR_DETECTED: STACK_POINTER_MISMATCH";
                            } else if (req.transformation?.type === 'slice') {
                                // Check if they provided the whole env var
                                const fullEnv = Object.values(envVars).find(v => v === providedValue);
                                if (fullEnv && fullEnv.startsWith(req.targetValue as string)) failReason = "SLICE_ERROR: BUFFER_LENGTH_EXCEEDED";
                            }
                        }

                        return {
                            type: req.type,
                            label: req.type.toUpperCase(),
                            target: req.targetValue.toString(),
                            provided: providedValue || "",
                            success: isMatch,
                            failReason
                        };
                    });

                    // Start Animation sequence
                    output = (
                        <div className="mt-2">
                            <OverdriveSequence
                                requirements={results}
                                onResult={(success) => {
                                    if (success) {
                                        fileNode.isEncrypted = false;
                                        setFailedAttempts(0);
                                        setHistory(prev => [...prev, (
                                            <div className="text-green-400 font-bold mb-4">
                                                {">>>"} CRITICAL OVERRIDE SUCCESSFUL. DATA STREAM DECRYPTED.
                                                <div className="whitespace-pre-wrap pl-4 border-l-2 border-green-500 mt-2 text-white font-normal">
                                                    {fileNode.content}
                                                </div>
                                            </div>
                                        )]);
                                        const isWin = fileNode.name === objective.fileName && JSON.stringify(odFilePath.slice(0, -1)) === JSON.stringify(objective.filePath);
                                        if (isWin) onWin();
                                    } else {
                                        const newFails = failedAttempts + 1;
                                        setFailedAttempts(newFails);
                                        const firstFail = results.find(r => !r.success);
                                        setHistory(prev => [...prev, (
                                            <div className="text-red-500 mb-4">
                                                {">>>"} OVERDRIVE FAILURE: {firstFail?.failReason || "CORE_SYNC_LOST"}
                                                <div className="text-sm italic">Attempt {newFails}/3 before lockout.</div>
                                            </div>
                                        )]);
                                        if (newFails >= 3) handleLockout();
                                    }
                                }}
                            />
                        </div>
                    );
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
            const availableCommands = ['help', 'ls', 'cd', 'cat', 'pwd', 'whoami', 'sudo', 'grep', 'clear', 'overdrive', 'ps', 'env', 'uptime', 'date'];
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
            className={`w-full h-full flex flex-col p-4 text-xl border-2 border-[#33ff00]/50 crt-screen relative overflow-hidden ${isLockedOut ? 'grayscale blur-sm' : ''}`}
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
            {!isLockedOut && (
                <InputLine
                    currentPath={currentPath}
                    currentUser={currentUser}
                    onSubmit={processCommand}
                    onTab={handleTab}
                    getCompletion={getCompletion}
                    inputRef={inputRef}
                    commandHistory={commandHistory}
                />
            )}
        </div>
    );
};

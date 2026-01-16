import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { GameState, VFSNode, NetworkNode, PlayerState } from '../types';

export interface TerminalProps {
    gameState: GameState;
    activeNode: NetworkNode;
    playerState: PlayerState;
    isMissionActive: boolean;
    onNodeChange: (index: number) => void;
    onWin: () => void;
    onMissionAccept: (mission: any) => void;
    onMissionAbort: () => void;
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
    onNodeChange,
    onWin,
    onMissionAccept,
    onMissionAbort,
    currentPath,
    setCurrentPath,
    currentUser,
    setCurrentUser
}) => {
    const [history, setHistory] = useState<React.ReactNode[]>([]);
    const [commandHistory, setCommandHistory] = useState<string[]>([]);

    // Generalized Input State
    const [inputMode, setInputMode] = useState<'command' | 'password'>('command');
    const [passwordCallback, setPasswordCallback] = useState<((pwd: string) => void) | null>(null);

    const [isLockedOut] = useState<boolean>(false);
    const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

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


        switch (cmd) {
            case 'help':
                output = (
                    <div className="whitespace-pre-wrap text-yellow-300">
                        {`
COMMAND      USAGE                   DESCRIPTION
----------------------------------------------------------------------------
help         help                    Shows this list.
ls           ls [-a]                 Lists files.
cd           cd [dir]                Changes directory.
cat          cat [file]              Reads file content.
pwd          pwd                     Current directory path.
whoami       whoami                  Current user.
jobs         jobs [accept <id>]      Browse/Accept missions (Homebase only).
market       market [buy <id>]       Browse/Buy upgrades (Homebase only).
sudo         sudo                    Gain root access.
ssh          ssh [user]@[ip]         Connect to remote host.
ping         ping [ip]               Check host availability.
ip           ip a                    Show network interfaces.
nmap         nmap [ip] [-sV]         Scan for open ports/services.
grep         grep [term] [file]      Search in file.
ps           ps aux                  List processes.
env          env                     List environment variables.
uptime       uptime                  Show system uptime.
date         date                    Show current date/time.
clear        clear                   Clear screen.
exit         exit                    Disconnect/Logout.
abort        abort                   Abandon current mission (Remote only).
disconnect   disconnect              Alias for abort.

TIPS:
- Clues are fragmented across files and nodes.
- Use 'cat' on log files to find IPs and usernames.
- Check .bash_history for ssh commands.
- WARNING: Logs contain honeypot data. Real clues are buried.
- Use 'nmap' to discover services, 'ssh' to pivot between nodes.`}
                    </div>
                );
                break;
            case 'jobs':
                if (isMissionActive) {
                    output = "Error: Jobs system unavailable while on remote mission.";
                } else {
                    if (args[0] === 'accept') {
                        // For now, accept the first dummy mission
                        output = "Mission accepted. Initiating connection...";
                        setTimeout(() => onMissionAccept({}), 1000);
                    } else {
                        output = (
                            <div className="text-yellow-400">
                                <div>AVAILABLE CONTRACTS:</div>
                                <div>----------------------------</div>
                                <div>[1] OMNICORP_DATA_RECOVERY (Diff: 1, Reward: 500c)</div>
                                <div>Usage: jobs accept 1</div>
                            </div>
                        );
                    }
                }
                break;
            case 'market':
                if (isMissionActive) {
                    output = "Error: Market unavailable while on remote mission.";
                } else {
                    output = (
                        <div className="text-yellow-400">
                            <div>SOFTWARE MARKET:</div>
                            <div>----------------------------</div>
                            <div>nmap: 500c - Network scanner</div>
                            <div>hydra: 1500c - Brute force tool</div>
                            <div className="mt-2">HARDWARE MARKET:</div>
                            <div>----------------------------</div>
                            <div>CPU_V2: 1000c - Faster execution</div>
                            <div className="text-gray-500 italic mt-2">Usage: market buy [item_id] (Coming soon in Phase 2)</div>
                        </div>
                    );
                }
                break;
            case 'abort':
            case 'disconnect':
                if (!isMissionActive) {
                    output = "Error: You are already at your Homebase.";
                } else {
                    output = "Aborting mission... disconnecting...";
                    setTimeout(() => onMissionAbort(), 1000);
                }
                break;
            case 'clear':
                setHistory(getWelcomeLines());
                return;
            case 'ls':
                const lsNode = getNodeByPath(currentPath);
                if (lsNode?.type === 'directory') {
                    if (lsNode.permissions === 'root' && currentUser !== 'root') {
                        output = `ls: cannot open directory '.': Permission denied`;
                    } else {
                        const showHidden = args.includes('-a');
                        const children = Object.keys(lsNode.children).filter(name => showHidden || !name.startsWith('.'));
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
                    setHistory(prev => [...prev, <div key="scan">Starting Nmap 7.92 ( https://nmap.org ) at {new Date().toISOString()}...</div>]);

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
                                <br /><br />Nmap done: 1 IP address (1 host up) scanned in 1.52 seconds
                            </div>
                        );
                        setHistory(prev => [...prev, result]);
                    }, 1500);
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
            const cmds = ['help', 'ls', 'cd', 'cat', 'pwd', 'whoami', 'sudo', 'ssh', 'ping', 'nmap', 'ip', 'grep', 'clear', 'exit'];
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


    return (
        <div
            className={`w-full h-full flex flex-col p-10 text-lg font-vt323 crt-screen relative active-node-theme ${themeColor} ${isTransitioning ? 'animate-pulse blur-sm' : ''}`}
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

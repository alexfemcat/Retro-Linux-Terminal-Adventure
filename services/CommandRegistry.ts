import { PlayerState } from '../types';
import { DEV_COMMAND_REGISTRY } from './DevCommandRegistry';

export interface CommandContext {
    playerState: PlayerState;
    isMissionActive: boolean;
    currentPath: string[];
    currentUser: 'user' | 'root';
    hostname: string;
}

export interface CommandDefinition {
    id: string;
    description: string;
    usage: string;
    isDefaultCommand: boolean; // help, ls, cd, etc.
    isLocalOnly: boolean; // market, jobs
    isRemoteOnly?: boolean; // abort
    requiredSoftware?: string; // id from marketData
}

export const COMMAND_REGISTRY: Record<string, CommandDefinition> = {
    'help': { id: 'help', description: 'Shows this list.', usage: 'help', isDefaultCommand: true, isLocalOnly: false },
    'ls': { id: 'ls', description: 'Lists files.', usage: 'ls [-a] [-l]', isDefaultCommand: true, isLocalOnly: false },
    'cd': { id: 'cd', description: 'Changes directory.', usage: 'cd [dir]', isDefaultCommand: true, isLocalOnly: false },
    'cat': { id: 'cat', description: 'Reads file content.', usage: 'cat [file]', isDefaultCommand: true, isLocalOnly: false },
    'pwd': { id: 'pwd', description: 'Current directory path.', usage: 'pwd', isDefaultCommand: true, isLocalOnly: false },
    'whoami': { id: 'whoami', description: 'Current user.', usage: 'whoami', isDefaultCommand: true, isLocalOnly: false },
    'clear': { id: 'clear', description: 'Clear screen.', usage: 'clear', isDefaultCommand: true, isLocalOnly: false },
    'exit': { id: 'exit', description: 'Disconnect/Logout.', usage: 'exit', isDefaultCommand: true, isLocalOnly: false },
    'inv': { id: 'inv', description: 'Show storage usage and inventory.', usage: 'inv', isDefaultCommand: true, isLocalOnly: false },
    'rm': { id: 'rm', description: 'Remove a file.', usage: 'rm [file]', isDefaultCommand: true, isLocalOnly: false },
    'kill': { id: 'kill', description: 'Terminate a process by PID.', usage: 'kill [pid]', isDefaultCommand: true, isLocalOnly: false },
    'echo': { id: 'echo', description: 'Write text to a file.', usage: 'echo "text" > [file]', isDefaultCommand: true, isLocalOnly: false },

    'alias': { id: 'alias', description: 'Create a command alias.', usage: 'alias [name]="[command]"', isDefaultCommand: true, isLocalOnly: false },
    'sh': { id: 'sh', description: 'Execute a script.', usage: 'sh [file]', isDefaultCommand: true, isLocalOnly: false },
    'theme': { id: 'theme', description: 'Set terminal theme.', usage: 'theme [theme_name]', isDefaultCommand: true, isLocalOnly: true },
    'settings': { id: 'settings', description: 'Open settings menu.', usage: 'settings', isDefaultCommand: true, isLocalOnly: true },

    // Mission Control
    'tutorial': { id: 'tutorial', description: 'Start the training simulation.', usage: 'tutorial', isDefaultCommand: true, isLocalOnly: true },
    'jobs': { id: 'jobs', description: 'Browse/Accept missions.', usage: 'jobs [accept <id>]', isDefaultCommand: true, isLocalOnly: true },
    'market': { id: 'market', description: 'Browse/Sell items.', usage: 'market [buy <id>|sell <file>]', isDefaultCommand: true, isLocalOnly: true },
    'overclock': { id: 'overclock', description: 'Toggle CPU overclocking.', usage: 'overclock [on|off]', isDefaultCommand: false, isLocalOnly: false },
    'voltage': { id: 'voltage', description: 'Set CPU voltage (1.0 - 1.5).', usage: 'voltage [value]', isDefaultCommand: false, isLocalOnly: false, requiredSoftware: 'overclock' },
    'memstat': { id: 'memstat', description: 'Show memory usage.', usage: 'memstat', isDefaultCommand: true, isLocalOnly: false },
    'abort': { id: 'abort', description: 'Abandon current mission.', usage: 'abort', isDefaultCommand: true, isLocalOnly: false, isRemoteOnly: true },
    'disconnect': { id: 'disconnect', description: 'Alias for abort.', usage: 'disconnect', isDefaultCommand: true, isLocalOnly: false, isRemoteOnly: true },
    'download': { id: 'download', description: 'Download file from remote.', usage: 'download [file]', isDefaultCommand: true, isLocalOnly: false, isRemoteOnly: true },

    // Hacking Tools (Gated)
    'ping': { id: 'ping', description: 'Check host availability.', usage: 'ping [ip]', isDefaultCommand: false, isLocalOnly: false },
    'ip': { id: 'ip', description: 'Show network interfaces.', usage: 'ip a', isDefaultCommand: false, isLocalOnly: false },
    'nmap-lite': { id: 'nmap-lite', description: 'Basic port scanner (Open/Closed only).', usage: 'nmap-lite [ip]', isDefaultCommand: false, isLocalOnly: false },
    'nmap': { id: 'nmap', description: 'Scan for open ports/services.', usage: 'nmap [ip] [-sV]', isDefaultCommand: true, isLocalOnly: false },
    'nmap-pro': { id: 'nmap-pro', description: 'Advanced OS fingerprinting and version detection.', usage: 'nmap-pro [ip]', isDefaultCommand: false, isLocalOnly: false },
    'brute-force.sh': { id: 'brute-force.sh', description: 'Basic noisy brute-force script.', usage: 'brute-force.sh [user]@[ip]', isDefaultCommand: false, isLocalOnly: false },
    'hydra': { id: 'hydra', description: 'Brute force tool.', usage: 'hydra [user]@[ip] [-P wordlist]', isDefaultCommand: false, isLocalOnly: false },
    'ssh-crack-v1': { id: 'ssh-crack-v1', description: 'Specialized SSH credential harvester.', usage: 'ssh-crack-v1 [user]@[ip]', isDefaultCommand: false, isLocalOnly: false },
    'sqlmap': { id: 'sqlmap', description: 'Automatic SQL injection tool.', usage: 'sqlmap [ip]', isDefaultCommand: false, isLocalOnly: false },
    'john': { id: 'john', description: 'Offline password hash cracker.', usage: 'john [hash_file]', isDefaultCommand: false, isLocalOnly: false },
    'proxy-tunnel': { id: 'proxy-tunnel', description: 'Encrypted traffic tunneling.', usage: 'proxy-tunnel [ip]', isDefaultCommand: false, isLocalOnly: false },
    'msfconsole': { id: 'msfconsole', description: 'Advanced exploitation framework.', usage: 'msfconsole', isDefaultCommand: false, isLocalOnly: false, requiredSoftware: 'msfconsole' },
    'msf-exploit': { id: 'msf-exploit', description: 'Execute a Metasploit module against a target.', usage: 'msf-exploit [ip] [service]', isDefaultCommand: false, isLocalOnly: false, requiredSoftware: 'msfconsole' },
    'dist-crack': { id: 'dist-crack', description: 'Coordinated multi-node brute force.', usage: 'dist-crack [user]@[ip]', isDefaultCommand: false, isLocalOnly: false, requiredSoftware: 'dist-crack' },
    '0day-pack': { id: '0day-pack', description: 'Instant-access exploit kit.', usage: '0day-pack [ip]', isDefaultCommand: false, isLocalOnly: false },
    'neuro-crack': { id: 'neuro-crack', description: 'AI-driven heuristic encryption bypass.', usage: 'neuro-crack [ip]', isDefaultCommand: false, isLocalOnly: false },

    'netmap': { id: 'netmap', description: 'Visualize discovered network nodes.', usage: 'netmap', isDefaultCommand: true, isLocalOnly: false },
    'ssh': { id: 'ssh', description: 'Connect to remote host.', usage: 'ssh [user]@[ip]', isDefaultCommand: true, isLocalOnly: false },
    'sudo': { id: 'sudo', description: 'Gain root access.', usage: 'sudo', isDefaultCommand: true, isLocalOnly: false },
    'grep': { id: 'grep', description: 'Search in file.', usage: 'grep [term] [file]', isDefaultCommand: true, isLocalOnly: false },
    'ps': { id: 'ps', description: 'List processes.', usage: 'ps aux', isDefaultCommand: true, isLocalOnly: false },
    'env': { id: 'env', description: 'List environment variables.', usage: 'env', isDefaultCommand: true, isLocalOnly: false },
    'uptime': { id: 'uptime', description: 'Show system uptime.', usage: 'uptime', isDefaultCommand: true, isLocalOnly: false },
    'date': { id: 'date', description: 'Show current date/time.', usage: 'date', isDefaultCommand: true, isLocalOnly: false },
};

export function checkCommandAvailability(command: string, context: CommandContext): { available: boolean; error?: string } {
    // 0. Check Dev Mode Commands
    const isDevCommand = !!DEV_COMMAND_REGISTRY[command];
    if (isDevCommand) {
        if (context.playerState.isDevMode) {
            return { available: true };
        } else {
            return { available: false, error: `command not found: ${command}` };
        }
    }

    const def = COMMAND_REGISTRY[command];

    if (!def) {
        return { available: false, error: `command not found: ${command}` };
    }

    // 1. Check if Local Only
    if (def.isLocalOnly && context.isMissionActive) {
        return { available: false, error: `Error: ${command} system unavailable while on remote mission.` };
    }

    // 2. Check if Remote Only
    if (def.isRemoteOnly && !context.isMissionActive && context.playerState.activeMissionId !== 'tutorial') {
        return { available: false, error: `Error: You are already at your Homebase.` };
    }

    // 3. Check if Default Command
    if (def.isDefaultCommand) {
        return { available: true };
    }

    // 4. Check if Installed (by name or requirement)
    const softwareNeeded = def.requiredSoftware || command;
    if (context.playerState.installedSoftware.includes(softwareNeeded)) {
        return { available: true };
    }

    // Special Case: voltage requires overclock binary
    if (command === 'voltage' && context.playerState.installedSoftware.includes('overclock')) {
        return { available: true };
    }

    return { available: false, error: `Error: Binary '${command}' not found. Install via market.` };
}

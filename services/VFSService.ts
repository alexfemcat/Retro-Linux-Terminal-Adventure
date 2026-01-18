import { PlayerState, Directory, VFSNode } from '../types';
import { MARKET_CATALOG } from '../data/marketData';
import { COMMAND_REGISTRY } from './CommandRegistry';

function getFileSize(name: string, content: string): number {
    const ext = name.split('.').pop()?.toLowerCase();

    // Binaries / Executables
    // Endgame binaries can be quite large, up to 1.5GB to fit into purchasable storage.
    if (content.includes('[CRITICAL BINARY]') || name === 'final_exploit.bin' || name === 'master_override.exe') {
        return 500 * 1024 + Math.random() * 1000 * 1024; // 500MB - 1.5GB in KB
    }

    const smallBinaries = ['help', 'ls', 'cd', 'cat', 'pwd', 'whoami', 'clear', 'exit', 'inv', 'rm', 'kill', 'echo', 'alias', 'sh', 'theme', 'settings', 'market', 'jobs', 'sudo', 'connect', 'scan', 'man', 'nano'];
    if (smallBinaries.includes(name) || ext === 'sh') {
        return 50 + Math.random() * 450; // 50KB - 500KB
    }

    if (ext === 'exe' || ext === 'bin' || ext === 'deb' || content.includes('[BINARY]')) {
        const software = MARKET_CATALOG.find(i => i.id === name);
        if (software && 'storageSize' in software) {
            return software.storageSize * 1024; // MB to KB
        }
        return 10 * 1024 + Math.random() * 190 * 1024; // 10MB - 200MB in KB
    }

    // Default for other file types
    return Math.max(1, Math.round(content.length / 1024)); // Proportional to content length, min 1KB
}


export function syncBinDirectory(playerState: PlayerState, vfs: VFSNode): VFSNode {
    if (vfs.type !== 'directory' || !vfs.children.home) {
        return vfs;
    }

    const homeDir = vfs.children.home as Directory;
    if (!homeDir.children.user) {
        return vfs;
    }

    const userHome = homeDir.children.user as Directory;
    if (!userHome.children.bin) {
        userHome.children.bin = { type: 'directory', name: 'bin', children: {}, size: 0 };
    }

    const binDir = userHome.children.bin as Directory;

    // Clear existing binaries to handle uninstalls (if that becomes a feature)
    binDir.children = {};

    const softwareToInstall = playerState.installedSoftware || [];

    // Add default commands that should always be present
    const defaultCommands = Object.values(COMMAND_REGISTRY)
        .filter(cmd => cmd.isDefaultCommand)
        .map(cmd => cmd.id);
    const allSoftware = [...new Set([...defaultCommands, ...softwareToInstall])];


    allSoftware.forEach((soft: string) => {
        binDir.children[soft] = {
            type: 'file',
            name: soft,
            content: '[EXECUTABLE BINARY]',
            size: getFileSize(soft, '[EXECUTABLE BINARY]')
        };
    });

    return vfs;
}
